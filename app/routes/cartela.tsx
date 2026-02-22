import { useNavigate } from "react-router";
import { useState } from "react";

export function meta() {
  return [{ title: "Cartela — Bingo" }];
}

function generateCard(): (number | null)[] {
  const numbers = new Set<number>();
  while (numbers.size < 24) {
    numbers.add(Math.floor(Math.random() * 90) + 1);
  }
  const arr: (number | null)[] = [...numbers].sort((a, b) => a - b);
  arr.splice(12, 0, null);
  return arr;
}

const COLUMNS = ["B", "I", "N", "G", "O"];

type ConfirmAction = "voltar" | "nova";

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ onConfirm, onCancel }: ConfirmDialogProps) {
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
        <p
          className="text-base font-semibold text-center"
          style={{ color: "var(--color-ink)" }}
        >
          Tem certeza que quer prosseguir?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
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

export default function Cartela() {
  const navigate = useNavigate();
  const [card, setCard] = useState<(number | null)[]>(() => generateCard());
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const hasMarked = marked.size > 0;

  function toggleMark(index: number) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleVoltar() {
    if (hasMarked) {
      setConfirm("voltar");
    } else {
      navigate("/");
    }
  }

  function handleNova() {
    if (hasMarked) {
      setConfirm("nova");
    } else {
      resetCard();
    }
  }

  function resetCard() {
    setCard(generateCard());
    setMarked(new Set());
  }

  function handleConfirm() {
    if (confirm === "voltar") {
      navigate("/");
    } else {
      resetCard();
    }
    setConfirm(null);
  }

  return (
    <>
      {confirm && (
        <ConfirmDialog
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleVoltar}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--color-ink-muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--color-ink-muted)")
              }
            >
              ← Voltar
            </button>
            <button
              onClick={handleNova}
              className="text-sm font-semibold transition-colors"
              style={{ color: "var(--color-primary)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--color-primary-dark)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--color-primary)")
              }
            >
              Nova cartela
            </button>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <div
              className="px-6 py-5 text-center"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span
                className="text-3xl font-black text-white tracking-[0.4em]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                BINGO
              </span>
            </div>

            <div
              className="grid grid-cols-5"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              {COLUMNS.map((col) => (
                <div
                  key={col}
                  className="py-2.5 text-center text-base font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {col}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5">
              {card.map((num, i) => {
                const isCenter = i === 12;
                const row = Math.floor(i / 5);
                const col = i % 5;
                const isLastRow = row === 4;
                const isLastCol = col === 4;
                const isMarked = marked.has(i);

                return (
                  <div
                    key={i}
                    onClick={() => !isCenter && toggleMark(i)}
                    className="aspect-square flex items-center justify-center"
                    style={{
                      borderRight: !isLastCol ? "1px solid var(--color-border)" : undefined,
                      borderBottom: !isLastRow ? "1px solid var(--color-border)" : undefined,
                      backgroundColor: isCenter ? "rgba(10,102,194,0.06)" : undefined,
                      cursor: isCenter ? "default" : "pointer",
                    }}
                  >
                    {isCenter ? (
                      <span
                        className="text-4xl font-black"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ★
                      </span>
                    ) : (
                      <span
                        className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold tabular-nums select-none transition-colors duration-150"
                        style={{
                          backgroundColor: isMarked
                            ? "var(--color-primary)"
                            : "var(--color-card)",
                          color: isMarked ? "#ffffff" : "var(--color-ink)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isMarked) {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              "rgba(10,102,194,0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMarked) {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              "var(--color-card)";
                          }
                        }}
                      >
                        {num}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p
            className="text-center text-sm mt-5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {hasMarked
              ? `${marked.size} número${marked.size > 1 ? "s" : ""} marcado${marked.size > 1 ? "s" : ""}`
              : "Toque em um número para marcá-lo"}
          </p>
        </div>
      </div>
    </>
  );
}
