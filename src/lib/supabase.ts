import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://stalbdpnwfbiqwytelxv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YWxiZHBud2ZiaXF3eXRlbHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDg1NDksImV4cCI6MjA5MTY4NDU0OX0.JBl_hIHaGX4uABKHC6c1djYxHT1TBgeVWoM_4eBuMPk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
