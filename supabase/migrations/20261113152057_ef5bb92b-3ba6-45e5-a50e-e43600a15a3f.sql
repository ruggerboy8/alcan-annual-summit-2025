ALTER TABLE public.event_registrations ADD COLUMN added_by_admin boolean NOT NULL DEFAULT false;
DROP INDEX public.event_registrations_email_event_version_idx;
CREATE UNIQUE INDEX event_registrations_email_event_version_idx ON public.event_registrations (email, event_version) WHERE added_by_admin = false;