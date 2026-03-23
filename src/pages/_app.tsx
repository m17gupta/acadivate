import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { AppShell } from '@/src/components/layout/AppShell';
import { store } from '@/src/hook/store';
import '@/src/app/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,700&family=Epilogue:wght@300;400;500;600;700;800&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
      <Toaster position="top-right" richColors />
    </Provider>
  );
}
