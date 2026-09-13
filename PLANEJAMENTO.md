# Planejamento — Controle de Finanças Pessoais

**Base:** `PRD.md` v1.0  
**Stack atual:** Next.js 16 + React 19 + Tailwind + shadcn/Base UI  
**Persistência alvo:** Supabase (PostgreSQL) — ainda **não conectado / não instalado**  
**Data:** 13/09/2026

---

## 1. Situação atual

Já existe um protótipo em tela única com:

- Totais gerais (receitas / despesas / saldo) sem filtro por dia/mês
- Formulário e lista de lançamentos unificados (`Transaction` com `type: income | expense`)
- Persistência em **localStorage** (`hooks/use-transactions.ts`)
- Categorias fixas em código (`lib/finance.ts`), sem CRUD

O PRD exige mais: CRUD de **categorias**, **receitas** e **despesas** separados, dashboard por **dia e mês**, e dados persistentes (agora via Supabase).

---

## 2. Decisões de implementação (fechadas neste plano)

| Tema | Decisão |
| --- | --- |
| Persistência | Supabase (Postgres). localStorage só até a conexão. |
| Auth no MVP | **RLS multi-usuário** (`user_id` + `auth.uid()`). **Tela de login e-mail/senha** (sem magic link, sem confirmação por e-mail). Usuário de teste seedado no banco. |
| Modelo | Tabelas `categorias`, `receitas`, `despesas`, todas com `user_id`. |
| Exclusão de categoria (RF10) | **Bloquear** se houver lançamento vinculado (`ON DELETE RESTRICT`). |
| Navegação | `/login`, `/` (dashboard), `/receitas`, `/despesas`, `/categorias`. Sem sessão → redireciona para `/login`. |
| Seletor de data no dashboard | Sim (default = hoje). |
| Moeda / data | `pt-BR`, R$ com 2 casas, datas `dd/mm/aaaa`. |
| Comandos Supabase | **Você executa depois** (CLI ainda não instalada). Agora só preparamos os arquivos SQL e o `.env.local`. |

### Credenciais de teste (seed)

| Campo | Valor |
| --- | --- |
| E-mail | `usuario@teste.com` |
| Senha | `1234` |

Ao configurar o projeto no painel Supabase: desativar **Confirm email**. Se a política mínima de senha bloquear 4 caracteres, reduzir o mínimo para 4 (MVP).

---

## 3. O que fazemos agora vs o que você faz depois

### Agora (preparação — sem executar Supabase)

- [x] Alinhar com `PRD.md`
- [x] Criar `.env.local` com placeholders
- [x] Escrever migrations SQL em `supabase/migrations/`
- [x] Seed de usuário de teste + categorias padrão (arquivos SQL)
- [x] Documentar este plano

**Não** instalar CLI do Supabase agora. **Não** rodar `supabase link`, `supabase db push` nem qualquer comando contra um projeto remoto nesta etapa.

### Depois (você — pós-conexão)

