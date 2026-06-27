
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('patient','admin','doctor','dispatcher');
CREATE TYPE public.sos_category AS ENUM ('medical','maternal','fire','accident','security','other');
CREATE TYPE public.sos_status AS ENUM ('pending','dispatched','resolved','cancelled');
CREATE TYPE public.appointment_status AS ENUM ('scheduled','completed','cancelled','no_show');
CREATE TYPE public.immunization_status AS ENUM ('upcoming','due','given','missed');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  genotype TEXT,
  state_id TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  language TEXT DEFAULT 'en',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.raw_user_meta_data->>'phone');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'patient');
  RETURN NEW;
END $$;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Now install signup trigger (after user_roles exists)
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- HOSPITALS (public directory)
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  address TEXT,
  lga TEXT,
  phone TEXT,
  lat NUMERIC,
  lng NUMERIC,
  has_emergency BOOLEAN DEFAULT TRUE,
  rating NUMERIC DEFAULT 4.5,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hospitals TO anon, authenticated;
GRANT ALL ON public.hospitals TO service_role;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hospitals public read" ON public.hospitals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage hospitals" ON public.hospitals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- DOCTORS
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  bio TEXT,
  years_experience INT DEFAULT 5,
  consultation_fee NUMERIC DEFAULT 5000,
  rating NUMERIC DEFAULT 4.7,
  avatar_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO anon, authenticated;
GRANT INSERT, UPDATE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors public read" ON public.doctors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage doctors" ON public.doctors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Doctor self update" ON public.doctors FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  reason TEXT,
  status public.appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own appointments" ON public.appointments FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Doctors view their appointments" ON public.appointments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = appointments.doctor_id AND d.user_id = auth.uid()));
CREATE POLICY "Admins view all appointments" ON public.appointments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_appt_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SOS INCIDENTS
CREATE TABLE public.sos_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.sos_category NOT NULL DEFAULT 'medical',
  status public.sos_status NOT NULL DEFAULT 'pending',
  lat NUMERIC,
  lng NUMERIC,
  address TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.sos_incidents TO authenticated;
GRANT ALL ON public.sos_incidents TO service_role;
ALTER TABLE public.sos_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own SOS" ON public.sos_incidents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own SOS" ON public.sos_incidents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users cancel own SOS" ON public.sos_incidents FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Responders view all SOS" ON public.sos_incidents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'dispatcher'));
CREATE POLICY "Responders update SOS" ON public.sos_incidents FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'dispatcher'));
CREATE TRIGGER trg_sos_updated BEFORE UPDATE ON public.sos_incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- MEDICAL RECORDS
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  provider TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_records TO authenticated;
GRANT ALL ON public.medical_records TO service_role;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own records" ON public.medical_records FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PREGNANCIES
CREATE TABLE public.pregnancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_period_date DATE NOT NULL,
  due_date DATE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pregnancies TO authenticated;
GRANT ALL ON public.pregnancies TO service_role;
ALTER TABLE public.pregnancies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own pregnancies" ON public.pregnancies FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ANC VISITS
CREATE TABLE public.anc_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pregnancy_id UUID NOT NULL REFERENCES public.pregnancies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.anc_visits TO authenticated;
GRANT ALL ON public.anc_visits TO service_role;
ALTER TABLE public.anc_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ANC" ON public.anc_visits FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CHILDREN
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own children" ON public.children FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- IMMUNIZATIONS
CREATE TABLE public.immunizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  given_date DATE,
  status public.immunization_status NOT NULL DEFAULT 'upcoming',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.immunizations TO authenticated;
GRANT ALL ON public.immunizations TO service_role;
ALTER TABLE public.immunizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own immunizations" ON public.immunizations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed hospitals
INSERT INTO public.hospitals (name, type, address, lga, phone, lat, lng, has_emergency, rating) VALUES
('Ahmadu Bello University Teaching Hospital','Teaching Hospital','Shika, Zaria','Sabon Gari','+234 803 100 0001',11.1543,7.6989,TRUE,4.7),
('Barau Dikko Teaching Hospital','Teaching Hospital','Kabala Road, Kaduna','Kaduna North','+234 803 100 0002',10.5267,7.4391,TRUE,4.6),
('44 Nigerian Army Reference Hospital','Military','Kawo, Kaduna','Kaduna North','+234 803 100 0003',10.5800,7.4350,TRUE,4.5),
('Yusuf Dantsoho Memorial Hospital','General','Tudun Wada, Kaduna','Kaduna South','+234 803 100 0004',10.4900,7.4200,TRUE,4.3),
('St. Gerard''s Catholic Hospital','Private','Kakuri, Kaduna','Kaduna South','+234 803 100 0005',10.4750,7.4100,TRUE,4.6),
('Garkuwa Specialist Hospital','Private','Ali Akilu Rd, Kaduna','Kaduna North','+234 803 100 0006',10.5200,7.4400,TRUE,4.5),
('Gwamna Awan General Hospital','General','Kakuri','Kaduna South','+234 803 100 0007',10.4700,7.4150,TRUE,4.2),
('Kaduna State Maternity Hospital','Maternity','Yakubu Gowon Way','Kaduna North','+234 803 100 0008',10.5300,7.4380,TRUE,4.4);

-- Seed doctors
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Aisha Bello','Cardiology', id, 'Senior cardiologist with focus on hypertension and heart failure.',12,7500,4.8,TRUE FROM public.hospitals WHERE name LIKE 'Ahmadu%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Ibrahim Yusuf','Pediatrics', id, 'Pediatrician specializing in childhood immunization and nutrition.',9,5000,4.7,TRUE FROM public.hospitals WHERE name LIKE 'Barau%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Fatima Sani','Obstetrics & Gynaecology', id, 'OB-GYN with 15+ years in maternal health.',15,8000,4.9,TRUE FROM public.hospitals WHERE name LIKE 'Kaduna State Maternity%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Musa Garba','General Practice', id, 'Family medicine and primary care.',7,3500,4.5,TRUE FROM public.hospitals WHERE name LIKE 'Gwamna%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Hauwa Lawal','Dermatology', id, 'Treats skin, hair, and nail conditions.',6,6000,4.6,TRUE FROM public.hospitals WHERE name LIKE 'Garkuwa%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Daniel Adeyemi','Orthopedics', id, 'Bone, joint and sports injury specialist.',11,7000,4.7,TRUE FROM public.hospitals WHERE name LIKE 'St. Gerard%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Zainab Mohammed','Psychiatry', id, 'Mental health, anxiety and depression care.',8,6500,4.6,TRUE FROM public.hospitals WHERE name LIKE '44 Nigerian%' LIMIT 1;
INSERT INTO public.doctors (full_name, specialty, hospital_id, bio, years_experience, consultation_fee, rating, available)
SELECT 'Dr. Samuel Okonkwo','Internal Medicine', id, 'Diabetes, hypertension and adult medicine.',10,5500,4.5,TRUE FROM public.hospitals WHERE name LIKE 'Yusuf Dantsoho%' LIMIT 1;
