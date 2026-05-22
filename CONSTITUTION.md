# Constituição do Projeto - Peaktime Frontend

Este documento estabelece as diretrizes arquiteturais, padrões de código, design system e fluxos de integração com a API do **Peaktime Backend** para o desenvolvimento do aplicativo Peaktime Frontend.

O Peaktime é um sistema de gerenciamento para academias que conecta professores e alunos para acompanhamento de treinos, nutrição e metas.

---

## 🚀 Stack Tecnológica

O projeto é construído como um aplicativo universal rodando sobre a plataforma **Expo (React Native)** com suporte a iOS, Android e Web.

- **Core:** React 19 (v19.2.3) + React Native (v0.85.3) + TypeScript
- **Plataforma & Tooling:** Expo (v56.0.3)
- **Roteamento:** Expo Router (v56.2.5) — Roteamento baseado em arquivos (`src/app`)
- **Estilização:** Vanilla React Native `StyleSheet` integrada com CSS customizado via `src/global.css` e o arquivo de tema centralizado (`src/constants/theme.ts`)
- **Efeitos e UI Nativas:** `@expo/ui`, `expo-symbols`, `expo-image` e `expo-glass-effect` para componentes visuais avançados
- **Animações:** `react-native-reanimated` (v4.3.1) e `react-native-gesture-handler`

---

## 🎯 Qualidade de Código

1. **TypeScript Estrito:**
   - Ativação obrigatória de `strict: true` no `tsconfig.json`.
   - Proibido o uso de `any` implícito. Qualquer tipo desconhecido ou complexo deve ser devidamente tipado com interfaces/types.
2. **Componentes Funcionais:**
   - Uso exclusivo de componentes funcionais com Hooks. Sem componentes de classe (`class components`).
3. **Tipagem Centralizada:**
   - Props de componentes e payloads de API devem ser tipados com interfaces/types claros e declarados em arquivos específicos na pasta `src/types/` (ex: `src/types/auth.ts`, `src/types/workout.ts`).
4. **Separação de Responsabilidades (UI vs. Lógica):**
   - Os componentes de UI devem ser puros e focados em apresentação.
   - Toda a lógica de negócio, chamadas de API, mutação de estado e autenticação deve ser isolada em **Hooks Customizados** (`src/hooks/`) ou em **Serviços** (`src/services/`).

---

## 🏗️ Arquitetura e Estrutura de Diretórios

A estrutura do projeto deve seguir estritamente o seguinte layout dentro de `src/`:

```
src/
├── app/                  # Rotas do Expo Router (File-based Routing)
│   ├── (auth)/           # Telas públicas (Login, Registro)
│   ├── (student)/        # Fluxo e abas do Aluno
│   ├── (professor)/      # Fluxo e abas do Professor
│   └── _layout.tsx       # Provedores de contexto e layout raiz do app
├── components/           # Componentes visuais e de UI reaproveitáveis
│   ├── ui/               # Componentes atômicos (Botões, Inputs, Cards)
│   └── ...               # Componentes compostos de domínio
├── constants/            # Constantes de tema, fontes e espaçamento
│   └── theme.ts          # Arquivo centralizador de design tokens
├── hooks/                # Hooks customizados de consumo de API e estado
│   ├── use-auth.ts       # Gerenciamento de sessão, login e registro
│   ├── use-workouts.ts   # Planos de treino, hoje, conclusão
│   └── use-nutrition.ts  # Refeições, buscas e exclusões
├── services/             # Lógica de integração e clientes de rede
│   ├── api.ts            # Cliente Fetch/Axios pré-configurado com baseURL e headers JWT
│   └── storage.ts        # Armazenamento seguro de tokens (SecureStore)
├── types/                # Interfaces TypeScript mapeando a API e dados internos
│   ├── auth.ts
│   ├── enrollment.ts
│   ├── workout.ts
│   └── nutrition.ts
└── global.css            # Variáveis CSS para ambiente Web
```

### Regra de Ouro da Customização
- Modificações de design system e tokens globais devem ser feitas **exclusivamente** em `src/constants/theme.ts` ou `src/global.css`.
- As configurações nativas do aplicativo (como permissões, ícone e splash screen) devem ser configuradas exclusivamente no `app.json`.

---

## 🔌 Integração com o Peaktime Backend

O aplicativo consome a API do Peaktime Backend (disponível por padrão em `http://localhost:3333` em desenvolvimento). A comunicação deve cobrir os seguintes fluxos e rotas:

