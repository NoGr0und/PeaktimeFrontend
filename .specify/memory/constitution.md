<!--
SYNC IMPACT REPORT
==================
- Version change: 0.0.0 (Template) -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Qualidade de Código e TypeScript Estrito
  - [PRINCIPLE_2_NAME] -> II. Arquitetura Modular, Roteamento e Dependências Enxutas
  - [PRINCIPLE_3_NAME] -> III. Design System, Mobile-First e Responsividade
  - [PRINCIPLE_4_NAME] -> IV. Acessibilidade (a11y) e Contraste
  - [PRINCIPLE_5_NAME] -> V. SEO e Estratégia de Deploy
- Added sections:
  - Integração e Fluxos de API
  - Workflow de Desenvolvimento
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
  - .specify/templates/checklist-template.md (✅ updated)
- Follow-up TODOs: None (all placeholders filled)
==================
-->

# Peaktime Frontend Constitution

## Core Principles

### I. Qualidade de Código e TypeScript Estrito
O projeto deve manter strict: true habilitado no tsconfig.json, garantindo tipagem forte
e proibindo any implícito. Todos os componentes devem ser funcionais e baseados em hooks
(class components são proibidos). Toda tipagem de props de componentes e payloads/respostas de API
deve ser centralizada em src/types/. É terminantemente proibido inserir lógica de negócio
complexa ou chamadas diretas de API dentro de componentes de UI do React Native.

### II. Arquitetura Modular, Roteamento e Dependências Enxutas
As rotas do aplicativo devem ser estritamente gerenciadas pelo Expo Router sob src/app/,
separando de forma clara os fluxos de autenticação ((auth)), de aluno ((student)) e de
professor ((professor)). Deve-se seguir a cadeia lógica de responsabilidades:
services/api (clientes de rede) -> types (modelos de dados) -> components (UI nativa).
O uso de dependências nativas deve ser enxuto, priorizando componentes padrão do ecossistema
Expo como secure-store, reanimated e expo-symbols.

### III. Design System, Mobile-First e Responsividade
Todo desenvolvimento de UI deve ser mobile-first, suportando larguras de tela a partir
de 320px usando flexbox do React Native e a API StyleSheet. O arquivo src/constants/theme.ts
é a fonte de verdade absoluta para cores (light/dark), tipografia e espaçamento. Na versão
web, os layouts devem limitar o conteúdo a uma largura máxima de 800px e centralizá-lo para
garantir uma experiência limpa.

### IV. Acessibilidade (a11y) e Contraste
A acessibilidade deve ser integrada nativamente em todos os componentes visuais e de interação,
utilizando propriedades como accessibilityLabel, accessibilityRole e assegurando contraste WCAG AA.

### V. SEO e Estratégia de Deploy
A versão web do aplicativo deve incluir metadados de SEO básicos por meio do componente Head do
Expo Router. O deploy da aplicação nativa (Android/iOS) deve ser gerado pelo EAS Build, enquanto a
versão web deve ser exportada de forma estática (expo export --platform web) para execução em CDNs.

## Integração e Fluxos de API
A comunicação com o backend deve cobrir as rotas de:
1. Autenticação e sessão no endpoint /api/auth com tokens salvos em SecureStore.
2. Vínculo entre aluno e professor via /api/enrollment com código de 6 caracteres.
3. Planejamento semanal e consumo do treino do dia atual via /api/workouts.
4. Registro, exclusão e pesquisa (Open Food Facts) de refeições em /api/nutrition.
5. Sincronização de push tokens para notificações móveis via /api/settings.

## Workflow de Desenvolvimento
Novas features devem seguir a sequência Spec Kit: especificação -> planejamento -> checklist ->
implementação de tarefas. Toda alteração na UI ou fluxo de rede deve validar conformidade
com a arquitetura e componentes centralizados antes de prosseguir para testes e build final.

## Governance
1. Esta Constituição rege toda e qualquer decisão de arquitetura no Peaktime Frontend.
2. Alterações e adições de pacotes nativos de terceiros exigem validação e aprovação explícita.
3. Modificações em design tokens globais devem ser centralizadas em src/constants/theme.ts ou global.css.

**Version**: 1.0.0 | **Ratified**: 2026-05-22 | **Last Amended**: 2026-05-22
