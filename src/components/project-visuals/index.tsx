import type { Project } from "@/content/projects";

type VisualProps = { compact?: boolean; contained?: boolean };

export function ProjectVisual({ type, compact = false, contained = false }: { type: Project["visual"] } & VisualProps) {
  if (type === "ring") return <SmartRingVisual compact={compact} contained={contained} />;
  if (type === "gnome") return <GnomeVisual compact={compact} contained={contained} />;
  if (type === "market") return <MarketVisual compact={compact} contained={contained} />;
  return <CalorieVisual compact={compact} contained={contained} />;
}

function Frame({ label, children, compact, contained }: { label: string; children: React.ReactNode } & VisualProps) {
  const shell = contained ? "border-0 border-b border-border rounded-none bg-transparent" : "rounded-card border border-border bg-surface";
  return <figure role="img" aria-label={label} className={`overflow-hidden ${shell} p-4 sm:p-6 ${compact ? "min-h-[190px]" : "min-h-[250px]"}`}><figcaption className="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-text-subtle">{label}</figcaption>{children}</figure>;
}

export function SmartRingVisual({ compact, contained }: VisualProps) {
  return <Frame label="Smart Ring / BLE protocol to local health data" compact={compact} contained={contained}>
    <div className="relative min-h-[150px] sm:min-h-[190px]"><svg viewBox="0 0 600 180" className="h-full min-h-[150px] w-full" aria-hidden="true"><path d="M0 82 C32 82 32 38 65 38s35 78 70 78 35-64 70-64 35 39 70 39 35-25 70-25 35 18 70 18 35-28 70-28 35 24 85 24" fill="none" stroke="var(--accent)" strokeWidth="2" opacity=".8" /><path d="M0 139h600" stroke="var(--border)" /><circle cx="210" cy="52" r="4" fill="var(--accent)" /><circle cx="425" cy="56" r="4" fill="var(--accent)" /><path d="M210 52v87M425 56v83" stroke="var(--border-strong)" strokeDasharray="3 7" /></svg><div className="absolute bottom-0 left-0 grid grid-cols-3 gap-3 text-[11px] text-text-subtle"><span><b className="block font-normal text-text">BLE packet</b>raw bytes</span><span><b className="block font-normal text-text">decoded</b>5 streams</span><span><b className="block font-normal text-text">stored</b>SQLite</span></div></div>
  </Frame>;
}

export function GnomeVisual({ compact, contained }: VisualProps) {
  return <Frame label="Gnome / sensors to ESP32-C6 to AWS to care guidance" compact={compact} contained={contained}>
    <div className="flex min-h-[150px] items-center gap-3 sm:gap-5"><div className="grid size-20 shrink-0 place-items-center border border-accent bg-accent-soft font-mono text-sm text-accent sm:size-24">ESP32-C6</div><div className="flex flex-1 flex-col gap-3"><div className="flex flex-wrap gap-1.5">{["soil", "light", "temp", "air", "water"].map((label) => <span key={label} className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] text-text-subtle">{label}</span>)}</div><div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-text-subtle"><span className="border border-border bg-surface-raised px-1 py-2">AWS</span><span className="border border-border bg-surface-raised px-1 py-2">MySQL</span><span className="border border-accent bg-accent-soft px-1 py-2 text-accent">guidance</span></div></div></div>
  </Frame>;
}

export function MarketVisual({ compact, contained }: VisualProps) {
  return <Frame label="Prediction Market Bot / calibration on held-out sets" compact={compact} contained={contained}>
    <div className="flex min-h-[140px] items-center gap-4"><svg viewBox="0 0 260 130" className="min-w-0 flex-1" aria-hidden="true"><path d="M20 110 240 20" stroke="var(--border-strong)" /><path d="M20 110 C70 87 100 84 135 64s62-19 105-44" fill="none" stroke="var(--accent)" strokeWidth="3" /><circle cx="82" cy="85" r="4" fill="var(--accent)" /><circle cx="164" cy="54" r="4" fill="var(--accent)" /></svg><div className="w-24 border-l border-border pl-4 text-[12px]"><span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-subtle">holdout</span><strong className="mt-2 block font-mono text-lg text-accent">&lt; .05</strong><span className="text-text-subtle">calibration error</span></div></div>
  </Frame>;
}

export function CalorieVisual({ compact, contained }: VisualProps) {
  return <Frame label="AI Calorie Counter / image to confirmed nutrition" compact={compact} contained={contained}>
    <div className="flex min-h-[140px] items-center gap-4"><div className="grid size-24 shrink-0 place-items-center border border-dashed border-accent bg-accent-soft text-center text-2xl text-accent" aria-hidden="true">◌<span className="block font-mono text-[9px]">image</span></div><div className="flex-1 space-y-2 text-[12px]"><div className="border-l-2 border-accent pl-3">Food detected<br /><span className="font-mono text-[10px] text-text-subtle">classification · portion</span></div><div className="border-l-2 border-accent pl-3">Confirm if uncertain</div><div className="border-l-2 border-accent pl-3">Nutrition result</div></div></div>
  </Frame>;
}
