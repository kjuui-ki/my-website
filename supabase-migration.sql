-- ============================================================
-- Rawad Health — Superadmin Approval System
-- Safe to run multiple times (idempotent)
-- Paste entire contents into Supabase SQL Editor → Run
-- ============================================================

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'user'     CHECK (role   IN ('superadmin', 'admin', 'user')),
  status     TEXT        NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (drop first so re-runs don't fail)
DROP POLICY IF EXISTS "users_select_own"      ON public.users;
DROP POLICY IF EXISTS "superadmin_select_all" ON public.users;
DROP POLICY IF EXISTS "users_insert_own"      ON public.users;
DROP POLICY IF EXISTS "superadmin_update_all" ON public.users;

-- Authenticated user can read their own row
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Superadmin can read ALL rows (matched by JWT email — avoids recursive table lookups)
CREATE POLICY "superadmin_select_all" ON public.users
  FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'kramabid1@gmail.com');

-- Any authenticated user can insert their own row
-- (the trigger below handles this automatically; this is a safety fallback)
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Superadmin can update any row (approve / reject)
CREATE POLICY "superadmin_update_all" ON public.users
  FOR UPDATE
  USING     ((auth.jwt() ->> 'email') = 'kramabid1@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'kramabid1@gmail.com');

-- 4. Trigger function — runs on every new auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as postgres, bypasses RLS
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'admin'      THEN 'admin'
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'superadmin' THEN 'superadmin'
      ELSE 'user'
    END,
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'admin' THEN 'pending'
      ELSE 'approved'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recreate trigger (drop first for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- 5. Backfill: ensure superadmin row exists if already registered
INSERT INTO public.users (id, email, role, status)
SELECT id, email, 'superadmin', 'approved'
FROM auth.users
WHERE email = 'kramabid1@gmail.com'
ON CONFLICT (id) DO UPDATE
  SET role   = 'superadmin',
      status = 'approved';
