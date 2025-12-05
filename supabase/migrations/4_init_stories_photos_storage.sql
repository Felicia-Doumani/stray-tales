-- Reset the bucket if it already exists (useful when resetting DB)
do $$
begin
  if exists (
    select 1 from storage.buckets where id = 'stories-photos'
  ) then
    -- Remove all files inside the bucket
    delete from storage.objects where bucket_id = 'stories-photos';

    -- Remove the bucket itself
    delete from storage.buckets where id = 'stories-photos';
  end if;
end $$;

-- Create the bucket for story images
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'stories-photos',      -- bucket id
  'stories-photos',      -- bucket name
  true,                  -- make images publicly viewable
  5000000,               -- 5MB max file size
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]                      -- allowed image types
);

-- Anyone (public) can view photos in this bucket
create policy "Public can view story photos"
on storage.objects for select
using (bucket_id = 'stories-photos');

-- Authenticated user (your admin) can upload images
create policy "Admin can upload story photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'stories-photos');

-- Authenticated user can delete their own uploads
create policy "Admin can delete story photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'stories-photos');
