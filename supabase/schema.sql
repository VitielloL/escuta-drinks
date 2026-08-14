create table if not exists public.drinks (
  id text primary key,
  name text not null,
  category text not null default 'Sem categoria',
  garnish text default '',
  method text default '',
  glass text default '',
  image text default '',
  history text default '',
  ingredients jsonb default '[]'::jsonb,
  preparation jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.drinks enable row level security;

create policy "Allow public read access"
  on public.drinks for select
  using (true);

create policy "Allow public insert access"
  on public.drinks for insert
  with check (true);

create policy "Allow public update access"
  on public.drinks for update
  using (true)
  with check (true);

create policy "Allow public delete access"
  on public.drinks for delete
  using (true);

create index if not exists drinks_name_idx
  on public.drinks (name);
