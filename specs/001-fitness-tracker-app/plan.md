# Implementation Plan: Monitoramento de Ocupação da Academia

**Branch**: `001-fitness-tracker-app` | **Date**: 2026-06-04 | **Spec**: [spec.md](specs/001-fitness-tracker-app/spec.md)

**Input**: Criar tela mobile de monitoramento da ocupação da academia em tempo real com gráficos de linha e barra, card de capacidade e legenda de níveis de lotação.

## Summary

Implementar uma tela dedicada ao monitoramento da ocupação da academia em tempo real dentro do app Peaktime. A tela será acessível tanto por alunos quanto professores e exibirá: um cabeçalho com logo e nome do app, um card principal com a ocupação atual (número de pessoas, porcentagem de capacidade, nível de lotação), um gráfico de linha mostrando a ocupação ao longo do dia, um gráfico de barras com previsão para as próximas horas, e uma legenda visual com os 5 níveis de lotação (vazio, tranquilo, moderado, cheio, lotado). A biblioteca `react-native-gifted-charts` será utilizada para os gráficos, pois todas as dependências já estão instaladas no projeto.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) com React 19.2.3 / React Native 0.85.3

**Primary Dependencies**:
- Expo SDK 56 (`expo: ~56.0.3`)
- `expo-router: ~56.2.5` (file-based routing)
- `react-native-svg: 15.15.4` (já instalado)
- `expo-linear-gradient: ~56.0.4` (já instalado)
- `react-native-gifted-charts` (**NOVA dependência** — único pacote novo necessário)
- `moti: ^0.30.0` (animações)

**Storage**: PostgreSQL via Prisma (Peaktime Backend)

**Testing**: Verificação manual via browser subagent + testes visuais

**Target Platform**: iOS / Android / Web (Expo managed workflow)

**Project Type**: Mobile App (Expo Router)

**Performance Goals**: Atualização de ocupação em < 2 segundos; gráficos renderizando a 60fps

**Constraints**: Mobile-first (320px+), dark theme obrigatório, sem dependências nativas adicionais

**Scale/Scope**: 1 nova tela, 1 novo serviço frontend, 1 novo plugin backend, 1 nova tabela no banco

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Notas |
|-----------|--------|-------|
| I. TypeScript Estrito | ✅ PASS | Todos os tipos serão definidos em `src/types/occupancy.ts` |
| II. Arquitetura Modular | ✅ PASS | Seguirá o padrão existente: `services/` → `types/` → `components/` |
| III. Design System Mobile-First | ✅ PASS | Usará `theme.ts` para cores, fontes e espaçamentos |
| IV. Acessibilidade (a11y) | ✅ PASS | Cards e gráficos terão `accessibilityLabel` e contraste AA |
| V. SEO e Deploy | ✅ PASS | Tela interna (não afeta SEO); compatível com EAS Build |
| Dependência Nova | ⚠️ JUSTIFICADA | `react-native-gifted-charts` é necessário para gráficos e suas peer deps já estão instaladas |

**Gate Result**: ✅ PASS — Nenhuma violação. A nova dependência é justificada.

## Project Structure

### Documentation (this feature)

```text
specs/001-fitness-tracker-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (student)/
│   │   ├── _layout.tsx          # [MODIFY] Adicionar rota "occupancy"
│   │   └── occupancy.tsx        # [NEW] Tela de ocupação (aluno)
│   └── (professor)/
│       ├── _layout.tsx          # [MODIFY] Adicionar rota "occupancy"
│       └── occupancy.tsx        # [NEW] Tela de ocupação (professor)
├── components/
│   └── ui/
│       ├── OccupancyCard.tsx    # [NEW] Card principal de ocupação
│       ├── OccupancyChart.tsx   # [NEW] Gráfico de linha (dia inteiro)
│       ├── ForecastChart.tsx    # [NEW] Gráfico de barras (previsão)
│       └── OccupancyLegend.tsx  # [NEW] Legenda com 5 níveis
├── services/
│   └── occupancyService.ts     # [NEW] Chamadas à API de ocupação
├── hooks/
│   └── use-occupancy.ts        # [NEW] Hook para consumir o serviço
├── types/
│   └── occupancy.ts            # [NEW] Tipos TypeScript
└── constants/
    └── theme.ts                # [MODIFY] Adicionar cores de níveis de ocupação
```

**Backend (Peaktime Backend):**
```text
src/plugins/
└── occupancy/                  # [NEW] Plugin completo
    ├── occupancy.plugin.ts
    ├── occupancy.routes.ts
    ├── occupancy.schema.ts
    └── occupancy.service.ts

prisma/
└── schema.prisma               # [MODIFY] Adicionar modelo OccupancyReading
```

**Structure Decision**: Segue o padrão modular existente do projeto. A tela de ocupação será uma rota independente dentro dos grupos `(student)` e `(professor)`, compartilhando os mesmos componentes reutilizáveis.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Nova dependência: `react-native-gifted-charts` | Necessário para renderizar gráficos de linha e barras com performance nativa | Implementar gráficos SVG manuais seria inviável em termos de tempo e manutenção |
