import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
    throw new Error(
      '🔴 SUPABASE NOT CONFIGURED!\n\n' +
      'Please follow these steps:\n' +
      '1. Go to https://supabase.com and create a free account\n' +
      '2. Create a new project\n' +
      '3. Go to Project Settings > API\n' +
      '4. Copy your Project URL and anon/public key\n' +
      '5. Update .env.local with your actual credentials\n' +
      '6. Restart the dev server (pnpm dev)\n\n' +
      'See SETUP_GUIDE.md for detailed instructions.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
