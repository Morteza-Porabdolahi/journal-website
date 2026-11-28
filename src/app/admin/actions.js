'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/src/db/index';
import { members, issues, news, nextEvent, awards } from '@/src/db/schema';
import { requireAdmin } from '@/src/lib/auth';
import { createSupabaseServerClient } from '@/src/lib/supabase-server';
import { toPersianDigits } from '@/src/lib/digits';

const BUCKET = 'journal-media';
const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

async function deleteFromStorage(urls) {
    const list = Array.isArray(urls) ? urls : [urls];

    const paths = list
        .filter((url) => typeof url === 'string' && url.includes(PUBLIC_PREFIX))
        .map((url) => {
            const rawPath = url.split(PUBLIC_PREFIX)[1]?.split('?')[0];
            return rawPath ? decodeURIComponent(rawPath) : null;
        })
        .filter(Boolean);

    if (paths.length === 0) return;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage.from(BUCKET).remove(paths);

    if (error) {
        console.error('Storage cleanup failed:', error.message);
    }
}

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
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();

    redirect('/');
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
        const [deleted] = await db
            .delete(members)
            .where(eq(members.id, id))
            .returning({ photo: members.photo });

        if (deleted?.photo) {
            await deleteFromStorage(deleted.photo);
        }

        revalidatePath('/');
        return { ok: true, message: 'عضو مورد نظر حذف شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function updateMember(formData) {
    await requireAdmin();

    let uploadedPhoto = null;

    try {
        const id = Number(formData.get('id'));
        const name = formData.get('name')?.toString().trim();
        const role = formData.get('role')?.toString().trim();

        if (!name || !role) {
            return { ok: false, message: 'نام و سمت عضو الزامی است.' };
        }

        const [existing] = await db
            .select({ photo: members.photo })
            .from(members)
            .where(eq(members.id, id));

        if (!existing) {
            return { ok: false, message: 'عضو مورد نظر پیدا نشد!' };
        }

        const removePhoto = formData.get('removePhoto') === 'on';
        const photoFile = formData.get('photoFile');
        const hasNewFile = photoFile instanceof File && photoFile.size > 0;
        const photoUrlInput = formData.get('photoUrl')?.toString().trim() || '';

        let nextPhoto = existing.photo || '';

        if (hasNewFile) {
            uploadedPhoto = await uploadToStorage(photoFile, 'members');
            nextPhoto = uploadedPhoto;
        } else if (removePhoto) {
            nextPhoto = '';
        } else if (photoUrlInput !== nextPhoto) {
            nextPhoto = photoUrlInput;
        }

        await db
            .update(members)
            .set({
                name,
                role,
                bio: formData.get('bio')?.toString().trim() || '',
                photo: nextPhoto,
                tg: formData.get('tg')?.toString().trim() || '',
                ig: formData.get('ig')?.toString().trim() || '',
                mail: formData.get('mail')?.toString().trim() || '',
                sortOrder: Number(formData.get('sortOrder')) || 0,
            })
            .where(eq(members.id, id));

        // Clean up old file only after Postgres update succeeds
        if (existing.photo && existing.photo !== nextPhoto) {
            await deleteFromStorage(existing.photo);
        }

        revalidatePath('/');
        return { ok: true, message: 'اطلاعات عضو با موفقیت بروزرسانی شد.' };
    } catch (err) {
        // If DB update failed after uploading a new file, remove the orphan
        if (uploadedPhoto) {
            await deleteFromStorage(uploadedPhoto);
        }
        return { ok: false, message: 'خطا در بروزرسانی اطلاعات عضو!' };
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
        const [deleted] = await db
            .delete(issues)
            .where(eq(issues.id, id))
            .returning({ cover: issues.cover, file: issues.file });

        if (deleted) {
            await deleteFromStorage([deleted.cover, deleted.file]);
        }

        revalidatePath('/');
        return { ok: true, message: 'جلد مورد نظر حذف شد.' };
    } catch (err) {
        return {
            ok: false,
            message: 'لطفاً دوباره تلاش کنید!',
        };
    }
}

