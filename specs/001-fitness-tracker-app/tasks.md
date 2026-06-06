# Tasks: Monitoramento de Ocupação da Academia

**Input**: Design documents from `/specs/001-fitness-tracker-app/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Não requisitados na especificação. Tarefas de teste omitidas.

**Organization**: Tarefas organizadas por funcionalidade para implementação incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `src/` at `PeaktimeFrontend/` repository root
- **Backend**: `src/` at `Peaktime Backend/` repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Instalar dependência de gráficos e criar estrutura base

- [x] T001 Instalar `react-native-gifted-charts` via `npx expo install react-native-gifted-charts` no PeaktimeFrontend
- [x] T002 [P] Criar tipos TypeScript de ocupação em `src/types/occupancy.ts`
- [x] T003 [P] Adicionar cores dos níveis de ocupação em `src/constants/theme.ts`

---

## Phase 2: Foundational (Backend — Blocking Prerequisites)

**Purpose**: Criar o plugin de ocupação no backend com banco de dados e rotas

**⚠️ CRITICAL**: O frontend não pode consumir dados sem o backend pronto

- [x] T004 Adicionar modelo `OccupancyReading` em `prisma/schema.prisma` e rodar `npx prisma migrate dev --name add-occupancy-reading`
- [x] T005 [P] Criar schema de validação em `src/plugins/occupancy/occupancy.schema.ts`
- [x] T006 [P] Criar service com métodos `getCurrentOccupancy`, `getDayHistory`, `getForecast`, `createReading` em `src/plugins/occupancy/occupancy.service.ts`
- [x] T007 Criar rotas `GET /current`, `GET /history`, `GET /forecast`, `POST /readings` em `src/plugins/occupancy/occupancy.routes.ts`
- [x] T008 Criar plugin Fastify que registra o prefixo `/api/occupancy` em `src/plugins/occupancy/occupancy.plugin.ts`
- [x] T009 Registrar plugin de ocupação no arquivo principal do servidor (se necessário)
- [x] T010 Popular dados de teste via POST para validar o backend isoladamente

**Checkpoint**: Backend de ocupação pronto — todas as rotas respondendo com dados válidos

---

## Phase 3: User Story 1 — Visualizar Ocupação Atual (Priority: P1) 🎯 MVP

**Goal**: Aluno ou professor abre a tela de ocupação e vê o card com o número de pessoas, porcentagem e nível de lotação

**Independent Test**: Abrir a tela de ocupação e verificar se o card exibe corretamente "42 pessoas", "52%", e "Moderado" com cor amarela

### Implementation for User Story 1

- [x] T011 [P] [US1] Criar serviço frontend `occupancyService.ts` em `src/services/occupancyService.ts` com método `getCurrent()`
- [x] T012 [P] [US1] Criar componente `OccupancyCard.tsx` em `src/components/ui/OccupancyCard.tsx` (exibe count, percentage, level com ícone e cor dinâmica)
- [x] T013 [P] [US1] Criar componente `OccupancyLegend.tsx` em `src/components/ui/OccupancyLegend.tsx` (5 níveis: Vazio, Tranquilo, Moderado, Cheio, Lotado)
- [x] T014 [US1] Criar tela `occupancy.tsx` em `src/app/(student)/occupancy.tsx` com cabeçalho (logo + nome do app), OccupancyCard e OccupancyLegend
- [x] T015 [US1] Adicionar rota "occupancy" ao layout do aluno em `src/app/(student)/_layout.tsx` e ao TabBar
- [x] T016 [P] [US1] Copiar tela de ocupação para professor em `src/app/(professor)/occupancy.tsx`
- [x] T017 [US1] Adicionar rota "occupancy" ao layout do professor em `src/app/(professor)/_layout.tsx` e ao TabBar
- [x] T018 [US1] Implementar polling automático a cada 30 segundos na tela de ocupação

**Checkpoint**: Card de ocupação atual funcional com legenda — MVP entregue

---

## Phase 4: User Story 2 — Gráfico de Linha (Histórico do Dia) (Priority: P2)

**Goal**: Exibir gráfico de linha mostrando como a ocupação variou ao longo do dia

**Independent Test**: Abrir a tela de ocupação e verificar que o gráfico de linha mostra pontos de dados ao longo das horas do dia com a cor do nível

### Implementation for User Story 2

- [x] T019 [US2] Adicionar método `getHistory(date)` ao `occupancyService.ts` em `src/services/occupancyService.ts`
- [x] T020 [US2] Criar componente `OccupancyChart.tsx` em `src/components/ui/OccupancyChart.tsx` usando `LineChart` do `react-native-gifted-charts`
- [x] T021 [US2] Integrar `OccupancyChart` na tela `occupancy.tsx` do aluno em `src/app/(student)/occupancy.tsx`
- [x] T022 [P] [US2] Integrar `OccupancyChart` na tela `occupancy.tsx` do professor em `src/app/(professor)/occupancy.tsx`

**Checkpoint**: Gráfico de linha renderizando com dados históricos do dia

---

## Phase 5: User Story 3 — Gráfico de Barras (Previsão) (Priority: P2)

**Goal**: Exibir gráfico de barras com a previsão de ocupação para as próximas horas

**Independent Test**: Abrir a tela de ocupação e verificar que o gráfico de barras mostra previsão para as próximas 4+ horas com cores por nível

### Implementation for User Story 3

- [x] T023 [US3] Adicionar método `getForecast()` ao `occupancyService.ts` em `src/services/occupancyService.ts`
- [x] T024 [US3] Criar componente `ForecastChart.tsx` em `src/components/ui/ForecastChart.tsx` usando `BarChart` do `react-native-gifted-charts`
- [x] T025 [US3] Integrar `ForecastChart` na tela `occupancy.tsx` do aluno em `src/app/(student)/occupancy.tsx`
- [x] T026 [P] [US3] Integrar `ForecastChart` na tela `occupancy.tsx` do professor em `src/app/(professor)/occupancy.tsx`

**Checkpoint**: Ambos os gráficos renderizando — tela completa

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Refinamentos visuais e de UX

- [x] T027 [P] Adicionar animações de entrada (MotiView) em todos os componentes de ocupação
- [x] T028 [P] Adicionar `accessibilityLabel` e `accessibilityRole` em OccupancyCard, OccupancyChart, ForecastChart e OccupancyLegend
- [x] T029 Garantir responsividade mobile-first (320px+) e maxWidth 800px na web
- [x] T030 Validar quickstart.md — executar todos os passos e confirmar que a tela funciona end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — iniciar imediatamente
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as User Stories
- **US1 (Phase 3)**: Depende do Phase 2 — pode iniciar T011-T013 em paralelo
- **US2 (Phase 4)**: Depende da US1 (tela já criada) — adiciona gráfico de linha
- **US3 (Phase 5)**: Depende da US1 (tela já criada) — pode ser paralelo com US2
- **Polish (Phase 6)**: Depende de US1 + US2 + US3

### User Story Dependencies

- **US1 (P1)**: Card + Legenda → pode ser desenvolvida assim que o backend estiver pronto
- **US2 (P2)**: Gráfico de Linha → depende da tela criada em US1, mas o componente pode ser desenvolvido em paralelo
- **US3 (P2)**: Gráfico de Barras → depende da tela criada em US1, pode ser paralelo com US2

### Within Each User Story

- Services antes de componentes
- Componentes antes de integração na tela
- Tela do aluno antes de replicar para professor

### Parallel Opportunities

- T002 e T003 podem rodar em paralelo (Setup)
- T005 e T006 podem rodar em paralelo (Backend)
- T011, T012 e T013 podem rodar em paralelo (US1 — arquivos diferentes)
- T016 pode rodar em paralelo com T015 (professor vs aluno layout)
- US2 e US3 podem ser desenvolvidas em paralelo após US1

---

## Parallel Example: User Story 1

```bash
# Launch all parallelizable US1 tasks together:
Task: "Criar serviço occupancyService.ts em src/services/occupancyService.ts"
Task: "Criar componente OccupancyCard.tsx em src/components/ui/OccupancyCard.tsx"
Task: "Criar componente OccupancyLegend.tsx em src/components/ui/OccupancyLegend.tsx"

# Then sequentially:
Task: "Criar tela occupancy.tsx em src/app/(student)/occupancy.tsx"
Task: "Adicionar rota ao layout e TabBar"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (instalar gifted-charts + tipos + cores)
2. Complete Phase 2: Backend (modelo + rotas + dados de teste)
3. Complete Phase 3: User Story 1 (card + legenda + tela)
4. **STOP and VALIDATE**: Testar tela de ocupação isoladamente
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Backend → Infraestrutura pronta
2. Add US1 → Card de ocupação atual → Deploy (MVP!)
3. Add US2 → Gráfico de linha do dia → Deploy
4. Add US3 → Gráfico de barras de previsão → Deploy
5. Polish → Animações, a11y, responsividade

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- `react-native-gifted-charts` já tem todas as peer deps instaladas no projeto