### 1. Autenticação e Autorização (`/api/auth`)
- **Login:** `POST /api/auth/login` (envia `email` e `password`) -> Retorna `access_token` e `refresh_token`.
- **Registro:** `POST /api/auth/register` (envia `email`, `password`, `name`, `birthDate`, `role` ['PROFESSOR', 'ALUNO'], `phone`?, `avatarUrl`?) -> Retorna `user` e tokens JWT.
- **Segurança:** O `access_token` recebido deve ser armazenado localmente de forma segura usando `expo-secure-store` e injetado no cabeçalho `Authorization: Bearer <token>` de todas as requisições autenticadas.

### 2. Vínculo Professor / Aluno (`/api/enrollment`)
- **Professor (Role: PROFESSOR):**
  - Gerar código de convite: `POST /api/enrollment/invite` (retorna código de 6 caracteres válido por 48h).
  - Listar alunos vinculados: `GET /api/enrollment/students` (retorna lista de alunos ativos).
- **Aluno (Role: ALUNO):**
  - Vincular-se a um professor: `POST /api/enrollment/join` (envia `{ code: "A1B2C3" }`).
  - Visualizar professor vinculado: `GET /api/enrollment/professor`.

### 3. Gerenciamento de Treinos (`/api/workouts`)
- **Professor:**
  - Criar plano semanal: `POST /api/workouts/plans` (envia `studentId`, `name` e lista de `days` com `dayOfWeek`, nome do dia e array de `exercises` contendo `name`, `sets`, `reps`, `order`, `loadKg`?, `restSeconds`?, `notes`?).
- **Aluno:**
  - Visualizar treino de hoje: `GET /api/workouts/today` (obtém o plano planejado para o dia atual baseado no dia da semana).
  - Concluir treino: `POST /api/workouts/complete` (envia `dayPlanId` e `date`).

### 4. Controle de Nutrição e Refeições (`/api/nutrition`)
- **Aluno:**
  - Registrar refeição: `POST /api/nutrition/meals` (envia `type` ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER'], `date` e array de `items` com `name`, `quantity`, `unit`, macros `calories`?, `protein`?, `carbs`?, `fat`?).
  - Listar refeições do dia: `GET /api/nutrition/meals?date=YYYY-MM-DD`.
  - Excluir refeição: `DELETE /api/nutrition/meals/:id`.
  - Pesquisar alimentos: `GET /api/nutrition/search?q=nome_alimento` (consome a API do Open Food Facts integrada no backend para retornar informações nutricionais por 100g).

### 5. Configurações e Notificações (`/api/settings`)
- **Push Notifications:** `POST /api/settings/push-token` (envia `{ token: "ExponentPushToken[...]" }` após obter permissão no dispositivo móvel).

---

## 🎨 Design e Interface (UI/UX)

- **Design Responsivo & Mobile-First:**
  - Foco em dispositivos móveis (largura mínima de 320px).
  - Adaptação na Web limitando a largura máxima com `MaxContentWidth` (800px) e centralizando a página para garantir legibilidade.
- **Fidelidade ao Tema (`theme.ts`):**
  - Utilizar rigorosamente a paleta de cores para modo claro (`light`) e modo escuro (`dark`).
  - Espaçamentos baseados nos tokens de `Spacing` (ex: `Spacing.three` para gaps padrão de 16px).
  - Fontes dinâmicas definidas pelo `Fonts` nativo para manter a fidelidade visual da plataforma (iOS, Android ou Web).
- **Acessibilidade:**
  - Todo elemento interativo deve ter um propósito claro. Usar `accessibilityLabel` nos botões e ícones e `accessibilityRole` adequado.
  - Imagens com textos alternativos adequados e garantia de contraste WCAG AA entre texto e fundo.

---

## 📦 Build e Deploy

- **Nativo (Android / iOS):**
  - Gerenciamento de build via **EAS (Expo Application Services)**.
  - Comandos para geração de builds em desenvolvimento/produção: `eas build`.
  - Atualizações instantâneas Over-the-Air (OTA) usando `eas update`.
- **Web:**
  - Geração do bundle de produção Web via `npx expo export --platform web`.
  - O output gerado na pasta `dist/` deve ser estático e otimizado para deploy imediato em qualquer CDN moderno (Vercel, Netlify, Cloudflare Pages ou GitHub Pages).
