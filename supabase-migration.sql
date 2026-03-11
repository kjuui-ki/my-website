-- ============================================================
-- Rawad Health — Superadmin Approval System
-- SAFE TO RE-RUN: drops and recreates table + policies + trigger
-- Paste entire contents into Supabase SQL Editor → Run
-- ============================================================

-- 1. Drop existing table (ensures correct schema on every run)
--    CASCADE also drops any dependent policies automatically
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Create users table
CREATE TABLE public.users (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'user'     CHECK (role   IN ('superadmin', 'admin', 'user')),
  status     TEXT        NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Authenticated user can read their own row
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Superadmin can read ALL rows (JWT email check — no recursive table lookup)
CREATE POLICY "superadmin_select_all" ON public.users
  FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'kramabid1@gmail.com');

-- Any authenticated user can insert their own row
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Superadmin can update any row (approve / reject)
CREATE POLICY "superadmin_update_all" ON public.users
  FOR UPDATE
  USING     ((auth.jwt() ->> 'email') = 'kramabid1@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'kramabid1@gmail.com');

-- 5. Trigger function — auto-inserts row on every auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as postgres owner, bypasses RLS
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    -- Determine role from signup metadata; superadmin email is hardcoded
    CASE
      WHEN NEW.email = 'kramabid1@gmail.com'                                THEN 'superadmin'
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'admin'      THEN 'admin'
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'superadmin' THEN 'superadmin'
      ELSE 'user'
    END,
    -- Admins start as pending; everyone else is immediately approved
    CASE
      WHEN NEW.email = 'kramabid1@gmail.com'                                THEN 'approved'
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'user') = 'admin'      THEN 'pending'
      ELSE 'approved'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- 6. Backfill ALL existing auth.users (people who registered before this migration)
INSERT INTO public.users (id, email, role, status)
SELECT
  au.id,
  au.email,
  CASE
    WHEN au.email = 'kramabid1@gmail.com'                                          THEN 'superadmin'
    WHEN COALESCE(au.raw_user_meta_data->>'role', 'user') = 'admin'               THEN 'admin'
    WHEN COALESCE(au.raw_user_meta_data->>'role', 'user') = 'superadmin'          THEN 'superadmin'
    ELSE 'user'
  END,
  CASE
    WHEN au.email = 'kramabid1@gmail.com'                                          THEN 'approved'
    WHEN COALESCE(au.raw_user_meta_data->>'role', 'user') = 'admin'               THEN 'pending'
    ELSE 'approved'
  END
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- 7. Force-correct superadmin row (safety net)
UPDATE public.users
   SET role = 'superadmin', status = 'approved'
 WHERE email = 'kramabid1@gmail.com';
