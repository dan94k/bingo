# Design System — Bingo

Regras de design da aplicação. Inspiração: LinkedIn (clean, profissional, minimalista).

---

## Paleta de Cores

| Token              | Valor     | Uso                                     |
|--------------------|-----------|------------------------------------------|
| `--color-primary`  | `#0A66C2` | Ações principais, links, destaques       |
| `--color-primary-dark` | `#004182` | Hover de elementos primários         |
| `--color-surface`  | `#F3F2EE` | Fundo da página                          |
| `--color-card`     | `#FFFFFF` | Fundo de cards e componentes             |
| `--color-border`   | `#E0DFDB` | Bordas sutis                             |
| `--color-ink`      | `#1C1E21` | Texto principal                          |
| `--color-ink-muted`| `#666666` | Texto secundário, labels, placeholders   |

---

## Tipografia

- **Família:** Inter (Google Fonts)
- **Pesos usados:** 400 (regular), 600 (semibold), 700 (bold), 900 (black)
- **Tamanhos:**
  - Título principal: `text-5xl` (3rem) — peso black
  - Título de seção: `text-3xl` (1.875rem)
  - Corpo: `text-base` (1rem)
  - Secundário / labels: `text-sm` (0.875rem)

---

## Espaçamentos

- **Padding interno de cards:** `p-10` (2.5rem / 40px)
- **Gap entre cards na Home:** `gap-5` (1.25rem / 20px)
- **Margem acima do grid de botões:** `mb-12` (3rem / 48px)
- **Padding de página:** `p-8` (2rem / 32px)
- **Espaçamento interno da cartela:** células com `aspect-square`

---

## Componentes

### Cards / Botões de navegação
- `border-radius`: `rounded-xl` (12px)
- `border`: `1px solid var(--color-border)`
- `background`: `var(--color-card)`
- Hover: borda muda para `var(--color-primary)` + `box-shadow: 0 4px 20px rgba(10,102,194,0.12)`
- Transição: `duration-200`

### Cartela de Bingo
- `border-radius`: `rounded-2xl` (16px)
- `box-shadow`: `0 2px 12px rgba(0,0,0,0.07)`
- Cabeçalho: fundo `var(--color-primary)`, texto branco, `letter-spacing: 0.4em`
- Grade: células separadas por `1px solid var(--color-border)`
- Célula central (estrela): fundo `rgba(10,102,194,0.06)`, ícone `★` na cor primary

### Links / Botões de texto
- Cor padrão: `var(--color-primary)`
- Hover: `var(--color-primary-dark)`
- Transição: `duration-200`

---

## Princípios Gerais

1. **Espaço em branco generoso** — evitar elementos muito próximos
2. **Hierarquia clara** — títulos grandes, subtítulos menores, labels discretos
3. **Uma cor de destaque** — apenas o azul LinkedIn como cor primária interativa
4. **Sem dark mode** — interface clara e limpa por padrão
5. **Bordas sutis** — sem sombras pesadas, preferência por bordas para delimitar áreas
