import type { Project } from "@/content/projects";

export function ProjectVisual({ type, compact = false }: { type: Project["visual"]; compact?: boolean }) {
  const common = "w-full";
  if (type === "ring") return <SmartRingVisual className={common} compact={compact} />;
  if (type === "gnome") return <GnomeVisual className={common} compact={compact} />;
  if (type === "market") return <MarketVisual className={common} compact={compact} />;
  return <CalorieVisual className={common} compact={compact} />;
}

function Frame({ label, children, className = "", compact }: { label: string; children: React.ReactNode; className?: string; compact?: boolean }) {
  return <figure role="img" aria-label={label} className={`${className} overflow-hidden rounded-card border border-border bg-surface p-4 sm:p-6 ${compact ? "min-h-[210px]" : "min-h-[300px]"}`}><figcaption className="field-note mb-4 text-text-muted">{label}</figcaption>{children}</figure>;
}

export function SmartRingVisual({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return <Frame label="Smart Ring: BLE signal to decoded stream to local insight" className={className} compact={compact}>
    <div className="relative h-[210px] sm:h-[250px]">
      <svg viewBox="0 0 600 220" className="h-full w-full" aria-hidden="true">
        <path d="M0 78 C35 78 35 32 70 32s35 94 70 94 35-76 70-76 35 44 70 44 35-28 70-28 35 20 70 20 35-32 70-32 35 26 80 26" fill="none" stroke="var(--rain)" strokeWidth="2" className="signal-trace" />
        <path d="M0 154h600" stroke="var(--border)" />
        <circle cx="210" cy="50" r="5" fill="var(--blossom)" /><circle cx="420" cy="54" r="5" fill="var(--accent)" />
        <path d="M210 50v104M420 54v100" stroke="var(--border)" strokeDasharray="3 7" />
      </svg>
      <div className="absolute bottom-0 left-0 grid grid-cols-3 gap-2 text-[12px] text-text-muted sm:gap-5"><span><b className="block font-normal text-text">BLE packet</b>raw bytes</span><span><b className="block font-normal text-text">decoded stream</b>5 signals</span><span><b className="block font-normal text-text">local insight</b>baseline</span></div>
    </div>
  </Frame>;
}

export function GnomeVisual({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return <Frame label="Gnome: plant environment through firmware and cloud to care guidance" className={className} compact={compact}>
    <div className="flex min-h-[190px] items-center gap-3 sm:gap-5">
      <div className="relative flex h-32 w-24 shrink-0 items-end justify-center rounded-b-[45%] border-b-8 border-accent-secondary/60 bg-accent-soft"><span className="mb-10 text-5xl" aria-hidden="true">♧</span><span className="absolute bottom-1 field-note text-[9px] text-text-muted">soil / light</span></div>
      <div className="flex flex-1 flex-col gap-3"><div className="flex flex-wrap gap-1.5">{["soil", "light", "temp", "air", "water"].map((x) => <span key={x} className="rounded-full border border-border px-2 py-1 font-mono text-[10px] text-text-muted">{x}</span>)}</div><div className="h-px bg-border" /><div className="rounded-sm border border-accent/50 bg-accent-soft p-3 text-[13px]">Sleep · collect · batch<br /><span className="font-mono text-[10px] text-text-muted">ESP32-C6 / every 15 min</span></div><div className="h-px bg-border" /><div className="border-l-2 border-blossom pl-3 text-[13px]">Your plant needs a little more light.</div></div>
    </div>
  </Frame>;
}

export function MarketVisual({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return <Frame label="Prediction Market Bot: market data to calibrated probability to decision" className={className} compact={compact}>
    <div className="flex min-h-[170px] items-center gap-5"><div className="flex-1"><div className="field-note text-text-muted">calibration / held-out sets</div><svg viewBox="0 0 260 130" className="mt-2 w-full" aria-hidden="true"><path d="M20 110 240 20" stroke="var(--border)" /><path d="M20 110 C70 87 100 84 135 64s62-19 105-44" fill="none" stroke="var(--accent-secondary)" strokeWidth="3" /><circle cx="82" cy="85" r="4" fill="var(--blossom)" /><circle cx="164" cy="54" r="4" fill="var(--accent)" /></svg></div><div className="w-24 border-l border-border pl-4 text-[13px]"><span className="field-note text-text-muted">output</span><strong className="mt-2 block font-mono text-xl text-accent">0.70</strong><span className="text-text-muted">trade threshold</span></div></div>
  </Frame>;
}

export function CalorieVisual({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return <Frame label="AI Calorie Counter: image to food classification to human-confirmed nutrition" className={className} compact={compact}>
    <div className="flex min-h-[170px] items-center gap-3 sm:gap-5"><div className="grid size-28 shrink-0 place-items-center border border-dashed border-rain bg-accent-soft text-center text-3xl" aria-hidden="true">◌<span className="field-note block text-[9px]">image frame</span></div><div className="flex-1 space-y-2 text-[13px]"><div className="border-l-2 border-accent-secondary pl-3">Food detected<br /><span className="font-mono text-[10px] text-text-muted">classification · portion</span></div><div className="border-l-2 border-blossom pl-3">Confirm before saving<br /><span className="text-text-muted">uncertain results stay human</span></div><div className="border-l-2 border-accent pl-3">Nutrition result</div></div></div>
  </Frame>;
}
