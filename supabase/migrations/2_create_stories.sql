-- Main table that stores all animal stories
create table stories (
  id uuid primary key default gen_random_uuid(),   -- Unique identifier
  title text not null,                             -- Story title
  description text not null,                       -- Main description
  photo_url text not null,                         -- URL of the story photo
  story_date date not null,                        -- Date of the story event
  location text,                                    -- Where it happened
  note text,                                        -- Extra internal notes
  status_id int references statuses(id),            -- Link to status (FK)
  created_at timestamptz not null default now(),    -- Automatically set creation time

  -- Every story must be linked to an authenticated user (admin)
  user_id uuid not null references auth.users(id)
);
