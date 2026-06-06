# Research: Monitoramento de Ocupação da Academia

**Feature**: Tela de ocupação em tempo real  
**Date**: 2026-06-04

## 1. Biblioteca de Gráficos

**Decision**: `react-native-gifted-charts`  
**Rationale**: Única biblioteca que possui TODAS as peer dependencies já instaladas no projeto (`react-native-svg`, `expo-linear-gradient`). Ativamente mantida, suporta bar charts e line charts, funciona em Expo managed workflow.  
**Alternatives Considered**:
- `Victory Native`: Maior bundle, problemas de resolução "exports" no Metro
- `react-native-chart-kit`: Legado, crashs reportados no Android com SDKs recentes
- `react-native-wagmi-charts`: Requer `react-native-haptic-feedback` (não instalado), foco em dados financeiros

## 2. Modelo de Dados de Ocupação

**Decision**: Criar tabela `OccupancyReading` com leituras periódicas (a cada 15 minutos)  
**Rationale**: Permite construir tanto o gráfico de linha (histórico do dia) quanto calcular médias para previsão. Cada leitura armazena o timestamp e a contagem de pessoas.  
**Alternatives Considered**:
- WebSocket em tempo real: Complexidade excessiva para MVP, o polling a cada 30s atende ao requisito de "tempo real" para o contexto de academia
- Armazenar apenas o valor atual: Impossibilitaria a construção do gráfico de linha histórico

## 3. Previsão de Ocupação

**Decision**: Média simples baseada nas últimas 4 semanas para o mesmo dia da semana/horário  
**Rationale**: Academias possuem padrões muito regulares por dia da semana. Uma média simples das últimas 4 semanas já fornece previsão confiável sem ML.  
**Alternatives Considered**:
- Machine Learning: Overengineering para MVP
- Sem previsão: O usuário pediu explicitamente "previsão para as próximas horas"

## 4. Níveis de Ocupação

**Decision**: 5 níveis baseados em percentual da capacidade máxima  
**Rationale**: O usuário definiu exatamente 5 níveis: Vazio, Tranquilo, Moderado, Cheio, Lotado  

| Nível | Faixa | Cor |
|-------|-------|-----|
| Vazio | 0-15% | `#64FFDA` (primary/cyan) |
| Tranquilo | 16-35% | `#00E676` (success/green) |
| Moderado | 36-60% | `#FFC107` (amber) |
| Cheio | 61-85% | `#FF9800` (orange) |
| Lotado | 86-100% | `#FF4081` (accent/pink) |

## 5. Capacidade Máxima

**Decision**: Armazenar como configuração da academia (valor fixo editável pelo admin/professor)  
**Rationale**: Academias possuem capacidade máxima definida por regulamento. Deve ser configurável.  
**Alternatives Considered**:
- Hardcoded: Inflexível; cada academia pode ter capacidade diferente
- Variável de ambiente: Não acessível para o professor alterar

## 6. Endpoint de Dados

**Decision**: API REST com polling a cada 30 segundos no frontend  
**Rationale**: Simples, segue o padrão existente da API. O polling a cada 30s é suficiente para monitoramento de ocupação de academia (não é um dashboard de bolsa de valores).  
**Alternatives Considered**:
- WebSocket: Complexidade adicional no Fastify e no frontend; não justificada para a granularidade necessária
- Server-Sent Events: Suporte irregular no React Native

## 7. Roteamento da Tela

**Decision**: Nova rota `occupancy.tsx` nos grupos `(student)` e `(professor)` com tab dedicada  
**Rationale**: Ambos os tipos de usuário se beneficiam de ver a ocupação. Compartilham o mesmo componente base.  
**Alternatives Considered**:
- Tela única fora dos grupos: Quebraria o padrão de roteamento Expo Router do projeto
- Modal overlay: A quantidade de conteúdo (2 gráficos + card + legenda) justifica uma tela completa
