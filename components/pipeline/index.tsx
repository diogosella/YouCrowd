"use client";

import "./pipeline.css";
import type { PipelineStep } from "@/lib/types";

export default function Pipeline({ steps }: { steps: PipelineStep[] }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="pipelineRow">
      {steps.map((s, i) => (
        <div key={s.key} className={s.active ? "pipelineStep isActive" : "pipelineStep"}>
          <div
            className={`pipelineBadge${s.active ? " isActive" : ""}${s.done ? " isDone" : ""}`}
          >
            {s.done ? "✓" : i + 1}
          </div>
          <div>
            <div className={s.active ? "pipelineLabel isActive" : "pipelineLabel"}>
              {s.label}
            </div>
            {s.sub && (
              <div className={s.active ? "pipelineSub isActive" : "pipelineSub"}>{s.sub}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
