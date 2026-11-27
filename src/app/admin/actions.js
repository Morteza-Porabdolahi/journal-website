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
    const ext = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
        .from('journal-media')
        .upload(filePath, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage
        .from('journal-media')
        .getPublicUrl(filePath);
    return data.publicUrl;
}

// --- Auth ---
export async function logoutAction() {
    try {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();

        redirect('/');
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

// --- Members ---
export async function addMember(formData) {
    await requireAdmin();

    try {
        const name = formData.get('name')?.toString().trim();
        const role = formData.get('role')?.toString().trim();

        if (!name || !role) {
            return { ok: false, message: 'نام و سمت عضو الزامی است!' };
        }

        const uploadedPhoto = await uploadToStorage(
            formData.get('photoFile'),
            'members'
        );
        const photo =
            uploadedPhoto || formData.get('photoUrl')?.toString().trim() || '';

        await db.insert(members).values({
            name,
            role,
            bio: formData.get('bio')?.toString().trim() || '',
            photo,
            tg: formData.get('tg')?.toString().trim() || '',
            ig: formData.get('ig')?.toString().trim() || '',
            mail: formData.get('mail')?.toString().trim() || '',
            sortOrder: Number(formData.get('sortOrder')) || 0,
        });

        revalidatePath('/');
        return { ok: true, message: 'عضو جدید با موفقیت ثبت شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'خطا در ثبت عضو. لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function deleteMember(formData) {
    await requireAdmin();

    try {
        const id = Number(formData.get('id'));
        await db.delete(members).where(eq(members.id, id));

        revalidatePath('/');
        return { ok: true, message: 'عضو مورد نظر حذف شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

// --- Issues ---
export async function addIssue(formData) {
    await requireAdmin();

    try {
        const uploadedCover = await uploadToStorage(
            formData.get('coverFile'),
            'issues/covers'
        );
        const uploadedPdf = await uploadToStorage(
            formData.get('pdfFile'),
            'issues/pdfs'
        );

        const title = formData.get('title')?.toString().trim();
        const cover =
            uploadedCover || formData.get('coverUrl')?.toString().trim() || '';
        const file =
            uploadedPdf || formData.get('pdfUrl')?.toString().trim() || '';

        if (!title || !cover || !file) {
            return {
                ok: false,
                message: 'عنوان، تصویر جلد و فایل PDF الزامی است!',
            };
        }

        await db.insert(issues).values({
            title,
            cover,
            file,
        });

        revalidatePath('/');
        return {
            ok: true,
            message: 'جلد جدید با موفقیت ثبت شد.',
        };
    } catch (err) {
        return {
            ok: false,
            message: 'خطا در ثبت عضو. لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function deleteIssue(formData) {
    await requireAdmin();

    try {
        const id = Number(formData.get('id'));
        await db.delete(issues).where(eq(issues.id, id));

        revalidatePath('/');
        return { ok: true, message: 'جلد مورد نظر حذف شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

// --- News & Next Event ---
export async function addNews(formData) {
    await requireAdmin();

    try {
        const uploadedImg = await uploadToStorage(
            formData.get('imgFile'),
            'news'
        );
        const img =
            uploadedImg ||
            formData.get('imgUrl')?.toString().trim() ||
            '/images/hero.jpg';

        const day = formData.get('day')?.toString().trim();
        const month = formData.get('month')?.toString().trim();
        const title = formData.get('title')?.toString().trim();
        const text = formData.get('text')?.toString().trim();

        if (!day || !month || !title || !text) {
            return {
                ok: false,
                message: 'روز، ماه، عنوان و متن خبر الزامی است!',
            };
        }

        await db.insert(news).values({
            cat: formData.get('cat')?.toString().trim() || 'خبر',
            day,
            month,
            title,
            text,
            place:
                formData.get('place')?.toString().trim() ||
                'دانشکده مهندسی شیمی و نفت',
            img,
            href: formData.get('href')?.toString().trim() || '#',
        });

        revalidatePath('/');
        return {
            ok: true,
            message: 'خبر جدید با موفقیت ثبت شد.',
        };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function deleteNews(formData) {
    await requireAdmin();

    try {
        const id = Number(formData.get('id'));
        await db.delete(news).where(eq(news.id, id));
        revalidatePath('/');

        return { ok: true, message: 'خبر مورد نظر حذف شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function updateNextEvent(formData) {
    await requireAdmin();

    try {
        const day = formData.get('day')?.toString().trim();
        const month = formData.get('month')?.toString().trim();
        const title = formData.get('title')?.toString().trim();
        const time = formData.get('time')?.toString().trim();
        const place = formData.get('place')?.toString().trim();

        if (!day || !month || !title || !time || !place) {
            return {
                ok: false,
                message: 'روز، ماه، عنوان، ساعت و محل رویداد الزامی است!',
            };
        }

        const payload = {
            tag: formData.get('tag')?.toString().trim() || 'رویداد پیش‌رو',
            day,
            month,
            title,
            time,
            place,
            href: formData.get('href')?.toString().trim() || '#',
        };

        const existing = await db.select().from(nextEvent).limit(1);
        if (existing.length > 0) {
            await db
                .update(nextEvent)
                .set(payload)
                .where(eq(nextEvent.id, existing[0].id));
        } else {
            await db.insert(nextEvent).values(payload);
        }

        revalidatePath('/');
        return {
            ok: true,
            message: 'رویداد پیش‌رو با موفقیت به‌روزرسانی شد.',
        };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

// --- Awards ---
export async function addAward(formData) {
    await requireAdmin();

    try {
        const year = formData.get('year')?.toString().trim();
        const type = formData.get('type')?.toString().trim();
        const title = formData.get('title')?.toString().trim();
        const text = formData.get('text')?.toString().trim();
        const org = formData.get('org')?.toString().trim();

        if (!year || !type || !title || !text || !org) {
            return {
                ok: false,
                message: 'لطفا اطلاعات مورد نیاز را تکمیل کنید!',
            };
        }

        await db.insert(awards).values({
            year,
            icon: formData.get('icon')?.toString().trim() || 'trophy',
            type,
            best: formData.get('best') === 'on',
            title,
            text,
            org,
        });

        revalidatePath('/');
        return {
            ok: true,
            message: 'مورد جدید با موفقیت ثبت شد.',
        };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function deleteAward(formData) {
    await requireAdmin();

    try {
        const id = Number(formData.get('id'));
        await db.delete(awards).where(eq(awards.id, id));
        revalidatePath('/');

        return { ok: true, message: 'مطلب مورد نظر حذف شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}
