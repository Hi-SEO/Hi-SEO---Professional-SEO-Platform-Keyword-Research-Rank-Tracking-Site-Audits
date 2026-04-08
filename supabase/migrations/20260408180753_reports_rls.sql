alter table public.reports enable row level security;

drop policy if exists "reports_select_own" on public.reports;
drop policy if exists "reports_insert_own" on public.reports;
drop policy if exists "reports_update_own" on public.reports;
drop policy if exists "reports_delete_own" on public.reports;

create policy "reports_select_own"
on public.reports
for select
using (auth.uid() = user_id);

create policy "reports_insert_own"
on public.reports
for insert
with check (auth.uid() = user_id);

create policy "reports_update_own"
on public.reports
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "reports_delete_own"
on public.reports
for delete
using (auth.uid() = user_id);
