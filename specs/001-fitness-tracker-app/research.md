# Research: Acompanhamento Fitness

## Decision: STACK & CONFIGURAÇÕES DE UI

1. **Biblioteca de Estilização**: Tamagui (pacotes `tamagui` e `@tamagui/config`) integrada com a configuração em `src/tamagui.config.ts`.
2. **Design Tokens**: Mapear as constantes existentes em `src/constants/theme.ts` (cores, tipografia, espaçamento) diretamente para os tokens e temas do Tamagui para garantir a fidelidade ao design system.
3. **Ícones**: Uso exclusivo do `expo-symbols` para ícones nativos, evitando carregar bibliotecas externas pesadas.
4. **Animações**: Utilizar `react-native-reanimated` e `react-native-gesture-handler` para transições suaves e interações gestuais nativas.

### Rationale

- **Tamagui**: Fornece um compilador otimizado de estilo que unifica a experiência nativa e web, com suporte a temas dinâmicos (claro/escuro) e layout flexível, sem o overhead de estilização runtime pesada.
- **Mapeamento de Tokens**: Garantir que as cores (como `#F0F0F3` e `#212225`) definidas no tema original sejam propagadas em todos os componentes atômicos (Button, Input, Card) via tokens do Tamagui.
- **expo-symbols**: Solução nativa de ícones do Expo 56 que consome recursos nativos eficientemente (SF Symbols no iOS, e fontes equivalentes no Android/Web).

### Alternatives Considered

- **NativeWind**: Descartado em favor do Tamagui, atendendo à solicitação explícita do usuário de Stack.
- **Bibliotecas de Ícones de Terceiros (ex. lucide-react-native)**: Descartadas para manter o projeto leve e alinhado ao ecossistema nativo padrão do Expo (`expo-symbols`).

---

## Decision: ARQUITETURA E GERENCIAMENTO DE ESTADO

1. **Estado do Aplicativo**: Sem uso de gerenciadores de estado global (Redux, Zustand ou Context API para lógica de negócio). Todo estado é local e encapsulado em **Hooks Customizados** (`src/hooks/`).
2. **Clientes de Rede**: Criar um cliente HTTP em `src/services/api.ts` usando a Fetch API nativa configurada com a baseURL do Peaktime Backend e interceptação para injetar o header `Authorization: Bearer <token>`.
3. **Armazenamento de Sessão**: Armazenamento seguro de tokens JWT usando `expo-secure-store` em `src/services/storage.ts`.

### Rationale

- **Hooks Customizados**: A UI permanece 100% livre de lógica de rede ou manipulação complexa de dados. O estado e a chamada assíncrona ficam isolados no hook, expondo apenas dados formatados, estados de loading, erro e funções de ação (como login, logout, concluir treino).
- **Sem Estado Global**: Como o aplicativo é direcionado a fluxos independentes de tela e sincronização com backend em tempo real, gerenciar estado via hooks locais focados evita acoplamento desnecessário de dados e simplifica o comportamento do app.

### Alternatives Considered

- **Zustand**: Descartado por requisição explícita do usuário de manter estado local com hooks, o que ajuda a isolar ciclos de vida das telas.
- **Axios**: Avaliado, mas optou-se pela Fetch API para diminuir o tamanho final do bundle nativo, mantendo a flexibilidade de wrappers.

---

## Decision: ARQUITETURA DE ROTAS E NAVEGAÇÃO

1. **Expo Router**: Fluxo de rotas baseados em arquivos sob `src/app/`, com separação estruturada por diretórios de grupos de rotas com parênteses:
   - `(auth)`: Login e Cadastro (telas públicas).
   - `(student)`: Área do Aluno (layout em tabs).
   - `(professor)`: Área do Professor (layout em tabs).

### Rationale

- **Expo Router Groups**: Garante que os fluxos de navegação permaneçam completamente isolados visualmente e logicamente. Impede que um aluno acesse acidentalmente telas de professores e vice-versa, permitindo configurar layouts de abas (`Tab.Navigator`) específicos para cada papel.