1. Criar o projeto no [painel Supabase](https://supabase.com).
2. Em **Authentication → Providers → Email**: login por e-mail/senha ativo; **Confirm email** desligado.
3. Em **Settings → API**, copiar URL e keys para o `.env.local`.
4. Rodar as migrations **na ordem** (recomendado sem CLI):
   - Abrir **SQL Editor** no Dashboard
   - Colar e executar cada arquivo de `supabase/migrations/` em ordem de nome
5. (Opcional) Se preferir CLI depois de instalar: `npx supabase link` + `npx supabase db push` — isso é **sua** escolha futura, não um passo automático agora.
6. No **Table Editor**, confirmar:
   - tabelas `categorias`, `receitas`, `despesas`
   - usuário `usuario@teste.com` em Authentication → Users
   - linhas de categorias padrão ligadas a esse usuário

---

## 4. Fases de construção do app

### Fase 0 — Fundação (pré-conexão) — em andamento / arquivos prontos

Ver seção 3.

### Fase 1 — Infra Supabase no app (após você rodar os SQL)

1. Instalar `@supabase/supabase-js` e `@supabase/ssr`.
2. Clientes em `lib/supabase/` (`client.ts`, `server.ts`).
3. Tipagem das tabelas (`types/database.ts`).
4. Middleware / proteção de rotas (sem sessão → `/login`).

### Fase 2 — Login MVP

1. Tela `/login`: campos e-mail + senha → `signInWithPassword`.
2. Sem cadastro público nesta entrega (usuário de teste já no banco).
3. Logout na navegação.

### Fase 3 — Domínio e dados

1. Modelos: `Categoria`, `Receita`, `Despesa` (com `userId`).
2. CRUD + totais do dashboard (dia/mês), sempre no escopo do `auth.uid()`.
3. RF10: bloquear exclusão de categoria em uso.

### Fase 4 — UI das telas

| Rota | Conteúdo |
| --- | --- |
| `/login` | E-mail + senha |
| `/` | Dashboard dia/mês |
| `/receitas` | CRUD |
| `/despesas` | CRUD |
| `/categorias` | CRUD |

### Fase 5 — Aceite (PRD §10 + login)

- [ ] Login com `usuario@teste.com` / `1234`
- [ ] Ver categorias padrão já no banco
- [ ] Cadastrar receita e despesa
- [ ] Dashboard dia/mês e saldos corretos
- [ ] Editar/excluir e persistir após reload

---

## 5. Migrations (arquivos prontos — execução depois, por você)

| Arquivo | Objetivo |
| --- | --- |
| `20260913190000_create_categorias.sql` | Tabela `categorias` + `user_id` + unique `(user_id, nome)` |
| `20260913190100_create_receitas.sql` | Tabela `receitas` + `user_id` + FK |
| `20260913190200_create_despesas.sql` | Tabela `despesas` + `user_id` + FK |
| `20260913190300_rls_mvp.sql` | RLS: só o dono (`auth.uid() = user_id`) |
| `20260913190400_seed_categorias_padrao.sql` | Trigger: novo usuário → INSERT das categorias padrão |
| `20260913190500_seed_usuario_teste.sql` | Cria `usuario@teste.com` (senha `1234`); categorias entram via trigger |

### Schema

```text
categorias
  id, user_id → auth.users, nome, descricao, created_at
  UNIQUE (user_id, nome)

receitas / despesas
  id, user_id → auth.users, descricao, valor (>0), data, categoria_id → categorias (ON DELETE RESTRICT)
```

### O que é “seed”?

**Seed** = dados iniciais **reais** gravados no banco com `INSERT` (não são só nomes no documento).

Depois que **você** rodar as migrations:

1. Existirá o usuário `usuario@teste.com` em `auth.users`.
2. Existirão **10 linhas** em `public.categorias` para esse usuário:

| Nome | Descrição |
| --- | --- |
| Alimentação | Mercado, restaurantes e delivery |
| Transporte | Combustível, ônibus, app de transporte |
| Salário | Remuneração e proventos fixos |
| Moradia | Aluguel, condomínio, contas da casa |
| Lazer | Cinema, viagens, hobbies |
| Saúde | Farmácia, consultas, plano de saúde |
| Educação | Cursos, livros, mensalidades |
| Contas | Água, luz, internet, telefone |
| Freelance | Trabalhos avulsos e serviços |
| Outros | Lançamentos sem categoria específica |

Novos usuários futuros também recebem as mesmas categorias pelo trigger.

---

## 6. Variáveis de ambiente

Arquivo: `.env.local` (já no `.gitignore` via `.env*.local`). Preencha **depois** de criar o projeto Supabase.

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Só server/admin; nunca no browser |

---

## 7. Ordem pós-conexão (resumo)

1. **Você:** projeto Supabase + keys no `.env.local` + rodar SQL (Editor ou CLI, se instalar)  
2. App: clientes Supabase + tipos  
3. Tela de login + proteção de rotas  
4. CRUD Categorias / Receitas / Despesas  
5. Dashboard  
6. Checklist de aceite  

---

## 8. Fora deste ciclo de UI

- Cadastro público de novos usuários / recuperação de senha por e-mail  
- Magic link / OTP  
- Tipo de categoria, recorrência, gráficos, exportação, Open Finance  
