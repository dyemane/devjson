import type { RequestTimings } from "../types";
import { PHASES, totalTime } from "./waterfall-bar";

interface TimingBreakdownProps {
  timings: RequestTimings;
}

export function TimingBreakdown({ timings }: TimingBreakdownProps) {
  const total = totalTime(timings);
  if (total <= 0) return null;

  return (
    <div class="timing-breakdown">
      {PHASES.map((p) => {
        const v = timings[p.key];
        if (v <= 0) return null;
        const pct = (v / total) * 100;
        return (
          <div key={p.key} class="timing-breakdown__row">
            <span class="timing-breakdown__label">{p.label}</span>
            <span class="timing-breakdown__bar-track">
              <span
                class="timing-breakdown__bar-fill"
                style={{ width: `${pct}%`, background: p.cssVar }}
              />
            </span>
            <span class="timing-breakdown__value">{v.toFixed(1)}ms</span>
          </div>
        );
      })}
      <div class="timing-breakdown__total">
        <span class="timing-breakdown__label">Total</span>
        <span class="timing-breakdown__bar-track" />
        <span class="timing-breakdown__value">{total.toFixed(1)}ms</span>
      </div>
    </div>
  );
}
