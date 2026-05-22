# Feature Specification: Acompanhamento Fitness

**Feature Branch**: `001-fitness-tracker-app`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Construir um aplicativo mobile de acompanhamento fitness — interface nativa para professores e alunos de academia..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autenticação e Registro de Alunos e Professores (Priority: P1)

**Why this priority**: Permite que os usuários acessem as áreas correspondentes às suas permissões e usem o sistema de maneira segura e individualizada. É a base de todo o aplicativo.

**Independent Test**: Usuário consegue se cadastrar como aluno ou professor, e fazer login com as credenciais cadastradas, sendo direcionado para a interface correta baseada no seu papel.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de cadastro, **When** preencher nome completo, e-mail válido, senha forte, data de nascimento e selecionar o papel "ALUNO" ou "PROFESSOR", **Then** a conta é criada com sucesso no backend e o usuário é redirecionado para a tela de login ou autenticado automaticamente.
2. **Given** que o usuário está na tela de login, **When** inserir e-mail e senha correspondentes a uma conta de "ALUNO" ativa, **Then** o sistema autentica com sucesso e abre a área exclusiva do aluno.
3. **Given** que o usuário está na tela de login, **When** inserir e-mail e senha correspondentes a uma conta de "PROFESSOR" ativa, **Then** o sistema autentica com sucesso e abre a área exclusiva do professor.

---

### User Story 2 - Vínculo Aluno-Professor via Código de Convite (Priority: P1)

**Why this priority**: Essencial para conectar a jornada do aluno à supervisão do professor, permitindo o recebimento de planos e acompanhamento.

**Independent Test**: Professor gera um código de 6 caracteres, aluno digita esse código e é vinculado imediatamente ao professor. O professor passa a visualizar o aluno na sua lista de alunos vinculados.

**Acceptance Scenarios**:

1. **Given** que o professor está autenticado em sua área de trabalho, **When** clicar no botão "Gerar Código de Convite", **Then** o sistema gera e exibe de forma clara um código único de 6 caracteres (válido por 48 horas) na tela do professor.
2. **Given** que o aluno está autenticado e não possui professor vinculado, **When** acessar a tela de vinculação, inserir o código válido de 6 caracteres e submeter, **Then** o sistema estabelece o vínculo e exibe feedback de sucesso, liberando a visualização de treinos e acompanhamento.

---

### User Story 3 - Visualização e Conclusão de Treinos Diários (Priority: P1)

**Why this priority**: Funcionalidade principal do fluxo do aluno, garantindo que ele saiba o que treinar no dia atual e possa marcar a execução.

**Independent Test**: Aluno entra na tela inicial no dia correspondente del plano e vê os exercícios planejados. Ao clicar no botão de conclusão, recebe feedback de sucesso e o treino é marcado como realizado.

**Acceptance Scenarios**:

1. **Given** que o aluno possui um plano de treino ativo para o dia de hoje, **When** acessar a tela inicial do aplicativo, **Then** visualiza a lista de exercícios programados com suas respectivas séries, repetições e cargas.
2. **Given** que o aluno visualiza o treino de hoje, **When** clicar no botão "Concluir Treino", **Then** o sistema registra o treino como concluído na data atual, exibe feedback visual com animação/mensagem de sucesso, e desabilita o botão de conclusão para o dia.

---

### User Story 4 - Criação de Plano de Treino Semanal pelo Professor (Priority: P2)

**Why this priority**: Permite ao professor gerenciar e personalizar a rotina semanal de exercícios de seus alunos vinculados.

**Independent Test**: Professor escolhe um aluno da lista, define os exercícios (séries, repetições e carga) para os dias da semana e salva o plano. O plano fica disponível imediatamente para o aluno na sua tela inicial correspondente.

**Acceptance Scenarios**:

1. **Given** que o professor acessa a lista de alunos vinculados, **When** selecionar um aluno específico e clicar em "Montar Plano Semanal", **Then** abre-se uma tela com os dias da semana estruturados.
2. **Given** que o professor preenche os dias desejados adicionando exercícios (definindo nome, séries, repetições, carga e observações) e clica em "Salvar Plano", **Then** o plano é gravado no backend e fica ativo para o aluno.

---

### User Story 5 - Diário de Refeições e Busca de Alimentos (Priority: P2)

**Why this priority**: Permite ao aluno registrar a alimentação diária de forma ágil, facilitada por buscas na base de dados de alimentos para maior precisão de macros.

**Independent Test**: Aluno realiza busca por um alimento, seleciona a quantidade, escolhe a refeição (café, almoço, lanche, jantar) e adiciona. A refeição é listada na data correspondente com macros calculados e pode ser excluída.

**Acceptance Scenarios**:

