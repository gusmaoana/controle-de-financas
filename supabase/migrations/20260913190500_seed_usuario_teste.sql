-- Seed do usuário de teste do MVP (login e-mail/senha, sem confirmação por e-mail).
-- E-mail: usuario@teste.com | Senha: 1234
-- Ao inserir em auth.users, o trigger seed_categorias_padrao grava as categorias em public.categorias.
-- Idempotente: se o e-mail já existir, não duplica.

create extension if not exists "pgcrypto";

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_encrypted_pw text := crypt('1234', gen_salt('bf'));
begin
  if exists (
    select 1 from auth.users where email = 'usuario@teste.com'
  ) then
    raise notice 'Usuário usuario@teste.com já existe — seed ignorado.';
    return;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_super_admin
  ) values (
    coalesce(
      (select id from auth.instances limit 1),
      '00000000-0000-0000-0000-000000000000'
    ),
    v_user_id,
    'authenticated',
    'authenticated',
    'usuario@teste.com',
    v_encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    v_user_id,
    v_user_id,
    jsonb_build_object(
      'sub', v_user_id::text,
      'email', 'usuario@teste.com',
      'email_verified', true
    ),
    'email',
    v_user_id::text,
    now(),
    now(),
    now()
  );

  -- Garantia: se o trigger não tiver rodado neste caminho, categorias ficam no banco mesmo assim
  insert into public.categorias (user_id, nome, descricao)
  values
    (v_user_id, 'Alimentação', 'Mercado, restaurantes e delivery'),
    (v_user_id, 'Transporte', 'Combustível, ônibus, app de transporte'),
    (v_user_id, 'Salário', 'Remuneração e proventos fixos'),
    (v_user_id, 'Moradia', 'Aluguel, condomínio, contas da casa'),
    (v_user_id, 'Lazer', 'Cinema, viagens, hobbies'),
    (v_user_id, 'Saúde', 'Farmácia, consultas, plano de saúde'),
    (v_user_id, 'Educação', 'Cursos, livros, mensalidades'),
    (v_user_id, 'Contas', 'Água, luz, internet, telefone'),
    (v_user_id, 'Freelance', 'Trabalhos avulsos e serviços'),
    (v_user_id, 'Outros', 'Lançamentos sem categoria específica')
  on conflict (user_id, nome) do nothing;

  raise notice 'Usuário de teste criado: usuario@teste.com (id %)', v_user_id;
end;
$$;
