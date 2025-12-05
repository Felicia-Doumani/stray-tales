-- Create a lookup table for story statuses (e.g., published, pending, etc.)
create table statuses (
  id serial primary key,        -- Auto-incrementing ID
  name text unique not null     -- Status name (unique so no duplicates)
);

-- Insert default statuses
insert into statuses (name)
values ('pending'), ('published'), ('archived');
