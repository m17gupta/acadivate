'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { useAppDispatch } from '@/src/hook/hooks';
import { loginThunk } from '@/src/hook/auth/authThunks';
import { toast } from 'sonner';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const adminEmail = 'admin@acadivate.com';
const adminPassword = '123456';

type props = {
  isadmin?: boolean
}
function LoginForm({ isadmin }: props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const urlError = searchParams?.get('error');

  const [email, setEmail] = useState(() => (isadmin ? adminEmail : ''));
  const [password, setPassword] = useState(() => (isadmin ? adminPassword : ''));
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    urlError === 'CredentialsSignin'
      ? 'Invalid email or password. Please try again.'
      : null
  );
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Magic Login Bot Protection
  const [num1] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [botAnswer, setBotAnswer] = useState('');
  const isHuman = Number(botAnswer) === num1 + num2;
  const pending = isSubmitting || isPending;

  useEffect(() => {
    if (isadmin) {
      setEmail(adminEmail);
      setPassword(adminPassword);
    } else {
      setEmail('');
      setPassword('');
    }
    setShowPassword(false);
    setBotAnswer('');
  }, [isadmin]);

  const validateForm = () => {
    const nextErrors: {
      email?: string;
      password?: string;
    } = {};

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!trimmedPassword) {
      nextErrors.password = 'Password is required';
    } else if (trimmedPassword.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearAuthState = () => {
    setAuthError(null);
    setFieldErrors({});
  };

  const navigateToCallback = () => {
    startTransition(() => {
      router.push(callbackUrl);
      router.refresh();
    });
  };

  const authenticate = async (credentials: {
    userName: string;
    password: string;
    failureMessage: string;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await dispatch(
        loginThunk({
          userName: credentials.userName,
          password: credentials.password,
        })
      ).unwrap();
      console.log("response login", response)

      if (response.status === 200) {
        toast.success('Successfully logged in!', {
          description: `Welcome back, ${response.user?.userName ?? 'user'}`,
        });
        if (response.user?.role == "admin") {
          router.push("/")
        } else {
          router.push("/dashboard/userAccount")
        }
      } else {
        toast.error('Login failed', {
          description: 'Unknown error occurred',
        });
        setAuthError('Unknown error occurred');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : credentials.failureMessage;
      toast.error('Authentication Error', {
        description: message || 'Invalid credentials',
      });
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    clearAuthState();
    authenticate({
      userName: email.trim(),
      password,
      failureMessage: 'Invalid email or password. Please try again.',
    });
  };

  const handleMagicLogin = () => {
    if (!isHuman || pending) {
      return;
    }

    clearAuthState();
    authenticate({
      userName: adminEmail,
      password: adminPassword,
      failureMessage: 'Magic login failed.',
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-4 py-8 flex items-center justify-center sm:px-6 lg:px-8">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(18,167,207,0.85) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18,167,207,0.85) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(18,167,207,0.24) 0%, rgba(18,167,207,0) 72%)',
          }}
        />
        <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-sh-md">
            <Building2 className="h-5 w-5 text-white" />
          </div> */}
          {/* <div className="text-center">
            <span className="block font-serif text-2xl font-semibold tracking-tight text-navy">
              Acadivate
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-text-muted">
              Admin Portal
            </span>
          </div> */}

          <div>
            <img src="/assets/Image/Acadivate logo-transpernt.png" width="150" height="120" alt="Logo" />
          </div>

        </div>

        <div className="overflow-hidden rounded-[2rem] border border-border-light bg-white/90 shadow-sh-xl backdrop-blur-sm">
          <div className="border-b border-border-light bg-linear-to-b from-primary/5 to-transparent px-8 pb-6 pt-10 text-center sm:px-10">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-primary">
              Secure sign in
            </p>
            <h1 className="text-3xl font-black tracking-tight text-navy">
              Welcome back
            </h1>
            <p className="mt-3 text-sm font-medium text-text-muted">
              Sign in to continue to the Acadivate admin dashboard
            </p>
          </div>

          <div className="px-8 pb-8 pt-6 sm:px-10">
            {authError && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-crimson/25 bg-crimson-2 px-4 py-3 text-crimson">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm font-medium leading-6">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="ml-1 text-[10px] font-black uppercase tracking-[0.22em] text-navy"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete={isadmin ? 'email' : 'off'}
                  name={isadmin ? 'admin-email' : 'signin-email'}
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={isadmin ? adminEmail : 'Enter your email address'}
                  disabled={pending}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (authError) {
                      setAuthError(null);
                    }
                    if (fieldErrors.email) {
                      setFieldErrors((current) => ({
                        ...current,
                        email: undefined,
                      }));
                    }
                  }}
                  className={cn(
                    'h-11 w-full rounded-2xl border-2 bg-bg-light px-4 text-sm font-medium text-navy outline-none transition-all placeholder:text-text-subtle focus:bg-white focus:border-primary',
                    fieldErrors.email
                      ? 'border-crimson/40 focus:border-crimson'
                      : 'border-transparent'
                  )}
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-crimson">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="ml-1 text-[10px] font-black uppercase tracking-[0.22em] text-navy"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isadmin ? 'current-password' : 'new-password'}
                    name={isadmin ? 'admin-password' : 'signin-password'}
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={isadmin ? adminPassword : 'Enter your password'}
                    disabled={pending}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (authError) {
                        setAuthError(null);
                      }
                      if (fieldErrors.password) {
                        setFieldErrors((current) => ({
                          ...current,
                          password: undefined,
                        }));
                      }
                    }}
                    className={cn(
                      'h-11 w-full rounded-2xl border-2 bg-bg-light px-4 pr-12 text-sm font-medium text-navy outline-none transition-all placeholder:text-text-subtle focus:bg-white focus:border-primary',
                      fieldErrors.password
                        ? 'border-crimson/40 focus:border-crimson'
                        : 'border-transparent'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle transition-colors hover:text-navy"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-crimson">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="h-11 w-full rounded-2xl bg-primary font-semibold text-white hover:bg-primary-dark"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>
            {isadmin &&
              <div className="mt-7 border-t border-border-light pt-6">
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-center text-sm font-semibold text-navy">
                    Test Mode: Magic Login
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                      <span className="inline-flex items-center justify-center rounded-xl border border-border-light bg-white px-4 py-2 text-sm font-medium text-navy shadow-sh-xs">
                        Bot Check: {num1} + {num2} = ?
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Answer"
                        disabled={pending}
                        value={botAnswer}
                        onChange={(event) => setBotAnswer(event.target.value)}
                        className="h-9 w-full rounded-xl border border-border-light bg-white px-3 text-center text-sm text-navy outline-none transition-all focus:border-primary sm:w-24"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={!isHuman || pending}
                      onClick={handleMagicLogin}
                      className="h-10 w-full rounded-2xl border-primary/30 bg-white text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      {pending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      ✨ Magic Login (Admin)
                    </Button>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs leading-5 text-text-muted">
                  This portal is for authorised Acadivate agents and
                  administrators only. Unauthorised access attempts are logged.
                </p>
              </div>}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-navy/70">
          © {new Date().getFullYear()} Acadivate. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
