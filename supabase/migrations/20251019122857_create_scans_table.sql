/*
  # Create scans tracking table for vCard analytics

  1. New Tables
    - `scans`
      - `id` (uuid, primary key) - Unique identifier for each scan
      - `qr_code_id` (text) - Identifier for the QR code being scanned
      - `device_type` (text) - Device type (iOS/Android/Desktop)
      - `user_agent` (text) - Full user agent string for detailed analytics
      - `country` (text) - Country code (e.g., 'QA', 'TR')
      - `ip_address` (text, nullable) - IP address of the scanner
      - `created_at` (timestamptz) - Timestamp of the scan
  
  2. Security
    - Enable RLS on `scans` table
    - Add policy for public insert (anyone can track scans)
    - Add policy for authenticated read (analytics access)
  
  3. Indexes
    - Index on created_at for efficient time-based queries
    - Index on qr_code_id for filtering by specific QR codes
*/

CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id text NOT NULL DEFAULT 'allync-main',
  device_type text NOT NULL,
  user_agent text NOT NULL,
  country text DEFAULT 'QA',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert scan records (public vCard tracking)
CREATE POLICY "Anyone can track scans"
  ON scans
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all scan data (analytics dashboard)
CREATE POLICY "Authenticated users can view all scans"
  ON scans
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id ON scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scans_device_type ON scans(device_type);