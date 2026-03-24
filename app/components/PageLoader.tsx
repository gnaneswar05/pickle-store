interface PageLoaderProps {
  label?: string;
  detail?: string;
  compact?: boolean;
}

export default function PageLoader({
  label = "Loading",
  detail = "Please wait while we prepare everything for you.",
  compact = false,
}: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[34px] border border-[var(--line)] bg-white/80 px-6 text-center shadow-[0_20px_56px_rgba(92,60,37,0.08)] ${
        compact ? "min-h-[260px] py-12" : "min-h-[70vh] py-20"
      }`}
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full border border-[rgba(159,63,35,0.15)]" />
        <div className="absolute h-16 w-16 rounded-full border-4 border-[rgba(159,63,35,0.12)] border-t-[var(--brand)] animate-spin" />
        <div className="absolute h-6 w-6 rounded-full bg-[var(--accent)] shadow-[0_0_24px_rgba(215,163,71,0.45)]" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
        {label}
      </p>
      <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">{detail}</p>
    </div>
  );
}
