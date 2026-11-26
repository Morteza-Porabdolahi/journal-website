'use client';

import { useState, useRef } from 'react';
import SectionHead from './SectionHead';
import styles from './SubmitArticle.module.css';

const MAX_MB = 5;
const ALLOWED = ['rar', 'zip'];

const CATEGORIES = [
    'مقاله علمی',
    'گزارش',
    'مصاحبه',
    'یادداشت و تحلیل',
    'معرفی کتاب یا نرم‌افزار',
];

const STEPS = [
    { t: 'ارسال مقاله', d: 'فرم را پر کنید و فایل خود را بفرستید.' },
    {
        t: 'داوری و ویرایش',
        d: 'تیم تحریریه و دبیر علمی مطلب را بررسی می‌کنند.',
    },
    { t: 'انتشار', d: 'مقاله تأییدشده در شماره بعدی نشریه چاپ می‌شود.' },
];

const RULES = [
    'فایل در قالب ZIP یا RAR و حداکثر ۵ مگابایت باشد.',
    'متن اصیل باشد و منابع در پایان مقاله ذکر شود.',
    'نام و مشخصات نویسنده در فرم درج شود.',
    'توجه داشته باشید که فایل فشرده ارسالی شامل فایل ورد و پی دی اف مقاله باشد.',
];

const Check = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
);

