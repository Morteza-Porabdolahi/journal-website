// src/lib/auth.js
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase-server';

const ALLOWED_ADMINS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Optional extra lock: restrict to specific emails in .env.local
  if (ALLOWED_ADMINS.length > 0 && !ALLOWED_ADMINS.includes(user.email?.toLowerCase())) {
    throw new Error('Unauthorized');
  }

  return user;
}