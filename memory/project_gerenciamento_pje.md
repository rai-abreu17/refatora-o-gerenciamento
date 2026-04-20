---
name: Projeto Gerenciamento PJe
description: Contexto do projeto Angular "Gerenciamento PJe" — stack, módulos, paleta e convenções de dashboard
type: project
---

Sistema Angular que administra usuários do PJe (Processo Judicial Eletrônico) mapeando situações irregulares e gerando insights de uso.

**Why:** A UI foca-se em gestores; o dashboard cruza múltiplas dimensões (conformidade, vínculo, origem, órgão, sistema, atividade).

**How to apply:**
- Stack: Angular 21.2 standalone (`signal`, `input()`, `output()`), Angular Material 21.2 (primário), Bootstrap 5.3 (grid/utilitários), chart.js 4.5 + ng2-charts 10.0.
- Paleta (tokens CSS em `src/styles.scss`): `--color-primary #1B4F8A`, `--color-accent #E8A000`, `--color-success #2E7D32`, `--color-warning #F57C00`, `--color-danger #C62828`; tipografia IBM Plex Sans.
- Módulos de domínio: `pje/`, `odin/`, `trema/` + `shared/` + `layout/`.
- Rota inicial: `pje/dashboard`. Rotas dentro de cada módulo em `*.routes.ts`.
- Shared components reutilizáveis: `page-header`, `data-table`, `status-badge`, `filter-bar`, `toast`, `confirm-dialog/modal`, `action-menu`, `chip-list`.
- Convenção de dashboard: componente orquestrador em `pje/dashboard/dashboard.component.{ts,html,scss}` + subcomponentes em `pje/dashboard/components/*`; mocks no serviço `pje/services/dashboard.service.ts`.
- Restrição vigente: refatoração de dashboard deve usar apenas dados mockados; não adicionar deps sem consulta; preservar identidade visual do resto do sistema.