1. **Given** que o aluno está na tela de nutrição, **When** digitar o nome de um alimento no campo de busca, **Then** o sistema exibe uma lista de alimentos correspondentes com suas informações nutricionais básicas por 100g/porção.
2. **Given** que o aluno selecionou um alimento e informou a quantidade, **When** escolher a refeição (Café da Manhã, Almoço, Lanche ou Jantar) e salvar, **Then** o item é adicionado ao diário com os macros calculados.
3. **Given** que o aluno visualiza a lista de refeições registradas de uma data específica, **When** clicar no botão de exclusão ou realizar o gesto de deslizar para excluir, **Then** o item é removido da lista e o total de calorias/macros do dia é recalculado.

### Edge Cases

- **Erro de Conexão à API**: Como o backend é essencial para persistir cadastros, treinos e refeições, o sistema deve detectar falta de internet ou erro de timeout da API e exibir uma mensagem amigável ao usuário (por exemplo, "Falha na conexão com o servidor. Tente novamente").
- **Código de Convite Expirado/Inválido**: Se o aluno digitar um código que já expirou (passou de 48h) ou não existe no backend, o sistema deve apresentar uma mensagem clara de erro ("Código de convite expirado ou inválido") e não criar o vínculo.
- **Visualização de Treino em Dias sem Plano**: Caso o aluno acesse o app em um dia da semana para o qual o professor não programou exercícios, o sistema deve exibir uma tela inicial limpa com a mensagem "Nenhum treino planejado para hoje. Aproveite para descansar!".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir o cadastro de usuários especificando nome, e-mail, senha, data de nascimento e o papel (`ALUNO` ou `PROFESSOR`).
- **FR-002**: O sistema MUST autenticar o usuário através de e-mail e senha, salvando os tokens JWT retornados na sessão segura.
- **FR-003**: O sistema MUST redirecionar o usuário para a interface correta com base no papel retornado pela API (`ALUNO` ou `PROFESSOR`).
- **FR-004**: O sistema MUST permitir que o professor gere um código alfanumérico único de convite contendo 6 caracteres.
- **FR-005**: O sistema MUST permitir que o professor visualize uma lista de todos os seus alunos ativos vinculados, exibindo nome, e-mail e foto/avatar.
- **FR-006**: O sistema MUST permitir que o professor crie e edite planos semanais de treino para seus alunos vinculados, detalhando nome do exercício, séries, repetições, carga (kg) e observações por dia da semana.
- **FR-007**: O sistema MUST permitir que o aluno digite o código de convite do professor para estabelecer o vínculo entre ambos.
- **FR-008**: O sistema MUST exibir na tela inicial do aluno o treino programado correspondente ao dia da semana atual.
- **FR-009**: O sistema MUST permitir que o aluno marque o treino de hoje como concluído e salvar essa informação.
- **FR-010**: O sistema MUST oferecer busca de alimentos em tempo real com informações nutricionais obtidas pela API do backend.
- **FR-011**: O sistema MUST permitir que o aluno adicione refeições informando o tipo (Café da Manhã, Almoço, Lanche, Jantar) e itens (com quantidade e cálculo proporcional dos macronutrientes).
- **FR-012**: O sistema MUST exibir o histórico diário de refeições permitindo filtrar por data e excluir qualquer registro via ação direta de exclusão (botão ou gesto).
- **FR-013**: O sistema MUST solicitar permissão e registrar o Expo Push Token do dispositivo do usuário no backend através do endpoint `POST /api/settings/push-token` após o login ou cadastro.

### Key Entities

- **User**: Representa alunos e professores com atributos de identificação, credenciais, data de nascimento e o papel (`role`).
- **Enrollment**: Representa o vínculo ativo entre um aluno e um professor.
- **WorkoutPlan**: O plano de treino semanal associado a um aluno, estruturado por dia de treino, contendo a lista de exercícios programados.
- **DailyWorkoutLog**: O registro histórico que valida a conclusão do treino de um determinado dia da semana em uma data específica por um aluno.
- **Meal**: Refeição registrada em uma data contendo o tipo da refeição, a lista de itens alimentares cadastrados, e o total consolidado de macros (calorias, proteínas, carboidratos e gorduras).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário deve conseguir concluir seu cadastro inicial em menos de 1 minuto em conexões móveis estáveis.
- **SC-002**: Os resultados de busca de alimentos devem retornar e renderizar na tela em menos de 1.5 segundos após a digitação.
- **SC-003**: 100% dos treinos concluídos pelo aluno devem ser atualizados e persistidos no backend imediatamente para visualização pelo professor.
- **SC-004**: O aplicativo deve se manter 100% legível e utilizável em telas móveis com largura a partir de 320px sem quebras de layout.

## Assumptions

- O aplicativo assumirá conexão de rede ativa para realizar a maior parte de suas operações, exibindo feedback de carregamento durante chamadas assíncronas.
- O armazenamento seguro local (`expo-secure-store`) será utilizado para persistência dos tokens JWT de autenticação (`access_token`, `refresh_token`).
- O Peaktime Backend já está funcional e respondendo de acordo com o contrato de API definido para autenticação, vinculação, treinos e nutrição.
