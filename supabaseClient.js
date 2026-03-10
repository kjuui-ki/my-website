// Supabase client — loaded via CDN as a global (window.supabase)
// The CDN script must be included before this file in the HTML.
const SUPABASE_URL = 'https://dcgyvpmrirxkngzndwdh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ3l2cG1yaXJ4a25nem5kd2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjQxMDUsImV4cCI6MjA4ODc0MDEwNX0.Lm-ri8smOJvGl5dXpYQ_F2b5eZgWFd1v11f1yRDEVX4';

window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
