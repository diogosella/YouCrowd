"use client";

import { useState } from "react";
import "./offerForm.css";
import { SAMPLE_OFFER } from "@/lib/sample";
import type { Offer, Status } from "@/lib/types";

interface OfferFormProps {
  offer: Offer;
  setOffer: (offer: Offer) => void;
  onRun: () => void;
  onReset: () => void;
  status: Status;
}

export default function OfferForm({ offer, setOffer, onRun, onReset, status }: OfferFormProps) {
  const running = status === "running";
  const done = status === "done";
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasContent = Boolean(offer.nome || offer.preco || offer.garantia || offer.copy);

  function handleSample() {
    if (hasContent) setConfirmOpen(true);
    else setOffer(SAMPLE_OFFER);
  }

  function applySample() {
    setOffer(SAMPLE_OFFER);
    setConfirmOpen(false);
  }

  return (
    <>
      <div className="offerCard">
        <div className="offerHeader">
          <div className="offerHeaderTitle">Sua oferta</div>
          <button
            type="button"
            className="offerSampleButton"
            onClick={handleSample}
            disabled={running}
          >
            Usar exemplo
          </button>
        </div>

        <div className="offerFieldGrid">
          <input
            className="offerInput"
            placeholder="Nome do produto"
            value={offer.nome}
            onChange={(e) => setOffer({ ...offer, nome: e.target.value })}
          />
          <input
            className="offerInput"
            placeholder="Preço"
            value={offer.preco}
            onChange={(e) => setOffer({ ...offer, preco: e.target.value })}
          />
          <input
            className="offerInput"
            placeholder="Garantia"
            value={offer.garantia}
            onChange={(e) => setOffer({ ...offer, garantia: e.target.value })}
          />
        </div>

        <textarea
          className="offerTextarea"
          placeholder="Cole aqui a descrição / copy do anúncio (a promessa, os bônus, a prova social...)"
          value={offer.copy}
          onChange={(e) => setOffer({ ...offer, copy: e.target.value })}
        />

        <div className="offerActions">
          <button type="button" className="offerRunButton" onClick={onRun} disabled={running}>
            {running ? "Rodando teste…" : "Rodar teste com 5 compradores"}
          </button>
          {done && (
            <button type="button" className="offerSecondaryButton" onClick={onRun}>
              Rodar de novo
            </button>
          )}
          {(done || status === "error") && (
            <button type="button" className="offerGhostButton" onClick={onReset}>
              Limpar
            </button>
          )}
        </div>
      </div>

      {confirmOpen && (
        <div className="confirmOverlay" onClick={() => setConfirmOpen(false)}>
          <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmTitle">Usar a oferta de exemplo?</div>
            <div className="confirmText">
              Isso vai substituir tudo o que você já preencheu. A ação não pode ser desfeita.
            </div>
            <div className="confirmActions">
              <button
                type="button"
                className="confirmCancel"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </button>
              <button type="button" className="confirmOk" onClick={applySample}>
                Substituir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
