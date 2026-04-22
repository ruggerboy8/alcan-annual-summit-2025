
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'email-assets',
  'email-assets',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read so email clients can fetch images
CREATE POLICY "Public read email assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'email-assets');
