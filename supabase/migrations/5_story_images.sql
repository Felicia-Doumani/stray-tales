create table story_images (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);