export default function SubmitArticle() {
    const [file, setFile] = useState(null);
    const [drag, setDrag] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle');
    const inputRef = useRef(null);

    const pick = (f) => {
        if (!f) return;
        const ext = f.name.split('.').pop().toLowerCase();
        if (!ALLOWED.includes(ext))
            return setError('فقط فایل‌های RAR و ZIP پذیرفته می‌شود.');
        if (f.size > MAX_MB * 1024 * 1024)
            return setError(`حجم فایل باید کمتر از ${MAX_MB} مگابایت باشد.`);
        setError('');
        setFile(f);
    };

    const clearFile = () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        pick(e.dataTransfer.files?.[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError('لطفاً فایل مقاله را انتخاب کنید.');

        const data = new FormData(e.currentTarget);
        data.set('file', file);
        setStatus('sending');
        setError('');

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                body: data,
            });
            if (!res.ok) throw new Error();
            setStatus('done');
        } catch {
            setStatus('idle');
            setError('ارسال انجام نشد. دوباره تلاش کنید.');
        }
    };

    const reset = () => {
        setStatus('idle');
        clearFile();
    };

    return (
        <section id="submit" className={styles.submit} aria-label="ارسال مقاله">
            <SectionHead
                title="ارسال مقاله"
                subtitle="صدای شما در شماره بعدی کیمیا"
                className={styles.sh}
            />

            <div className={styles.grid}>
                <aside className={styles.info}>
                    <div className={styles.shapes} aria-hidden="true">
                        <i className={styles.arc1} />
                        <i className={styles.arc2} />
                        <svg
                            className={styles.wave}
                            viewBox="0 0 400 160"
                            preserveAspectRatio="none"
                        >
                            <path d="M0 70 C70 20 140 20 200 70 S330 120 400 60 V160 H0 Z" />
                            <path d="M0 105 C80 70 150 75 210 108 S340 140 400 100 V160 H0 Z" />
                        </svg>
                    </div>
                    <span className={styles.badge}>فراخوان مقاله</span>
                    <h3>نوشته‌هایتان را با ما به اشتراک بگذارید</h3>
                    <p>
                        مقاله، گزارش یا تجربه‌های دانشجویی خود را در حوزه مهندسی
                        شیمی و نفت برای ما بفرستید.
                    </p>

                    <ol className={styles.steps}>
                        {STEPS.map((s, i) => (
                            <li key={s.t}>
                                <span className={styles.num}>{i + 1}</span>
                                <div>
                                    <b>{s.t}</b>
                                    <span>{s.d}</span>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <ul className={styles.rules}>
                        {RULES.map((r) => (
                            <li key={r}>
                                <Check />
                                {r}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className={styles.card}>
                    {status === 'done' ? (
                        <div className={styles.done} role="status">
                            <span className={styles.doneIc}>
                                <Check />
                            </span>
                            <h3>مقاله شما دریافت شد</h3>
                            <p>
                                از همکاری‌تان سپاسگزاریم. نتیجه بررسی از طریق
                                ایمیل به شما اطلاع داده می‌شود.
                            </p>
                            <button
                                type="button"
                                className={styles.btn}
                                onClick={reset}
                            >
                                ارسال مقاله دیگر
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} noValidate={false}>
                            <div className={styles.fields}>
                                <label className={styles.f}>
                                    <span>نام و نام خانوادگی</span>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="مثلاً علی رضایی"
                                    />
                                </label>

                                <label className={styles.f}>
                                    <span>شماره دانشجویی</span>
                                    <input
                                        name="studentId"
                                        type="text"
                                        inputMode="numeric"
                                        dir="ltr"
                                        placeholder="۴۰۰۱۲۳۴۵۶"
                                    />
                                </label>

                                <label className={styles.f}>
                                    <span>ایمیل</span>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        dir="ltr"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                    />
                                </label>

                                <label className={styles.f}>
                                    <span>دسته مقاله</span>
                                    <select
                                        name="category"
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            انتخاب کنید
                                        </option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className={`${styles.f} ${styles.full}`}>
                                    <span>عنوان مقاله</span>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="عنوان مقاله خود را بنویسید"
                                    />
                                </label>

                                <label className={`${styles.f} ${styles.full}`}>
                                    <span>چکیده کوتاه</span>
                                    <textarea
                                        name="summary"
                                        rows={4}
                                        maxLength={600}
                                        placeholder="در چند جمله موضوع مقاله را توضیح دهید"
                                    />
                                </label>

                                <div className={`${styles.f} ${styles.full}`}>
                                    <span>فایل مقاله</span>
                                    {file ? (
                                        <div className={styles.fileRow}>
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
                                                <path d="M14 3v5h5" />
                                            </svg>
                                            <div className={styles.fileName}>
                                                <b>{file.name}</b>
                                                <small>
                                                    {(
                                                        file.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{' '}
                                                    مگابایت
                                                </small>
                                            </div>
                                            <button
                                                type="button"
                                                className={styles.rm}
                                                onClick={clearFile}
                                                aria-label="حذف فایل"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            className={`${styles.drop} ${drag ? styles.dragOver : ''}`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setDrag(true);
                                            }}
                                            onDragLeave={() => setDrag(false)}
                                            onDrop={onDrop}
                                        >
                                            <input
                                                ref={inputRef}
                                                type="file"
                                                accept=".rar,.zip"
                                                onChange={(e) =>
                                                    pick(e.target.files?.[0])
                                                }
                                            />
                                            <span className={styles.dropIc}>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
                                                </svg>
                                            </span>
                                            <b>
                                                فایل را اینجا رها کنید یا کلیک
                                                کنید
                                            </b>
                                            <small>
                                                ZIP یا RAR تا {MAX_MB} مگابایت
                                            </small>
                                        </label>
                                    )}
                                </div>

                                <input
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className={styles.hp}
                                    aria-hidden="true"
                                />

                                <label
                                    className={`${styles.agree} ${styles.full}`}
                                >
                                    <input
                                        name="agree"
                                        type="checkbox"
                                        required
                                    />
                                    <span>
                                        تأیید می‌کنم این مقاله اثر خودم است و با
                                        ویرایش آن توسط تحریریه موافقم.
                                    </span>
                                </label>
                            </div>

                            {error && (
                                <p className={styles.err} role="alert">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={styles.btn}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending'
                                    ? 'در حال ارسال...'
                                    : 'ارسال مقاله'}
                                <span className={styles.ic}>
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        aria-hidden="true"
                                    >
                                        <path d="M9 2L4 7l5 5" />
                                    </svg>
                                </span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
