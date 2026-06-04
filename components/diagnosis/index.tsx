"use client";

import "./diagnosis.css";
import { OBJECTION_CATEGORIES } from "@/lib/objections";
import type { Diagnosis as DiagnosisData } from "@/lib/types";

function catLabel(id?: string | null): string | null {
  const c = OBJECTION_CATEGORIES.find((x) => x.id === id);
  return c ? c.label : null;
}

export default function Diagnosis({ diag }: { diag: DiagnosisData | null }) {
  if (!diag) return null;
  const objecoes = diag.objecoes_top || [];
  const recs = diag.recomendacoes || [];

  return (
    <div className="diagPanel">
      <div className="diagTitle">Diagnóstico da oferta</div>
      <div className="diagColumns">
        <div>
          <div className="diagColTitle">Principais objeções</div>
          {objecoes.map((o, i) => (
            <div key={i} className="diagObjItem">
              <div className="diagObjHead">
                <span className="diagObjName">{o.tema || catLabel(o.categoria) || "Objeção"}</span>
                <span className="diagObjFreq">{o.frequencia}</span>
              </div>
              {catLabel(o.categoria) && <div className="diagObjCat">{catLabel(o.categoria)}</div>}
              {o.exemplo && <div className="diagObjExample">“{o.exemplo}”</div>}
            </div>
          ))}
        </div>
        <div>
          <div className="diagColTitle">O que ajustar antes de promover</div>
          {recs.map((r, i) => (
            <div key={i} className="diagRec">
              <span className="diagRecBullet">›</span>
              <span className="diagRecText">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
