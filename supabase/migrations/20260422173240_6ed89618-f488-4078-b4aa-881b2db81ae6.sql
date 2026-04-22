-- 1. Add preheader to email_templates
ALTER TABLE public.email_templates
  ADD COLUMN IF NOT EXISTS preheader text;

-- 2. Create email_campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prompt text,
  subject text NOT NULL,
  preheader text,
  html text NOT NULL,
  text_fallback text,
  status text NOT NULL DEFAULT 'draft',
  recipient_filter text NOT NULL DEFAULT 'all',
  recipient_count integer,
  sent_at timestamptz,
  sent_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_campaigns_status_chk CHECK (status IN ('draft','sent')),
  CONSTRAINT email_campaigns_filter_chk CHECK (recipient_filter IN ('all','staff','guests'))
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at
  ON public.email_campaigns (created_at DESC);

-- 3. Enable RLS (no policies — service-role-only access via admin edge functions)
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- 4. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_email_campaigns_updated_at ON public.email_campaigns;
CREATE TRIGGER trg_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();