
DROP POLICY IF EXISTS "Public read email assets" ON storage.objects;

-- Allow direct file fetch by path (won't enable listing)
CREATE POLICY "Public can read individual email-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'email-assets' AND name IS NOT NULL AND length(name) > 0);
