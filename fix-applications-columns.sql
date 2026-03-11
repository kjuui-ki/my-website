-- ============================================================
-- Add missing columns to applications table
-- Run in: Supabase Dashboard → SQL Editor → Run
-- Then: Settings → API → Reload schema
-- ============================================================

ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS specialty      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS classification TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS city           TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS experience     TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS qualification  TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS cv_url         TEXT;

-- After running:
-- 1. Supabase Dashboard → Settings → API → Reload schema
-- 2. For CV upload to work, create a PUBLIC Storage bucket named "cvs":
--    Supabase Dashboard → Storage → New bucket → name: cvs → Public: ON
