import { useNavigate } from "react-router";
import { useState, useRef } from "react";

export function meta() {
  return [{ title: "Sorteador — Bingo" }];
}

const ANIMATION_DURATION_MS = 3000;
const MAX_HISTORY_VISIBLE = 10;

function ConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs rounded-2xl p-6 flex flex-col gap-5"
        style={{
          backgroundColor: "var(--color-card)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-semibold text-center" style={{ color: "var(--color-ink)" }}>
          Tem certeza que quer prosseguir?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm font-semibold"
            style={{
              color: "var(--color-ink-muted)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-border)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)")
            }
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-dark)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary)")
            }
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sorteador() {
  const navigate = useNavigate();
  // ordem de sorteio (índice 0 = primeiro sorteado)
  const [drawnOrder, setDrawnOrder] = useState<number[]>([]);
  // número exibido durante a animação (slot machine)
  const [spinning, setSpinning] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [confirm, setConfirm] = useState<"voltar" | "limpar" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const drawnSet = new Set(drawnOrder);
  const allDrawn = drawnOrder.length === 90;
  const lastDrawn = drawnOrder.at(-1) ?? null;

  // histórico = todos exceto o último, do mais recente para o mais antigo
  const history = drawnOrder.slice(0, -1).reverse();
  const hasMoreHistory = history.length > MAX_HISTORY_VISIBLE;
  const visibleHistory = history.slice(0, MAX_HISTORY_VISIBLE);

  // número exibido no display grande
  const displayNum = animating ? spinning : lastDrawn;

  function clearAnimation() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function startAnimation(target: number) {
    const startTime = performance.now();

    function tick() {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / ANIMATION_DURATION_MS;

      if (progress >= 1) {
        // Animação terminou: confirma o número sorteado
        setSpinning(null);
        setDrawnOrder((prev) => [...prev, target]);
        setAnimating(false);
        return;
      }

      // Exibe número aleatório no display (efeito slot machine)
      setSpinning(Math.floor(Math.random() * 90) + 1);

      // Intervalo começa curto (~35ms) e vai crescendo (~420ms)
      const interval = 35 + Math.pow(progress, 1.8) * 385;
      timeoutRef.current = setTimeout(tick, interval);
    }

    tick();
  }

  function drawNext() {
    if (animating || allDrawn) return;
    const available = Array.from({ length: 90 }, (_, i) => i + 1).filter(
      (n) => !drawnSet.has(n)
    );
    const target = available[Math.floor(Math.random() * available.length)];
    setAnimating(true);
    startAnimation(target);
  }

  function handleVoltar() {
    if (animating) return;
    if (drawnOrder.length > 0) setConfirm("voltar");
    else navigate("/");
  }

  function handleLimpar() {
    if (animating || drawnOrder.length === 0) return;
    setConfirm("limpar");
  }

  function handleConfirm() {
    clearAnimation();
    if (confirm === "voltar") {
      navigate("/");
    } else {
      setDrawnOrder([]);
      setSpinning(null);
      setAnimating(false);
    }
    setConfirm(null);
  }

  return (
    <>
      {confirm && (
        <ConfirmDialog onConfirm={handleConfirm} onCancel={() => setConfirm(null)} />
      )}

      <div
        className="min-h-screen flex flex-col items-center p-6 pb-10"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between w-full max-w-2xl mb-5">
          <button
            onClick={handleVoltar}
            disabled={animating}
            className="text-sm font-medium transition-colors disabled:opacity-40"
            style={{ color: "var(--color-ink-muted)" }}
            onMouseEnter={(e) => {
              if (!animating)
                (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--color-ink-muted)")
            }
          >
            ← Voltar
          </button>

          <button
            onClick={handleLimpar}
            disabled={animating || drawnOrder.length === 0}
            className="text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--color-primary)" }}
            onMouseEnter={(e) => {
              if (!animating && drawnOrder.length > 0)
                (e.currentTarget as HTMLElement).style.color = "var(--color-primary-dark)";
            }}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--color-primary)")
            }
          >
            Limpar números
          </button>
        </div>

        {/* Faixa compacta: último sorteado + histórico + botão sortear */}
        <div
          className="w-full max-w-2xl rounded-2xl px-4 py-3 mb-5 flex items-center gap-4"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Lista unificada: último (azul, grande) + histórico decrescente */}
          <div className="flex items-center gap-3 flex-1 overflow-hidden min-w-0">
            {drawnOrder.length === 0 && !animating && (
              <span className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                Nenhum número sorteado ainda
              </span>
            )}

            {/* Último / animação — largura fixa para não quebrar layout */}
            {(displayNum !== null || animating) && (
              <span
                className="tabular-nums shrink-0 font-black leading-none inline-block text-center"
                style={{ color: "var(--color-primary)", fontSize: "2.25rem", width: "3rem" }}
              >
                {displayNum ?? "—"}
              </span>
            )}

            {/* Histórico anterior */}
            {visibleHistory.map((n, i) => {
              const ratio = (i + 1) / MAX_HISTORY_VISIBLE;
              const fontSize = 1.5 - ratio * 0.95; // 1.5rem → ~0.55rem
              const opacity = 1 - ratio * 0.65;     // 1 → 0.35
              return (
                <span
                  key={n}
                  className="tabular-nums shrink-0 font-semibold"
                  style={{
                    color: "var(--color-ink-muted)",
                    fontSize: `${fontSize}rem`,
                    opacity,
                  }}
                >
                  {n}
                </span>
              );
            })}
          </div>

          {/* Botão Sortear */}
          <button
            onClick={drawNext}
            disabled={animating || allDrawn}
            className="shrink-0 px-6 py-3 rounded-xl text-base font-bold text-white transition-colors disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-primary)",
              opacity: animating || allDrawn ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!animating && !allDrawn)
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-dark)";
            }}
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary)")
            }
          >
            Sortear
          </button>
        </div>

        {/* Grid 10×9 */}
        <div
          className="rounded-2xl overflow-hidden w-full max-w-2xl"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
        >
          <div className="grid grid-cols-10">
            {Array.from({ length: 90 }, (_, i) => {
              const num = i + 1;
              const isDrawn = drawnSet.has(num);
              const row = Math.floor(i / 10);
              const col = i % 10;

              return (
                <div
                  key={num}
                  className="aspect-square flex items-center justify-center"
                  style={{
                    borderRight: col < 9 ? "1px solid var(--color-border)" : undefined,
                    borderBottom: row < 8 ? "1px solid var(--color-border)" : undefined,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold tabular-nums select-none"
                    style={{
                      backgroundColor: isDrawn ? "var(--color-primary)" : "transparent",
                      color: isDrawn ? "#ffffff" : "var(--color-ink)",
                    }}
                  >
                    {num}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}
