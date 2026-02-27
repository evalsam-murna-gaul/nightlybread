-- ─────────────────────────────────────────────────────────────────────────────
-- Taste & Co. — Supabase Setup SQL
-- Run this in your Supabase project: Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create user_roles table
--    Stores role + display name for each Supabase auth user
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  name        text,
  created_at  timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Users can read their own role
CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do anything (used by server-side API routes)
CREATE POLICY "Service role has full access"
  ON public.user_roles
  USING (auth.role() = 'service_role');

-- 4. Create a trigger to auto-insert a 'user' role on new sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, name)
  VALUES (
    NEW.id,
    'user',
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Manually promote a user to admin
--    Replace 'your-user-uuid' with the UUID from Supabase Dashboard → Auth → Users
-- ─────────────────────────────────────────────────────────────────────────────
-- UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'your-user-uuid';
