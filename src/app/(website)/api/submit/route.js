import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['zip', 'rar'];

const esc = (s = '') =>
    String(s).replace(
        /[&<>"']/g,
        (c) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[c]
    );

const bad = (msg, status = 400) =>
    NextResponse.json({ error: msg }, { status });

export async function POST(request) {
    let data;
    try {
        data = await request.formData();
    } catch {
        return bad('درخواست نامعتبر است');
    }

    if (data.get('website')) return NextResponse.json({ ok: true });

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const title = String(data.get('title') || '').trim();
    const category = String(data.get('category') || '').trim();
    const studentId = String(data.get('studentId') || '').trim();
    const summary = String(data.get('summary') || '').trim();
    const file = data.get('file');

    if (!name || !title || !category || !/^\S+@\S+\.\S+$/.test(email)) {
        return bad('اطلاعات فرم ناقص است');
    }
    if (!file || typeof file === 'string')
        return bad('فایل مقاله ارسال نشده است');

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) return bad('فرمت فایل مجاز نیست');
    if (file.size > MAX_BYTES) return bad('حجم فایل زیاد است', 413);

    const buffer = Buffer.from(await file.arrayBuffer());

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    try {
        await transporter.sendMail({
            from: `"نشریه کیمیا" <${process.env.SMTP_USER}>`,
            to: process.env.MAIL_TO,
            replyTo: email,
            subject: `مقاله جدید: ${title}`,
            html: `
        <div dir="rtl" style="font-family:Tahoma,sans-serif;line-height:2">
          <h2>مقاله جدید برای نشریه کیمیا</h2>
          <p><b>نام:</b> ${esc(name)}</p>
          <p><b>شماره دانشجویی:</b> ${esc(studentId) || '—'}</p>
          <p><b>ایمیل:</b> ${esc(email)}</p>
          <p><b>دسته:</b> ${esc(category)}</p>
          <p><b>عنوان:</b> ${esc(title)}</p>
          <p><b>چکیده:</b><br>${esc(summary).replace(/\n/g, '<br>') || '—'}</p>
        </div>`,
            attachments: [{ filename: file.name, content: buffer }],
        });
    } catch (err) {
        console.error('mail error:', err);
        return bad('ارسال ایمیل انجام نشد', 500);
    }

    return NextResponse.json({ ok: true });
}
