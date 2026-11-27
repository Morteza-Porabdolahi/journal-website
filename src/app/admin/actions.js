'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/src/db/index';
import { members, issues, news, nextEvent, awards } from '@/src/db/schema';
import { requireAdmin } from '@/src/lib/auth';
import { createSupabaseServerClient } from '@/src/lib/supabase-server';

async function uploadToStorage(file, folder) {
  if (!file || typeof file === 'string' || file.size === 0) return '';

  const supabase = await createSupabaseServerClient();
  const extension = file.name.split('.').pop();
  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error } = await supabase.storage
    .from('journal-media')
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from('journal-media').getPublicUrl(filePath);
  return data.publicUrl;
}

// --- Auth ---
export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}

// --- Members ---
export async function addMember(formData) {
  await requireAdmin();

  const uploadedPhoto = await uploadToStorage(formData.get('photoFile'), 'members');
  const photo = uploadedPhoto || formData.get('photoUrl')?.toString().trim() || '';

  await db.insert(members).values({
    name: formData.get('name')?.toString().trim(),
    role: formData.get('role')?.toString().trim(),
    bio: formData.get('bio')?.toString().trim() || '',
    photo,
    tg: formData.get('tg')?.toString().trim() || '',
    ig: formData.get('ig')?.toString().trim() || '',
    mail: formData.get('mail')?.toString().trim() || '',
    sortOrder: Number(formData.get('sortOrder')) || 0,
  });

  revalidatePath('/');
}

export async function deleteMember(formData) {
  await requireAdmin();
  
  const id = Number(formData.get('id'));
  await db.delete(members).where(eq(members.id, id));

  revalidatePath('/');
}

// --- Issues ---
export async function addIssue(formData) {
  await requireAdmin();

  const uploadedCover = await uploadToStorage(formData.get('coverFile'), 'issues/covers');
  const uploadedPdf = await uploadToStorage(formData.get('pdfFile'), 'issues/pdfs');

  const cover = uploadedCover || formData.get('coverUrl')?.toString().trim() || '';
  const file = uploadedPdf || formData.get('pdfUrl')?.toString().trim() || '';

  await db.insert(issues).values({
    title: formData.get('title')?.toString().trim(),
    cover,
    file,
  });

  revalidatePath('/');
}

export async function deleteIssue(formData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  await db.delete(issues).where(eq(issues.id, id));
  revalidatePath('/');
}

// --- News & Next Event ---
export async function addNews(formData) {
  await requireAdmin();

  const uploadedImg = await uploadToStorage(formData.get('imgFile'), 'news');
  const img = uploadedImg || formData.get('imgUrl')?.toString().trim() || '/images/hero.jpg';

  await db.insert(news).values({
    cat: formData.get('cat')?.toString().trim() || 'خبر',
    day: formData.get('day')?.toString().trim(),
    month: formData.get('month')?.toString().trim(),
    title: formData.get('title')?.toString().trim(),
    text: formData.get('text')?.toString().trim(),
    place: formData.get('place')?.toString().trim() || '',
    img,
    href: formData.get('href')?.toString().trim() || '#',
  });

  revalidatePath('/');
}

export async function deleteNews(formData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  await db.delete(news).where(eq(news.id, id));
  revalidatePath('/');
}

export async function updateNextEvent(formData) {
  await requireAdmin();

  const payload = {
    tag: formData.get('tag')?.toString().trim() || 'رویداد پیش‌رو',
    day: formData.get('day')?.toString().trim(),
    month: formData.get('month')?.toString().trim(),
    title: formData.get('title')?.toString().trim(),
    time: formData.get('time')?.toString().trim(),
    place: formData.get('place')?.toString().trim(),
    href: formData.get('href')?.toString().trim() || '#',
  };

  const existing = await db.select().from(nextEvent).limit(1);
  if (existing.length > 0) {
    await db.update(nextEvent).set(payload).where(eq(nextEvent.id, existing[0].id));
  } else {
    await db.insert(nextEvent).values(payload);
  }

  revalidatePath('/');
}

// --- Awards ---
export async function addAward(formData) {
  await requireAdmin();

  await db.insert(awards).values({
    year: formData.get('year')?.toString().trim(),
    icon: formData.get('icon')?.toString().trim() || 'trophy',
    type: formData.get('type')?.toString().trim() || 'جایزه',
    best: formData.get('best') === 'on',
    title: formData.get('title')?.toString().trim(),
    text: formData.get('text')?.toString().trim(),
    org: formData.get('org')?.toString().trim(),
  });

  revalidatePath('/');
}

export async function deleteAward(formData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  await db.delete(awards).where(eq(awards.id, id));
  revalidatePath('/');
}