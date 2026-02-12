import type { RequestTimings } from "../types";

const PHASES: { key: keyof RequestTimings; cssVar: string; label: string }[] = [
  { key: "blocked", cssVar: "var(--wf-blocked)", label: "Blocked" },
  { key: "dns", cssVar: "var(--wf-dns)", label: "DNS" },
  { key: "connect", cssVar: "var(--wf-connect)", label: "Connect" },
  { key: "ssl", cssVar: "var(--wf-ssl)", label: "SSL" },
  { key: "send", cssVar: "var(--wf-send)", label: "Send" },
  { key: "wait", cssVar: "var(--wf-wait)", label: "Wait" },
  { key: "receive", cssVar: "var(--wf-receive)", label: "Receive" },
];

function activePhases(timings: RequestTimings) {
  return PHASES.filter((p) => timings[p.key] > 0);
}

function totalTime(timings: RequestTimings) {
  return PHASES.reduce((sum, p) => sum + Math.max(timings[p.key], 0), 0);
}

interface WaterfallBarProps {
  timings: RequestTimings;
}

export function WaterfallBar({ timings }: WaterfallBarProps) {
  const phases = activePhases(timings);
  const total = totalTime(timings);
  if (total <= 0 || phases.length === 0) return null;

  return (
    <span class="wf-bar">
      {phases.map((p) => (
        <span
          key={p.key}
          class="wf-bar__segment"
          style={{
            background: p.cssVar,
            width: `${(timings[p.key] / total) * 100}%`,
          }}
        />
      ))}
    </span>
  );
}

interface WaterfallTooltipProps {
  timings: RequestTimings;
}

export function WaterfallTooltip({ timings }: WaterfallTooltipProps) {
  const total = totalTime(timings);

  return (
    <span class="wf-tooltip">
      {PHASES.map((p) => {
        const v = timings[p.key];
        if (v <= 0) return null;
        return (
          <span key={p.key} class="wf-tooltip__row">
            <span class="wf-tooltip__swatch" style={{ background: p.cssVar }} />
            <span class="wf-tooltip__label">{p.label}</span>
            <span class="wf-tooltip__value">{v.toFixed(1)}ms</span>
          </span>
        );
      })}
      <span class="wf-tooltip__divider" />
      <span class="wf-tooltip__row">
        <span class="wf-tooltip__swatch" style={{ background: "transparent" }} />
        <span class="wf-tooltip__label">Total</span>
        <span class="wf-tooltip__value">{total.toFixed(1)}ms</span>
      </span>
    </span>
  );
}

export { PHASES, totalTime };
