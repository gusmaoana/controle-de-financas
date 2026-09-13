-- Seed de categorias padrão por usuário = INSERT real em public.categorias.
-- Como categorias têm user_id, o seed roda ao criar cada usuário em auth.users
-- (também cobre o usuário de teste criado na migration seguinte).

create or replace function public.seed_categorias_padrao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categorias (user_id, nome, descricao)
  values
    (new.id, 'Alimentação', 'Mercado, restaurantes e delivery'),
    (new.id, 'Transporte', 'Combustível, ônibus, app de transporte'),
    (new.id, 'Salário', 'Remuneração e proventos fixos'),
    (new.id, 'Moradia', 'Aluguel, condomínio, contas da casa'),
    (new.id, 'Lazer', 'Cinema, viagens, hobbies'),
    (new.id, 'Saúde', 'Farmácia, consultas, plano de saúde'),
    (new.id, 'Educação', 'Cursos, livros, mensalidades'),
    (new.id, 'Contas', 'Água, luz, internet, telefone'),
    (new.id, 'Freelance', 'Trabalhos avulsos e serviços'),
    (new.id, 'Outros', 'Lançamentos sem categoria específica')
  on conflict (user_id, nome) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_seed_categorias on auth.users;

create trigger on_auth_user_created_seed_categorias
  after insert on auth.users
  for each row
  execute function public.seed_categorias_padrao();

comment on function public.seed_categorias_padrao() is
  'Insere categorias padrão (Alimentação, Transporte, Salário, etc.) para cada novo usuário';
