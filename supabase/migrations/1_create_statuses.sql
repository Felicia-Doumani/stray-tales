create table if not exists statuses (
  id integer primary key,
  name text unique not null
);


-- Insert default statuses
insert into statuses (id, name) values
  (1, 'Looking for a home'),
  (2, 'In foster care'),
  (3, 'Adopted'),
  (4, 'Back on the streets'),
  (5, 'Missing'),
  (6, 'In treatment / recovering'),
  (7, 'Gone');