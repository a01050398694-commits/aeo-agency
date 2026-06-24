-- ============================================================
-- AEO Agency — Supabase 스키마 v1
-- 프로젝트: aeo-agency (qrcaacrevijtwcibzrep)
-- 적용: scripts/setup/supabase-schema.sql
-- ============================================================

-- ─── 1. clients ───────────────────────────────────────────────
create table if not exists public.clients (
  id              bigserial primary key,
  slug            text unique not null,
  status          text not null default 'active' check (status in ('active','paused','churned')),
  brand_name      text not null,
  primary_query   text,
  primary_url     text,
  naver_place_id  text,
  onboarded_at    date not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists clients_status_idx on public.clients(status);
create index if not exists clients_slug_idx on public.clients(slug);

-- ─── 2. sov_measurements (일일 SOV 집계) ─────────────────────
create table if not exists public.sov_measurements (
  id                bigserial primary key,
  client_slug       text not null references public.clients(slug) on delete cascade,
  measured_date     date not null,
  engine            text not null default 'gemini-2.5-flash',
  queries_total     int not null,
  queries_success   int not null,
  queries_failed    int not null,
  cited_us          int not null default 0,
  sov_percent       numeric(5,2) not null default 0,
  competitor_top    jsonb not null default '{}'::jsonb,
  raw_json_path     text,
  created_at        timestamptz not null default now(),
  unique (client_slug, measured_date, engine)
);

create index if not exists sov_client_date_idx
  on public.sov_measurements(client_slug, measured_date desc);

-- ─── 3. citations (쿼리별 상세 — 디버깅/추세) ────────────────
create table if not exists public.citations (
  id              bigserial primary key,
  client_slug     text not null references public.clients(slug) on delete cascade,
  measured_date   date not null,
  query           text not null,
  cited_us        boolean not null default false,
  cited_competitors text[] not null default '{}',
  citation_urls   text[] not null default '{}',
  answer_text     text,
  duration_ms     int,
  created_at      timestamptz not null default now()
);

create index if not exists citations_client_date_idx
  on public.citations(client_slug, measured_date desc);
create index if not exists citations_cited_us_idx
  on public.citations(client_slug, cited_us) where cited_us = true;

-- ─── 4. content_queue (콘텐츠 승인 대기열) ────────────────────
create table if not exists public.content_queue (
  id              bigserial primary key,
  client_slug     text not null references public.clients(slug) on delete cascade,
  content_type    text not null check (content_type in
                    ('answer_block','faq','blog','social','schema')),
  target_query    text,
  title           text,
  body_md         text,
  schema_json     jsonb,
  status          text not null default 'pending' check (status in
                    ('pending','approved','rejected','published')),
  reviewer_note   text,
  created_at      timestamptz not null default now(),
  reviewed_at     timestamptz,
  published_at    timestamptz
);

create index if not exists content_queue_client_status_idx
  on public.content_queue(client_slug, status);

-- ─── 5. RLS 정책 ──────────────────────────────────────────────
-- 운영자 단독 사용 → 일단 service_role만 접근 가능하도록 RLS 활성화
-- 추후 클라이언트 포털 추가 시 slug 기반 정책 추가
alter table public.clients enable row level security;
alter table public.sov_measurements enable row level security;
alter table public.citations enable row level security;
alter table public.content_queue enable row level security;

-- service_role bypass 정책 (anon은 차단)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_clients') then
    create policy service_role_all_clients on public.clients
      for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_sov') then
    create policy service_role_all_sov on public.sov_measurements
      for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_citations') then
    create policy service_role_all_citations on public.citations
      for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'service_role_all_queue') then
    create policy service_role_all_queue on public.content_queue
      for all to service_role using (true) with check (true);
  end if;
end $$;

-- ─── 6. updated_at 트리거 ────────────────────────────────────
create or replace function public.tg_set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists tg_clients_updated_at on public.clients;
create trigger tg_clients_updated_at before update on public.clients
  for each row execute function public.tg_set_updated_at();
