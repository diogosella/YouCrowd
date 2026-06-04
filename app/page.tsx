"use client";

import "./page.css";
import { useMemo, useState } from "react";
import { PERSONAS } from "@/lib/personas";
import { OBJECTION_CATEGORIES } from "@/lib/objections";
import OfferForm from "@/components/offerForm";
import Pipeline from "@/components/pipeline";
import PersonaCard from "@/components/personaCard";
import Stats from "@/components/stats";
import Diagnosis from "@/components/diagnosis";
import Disclaimer from "@/components/disclaimer";
import type { Offer, Reaction, Diagnosis as DiagnosisData, Status, PipelineStep } from "@/lib/types";

const EMPTY_OFFER: Offer = { nome: "", preco: "", garantia: "", copy: "" };

type Stage = "sim" | "diag" | null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function catLabel(id?: string | null): string | null {
  const c = OBJECTION_CATEGORIES.find((x) => x.id === id);
  return c ? c.label : null;
}

async function postJSON<T = any>(url: string, body: unknown, retries = 1): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }
    if (res.ok) return data;
    // 429: espera e tenta de novo (deixa a janela do rate limit liberar).
    if (res.status === 429 && attempt < retries) {
      await sleep(5000);
      continue;
    }
    if (res.status === 429) {
      throw new Error("Limite de requisições da LLM atingido, tente novamente mais tarde");
    }
    throw new Error(data?.error || `Erro ${res.status}`);
  }
}

export default function Home() {
  const [offer, setOffer] = useState<Offer>(EMPTY_OFFER);
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState<Stage>(null);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});
  const [diag, setDiag] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reactionList = useMemo(
    () => PERSONAS.map((p) => reactions[p.id]).filter((r): r is Reaction => Boolean(r)),
    [reactions]
  );
  const reagiram = reactionList.filter((r) => r.state === "done").length;
  const comprariam = reactionList.filter(
    (r) => r.state === "done" && r.veredito === "compraria"
  ).length;
  const diretriz = reagiram ? Math.round((comprariam / reagiram) * 100) : 0;
  const topObjection =
    diag?.objecoes_top?.[0]?.tema ||
    catLabel(diag?.objecoes_top?.[0]?.categoria) ||
    (status === "done" ? "—" : "");

  const hasPanel = Object.keys(reactions).length > 0;

  async function run() {
    if (!offer.copy.trim() && !offer.nome.trim()) {
      setError("Preencha ao menos o nome e a descrição da oferta.");
      setStatus("error");
      return;
    }
    setError(null);
    setDiag(null);
    setStatus("running");
    setStage("sim");

    const initial: Record<string, Reaction> = {};
    PERSONAS.forEach((p) => {
      initial[p.id] = { state: "pending" };
    });
    setReactions(initial);

    try {
      // Sequencial (1 persona por vez, com intervalo) para não estourar o rate limit.
      const reacted: Reaction[] = [];
      for (let i = 0; i < PERSONAS.length; i++) {
        const p = PERSONAS[i];
        try {
          const r = await postJSON("/api/simulate", { offer, personaId: p.id });
          const filled: Reaction = {
            personaId: p.id,
            state: "done",
            veredito: r.veredito,
            objecao: r.objecao,
            o_que_pesou: r.o_que_pesou,
          };
          setReactions((prev) => ({ ...prev, [p.id]: filled }));
          reacted.push(filled);
        } catch (e: any) {
          const fb: Reaction = {
            personaId: p.id,
            state: "done",
            veredito: "em dúvida",
            objecao: e?.message ? `(erro: ${e.message})` : "(não consegui reagir a tempo)",
          };
          setReactions((prev) => ({ ...prev, [p.id]: fb }));
          reacted.push(fb);
        }
        if (i < PERSONAS.length - 1) await sleep(1200);
      }

      setStage("diag");
      const d = await postJSON<DiagnosisData>("/api/diagnose", {
        offer,
        reactions: reacted.map((r) => ({
          personaId: r.personaId,
          veredito: r.veredito,
          objecao: r.objecao,
        })),
      });
      setDiag(d);
      setStatus("done");
      setStage(null);
    } catch (e: any) {
      setError(e?.message || "Algo deu errado ao rodar o teste.");
      setStatus("error");
      setStage(null);
    }
  }

  function reset() {
    setOffer(EMPTY_OFFER);
    setReactions({});
    setDiag(null);
    setError(null);
    setStatus("idle");
    setStage(null);
  }

  const steps: PipelineStep[] =
    status === "running" || status === "done"
      ? [
          {
            key: "sim",
            label: "Consultar painel",
            sub: `${reagiram}/${PERSONAS.length} reagiram`,
            active: stage === "sim",
            done: stage === "diag" || status === "done",
          },
          {
            key: "diag",
            label: "Diagnosticar",
            active: stage === "diag",
            done: status === "done",
          },
        ]
      : [];

  return (
    <main className="main">
      <div className="container">
        <div className="headerBlock">
          <img className="logoImg" src="/assets/youcrowd-logo.png" alt="YouCrowd" />
          <div className="subtitle">
            Teste sua oferta com 5 compradores sintéticos antes de gastar 1 centavo em
            tráfego.
          </div>
        </div>

        <OfferForm
          offer={offer}
          setOffer={setOffer}
          onRun={run}
          onReset={reset}
          status={status}
        />

        <Pipeline steps={steps} />

        {error && <div className="errorBox">{error}</div>}

        {hasPanel && (
          <>
            <Stats
              reagiram={reagiram}
              total={PERSONAS.length}
              diretriz={diretriz}
              topObjection={topObjection}
            />

            <div className="panelGrid">
              {PERSONAS.map((p) => (
                <PersonaCard key={p.id} persona={p} reaction={reactions[p.id]} />
              ))}
            </div>
          </>
        )}

        <Diagnosis diag={diag} />

        {status === "done" && <Disclaimer />}
        
      </div>
    </main>
  );
}
