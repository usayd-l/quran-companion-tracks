
-- 1. Add attendance tracking, absence reasons, and log improvements
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'super_admin';

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS parent_email text,
  ADD COLUMN IF NOT EXISTS enrollment_date date,
  ADD COLUMN IF NOT EXISTS student_identifier text;

-- Classroom config for programs (days per week, session type, etc.)
CREATE TABLE IF NOT EXISTS classroom_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  attendance_days integer NOT NULL DEFAULT 5,
  session_type text NOT NULL DEFAULT 'full_day', -- 'half_day', 'full_day', etc.
  program_type text, -- e.g. "Hifz", "Nazra", etc.
  created_at timestamp with time zone DEFAULT now()
);

-- Add classroom_config_id to profiles (optional override)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS classroom_config_id uuid REFERENCES classroom_configs(id);

-- Extend recitation log for attendance and flexible surah/juz/page fields
ALTER TABLE recitation_logs
  ADD COLUMN IF NOT EXISTS attendance_status text, -- present, absent, late
  ADD COLUMN IF NOT EXISTS absence_reason text,
  ADD COLUMN IF NOT EXISTS pages_count integer;

-- Sabaq Dhor/Dhor: add ayahStart/ayahEnd for all recitation types (if not present)
-- (Columns already exist: ayah_start, ayah_end. No change needed.)

-- Remove page_start/page_end if you want only pages_count:
ALTER TABLE recitation_logs
  DROP COLUMN IF EXISTS page_start,
  DROP COLUMN IF EXISTS page_end;

-- Add institution support (for super admin/principal)
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE classrooms
  ADD COLUMN IF NOT EXISTS institution_id uuid REFERENCES institutions(id);

-- Add institution_id to profiles for student/teacher-institution mapping
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS institution_id uuid REFERENCES institutions(id);

-- Create absence reasons lookup (to be used as options)
CREATE TABLE IF NOT EXISTS absence_reasons (
  id serial PRIMARY KEY,
  reason text UNIQUE
);

INSERT INTO absence_reasons (reason) VALUES
  ('Sick'), ('Vacation'), ('Family Emergency'), ('Late Arrival'), ('Transport Issues'), ('No Reason'), ('Other')
ON CONFLICT DO NOTHING;

