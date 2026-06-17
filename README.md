# Peaktime — Frontend Mobile & Web Application

Peaktime é uma aplicação moderna de acompanhamento fitness personalizado, desenvolvida em **React Native** com **Expo** e **TypeScript**. A interface do usuário é construída sobre o framework **Tamagui**, oferecendo um visual premium com alta performance e compatibilidade nativa (iOS/Android) e web.

O sistema atende a dois perfis principais de usuários:
- **Alunos**: Acompanham seus treinos diários, controlam a ingestão calórica e de macronutrientes, e visualizam seu progresso semanal.
- **Professores**: Gerenciam seus alunos vinculados, criam planos semanais de treino sob medida e geram códigos de convite para novas matrículas.

---

## 🚀 Tecnologias & Stack

- **Framework**: [Expo](https://expo.dev) (SDK 56) e [React Native](https://reactnative.dev)
- **Roteamento**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing com rotas tipadas)
- **Interface & UI**: [Tamagui](https://tamagui.dev) (v2) + `@tamagui/lucide-icons-2`
- **Animações**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/) (v4)
- **Segurança**: `expo-secure-store` para persistência de tokens JWT
- **Linguagem**: TypeScript (Strict Mode)

---

## 📁 Estrutura de Pastas e Arquivos

```
PeaktimeFrontend/
├── assets/                  # Assets estáticos (imagens, ícones e splash screens)
├── specs/                   # Documentação de especificação de telas e regras de negócio
├── src/
│   ├── app/                 # Estrutura de rotas e telas (Expo Router)
│   │   ├── (auth)/          # Telas públicas de Autenticação (Login e Cadastro)
│   │   ├── (student)/       # Fluxo privado do Aluno (Abas: Treino, Nutrição e Perfil)
│   │   ├── (professor)/     # Fluxo privado do Professor (Alunos, Perfil e Criar Plano)
│   │   ├── _layout.tsx      # Layout raiz com Provedores globais e Guarda de Rotas (Auth Guard)
│   │   └── index.tsx        # Página de entrada/fallback da aplicação
│   ├── components/          # Componentes de domínio (específicos do negócio)
│   │   └── ui/              # Componentes genéricos de UI reutilizáveis
│   ├── constants/           # Constantes de tema, fontes e medidas globais
│   ├── hooks/               # Hooks customizados de estado e integração com a API
│   ├── services/            # Serviços utilitários (cliente HTTP e persistência)
│   ├── types/               # Tipagens e interfaces TypeScript
│   └── tamagui.config.ts    # Configuração central do Tamagui (Design Tokens)
├── package.json             # Scripts de execução e dependências do projeto
└── tsconfig.json            # Definições do compilador TypeScript
```

---

## 🎨 Design System, Cores e Tipografia

### 🎨 Paleta de Cores (Premium Light & Blue Theme)
O app adota uma estética limpa de alto contraste, com **fundo predominantemente branco** e **detalhes e realces em azul elétrico premium**. Os tokens de cores estão definidos no arquivo [theme.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/constants/theme.ts):

| Token | Modo Claro (Light) | Modo Escuro (Dark) | Descrição |
|---|---|---|---|
| `text` | `#0f172a` (Slate 900) | `#ffffff` | Cor principal dos textos |
| `background` | `#ffffff` | `#0b132b` | Fundo principal da aplicação |
| `backgroundElement` | `#f5f7fb` (Soft Slate) | `#1c2541` | Fundo de inputs, cards ou áreas internas |
| `backgroundSelected` | `#e8eef9` (Blue Tint) | `#3a506b` | Fundo para itens marcados ou bordas de apoio |
| `textSecondary` | `#64748b` (Slate 500) | `#8d99ae` | Subtítulos e textos secundários |
| `primary` | `#0252e3` (Electric Blue) | `#48cae4` | Cor primária de destaque, botões e foco |
| `primaryLight` | `#edf2fe` (Soft Blue) | `#1c2541` | Background leve para badges azuis |
| `accent` | `#06b6d4` (Teal) | `#00b4d8` | Cor de acentuação secundária |
| `tint` | `#0252e3` | `#48cae4` | Cor ativa de guias e componentes focados |

### 📐 Espaçamento (Spacing)
Os espaçamentos são baseados em múltiplos lógicos, conforme configurados em [tamagui.config.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/tamagui.config.ts):
- `half`: 2px
- `one`: 4px
- `two`: 8px
- `three`: 16px (margem interna padrão de cards e telas)
- `four`: 24px (separador de grandes blocos)
- `five`: 32px
- `six`: 64px

### 🔘 Arredondamento (Radius)
Os cantos arredondados suavizam o layout e seguem a proposta do UI Kit moderno:
- `half`: 4px
- `one`: 8px
- `two`: 12px
- `three`: 16px (utilizado nos cards elevados principais da aplicação)
- `four`: 24px (para botões redondos e grandes aberturas)

