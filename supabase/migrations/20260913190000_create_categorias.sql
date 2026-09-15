-- Categorias — por usuário (multi-usuário; UI de login depois)
create extension if not exists "pgcrypto";

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  descricao text,
  created_at timestamptz not null default now(),
  constraint categorias_nome_por_usuario unique (user_id, nome),
  constraint categorias_nome_nao_vazio check (length(trim(nome)) > 0)
);

create index if not exists categorias_user_id_idx on public.categorias (user_id);

comment on table public.categorias is 'Categorias reutilizáveis por usuário (receitas e despesas)';
comment on column public.categorias.user_id is 'Dono do registro = auth.users.id (auth.uid())';
