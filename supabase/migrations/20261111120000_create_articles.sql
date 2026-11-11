-- =====================================================================
-- Actualité : profils (rôle), auteurs, catégories, articles et images
-- Adapté du site Superentreprise pour Solissia (site bilingue fr / en).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Profils : une ligne par compte, avec son rôle
-- ---------------------------------------------------------------------
create type public.user_role as enum ('member', 'writer');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil des utilisateurs Solissia (rôle).';

alter table public.profiles enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Lecture seule pour l'utilisateur : le rôle s'attribue uniquement
-- par SQL ou depuis le dashboard Supabase.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crée le profil à l'inscription.
-- security definer : nécessaire pour écrire dans public.profiles depuis le
-- trigger sur auth.users ; non appelable via l'API (droits révoqués).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profils des comptes déjà créés
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Vrai si l'utilisateur connecté a le rôle writer
create function public.is_writer()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'writer'
  );
$$;

revoke execute on function public.is_writer() from public, anon;
grant execute on function public.is_writer() to authenticated;

-- ---------------------------------------------------------------------
-- 2. Auteurs : identité publique affichée avec les articles
-- ---------------------------------------------------------------------
create table public.authors (
  id uuid primary key references public.profiles (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 100),
  job_title text check (char_length(job_title) <= 120),
  avatar_url text,
  bio text,
  linkedin_url text
    check (linkedin_url ~ '^https://([a-z]{2,3}\.)?linkedin\.com/' and char_length(linkedin_url) <= 300),
  x_url text
    check (x_url ~ '^https://(www\.)?(x|twitter)\.com/' and char_length(x_url) <= 300),
  contact_email text
    check (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(contact_email) <= 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.authors is 'Identité publique des auteurs d''articles.';

alter table public.authors enable row level security;

create policy "Les auteurs sont visibles par tous"
  on public.authors for select
  to anon, authenticated
  using (true);

create policy "Un writer crée sa fiche auteur"
  on public.authors for insert
  to authenticated
  with check ((select auth.uid()) = id and (select public.is_writer()));

create policy "Un writer modifie sa fiche auteur"
  on public.authors for update
  to authenticated
  using ((select auth.uid()) = id and (select public.is_writer()))
  with check ((select auth.uid()) = id and (select public.is_writer()));

revoke all on public.authors from anon, authenticated;
grant select on public.authors to anon, authenticated;
grant insert (id, display_name, job_title, avatar_url, bio, linkedin_url, x_url, contact_email)
  on public.authors to authenticated;
grant update (display_name, job_title, avatar_url, bio, linkedin_url, x_url, contact_email)
  on public.authors to authenticated;

create trigger authors_set_updated_at
  before update on public.authors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Catégories (nom en français et en anglais, lecture publique)
-- ---------------------------------------------------------------------
create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text not null,
  created_at timestamptz not null default now()
);

comment on table public.categories is 'Catégories des articles d''actualité.';

alter table public.categories enable row level security;

create policy "Les catégories sont visibles par tous"
  on public.categories for select
  to anon, authenticated
  using (true);

revoke all on public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;

insert into public.categories (slug, name_fr, name_en) values
  ('fruits', 'Fruits', 'Fruit'),
  ('legumes', 'Légumes', 'Vegetables'),
  ('sourcing', 'Sourcing', 'Sourcing'),
  ('marches', 'Marchés & tendances', 'Markets & trends'),
  ('logistique-qualite', 'Logistique & qualité', 'Logistics & quality');

-- ---------------------------------------------------------------------
-- 4. Articles (chacun rédigé dans une langue : fr ou en)
-- ---------------------------------------------------------------------
create type public.article_status as enum ('draft', 'published');

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category_id bigint references public.categories (id) on delete set null,
  author_id uuid references public.authors (id) on delete restrict,
  status public.article_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Le même slug peut exister en français et en anglais
  unique (locale, slug)
);

comment on table public.articles is 'Articles de la rubrique Actualité.';

create index articles_published_idx on public.articles (locale, published_at desc)
  where status = 'published';
create index articles_category_id_idx on public.articles (category_id);
create index articles_author_id_idx on public.articles (author_id);

alter table public.articles enable row level security;

-- Lecture : une seule règle par rôle
create policy "Les visiteurs voient les articles publiés"
  on public.articles for select
  to anon
  using (status = 'published' and published_at <= now());

create policy "Les connectés voient les articles publiés et leurs propres articles"
  on public.articles for select
  to authenticated
  using (
    (status = 'published' and published_at <= now())
    or (select auth.uid()) = author_id
  );

-- Écriture : réservée aux writers, sur leurs propres articles
create policy "Un writer crée ses articles"
  on public.articles for insert
  to authenticated
  with check ((select auth.uid()) = author_id and (select public.is_writer()));

create policy "Un writer modifie ses articles"
  on public.articles for update
  to authenticated
  using ((select auth.uid()) = author_id and (select public.is_writer()))
  with check ((select auth.uid()) = author_id and (select public.is_writer()));

create policy "Un writer supprime ses articles"
  on public.articles for delete
  to authenticated
  using ((select auth.uid()) = author_id and (select public.is_writer()));

revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon;
grant select, insert, update, delete on public.articles to authenticated;

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- Renseigne published_at à la première publication
create function public.set_article_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

revoke execute on function public.set_article_published_at() from public, anon, authenticated;

create trigger articles_set_published_at
  before insert or update on public.articles
  for each row execute function public.set_article_published_at();

-- ---------------------------------------------------------------------
-- 5. Images : couvertures d'articles et photos d'auteurs
-- ---------------------------------------------------------------------
-- Buckets publics : images lisibles par tous via leur URL publique
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('article-covers', 'article-covers', true, 5242880, -- 5 Mo
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', true, 2097152, -- 2 Mo
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

-- Envoi, remplacement et suppression : réservés aux writers, chacun dans son
-- dossier « {id utilisateur}/… ». L'upsert nécessite INSERT + SELECT + UPDATE.
create policy "Les writers voient leurs propres images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );

create policy "Les writers envoient leurs images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );

create policy "Les writers remplacent leurs images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  )
  with check (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );

create policy "Les writers suppriment leurs images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );
