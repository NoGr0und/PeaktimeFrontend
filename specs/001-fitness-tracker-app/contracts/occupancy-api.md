# API Contracts: Occupancy

**Base URL**: `{EXPO_PUBLIC_API_URL}/occupancy`

## Endpoints

### GET `/occupancy/current`

Retorna a leitura de ocupação mais recente.

**Auth**: Bearer Token (qualquer role)

**Response 200**:
```json
{
  "id": "uuid",
  "count": 42,
  "capacity": 80,
  "percentage": 52.5,
  "level": "MODERATE",
  "timestamp": "2026-06-04T19:30:00Z"
}
```

---

### GET `/occupancy/history?date=YYYY-MM-DD`

Retorna todas as leituras do dia especificado (para o gráfico de linha).

**Auth**: Bearer Token (qualquer role)

**Query Params**:
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `date` | string (YYYY-MM-DD) | No | hoje | Data para buscar o histórico |

**Response 200**:
```json
{
  "date": "2026-06-04",
  "capacity": 80,
  "readings": [
    { "hour": 6, "minute": 0, "count": 5 },
    { "hour": 6, "minute": 15, "count": 8 },
    { "hour": 6, "minute": 30, "count": 12 },
    ...
  ]
}
```

---

### GET `/occupancy/forecast`

Retorna a previsão de ocupação para as próximas horas (baseada em médias históricas do mesmo dia da semana).

**Auth**: Bearer Token (qualquer role)

**Response 200**:
```json
{
  "dayOfWeek": "WEDNESDAY",
  "capacity": 80,
  "forecast": [
    { "hour": 19, "avgCount": 45, "percentage": 56.2, "level": "MODERATE" },
    { "hour": 20, "avgCount": 62, "percentage": 77.5, "level": "BUSY" },
    { "hour": 21, "avgCount": 38, "percentage": 47.5, "level": "MODERATE" },
    { "hour": 22, "avgCount": 15, "percentage": 18.7, "level": "QUIET" }
  ]
}
```

---

### POST `/occupancy/readings`

Registra uma nova leitura de ocupação (acesso restrito a PROFESSOR ou sistema).

**Auth**: Bearer Token (role: PROFESSOR)

**Request Body**:
```json
{
  "count": 42,
  "capacity": 80
}
```

**Response 201**:
```json
{
  "id": "uuid",
  "count": 42,
  "capacity": 80,
  "percentage": 52.5,
  "level": "MODERATE",
  "timestamp": "2026-06-04T19:30:00Z"
}
```

**Error 400**: `count` > `capacity` ou valores inválidos
**Error 403**: Usuário não tem permissão (role !== PROFESSOR)