### 🔠 Tipografia
O aplicativo mapeia fontes otimizadas de acordo com a plataforma de execução:
- **iOS**: `system-ui`, `ui-serif`, `ui-rounded`, `ui-monospace`
- **Android & Web**: `normal` (com fontes de suporte carregadas no web: *Spline Sans*, *Inter*, *SF Pro Rounded*).
Através do componente `<ThemedText>`, são oferecidas tipografias semânticas prontas:
- `title` (Títulos grandes)
- `subtitle` (Subtítulos médios)
- `default` (Textos de leitura comuns)
- `small` / `smallBold` (Badges e labels secundárias)
- `link` / `linkPrimary` (Elementos clicáveis)

---

## 🧭 Fluxo de Navegação & Stacks

A aplicação utiliza o **Guarda de Rotas (Auth Guard)** implementado na raiz do roteador em [_layout.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/_layout.tsx). O direcionamento é dinâmico com base na sessão ativa do usuário:

```
                  ┌───────────────────────────────┐
                  │   Root Layout (_layout.tsx)   │
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  │        Estado de Login        │
                  └──────┬─────────────────┬──────┘
                         │                 │
                 [Sem Autenticação]   [Autenticado]
                         │                 │
            ┌────────────┴────┐     ┌──────┴────────────────────────┐
            │   Stack (auth)  │     │  Aluno (ALUNO)   Prof (PROF)  │
            │  ┌────────────┐ │     └──┬────────────────┬───────────┘
            │  │  /login    │ │        │                │
            │  ├────────────┤ │  ┌─────┴──────┐   ┌─────┴───────────┐
            │  │  /register │ │  │Tab (student)   Tab (professor)   │
            │  └────────────┘ │  │ ┌────────┐ │   │ ┌─────────────┐ │
            └─────────────────┘  │ │/index  │ │   │ │/index       │ │
                                 │ ├────────┤ │   │ ├─────────────┤ │
                                 │ │/nutrit.│ │   │ │/profile     │ │
                                 │ ├────────┤ │   │ ├─────────────┤ │
                                 │ │/profile│ │   │ │/create-plan*│ │
                                 │ └────────┘ │   │ └─────────────┘ │
                                 └────────────┘   └─────────────────┘
                                                   * create-plan é oculta 
                                                     nas abas (Stack interna)
```

---

## 🖥️ Páginas da Aplicação (`src/app/`)

### 🔑 Telas Públicas (`(auth)`)
- **Login ([login.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(auth)/login.tsx))**: Interface limpa com formulário de login (email e senha), suporte a KeyboardAvoidingView e cabeçalho estilizado com o logo da marca Peaktime.
- **Cadastro ([register.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(auth)/register.tsx))**: Fluxo de cadastro unificado. Permite escolher o tipo de conta (Aluno ou Professor) com botões interativos e possui campos com máscara e validação em tempo real (data de nascimento, e-mail e senha).

### 🏃 Fluxo do Aluno (`(student)`)
- **Treino do Dia ([index.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(student)/index.tsx))**:
  - Saudação personalizada e data atual.
  - **Relatório de Atividade Semanal**: Painel que exibe os dias da semana de segunda a domingo, destacando o dia atual e indicando quais treinos foram concluídos no ciclo com ícones de marcação.
  - **Card de Treino**: Exibição da rotina diária através do `WorkoutCard`. Se for dia de descanso, mostra um estado vazio temático.
  - **Conclusão**: Ao concluir o treino, exibe uma mensagem motivacional e desabilita a ação.
- **Diário Alimentar ([nutrition.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(student)/nutrition.tsx))**:
  - Navegação entre datas e cabeçalho com progresso calórico circular (Meta: 2000 kcal).
  - Barras horizontais indicadoras de Carboidratos, Proteínas e Gorduras.
  - Registro de refeições dividido em Café da Manhã, Almoço, Lanche e Jantar.
  - **Modal de Pesquisa de Alimentos**: Integração direta com a base do Open Food Facts. Possui debounce de digitação e calculadora integrada de porção.
- **Perfil ([profile.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(student)/profile.tsx))**: Informações do aluno e seção para colar o código de convite de 6 caracteres do professor para estabelecer vínculo.

### 👨‍🏫 Fluxo do Professor (`(professor)`)
- **Painel de Alunos ([index.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(professor)/index.tsx))**: Exibe a lista de alunos ativos vinculados ao professor. Permite navegar diretamente para a elaboração de novos treinos.
- **Meu Perfil ([profile.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(professor)/profile.tsx))**: Mostra dados cadastrais e gerencia o **Código de Convite** temporário de matrícula rápida.
- **Montar Plano ([create-plan.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/app/(professor)/create-plan.tsx))**: Interface avançada com guias horizontais para cada dia da semana (Segunda a Domingo) para adicionar, ordenar e configurar exercícios individuais (séries, repetições, carga e tempo de descanso).

---

## 🧩 Componentes Compartilhados

