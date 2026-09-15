-- RLS multi-usuário: cada linha só é acessível pelo dono (auth.uid() = user_id).
-- UI de login fica para depois; schema e policies já nascem prontos para Auth.

alter table public.categorias enable row level security;
alter table public.receitas enable row level security;
alter table public.despesas enable row level security;

-- Categorias
create policy "categorias_select_own"
  on public.categorias for select
  using (auth.uid() = user_id);

create policy "categorias_insert_own"
  on public.categorias for insert
  with check (auth.uid() = user_id);

create policy "categorias_update_own"
  on public.categorias for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "categorias_delete_own"
  on public.categorias for delete
  using (auth.uid() = user_id);

-- Receitas
create policy "receitas_select_own"
  on public.receitas for select
  using (auth.uid() = user_id);

create policy "receitas_insert_own"
  on public.receitas for insert
  with check (auth.uid() = user_id);

create policy "receitas_update_own"
  on public.receitas for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "receitas_delete_own"
  on public.receitas for delete
  using (auth.uid() = user_id);

-- Despesas
create policy "despesas_select_own"
  on public.despesas for select
  using (auth.uid() = user_id);

create policy "despesas_insert_own"
  on public.despesas for insert
  with check (auth.uid() = user_id);

create policy "despesas_update_own"
  on public.despesas for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "despesas_delete_own"
  on public.despesas for delete
  using (auth.uid() = user_id);
