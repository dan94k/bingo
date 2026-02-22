import { Link } from "react-router";

export function meta() {
  return [
    { title: "Bingo" },
    { name: "description", content: "Jogo de Bingo online" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="mb-12 text-center">
        <h1
          className="text-5xl font-black tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          Bingo
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--color-ink-muted)" }}>
          Escolha uma opção para começar
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-xl">
        <Link
          to="/sorteador"
          className="flex-1 rounded-xl border p-10 flex flex-col items-center gap-4 transition-all duration-200"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(10,102,194,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <span className="text-5xl">🎲</span>
          <div className="text-center">
            <p className="text-lg font-semibold" style={{ color: "var(--color-ink)" }}>
              Sorteador
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
              Sorteie os números do bingo
            </p>
          </div>
        </Link>

        <Link
          to="/cartela"
          className="flex-1 rounded-xl border p-10 flex flex-col items-center gap-4 transition-all duration-200 group"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(10,102,194,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <span className="text-5xl">🎴</span>
          <div className="text-center">
            <p
              className="text-lg font-semibold transition-colors"
              style={{ color: "var(--color-ink)" }}
            >
              Cartela
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
              Gere sua cartela aleatória
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
