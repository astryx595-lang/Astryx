-- ============================================================
-- Astryx — Supabase Schema
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ──────────────────────────────────────────────────
create type user_role    as enum ('client', 'admin');
create type service_type as enum ('basic', 'complete', 'synastry', 'solar_return');
create type order_status as enum ('pending', 'confirmed', 'in_progress', 'delivered', 'cancelled');

-- ─── Tabela: users (perfil — estende auth.users) ────────────
create table public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text         not null unique,
  full_name   text         not null,
  phone       text,
  role        user_role    not null default 'client',
  avatar_url  text,
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);

-- ─── Tabela: orders ──────────────────────────────────────────
create table public.orders (
  id           uuid         primary key default uuid_generate_v4(),
  user_id      uuid         references public.users(id) on delete cascade not null,
  service_type service_type not null,
  status       order_status not null default 'pending',
  price_cents  integer      not null,
  notes        text,
  admin_notes  text,
  delivered_at timestamptz,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

-- ─── Tabela: birth_data ──────────────────────────────────────
create table public.birth_data (
  id                        uuid    primary key default uuid_generate_v4(),
  order_id                  uuid    references public.orders(id) on delete cascade not null unique,
  full_name                 text    not null,
  birth_date                date    not null,
  birth_time                time,
  birth_time_unknown        boolean not null default false,
  birth_city                text    not null,
  birth_country             text    not null,
  birth_state               text,
  latitude                  numeric(10, 7),
  longitude                 numeric(10, 7),
  timezone                  text,
  -- Sinastria (segunda pessoa)
  partner_full_name         text,
  partner_birth_date        date,
  partner_birth_time        time,
  partner_birth_time_unknown boolean,
  partner_birth_city        text,
  partner_birth_country     text,
  partner_birth_state       text
);

-- ─── Tabela: astral_charts ───────────────────────────────────
create table public.astral_charts (
  id               uuid        primary key default uuid_generate_v4(),
  order_id         uuid        references public.orders(id) on delete cascade not null unique,
  pdf_storage_path text        not null,
  pdf_filename     text        not null,
  pdf_size_bytes   integer     not null,
  uploaded_by      uuid        references public.users(id) not null,
  uploaded_at      timestamptz not null default now(),
  download_count   integer     not null default 0,
  expires_at       timestamptz
);

-- ─── Tabela: order_status_history ───────────────────────────
create table public.order_status_history (
  id          uuid         primary key default uuid_generate_v4(),
  order_id    uuid         references public.orders(id) on delete cascade not null,
  from_status order_status,
  to_status   order_status not null,
  changed_by  uuid         references public.users(id) not null,
  reason      text,
  created_at  timestamptz  not null default now()
);

-- ─── Trigger: atualiza updated_at automaticamente ────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_users
  before update on public.users
  for each row execute function update_updated_at();

create trigger set_updated_at_orders
  before update on public.orders
  for each row execute function update_updated_at();

-- ─── Trigger: cria perfil ao cadastrar via Supabase Auth ─────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security (RLS) ────────────────────────────────
alter table public.users              enable row level security;
alter table public.orders             enable row level security;
alter table public.birth_data         enable row level security;
alter table public.astral_charts      enable row level security;
alter table public.order_status_history enable row level security;

-- Helper: verifica se o usuário logado é admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Políticas: users
create policy "users: ver próprio perfil ou admin"
  on public.users for select
  using (auth.uid() = id or is_admin());

create policy "users: editar próprio perfil"
  on public.users for update
  using (auth.uid() = id);

-- Políticas: orders
create policy "orders: ver próprios pedidos ou admin"
  on public.orders for select
  using (user_id = auth.uid() or is_admin());

create policy "orders: cliente cria pedido"
  on public.orders for insert
  with check (user_id = auth.uid());

create policy "orders: apenas admin atualiza"
  on public.orders for update
  using (is_admin());

-- Políticas: birth_data
create policy "birth_data: ver dados do próprio pedido ou admin"
  on public.birth_data for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = birth_data.order_id
        and (orders.user_id = auth.uid() or is_admin())
    )
  );

create policy "birth_data: cliente insere dados do próprio pedido"
  on public.birth_data for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = birth_data.order_id
        and orders.user_id = auth.uid()
    )
  );

-- Políticas: astral_charts
create policy "charts: ver PDF do próprio pedido ou admin"
  on public.astral_charts for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = astral_charts.order_id
        and (orders.user_id = auth.uid() or is_admin())
    )
  );

create policy "charts: apenas admin faz upload"
  on public.astral_charts for insert
  with check (is_admin());

-- Políticas: order_status_history
create policy "history: ver histórico do próprio pedido ou admin"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_status_history.order_id
        and (orders.user_id = auth.uid() or is_admin())
    )
  );

create policy "history: apenas admin registra mudança"
  on public.order_status_history for insert
  with check (is_admin());

-- ─── Storage bucket para PDFs dos mapas ──────────────────────
insert into storage.buckets (id, name, public)
values ('astral-charts', 'astral-charts', false)
on conflict do nothing;

create policy "storage: cliente lê próprio PDF"
  on storage.objects for select
  using (
    bucket_id = 'astral-charts'
    and (
      is_admin()
      or exists (
        select 1 from public.astral_charts ac
        join public.orders o on o.id = ac.order_id
        where ac.pdf_storage_path = name
          and o.user_id = auth.uid()
      )
    )
  );

create policy "storage: apenas admin faz upload"
  on storage.objects for insert
  with check (bucket_id = 'astral-charts' and is_admin());
