-- Enable Row Level Security for safe access control
alter table stories enable row level security;

-- Policy: only the creator (admin) can insert, update, delete, or read their stories
create policy "admins can manage stories"
on stories for all
using (auth.uid() = user_id)        -- Row is visible only if logged in admin owns it
with check (auth.uid() = user_id);  -- Admin can modify only rows they created
