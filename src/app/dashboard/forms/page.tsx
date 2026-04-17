export default function Page() {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-text-subtle">
          Dashboard
        </p>
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Forms</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
          This section will be used to manage form modules such as nominations, registrations, and other future workflows.
        </p>
      </div>
    </div>
  );
}
