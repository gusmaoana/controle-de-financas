-- Despesas — lançamentos de saída por usuário
create table if not exists public.despesas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  descricao text not null,
  valor numeric(12, 2) not null,
  data date not null,
  categoria_id uuid not null references public.categorias (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint despesas_descricao_nao_vazia check (length(trim(descricao)) > 0),
  constraint despesas_valor_positivo check (valor > 0)
);

create index if not exists despesas_user_id_idx on public.despesas (user_id);
create index if not exists despesas_data_idx on public.despesas (data);
create index if not exists despesas_categoria_id_idx on public.despesas (categoria_id);
create index if not exists despesas_user_data_idx on public.despesas (user_id, data);

comment on table public.despesas is 'Despesas do usuário, vinculadas a uma categoria própria';
comment on column public.despesas.user_id is 'Dono do registro = auth.users.id (auth.uid())';