export async function updateIssue(formData) {
    await requireAdmin();

    const uploadedFiles = [];

    try {
        const id = Number(formData.get('id'));
        const title = formData.get('title')?.toString().trim();

        if (!title) {
            return { ok: false, message: 'عنوان شماره نشریه الزامی است.' };
        }

        const [existing] = await db
            .select({ cover: issues.cover, file: issues.file })
            .from(issues)
            .where(eq(issues.id, id));

        if (!existing) {
            return { ok: false, message: 'شماره مورد نظر پیدا نشد.' };
        }

        const coverFile = formData.get('coverFile');
        const coverUrlInput = formData.get('coverUrl')?.toString().trim() || '';
        const pdfFile = formData.get('pdfFile');
        const fileUrlInput = formData.get('fileUrl')?.toString().trim() || '';

        let nextCover = existing.cover;

        if (coverFile instanceof File && coverFile.size > 0) {
            const uploadedCover = await uploadToStorage(coverFile, 'issues');

            uploadedFiles.push(uploadedCover);
            nextCover = uploadedCover;
        } else if (coverUrlInput && coverUrlInput !== existing.cover) {
            nextCover = coverUrlInput;
        }

        let nextFile = existing.file;

        if (pdfFile instanceof File && pdfFile.size > 0) {
            const uploadedPdf = await uploadToStorage(pdfFile, 'issues');

            uploadedFiles.push(uploadedPdf);
            nextFile = uploadedPdf;
        } else if (fileUrlInput && fileUrlInput !== existing.file) {
            nextFile = fileUrlInput;
        }

        if (!nextCover || !nextFile) {
            return {
                ok: false,
                message: 'تصویر جلد و فایل PDF هر دو الزامی هستند!',
            };
        }

        await db
            .update(issues)
            .set({
                title,
                cover: nextCover,
                file: nextFile,
            })
            .where(eq(issues.id, id));

        const oldFiles = [];

        if (existing.cover && existing.cover !== nextCover) {
            oldFiles.push(existing.cover);
        }

        if (existing.file && existing.file !== nextFile) {
            oldFiles.push(existing.file);
        }

        if (oldFiles.length > 0) {
            await deleteFromStorage(oldFiles);
        }

        revalidatePath('/');
        return { ok: true, message: 'شماره نشریه با موفقیت بروزرسانی شد.' };
    } catch (err) {
        if (uploadedFiles.length > 0) {
            await deleteFromStorage(uploadedFiles);
        }
        return { ok: false, message: 'خطا در بروزرسانی شماره نشریه!' };
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

        const day = toPersianDigits(formData.get('day')?.toString().trim());
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
        const [deleted] = await db
            .delete(news)
            .where(eq(news.id, id))
            .returning({ img: news.img });

        if (deleted?.img) {
            await deleteFromStorage(deleted.img);
        }

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
        const day = toPersianDigits(formData.get('day')?.toString().trim());
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

export async function updateNews(formData) {
    await requireAdmin();

    let uploadedImg = null;

    try {
        const id = Number(formData.get('id'));
        const cat = formData.get('cat')?.toString().trim() || 'خبر';
        const day = toPersianDigits(formData.get('day')?.toString().trim());
        const month = formData.get('month')?.toString().trim();
        const title = formData.get('title')?.toString().trim();
        const text = formData.get('text')?.toString().trim();

        if (!day || !month || !title || !text) {
            return {
                ok: false,
                message: 'عنوان، تاریخ و متن خبر الزامی هستند!',
            };
        }

        const [existing] = await db
            .select({ img: news.img })
            .from(news)
            .where(eq(news.id, id));

        if (!existing) {
            return { ok: false, message: 'خبر مورد نظر پیدا نشد!' };
        }

        const removeImg = formData.get('removeImg') === 'on';
        const imgFile = formData.get('imgFile');
        const hasNewFile = imgFile instanceof File && imgFile.size > 0;
        const imgUrlInput = formData.get('imgUrl')?.toString().trim() || '';

        let nextImg = existing.img || '';

        if (hasNewFile) {
            uploadedImg = await uploadToStorage(imgFile, 'news');
            nextImg = uploadedImg;
        } else if (removeImg) {
            nextImg = '';
        } else if (imgUrlInput !== nextImg) {
            nextImg = imgUrlInput;
        }

        await db
            .update(news)
            .set({
                cat,
                day,
                month,
                title,
                text,
                place: formData.get('place')?.toString().trim() || '',
                img: nextImg,
                href: formData.get('href')?.toString().trim() || '#',
            })
            .where(eq(news.id, id));

        if (existing.img && existing.img !== nextImg) {
            await deleteFromStorage(existing.img);
        }

        revalidatePath('/');
        return { ok: true, message: 'خبر با موفقیت بروزرسانی شد.' };
    } catch (err) {
        if (uploadedImg) {
            await deleteFromStorage(uploadedImg);
        }
        return { ok: false, message: 'خطا در بروزرسانی خبر!' };
    }
}

// --- Awards ---
export async function addAward(formData) {
    await requireAdmin();

    try {
        const year = toPersianDigits(formData.get('year')?.toString().trim());
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

export async function updateAward(formData) {
    await requireAdmin();

    try {
        const id = Number(formData.get('id'));
        const year = toPersianDigits(formData.get('year')?.toString().trim());
        const type = formData.get('type')?.toString().trim();
        const title = formData.get('title')?.toString().trim();
        const text = formData.get('text')?.toString().trim();
        const org = formData.get('org')?.toString().trim();

        if (!year || !type || !title || !text || !org) {
            return {
                ok: false,
                message: 'تکمیل تمام فیلدهای الزامی ضروری است!',
            };
        }

        const [updated] = await db
            .update(awards)
            .set({
                year,
                icon: formData.get('icon')?.toString().trim() || 'trophy',
                type,
                best: formData.get('best') === 'on',
                title,
                text,
                org,
            })
            .where(eq(awards.id, id))
            .returning({ id: awards.id });

        if (!updated) {
            return { ok: false, message: 'مورد انتخاب‌شده پیدا نشد!' };
        }

        revalidatePath('/');
        return { ok: true, message: 'افتخار با موفقیت بروزرسانی شد.' };
    } catch (err) {
        return { ok: false, message: 'خطا در بروزرسانی!' };
    }
}
