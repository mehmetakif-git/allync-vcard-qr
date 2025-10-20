-- QR Codes table for managing multiple QR codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  redirect_url text NOT NULL,
  title text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Public can read active QR codes (for redirects)
CREATE POLICY "Anyone can view active QR codes"
  ON qr_codes
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Authenticated users can manage QR codes
CREATE POLICY "Authenticated users can manage QR codes"
  ON qr_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default QR code
INSERT INTO qr_codes (slug, redirect_url, title, description)
VALUES ('allyn', 'https://qr.allyncai.com/allyn', 'Allync-Ai vCard', 'Main business card QR')
ON CONFLICT (slug) DO NOTHING;

-- Update scans table to use foreign key
ALTER TABLE scans 
  DROP COLUMN IF EXISTS qr_code_id,
  ADD COLUMN qr_code_id uuid REFERENCES qr_codes(id) ON DELETE CASCADE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_qr_codes_slug ON qr_codes(slug);
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id_fk ON scans(qr_code_id);