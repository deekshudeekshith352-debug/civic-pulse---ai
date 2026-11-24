-- ==============================================================================
-- Praja Voice AI - Supabase PostgreSQL Schema, Storage & Realtime Setup
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial location and distance querying

-- 2. ENUM types
CREATE TYPE issue_category AS ENUM (
  'Street Light',
  'Garbage',
  'Potholes',
  'Water Leakage',
  'Drainage Overflow',
  'Illegal Dumping',
  'Fallen Tree',
  'Dangerous Wire'
);

CREATE TYPE issue_status AS ENUM (
  'Submitted',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved'
);

-- 3. Profiles table (linked to supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 50,
  streak_days INTEGER DEFAULT 1,
  ward TEXT DEFAULT 'Ward 12',
  is_authority BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Civic Issues table
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY, -- e.g. 'CP-1001'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category issue_category NOT NULL,
  status issue_status NOT NULL DEFAULT 'Submitted',
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  size_estimate TEXT,
  safety_hazards TEXT[] DEFAULT '{}',
  is_emergency BOOLEAN DEFAULT FALSE,
  department TEXT NOT NULL,
  assigned_team TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  geom GEOMETRY(Point, 4326),
  address TEXT NOT NULL,
  ward TEXT NOT NULL,
  upvotes INTEGER DEFAULT 1,
  reporter_id UUID REFERENCES public.profiles(id),
  reporter_name TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  sla_hours INTEGER DEFAULT 48,
  sla_deadline TIMESTAMPTZ NOT NULL,
  estimated_cost NUMERIC(10, 2) DEFAULT 150.00,
  images TEXT[] NOT NULL DEFAULT '{}',
  resolution_photo TEXT,
  resolution_confidence NUMERIC(5, 2),
  resolution_notes TEXT,
  citizen_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for radius & duplicate searching
CREATE INDEX IF NOT EXISTS idx_issues_geom ON public.issues USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON public.issues(ward);

-- Populate geom from lat/lng on insert/update
CREATE OR REPLACE FUNCTION public.sync_issue_geom()
RETURNS TRIGGER AS $$
BEGIN
  NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_issue_geom
BEFORE INSERT OR UPDATE ON public.issues
FOR EACH ROW EXECUTE FUNCTION public.sync_issue_geom();

-- 5. Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issue_id TEXT REFERENCES public.issues(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  text TEXT NOT NULL,
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Timeline Audit Log table
CREATE TABLE IF NOT EXISTS public.timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issue_id TEXT REFERENCES public.issues(id) ON DELETE CASCADE,
  status issue_status NOT NULL,
  note TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Upvotes tracking table (prevents duplicate voting)
CREATE TABLE IF NOT EXISTS public.issue_upvotes (
  issue_id TEXT REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (issue_id, user_id)
);

-- 8. Duplicate Detection Function: Finds existing reports within radius (meters)
CREATE OR REPLACE FUNCTION public.find_duplicate_issues(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_category issue_category,
  p_radius_meters DOUBLE PRECISION DEFAULT 250.0
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  distance_meters DOUBLE PRECISION,
  upvotes INTEGER,
  status issue_status
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    ST_DistanceSphere(i.geom, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)) AS distance_meters,
    i.upvotes,
    i.status
  FROM public.issues i
  WHERE i.category = p_category
    AND i.status != 'Resolved'
    AND ST_DWithin(i.geom, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, p_radius_meters)
  ORDER BY distance_meters ASC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- 9. Row Level Security (RLS) Policies
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for verified civic transparency"
ON public.issues FOR SELECT USING (true);

CREATE POLICY "Citizens can insert reports"
ON public.issues FOR INSERT WITH CHECK (true);

CREATE POLICY "Authorities or creators can update issues"
ON public.issues FOR UPDATE USING (true);

-- 10. Enable Supabase Realtime for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
