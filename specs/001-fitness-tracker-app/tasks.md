# Tasks: Acompanhamento Fitness

**Input**: Design documents from `specs/001-fitness-tracker-app/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- Contains exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização e configuração de bibliotecas compartilhadas

- [x] T000 Install required dependencies (tamagui, @tamagui/config, @tamagui/lucide-icons, expo-secure-store, expo-notifications, expo-device)
- [x] T001 Initialize and configure Tamagui in src/tamagui.config.ts
- [x] T002 Update root layout in src/app/_layout.tsx to include TamaguiProvider, wrap the application, and apply the Web-specific max-width (800px) centered layout constraint (defined in theme.ts)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura básica de persistência e chamadas de rede autenticadas

**⚠️ CRITICAL**: Nenhuma tela ou hook de história de usuário pode ser implementado antes da conclusão desta fase.

- [x] T003 Implement token secure storage helper in src/services/storage.ts
- [x] T004 Implement HTTP Fetch API client with automatic JWT authorization injection in src/services/api.ts

**Checkpoint**: Foundation ready - a implementação das histórias de usuário pode iniciar em paralelo.

---

## Phase 3: User Story 1 - Autenticação e Registro de Alunos e Professores (Priority: P1) 🎯 MVP

**Goal**: Permitir cadastro e login diferenciando os papéis ALUNO e PROFESSOR, salvando o token JWT e redirecionando para os fluxos corretos.

**Independent Test**: Usuário consegue se registrar e fazer login nas telas, acessando a área correspondente ao seu papel.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create authentication types in src/types/auth.ts
- [ ] T006 [US1] Implement auth hooks for signup and login in src/hooks/use-auth.ts
- [ ] T007 [P] [US1] Implement Button UI atomic component using Tamagui in src/components/ui/Button.tsx
- [ ] T008 [P] [US1] Implement Input UI atomic component using Tamagui in src/components/ui/Input.tsx
- [ ] T009 [P] [US1] Implement Card UI atomic component using Tamagui in src/components/ui/Card.tsx
- [ ] T010 [US1] Build register screen utilizing new components in src/app/(auth)/register.tsx
- [ ] T011 [US1] Build login screen utilizing new components in src/app/(auth)/login.tsx

**Checkpoint**: User Story 1 está totalmente funcional e testável.

---

## Phase 4: User Story 2 - Vínculo Aluno-Professor via Código (Priority: P1)

**Goal**: Professor gera um código de convite de 6 caracteres e aluno digita esse código para criar o vínculo, aparecendo na lista do professor.

**Independent Test**: Professor gera o código na tela de perfil, aluno insere na sua tela de vínculo e o vínculo é confirmado com sucesso.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Create enrollment types in src/types/enrollment.ts
- [ ] T013 [US2] Implement enrollment hook in src/hooks/use-enrollment.ts
- [ ] T014 [P] [US2] Implement InviteCodeDisplay component in src/components/InviteCodeDisplay.tsx
- [ ] T015 [P] [US2] Implement StudentListItem component in src/components/StudentListItem.tsx
- [ ] T016 [US2] Build professor profile and invite screen in src/app/(professor)/profile.tsx
- [ ] T017 [US2] Build student profile and vinculation screen in src/app/(student)/profile.tsx
- [ ] T018 [US2] Build professor student list homepage in src/app/(professor)/index.tsx

**Checkpoint**: Fluxo de convite e vinculação 100% funcional entre professor e aluno.

---

## Phase 5: User Story 3 - Visualização e Conclusão de Treinos Diários (Priority: P1)

**Goal**: Exibir os exercícios do dia da semana atual para o aluno, com botão de confirmação de conclusão.

**Independent Test**: Aluno acessa o treino planejado na tela inicial e confirma a conclusão, recebendo feedback visual.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Create workout types in src/types/workout.ts
- [ ] T020 [US3] Implement workouts hooks (fetching today, completing log) in src/hooks/use-workouts.ts
- [ ] T021 [P] [US3] Implement ExerciseRow component in src/components/ExerciseRow.tsx
- [ ] T022 [P] [US3] Implement WorkoutCard component in src/components/WorkoutCard.tsx
- [ ] T023 [US3] Build student workout today homepage in src/app/(student)/index.tsx, ensuring the empty state "Nenhum treino planejado para hoje. Aproveite para descansar!" is handled when no workout exists.

**Checkpoint**: Aluno consegue ver o treino diário planejado e registrar a finalização.

---

## Phase 6: User Story 4 - Criação de Plano de Treino Semanal pelo Professor (Priority: P2)

**Goal**: Disponibilizar tela para o professor montar a grade de treinos semanais de seus alunos vinculados.

**Independent Test**: Professor seleciona o aluno na lista, monta as séries/exercícios para os dias da semana e salva o plano.

### Implementation for User Story 4

- [ ] T024 [US4] Build create weekly workout plan screen in src/app/(professor)/create-plan.tsx

**Checkpoint**: Planos de treinos podem ser criados, atualizados e atribuídos aos alunos.

---

## Phase 7: User Story 5 - Diário de Refeições e Busca de Alimentos (Priority: P2)

**Goal**: Adicionar refeições selecionando alimentos por busca, visualizá-las organizadas por data e removê-las se necessário.

**Independent Test**: Aluno realiza busca por alimentos, adiciona a uma categoria de refeição, visualiza os macros na lista diária e exclui a refeição.

### Implementation for User Story 5

- [ ] T025 [P] [US5] Create nutrition types in src/types/nutrition.ts
- [ ] T026 [US5] Implement nutrition hooks in src/hooks/use-nutrition.ts
- [ ] T027 [P] [US5] Implement MealCard component in src/components/MealCard.tsx
- [ ] T028 [US5] Build nutrition daily log and meal addition/search screen in src/app/(student)/nutrition.tsx, implementing debounce on real-time food search to meet the 1.5-second performance criteria (SC-002).

**Checkpoint**: Diário de nutrição ativo e sincronizado com API nutricional.

---

## Phase 7.5: Push Notifications & Settings (Constitution Requirement)

**Purpose**: Sincronização de tokens de notificações push para alunos e professores.

- [ ] T028a [P] [US1] Create settings and push notification types in src/types/settings.ts
- [ ] T028b [US1] Implement settings custom hook containing register push token logic in src/hooks/use-settings.ts
- [ ] T028c [US1] Integrate push notifications permissions check, token acquisition, and registry inside app root layout src/app/_layout.tsx

**Checkpoint**: Registro de push tokens totalmente operacional após autenticação de usuários.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes de navegação estrutural, layout final, acessibilidade e validação geral.

- [ ] T029 Configure student navigation tabs layout in src/app/(student)/_layout.tsx
- [ ] T030 Configure professor navigation tabs layout in src/app/(professor)/_layout.tsx
- [ ] T030a [US1] Add basic SEO metadata inside routes utilizing the Expo Router Head component (Principle V)
- [ ] T031 Run validation build, check accessibility properties (accessibilityLabel/accessibilityRole), and run TypeScript compilation checks across the app

---

## Dependencies & Execution Order

### Phase Dependencies

1.  **Setup (Phase 1)**: Sem dependências (Início imediato).
2.  **Foundational (Phase 2)**: Depende do Setup (Bloqueia todas as Histórias de Usuário).
3.  **User Stories (Phase 3+)**: Dependem da finalização da fase Foundational.
    -   Podem ser executadas em sequência lógica ou paralelo.
4.  **Polish (Phase 8)**: Depende de todas as histórias concluídas.

### Parallel Opportunities

-   Todas as tarefas marcadas com `[P]` (ex: criação de tipos TS, ou componentes visuais isolados) podem ser executadas simultaneamente ou em paralelo por diferentes desenvolvedores, pois operam em arquivos distintos e sem dependência mútua direta.
