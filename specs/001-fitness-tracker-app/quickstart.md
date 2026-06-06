# Quickstart: Monitoramento de Ocupação

## Pré-requisitos

- Node.js 18+
- Expo CLI (`npx expo`)
- Backend Peaktime rodando em `localhost:3333`
- PostgreSQL com Prisma migrations aplicadas

## Setup

### 1. Instalar dependência de gráficos

```bash
cd PeaktimeFrontend
npx expo install react-native-gifted-charts
```

### 2. Aplicar migration do banco

```bash
cd "Peaktime Backend"
npx prisma migrate dev --name add-occupancy-reading
```

### 3. Rodar o projeto

```bash
# Terminal 1 — Backend
cd "Peaktime Backend"
npm run dev

# Terminal 2 — Frontend
cd PeaktimeFrontend
npx expo start --web
```

## Verificação

1. Abrir `http://localhost:8081` no navegador
2. Logar como aluno ou professor
3. Navegar até a aba de **Ocupação** (ícone de pessoas)
4. Verificar se o card principal, gráficos e legenda estão renderizando

## Dados de Teste

Para popular dados simulados de ocupação, faça POST via curl:

```bash
# Registrar leitura atual (como professor)
curl -X POST http://localhost:3333/api/occupancy/readings \
  -H "Authorization: Bearer <TOKEN_PROFESSOR>" \
  -H "Content-Type: application/json" \
  -d '{"count": 42, "capacity": 80}'
```

## Notas

- A tela faz polling automático a cada 30 segundos
- Previsão é calculada com base nas últimas 4 semanas do mesmo dia da semana
- Sem dados históricos, o gráfico de previsão mostrará valores zerados
