# Dashboard PJe

Dashboard principal do módulo Gerenciamento PJe. Hoje, 100% dos números exibidos
vêm de mocks determinísticos em memória — nenhuma chamada HTTP é feita.

## Estrutura

```
pje/dashboard/
├── dashboard.component.{ts,html,scss}  # orquestrador + layout
├── dashboard.model.ts                  # tipos de domínio e labels
└── components/
    ├── dashboard-filters/              # filtros globais (Órgão, Sistema, Origem)
    ├── kpi-stat-card/                  # 5 KPIs com sparkline
    ├── trend-chart/                    # PJe 1G × PJe 2G + granularidade + export CSV
    ├── login-heatmap/                  # 24h × 7 dias em CSS-grid
    ├── distribution-chart/             # donut/hbar/grouped-bar reutilizável
    ├── last-access-buckets/            # faixas + destaque "Nunca acessou"
    ├── critical-users-table/           # Top N usuários críticos
    └── compliance-footer/              # barras de conformidade global
```

## Onde ficam os mocks

Todos os mocks vivem em **`src/app/pje/services/dashboard.service.ts`**.

O serviço gera ao subir:

- **220 usuários sintéticos** (`seedUsuarios`) via RNG determinístico `mulberry32`
  com seed `20260420`. Distribuições realistas:
  - Órgão: ~65% TRE-MA / 35% TSE
  - Sistema: ~70% PJe 1G / 30% PJe 2G
  - Origem: ~70% interno / 30% externo
  - Vínculo: ~75% ativo / 15% inativo / 10% sem vínculo
  - Conformidade: ~15% com alguma irregularidade
  - Último acesso: ~8% nunca acessaram
- **Séries temporais** (`buildSeries`) com picos em horário comercial e queda em
  fins de semana.
- **Heatmap** com padrão duplo pico 9–11h e 14–17h.

Expõe dois endpoints Observable com `delay` para simular latência:

| Método | O que retorna |
| --- | --- |
| `getSnapshot(filters)` | Payload completo usado pelo novo dashboard |
| `getAccessCount(sistema, granularity, start, end)` | Compatível com o dashboard antigo |

Os filtros do snapshot (`Órgão`, `Sistema`, `Origem`) reduzem a lista de usuários
antes das agregações — toda métrica decorre dessa projeção.

## Como trocar por chamadas reais no futuro

1. Defina a interface do backend replicando `DashboardSnapshot` (ou uma versão
   paginada/parcial) em uma biblioteca compartilhada.
2. No `DashboardService`, substitua o corpo de `getSnapshot` por um
   `httpClient.get<DashboardSnapshot>(environment.apiUrl + '/dashboard', { params })`.
   Os `filters` serializam trivialmente como query params.
3. Mantenha `getAccessCount` enquanto houver integrações legadas — ele continua
   funcionando sobre o mock até que o backend ofereça um endpoint equivalente.
4. Remova `seedUsuarios`, `mulberry32` e as funções `build*` quando o backend
   cobrir todos os campos do snapshot. Os componentes do dashboard dependem
   **apenas** das interfaces em `dashboard.model.ts`, não dos helpers internos.
5. Para testes end-to-end, pode-se habilitar o mock via um flag
   (`useMockService`) e manter o service atual como fonte para cenários
   determinísticos.

## Filtros e reatividade

O estado vive em `DashboardComponent` como `signal<DashboardFilters>`. Qualquer
mudança dispara `load()`, que refaz o snapshot e empurra dados para os
subcomponentes via `input()` — sem stores, sem effects manuais.

A granularidade (`day/week/month/year`) é controlada dentro do `trend-chart`
e propagada pelo filtro global (afeta apenas a série temporal).

## Responsividade

Breakpoints:

- `≥1200px` — 6 colunas, heatmap e buckets ocupam 3 cada
- `768–1199px` — 4 colunas
- `<768px` — coluna única, scroll horizontal reservado para heatmap e tabela

## Acessibilidade

- Contraste AA em todos os textos sobre fundo colorido (KPI cards, destaque
  "Nunca acessou", chips de conformidade).
- `role="progressbar"` nas barras de último acesso e compliance.
- `aria-label` em chips, heatmap e tabela.
- Foco visível nas células do heatmap (`:focus-visible` com outline).