### 🧱 Componentes Genéricos de UI (`src/components/ui/`)
- **`Button` ([Button.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/ui/Button.tsx))**: Extende o botão padrão do Tamagui, oferecendo controle de carregamento integrado (`isLoading`) e variantes visuais predefinidas (`primary`, `secondary`, `outline`, `ghost`).
- **`Card` ([Card.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/ui/Card.tsx))**: Container estilizado que padroniza o sombreamento e os arredondamentos da aplicação. Possui variantes `flat`, `outlined` e `elevated`.
- **`Input` ([Input.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/ui/Input.tsx))**: Input envelopado com suporte a rótulos de topo, validações de erro em vermelho abaixo do campo, ícones decorativos esquerdos e botão nativo de exibição/ocultação para senhas.
- **`Collapsible` ([collapsible.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/ui/collapsible.tsx))**: Painel expansível interativo com ícone chevron animado por baixo da biblioteca Reanimated.

### 🏋️ Componentes de Negócio/Domínio (`src/components/`)
- **`WorkoutCard` ([WorkoutCard.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/WorkoutCard.tsx))**: Cabeçalho de dia de treino com uma faixa lateral azul primária e listagem interna dos exercícios.
- **`ExerciseRow` ([ExerciseRow.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/ExerciseRow.tsx))**: Exibe os detalhes de cada exercício em um card elevado contendo o número da ordem, séries, repetições, carga e tempo de descanso.
- **`MealCard` ([MealCard.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/MealCard.tsx))**: Exibe a lista de alimentos de uma refeição, o horário de registro, o somatório nutricional e a opção de excluir o log.
- **`StudentListItem` ([StudentListItem.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/StudentListItem.tsx))**: Item da lista de alunos no painel do professor.
- **`InviteCodeDisplay` ([InviteCodeDisplay.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/components/InviteCodeDisplay.tsx))**: Exibe o código do professor com ações de copiar para a área de transferência e contagem regressiva para expiração.

---

## ⚓ Hooks Customizados (`src/hooks/`)

O aplicativo adota hooks customizados para desacoplar a lógica de estado das telas:

- **`useAuth` ([use-auth.tsx](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/hooks/use-auth.tsx))**: Provedor global que decodifica JWT, mantém a sessão do usuário ativa entre reinicializações do app e fornece funções de `login`, `register` e `logout`.
- **`useEnrollment` ([use-enrollment.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/hooks/use-enrollment.ts))**: Trata do ecossistema de conexões aluno-professor: busca da lista de alunos matriculados, vinculação com código de convite e geração de novos tokens de convite.
- **`useWorkouts` ([use-workouts.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/hooks/use-workouts.ts))**: Gerencia a busca da planilha de treinos semanal, status de conclusão diária e envio de novos planos elaborados.
- **`useNutrition` ([use-nutrition.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/hooks/use-nutrition.ts))**: Encapsula chamadas ao diário alimentar, criação de refeições, exclusão e rotina de busca de alimentos por texto na base de dados externa.
- **`useTheme` ([use-theme.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/hooks/use-theme.ts))**: Utilitário reativo que entrega as cores corretas do tema ativo (`Colors.light` ou `Colors.dark`).

---

## ⚙️ Serviços e Integração (`src/services/`)

- **`api.ts` ([api.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/services/api.ts))**:
  - Envelopamento do `fetch` nativo com suporte a métodos tipados genericamente (`api.get<T>`, `api.post<T>`, etc.).
  - Injeta de forma transparente o token `Authorization: Bearer <token>` em todas as requisições autenticadas.
  - Possui tratamento global de erro (`APIError`). Em caso de erro `401 Unauthorized`, limpa automaticamente a sessão expirada e redireciona o usuário para a tela de autenticação pública.
  - Endereço da API REST: `http://localhost:3333` (configurado pela constante `API_BASE_URL`).
- **`storage.ts` ([storage.ts](file:///c:/Users/joaov/OneDrive/Documentos/GitHub/PeaktimeFrontend/src/services/storage.ts))**:
  - Camada de abstração de armazenamento local.
  - Seleciona automaticamente o motor de armazenamento ideal: **`expo-secure-store`** em plataformas nativas (iOS/Android) ou **`localStorage`** em navegadores web.
  - Chaves gerenciadas: `peaktime_access_token`, `peaktime_refresh_token` e `peaktime_user_role`.

---

## 📟 Integração Hardware (Arduino Uno)

O Peaktime suporta uma integração IoT via WebSocket / Server-Sent Events (SSE) com o microcontrolador **Arduino Uno**, simulando o controle de fluxo de uma catraca física de acesso.

### Lógica de Contabilidade do Fluxo
A comunicação estabelecida entre o hardware e o ecossistema web atualiza em tempo real o contador de presença baseado nas seguintes diretrizes:
- **Sinal de Entrada (`+1`)**: Disparado quando a catraca detecta uma rotação de entrada bem-sucedida, incrementando instantaneamente em `+1` o contador global no dashboard.
- **Sinal de Saída (`-1`)**: Disparado quando a catraca detecta uma rotação de saída ou fluxo reverso, decrementando em `-1` o contador de usuários ativos no ambiente.

---

## 🛠️ Executando o Projeto

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento do Expo:
```bash
npx expo start
```

No terminal do Expo, pressione as teclas para carregar o app:
- **`a`**: Abre no Emulador Android.
- **`i`**: Abre no Simulador iOS.
- **`w`**: Abre no navegador Web.
- **`r`**: Recarrega o bundle da aplicação.
