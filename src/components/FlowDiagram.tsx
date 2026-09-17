/* One diagram primitive for the whole site.
   Project visuals are generated from each case study's architecture steps,
   so they depict an architecture that is written down rather than an
   invented screenshot.

   Built from HTML rather than SVG on purpose. Text inside a fixed SVG
   viewBox scales with the box: at a card's real width these labels landed
   between 5px and 11px, which is illegible. As HTML the labels stay at
   their CSS size, reflow, and remain selectable.

   Layout is driven by container queries, so a diagram responds to the width
   of the card it sits in rather than the viewport. Every card therefore
   behaves identically at any given size. */

export interface FlowStep {
  name: string;
  detail?: string;
}

export function FlowDiagram({
  steps,
  title,
  animate = false,
  className = "",
}: {
  steps: FlowStep[];
  title: string;
  animate?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`@container m-0 ${className}`}
      aria-label={`${title}: ${steps.map((s) => s.name).join(", then ")}.`}
      role="img"
    >
      <ol
        className="flex list-none flex-col gap-0 p-0 @[26rem]:flex-row @[26rem]:items-stretch"
        aria-hidden="true"
      >
        {steps.map((step, i) => (
          <li
            key={step.name}
            className="flex flex-1 items-center gap-0 @[26rem]:flex-col"
          >
            <div
              className={`flex w-full flex-1 flex-col justify-center rounded-[10px] border bg-surface px-3 py-2.5 text-center @[26rem]:min-h-[64px] ${
                i === steps.length - 1 ? "border-accent" : "border-border"
              }`}
            >
              <span className="text-[13px] leading-tight font-semibold">
                {step.name}
              </span>
              {step.detail && (
                <span className="mt-0.5 font-mono text-[11px] text-text-muted">
                  {step.detail}
                </span>
              )}
            </div>

            {/* Connector. Vertical while stacked, horizontal once in a row. */}
            {i < steps.length - 1 && (
              <span
                className="relative flex shrink-0 items-center justify-center self-center py-1.5 @[26rem]:px-1.5 @[26rem]:py-0"
                aria-hidden="true"
              >
                <span className="block h-4 w-px bg-border @[26rem]:h-px @[26rem]:w-4" />
                {animate && (
                  <span
                    className="telemetry-dot absolute size-[5px] rounded-full bg-accent"
                    style={{ "--step": i } as React.CSSProperties}
                  />
                )}
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
