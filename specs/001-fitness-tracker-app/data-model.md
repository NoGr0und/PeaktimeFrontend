# Data Model: Acompanhamento Fitness

Este documento descreve as estruturas de dados, interfaces TypeScript e relacionamentos que serão criados em `src/types/` para representar os dados e contratos da API.

---

## 👤 Autenticação (`src/types/auth.ts`)

### `UserRole`
Tipo enumerado que define os papéis de usuário suportados pelo sistema.
```typescript
export type UserRole = 'ALUNO' | 'PROFESSOR';
```

### `User`
Representa um usuário cadastrado (aluno ou professor).
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  birthDate: string; // ISO date string (YYYY-MM-DD)
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}
```

### `AuthResponse`
Estrutura de dados retornada no cadastro ou login bem-sucedido.
```typescript
export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
```

---

## 🔗 Vínculo Aluno-Professor (`src/types/enrollment.ts`)

### `Enrollment`
Representa a relação de vínculo ativa entre aluno e professor.
```typescript
export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatarUrl?: string;
  professorId: string;
  createdAt: string;
}
```

### `InviteCodeResponse`
Retorno da geração do código de convite gerado pelo professor.
```typescript
export interface InviteCodeResponse {
  code: string; // Código alfanumérico de 6 caracteres
  expiresAt: string; // ISO string de expiração (48 horas após criação)
}
```

---

## 🏋️ Gerenciamento de Treinos (`src/types/workout.ts`)

### `Exercise`
Mapeia um exercício individual dentro de uma rotina.
```typescript
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  order: number;
  loadKg?: number;
  restSeconds?: number;
  notes?: string;
}
```

### `DayPlan`
Representa o planejamento de treino de um dia específico da semana.
```typescript
export interface DayPlan {
  id: string;
  dayOfWeek: number; // 0 (Domingo) a 6 (Sábado)
  name: string;      // Ex: "Treino A - Peito e Tríceps"
  exercises: Exercise[];
}
```

### `WorkoutPlan`
Plano semanal completo vinculado a um aluno.
```typescript
export interface WorkoutPlan {
  id: string;
  studentId: string;
  name: string; // Ex: "Hipertrofia ABC"
  days: DayPlan[];
}
```

### `DailyWorkoutLog`
Histórico de execução/conclusão de treinos.
```typescript
export interface DailyWorkoutLog {
  id: string;
  dayPlanId: string;
  date: string; // Data da conclusão (YYYY-MM-DD)
  completed: boolean;
}
```

---

## 🍎 Controle de Nutrição (`src/types/nutrition.ts`)

### `MealType`
Categorias de refeição.
```typescript
export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';
```

### `MealItem`
Componente alimentício de uma refeição.
```typescript
export interface MealItem {
  name: string;
  quantity: number; // Ex: 100, 2
  unit: string;     // Ex: "g", "unidades"
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}
```

### `Meal`
Estrutura completa de uma refeição registrada.
```typescript
export interface Meal {
  id: string;
  type: MealType;
  date: string; // YYYY-MM-DD
  items: MealItem[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
}
```

### `FoodSearchResult`
Item retornado pela busca no backend integrada com Open Food Facts.
```typescript
export interface FoodSearchResult {
  name: string;
  calories: number; // por 100g
  protein: number;  // por 100g
  carbs: number;    // por 100g
  fat: number;      // por 100g
}
```
