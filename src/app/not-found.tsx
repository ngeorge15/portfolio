import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-start px-5 py-24 sm:px-8 sm:py-32">
      <p className="font-mono text-[13px] text-text-muted">404</p>
      <h1 className="mt-3 text-[32px] sm:text-[38px]">
        This page doesn&rsquo;t exist
      </h1>
      <p className="measure mt-4 text-[17px] text-text-muted">
        The link may be out of date, or the page may have moved. The work and
        contact details are all on the home page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm bg-text px-5 text-[15px] font-medium text-background transition-opacity duration-200 hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/#work"
          className="inline-flex min-h-11 items-center rounded-sm border border-border px-5 text-[15px] font-medium transition-colors duration-200 hover:border-accent"
        >
          View work
        </Link>
      </div>
    </div>
  );
}
