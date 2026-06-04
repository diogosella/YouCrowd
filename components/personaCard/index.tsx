"use client";

import "./personaCard.css";
import type { Persona, Reaction, Veredito } from "@/lib/types";

function verdictClass(v: Veredito): string {
  if (v === "compraria") return "compraria";
  if (v === "não compraria") return "nao";
  return "duvida";
}

interface PersonaCardProps {
  persona: Persona;
  reaction?: Reaction | null;
}

export default function PersonaCard({ persona, reaction }: PersonaCardProps) {
  const pending = !reaction || reaction.state === "pending";
  const v: Veredito = reaction?.veredito || "em dúvida";

  return (
    <div className={pending ? "personaCard isPending" : "personaCard"}>
      <div className="personaHead">
        <div className="personaName">{persona.nome}</div>
        {pending ? (
          <span className="personaPending">pensando…</span>
        ) : (
          <span className={`verdictBadge ${verdictClass(v)}`}>{v}</span>
        )}
      </div>

      <div className="personaPerfil">{persona.perfil}</div>

      <div className="personaAnchor">ancorada em: {persona.ancora}</div>

      {!pending && reaction?.objecao && (
        <div className="personaQuote">“{reaction.objecao}”</div>
      )}
    </div>
  );
}
