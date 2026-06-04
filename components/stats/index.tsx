"use client";

import "./stats.css";
import type { ReactNode } from "react";

function Stat({ label, value, small }: { label: string; value: ReactNode; small?: boolean }) {
  return (
    <div className="statCard">
      <div className="statLabel">{label}</div>
      <div className={small ? "statValue small" : "statValue"}>{value}</div>
    </div>
  );
}

interface StatsProps {
  reagiram: number;
  total: number;
  diretriz: number;
  topObjection: string;
}

export default function Stats({ reagiram, total, diretriz, topObjection }: StatsProps) {
  return (
    <div className="statsGrid">
      <Stat label="Comprariam (diretriz)" value={reagiram ? `${diretriz}%` : "—"} />
      <Stat label="Reagiram" value={`${reagiram} / ${total}`} />
      <Stat label="Objeção nº 1" value={topObjection || "…"} small />
    </div>
  );
}
