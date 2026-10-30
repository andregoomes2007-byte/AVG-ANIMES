-- AVG ANIMES: tabela, segurança (RLS) e função de apagar conta.
-- Cole tudo no SQL Editor do Supabase e clique em Run.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

drop policy if exists "ler os proprios dados" on public.user_data;
drop policy if exists "criar os proprios dados" on public.user_data;
drop policy if exists "atualizar os proprios dados" on public.user_data;
drop policy if exists "apagar os proprios dados" on public.user_data;

create policy "ler os proprios dados" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "criar os proprios dados" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "atualizar os proprios dados" on public.user_data
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "apagar os proprios dados" on public.user_data
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Apagar a própria conta (LGPD)
create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke all on function public.delete_user() from public, anon;
grant execute on function public.delete_user() to authenticated;
