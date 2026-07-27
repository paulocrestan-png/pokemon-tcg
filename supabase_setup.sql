-- ============================================================
-- LOJA POKÉMON TCG — Setup do Supabase (colar TUDO no SQL Editor)
-- Admin da loja: paulocrestan@gmail.com (troque abaixo se quiser)
-- ============================================================

-- Configuração da loja (nome + WhatsApp)
create table if not exists loja_config (
  id int primary key default 1,
  nome text,
  whats text
);

-- Cartas à venda
create table if not exists loja_items (
  id text primary key,
  nome text not null,
  colecao text,
  numero text,
  imagem text,
  preco numeric not null,
  qtd int not null default 1,
  condicao text,
  reservada_por text,
  reservada_em timestamptz,
  atualizado_em timestamptz default now()
);

alter table loja_config enable row level security;
alter table loja_items  enable row level security;

-- Qualquer usuário LOGADO pode ler
drop policy if exists "ler itens" on loja_items;
create policy "ler itens" on loja_items
  for select to authenticated using (true);

drop policy if exists "ler config" on loja_config;
create policy "ler config" on loja_config
  for select to authenticated using (true);

-- Só o ADMIN pode escrever direto (publicar/alterar/apagar)
drop policy if exists "admin itens" on loja_items;
create policy "admin itens" on loja_items
  for all to authenticated
  using     ((auth.jwt()->>'email') = 'paulocrestan@gmail.com')
  with check ((auth.jwt()->>'email') = 'paulocrestan@gmail.com');

drop policy if exists "admin config" on loja_config;
create policy "admin config" on loja_config
  for all to authenticated
  using     ((auth.jwt()->>'email') = 'paulocrestan@gmail.com')
  with check ((auth.jwt()->>'email') = 'paulocrestan@gmail.com');

-- Reservar carta (qualquer usuário logado; só se estiver livre)
create or replace function reservar_carta(item_id text)
returns boolean language plpgsql security definer as $$
begin
  update loja_items
     set reservada_por = (auth.jwt()->>'email'),
         reservada_em  = now()
   where id = item_id and reservada_por is null;
  return found;
end $$;

-- Cancelar reserva (o próprio reservante ou o admin)
create or replace function cancelar_reserva(item_id text)
returns boolean language plpgsql security definer as $$
begin
  update loja_items
     set reservada_por = null,
         reservada_em  = null
   where id = item_id
     and (reservada_por = (auth.jwt()->>'email')
          or (auth.jwt()->>'email') = 'paulocrestan@gmail.com');
  return found;
end $$;

-- Atualização AO VIVO (realtime) na página da loja
do $$ begin
  alter publication supabase_realtime add table loja_items;
exception when duplicate_object then null; end $$;
