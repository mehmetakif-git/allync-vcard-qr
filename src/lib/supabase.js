import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Device detection
export function detectDevice() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Android/i.test(ua)) return 'Android'
  return 'Desktop'
}

// Track scan - artık slug'a göre çalışıyor
export async function trackScan(slug = 'allyn') {
  try {
    // Get QR code by slug
    const { data: qrCode } = await supabase
      .from('qr_codes')
      .select('id')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (!qrCode) {
      console.error('QR code not found for slug:', slug)
      return
    }

    // Insert scan record
    const { data, error } = await supabase
      .from('scans')
      .insert([
        {
          qr_code_id: qrCode.id,
          device_type: detectDevice(),
          user_agent: navigator.userAgent,
          country: 'QA'
        }
      ])

    if (error) throw error
    console.log('Scan tracked successfully for:', slug)
    return data
  } catch (error) {
    console.error('Error tracking scan:', error)
  }
}

// Get analytics data - tüm QR kodlar için
export async function getAnalytics() {
  try {
    // Get default QR code (allyn)
    const { data: qrCode } = await supabase
      .from('qr_codes')
      .select('id')
      .eq('slug', 'allyn')
      .single()

    if (!qrCode) return null

    // Total scans
    const { count: totalScans } = await supabase
      .from('scans')
      .select('*', { count: 'exact', head: true })
      .eq('qr_code_id', qrCode.id)

    // Today's scans
    const today = new Date().toISOString().split('T')[0]
    const { count: todayScans } = await supabase
      .from('scans')
      .select('*', { count: 'exact', head: true })
      .eq('qr_code_id', qrCode.id)
      .gte('scanned_at', today)

    // Recent scans - updated column name
    const { data: recentScans } = await supabase
      .from('scans')
      .select('*')
      .eq('qr_code_id', qrCode.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Device breakdown
    const { data: deviceStats } = await supabase
      .from('scans')
      .select('device_type')
      .eq('qr_code_id', qrCode.id)

    return {
      totalScans: totalScans || 0,
      todayScans: todayScans || 0,
      recentScans: recentScans || [],
      deviceStats: deviceStats || []
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return null
  }
}

// Real-time subscription
export function subscribeToScans(callback) {
  return supabase
    .channel('scans')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'scans' },
      callback
    )
    .subscribe()
}