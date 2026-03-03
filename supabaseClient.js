import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://xdralutzorsucgtdfgqm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZFdx5fZCftTOrNIn6gVU3A_lE0cMqTb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
