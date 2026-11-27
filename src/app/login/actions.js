'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/src/lib/supabase-server';

// const ALLOWED_ADMINS = (process.env.ADMIN_EMAILS || '')
//   .split(',')
//   .map((e) => e.trim().toLowerCase())

export async function loginAction(_, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'لطفاً ایمیل و رمز عبور را وارد کنید.' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: 'ایمیل یا رمز عبور نادرست است.' };
  }

  // if (
  //   ALLOWED_ADMINS.length > 0 &&
  //   !ALLOWED_ADMINS.includes(data.user.email?.toLowerCase())
  // ) {
  //   await supabase.auth.signOut();
  //   return { error: 'شما دسترسی مدیریت به این پنل را ندارید.' };
  // }

  redirect('/admin');
}