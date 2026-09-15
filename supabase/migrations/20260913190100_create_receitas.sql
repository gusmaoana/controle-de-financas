-- Receitas — lançamentos de entrada por usuário
create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  descricao text not null,
  valor numeric(12, 2) not null,
  data date not null,
  categoria_id uuid not null references public.categorias (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint receitas_descricao_nao_vazia check (length(trim(descricao)) > 0),
  constraint receitas_valor_positivo check (valor > 0)
);

create index if not exists receitas_user_id_idx on public.receitas (user_id);
create index if not exists receitas_data_idx on public.receitas (data);
create index if not exists receitas_categoria_id_idx on public.receitas (categoria_id);
create index if not exists receitas_user_data_idx on public.receitas (user_id, data);

comment on table public.receitas is 'Receitas do usuário, vinculadas a uma categoria própria';
comment on column public.receitas.user_id is 'Dono do registro = auth.users.id (auth.uid())';
