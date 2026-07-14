create table public.greetings (
  slug text primary key,
  form_data jsonb not null default '{}'::jsonb,
  ai_content jsonb not null,
  owner_token_hash text not null,
  status text not null default 'published' check (status in ('published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.greetings enable row level security;
revoke all on table public.greetings from anon, authenticated;
grant select, insert, update, delete on table public.greetings to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'greeting-media',
  'greeting-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
