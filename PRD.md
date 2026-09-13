# PRD — Controle de Finanças Pessoais

**Versão:** 1.0  
**Status:** MVP / início do projeto  
**Data:** 13/09/2026

---

## 1. Objetivo

Criar um aplicativo simples para o usuário **cadastrar receitas, despesas e categorias**, e **acompanhar o saldo no dashboard** por dia e por mês.

Nesta primeira versão, o foco é só o cadastro e a visualização. Sem login, sem banco compartilhado e sem recursos avançados.

---

## 2. Problema

Quem controla o dinheiro no papel ou na planilha perde tempo e clareza. Falta um lugar único para:

- registrar o que entra e o que sai;
- classificar cada lançamento por categoria (ex.: alimentação, almoço, salário);
- ver o total do dia e do mês sem fazer conta na mão.

---

## 3. Público

Usuário único: a própria pessoa que vai usar o app no dia a dia.

---

## 4. Escopo do MVP

### 4.1 Dentro do escopo

| Funcionalidade | Descrição |
| --- | --- |
| Dashboard | Totais de receitas e despesas **por dia** e **por mês**, além do saldo do período. |
| Cadastro de receitas | Criar, listar, editar e excluir receitas. |
| Cadastro de despesas | Criar, listar, editar e excluir despesas. |
| Cadastro de categorias | Criar, listar, editar e excluir categorias. A mesma categoria pode ser usada em receita ou despesa. |

### 4.2 Fora do escopo (por enquanto)

- Autenticação / múltiplos usuários
- Contas bancárias, cartões e transferências
- Metas, orçamento e relatórios avançados
- Recorrência automática (ex.: conta de luz todo mês)
- Importação de extrato / Open Finance
- App mobile nativo
- Notificações

---

## 5. Telas

### 5.1 Dashboard (tela inicial)

O usuário precisa enxergar, de imediato:

- **Receitas do dia** e **receitas do mês**
- **Despesas do dia** e **despesas do mês**
- **Saldo do dia** (receitas do dia − despesas do dia)
- **Saldo do mês** (receitas do mês − despesas do mês)

Regras de período:

- **Dia:** data de hoje (ou a data selecionada, se houver seletor).
- **Mês:** mês calendário da data selecionada (ex.: 01/09 a 30/09).

Sugestão de extras simples (opcional no MVP, se couber):

- Filtro de mês/ano no topo.
- Lista das últimas receitas e despesas.
- Totais agrupados por categoria no mês.

### 5.2 Receitas

- Lista de receitas (descrição, valor, data, categoria).
- Formulário para cadastrar / editar:
  - descrição (obrigatório)
  - valor (obrigatório, maior que zero)
  - data (obrigatório)
  - categoria (obrigatório, escolhida da lista cadastrada)

### 5.3 Despesas

Mesmos campos e comportamentos das receitas.

### 5.4 Categorias

- Lista de categorias já cadastradas (ex.: Almoço, Alimentação, Salário, Transporte).
- Formulário para cadastrar / editar:
  - nome (obrigatório, único)
  - observação / descrição (opcional)

A categoria **não tem tipo** nesta versão: serve tanto para receita quanto para despesa.

---

## 6. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF01 | O sistema deve permitir cadastrar, editar, listar e excluir **categorias**. |
| RF02 | O sistema deve impedir categoria com nome vazio ou nome duplicado. |
| RF03 | O sistema deve permitir cadastrar, editar, listar e excluir **receitas**. |
| RF04 | O sistema deve permitir cadastrar, editar, listar e excluir **despesas**. |
| RF05 | Receita e despesa devem ter descrição, valor, data e categoria. |
| RF06 | Só deve ser possível selecionar categorias já cadastradas. |
| RF07 | O dashboard deve exibir totais de receitas e despesas **do dia**. |
| RF08 | O dashboard deve exibir totais de receitas e despesas **do mês**. |
| RF09 | O dashboard deve exibir o saldo do dia e o saldo do mês. |
| RF10 | Ao excluir uma categoria em uso, o sistema deve avisar o usuário e bloquear a exclusão **ou** pedir confirmação e deixar os lançamentos sem categoria — a escolha da implementação deve ser única e documentada no código. **Recomendação:** bloquear a exclusão enquanto houver lançamentos vinculados. |

---

## 7. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | Interface em português, simples e usável no computador (responsivo é desejável). |
| RNF02 | Valores em Real (R$), com duas casas decimais. |
| RNF03 | Datas no formato brasileiro (dd/mm/aaaa). |
| RNF04 | Os dados devem persistir após recarregar a página (localStorage, arquivo JSON ou banco local — a definir na implementação). |
| RNF05 | Validação no formulário: campos obrigatórios e valor > 0. |

---

## 8. Modelo de dados (simples)

### Categoria

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| id | identificador | sim |
| nome | texto | sim (único) |
| descricao | texto | não |

### Receita

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| id | identificador | sim |
| descricao | texto | sim |
| valor | número | sim (> 0) |
| data | data | sim |
| categoriaId | referência | sim |

### Despesa

Mesmos campos da receita.

---

## 9. Fluxos principais

1. **Primeiro uso:** cadastrar categorias (ex.: Alimentação, Almoço, Salário) → cadastrar receitas e despesas → abrir o dashboard e ver os totais.
2. **Uso diário:** lançar receita ou despesa escolhendo categoria e data → conferir dia e mês no dashboard.
3. **Ajuste:** editar ou excluir um lançamento; totais do dashboard atualizam em seguida.

---

## 10. Critérios de aceite do MVP

O MVP está pronto quando o usuário conseguir:

- [ ] Cadastrar pelo menos 2 categorias.
- [ ] Cadastrar uma receita e uma despesa usando essas categorias.
- [ ] Ver no dashboard receitas e despesas do **dia** e do **mês**.
- [ ] Ver saldo do dia e saldo do mês corretos.
- [ ] Editar e excluir um lançamento e ver o dashboard atualizado.
- [ ] Recarregar a página e manter os dados.

---

## 11. Próximas versões (não implementar agora)

- Filtro por categoria no dashboard.
- Tipo de categoria (receita / despesa / ambas).
- Lançamentos recorrentes.
- Gráficos e exportação (CSV/PDF).
- Login e nuvem.

---

## 12. Decisões em aberto

Itens para decidir na implementação, sem travar o PRD:

1. Stack (ex.: HTML + JS, React, ou outra).
2. Onde persistir os dados (localStorage é suficiente para o início).
3. Se o dashboard terá seletor de data ou sempre usa “hoje / mês atual”.
4. Navegação: menu lateral, abas ou rotas (`/`, `/receitas`, `/despesas`, `/categorias`).
