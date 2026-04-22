-- Table 1: event_registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendee_type TEXT NOT NULL CHECK (attendee_type IN ('staff', 'guest')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  practice TEXT,
  organization TEXT,
  role TEXT,
  registration_status TEXT NOT NULL DEFAULT 'registered',
  confirmation_email_sent_at TIMESTAMPTZ,
  confirmation_email_id TEXT,
  checked_in_at TIMESTAMPTZ,
  checked_in_by TEXT,
  event_version TEXT NOT NULL DEFAULT 'v1-alcan-summit-2026',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX event_registrations_email_event_version_idx
  ON public.event_registrations (email, event_version);
CREATE INDEX event_registrations_email_idx ON public.event_registrations (email);
CREATE INDEX event_registrations_attendee_type_idx ON public.event_registrations (attendee_type);
CREATE INDEX event_registrations_registration_status_idx ON public.event_registrations (registration_status);
CREATE INDEX event_registrations_created_at_idx ON public.event_registrations (created_at);

-- Table 2: email_templates
CREATE TABLE public.email_templates (
  template_key TEXT PRIMARY KEY,
  version INTEGER NOT NULL DEFAULT 1,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text_fallback TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 3: email_sends
CREATE TABLE public.email_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key TEXT NOT NULL,
  template_version INTEGER NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  registration_id UUID REFERENCES public.event_registrations(id) ON DELETE SET NULL,
  resend_message_id TEXT,
  send_type TEXT NOT NULL CHECK (send_type IN ('test', 'production')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  sent_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX email_sends_registration_id_idx ON public.email_sends (registration_id);
CREATE INDEX email_sends_created_at_idx ON public.email_sends (created_at);

-- Seed the default confirmation template
INSERT INTO public.email_templates (template_key, version, subject, html, text_fallback, is_published)
VALUES (
  'confirmation',
  1,
  'You''re registered for The Alcan Summit 2026!',
  '<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;"><h1 style="color: #0d2e4a;">Hi {{first_name}},</h1><p>You''re officially registered for <strong>The Alcan Summit 2026</strong>.</p><p><strong>Date:</strong> {{event_date}}<br/><strong>Location:</strong> {{event_location}}</p><p>We''ll be in touch with more details as the event approaches. Until then — see you at the summit.</p><p style="margin-top: 32px;">— The Alcan Team</p></body></html>',
  'Hi {{first_name}}, You''re officially registered for The Alcan Summit 2026. Date: {{event_date}}. Location: {{event_location}}. See you at the summit. — The Alcan Team',
  true
);

-- RLS: enable on all tables, no client policies (edge functions use service role)
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;