create table jobs (
  id serial primary key,
  title text not null,
  category text not null,
  salary integer not null,
  created_at timestamp default now()
);