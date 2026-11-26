import Link from 'next/link';
import styles from './Footer.module.css';
import Image from 'next/image';

const QUICK = [
    { label: 'معرفی نشریه', href: '#about' },
    { label: 'مجلات نشریه', href: '#journals' },
    { label: 'اخبار و رویدادها', href: '#news' },
    { label: 'افتخارات', href: '#awards' },
    { label: 'اعضای ویژه', href: '#fm' },
];

const CONTACT = [
    {
        icon: 'pin',
        text: 'تبریز، بلوار ۲۹ بهمن، دانشگاه تبریز، دانشکده مهندسی شیمی و نفت',
    },
    {
        icon: 'phone',
        text: '۰۴۱-۳۳۳۹۳۰۰۰',
        href: 'tel:+984133393000',
        ltr: true,
    },
    {
        icon: 'mail',
        text: 'chemengineeringjournal@gmail.com',
        href: 'mailto:chemengineeringjournal@gmail.com',
        ltr: true,
    },
];

const SOCIAL = [
    { key: 'tg', label: 'تلگرام', href: '#' },
    { key: 'ig', label: 'اینستاگرام', href: '#' },
    {
        key: 'mail',
        label: 'ایمیل',
        href: 'mailto:chemengineeringjournal@gmail.com',
    },
];

const ICONS = {
    pin: (
        <>
            <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    phone: (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M3.5 7.5l8.5 6 8.5-6" />
        </>
    ),
    tg: (
        <>
            <path d="M21.5 3.5L2.5 11l6 2.2 2.3 6.3 3-4 5 3.7z" />
            <path d="M8.5 13.2l9-6.2" />
        </>
    ),
    ig: (
        <>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
        </>
    ),
    up: <path d="M6 15l6-6 6 6" />,
    arrow: <path d="M9 2L4 7l5 5" />,
};

const Icon = ({ name, size }) => (
    <svg
        viewBox={name === 'arrow' ? '0 0 14 14' : '0 0 24 24'}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {ICONS[name]}
    </svg>
);

export default function Footer() {
    const year = new Date().toLocaleDateString('fa-IR', { year: 'numeric' });

    return (
        <footer id="contact" className={styles.footer}>
            <div className={styles.cta}>
                <div className={styles.ctaText}>
                    <h3>آیا در زمینه های دیگری می‌خواهید همکاری کنید؟</h3>
                    <p>
                        برای ارتباط با نشریه انجمن دانشکده مهندسی شیمی و نفت روی
                        لینک روبه‌رو کلیک کنید.
                    </p>
                </div>
                <a
                    className={styles.ctaBtn}
                    href="mailto:chemengineeringjournal@gmail.com"
                >
                    ارتباط با نشریه
                    <span className={styles.ctaIc}>
                        <Icon name="arrow" size={10} />
                    </span>
                </a>
            </div>

            <div className={styles.body}>
                <div className={styles.bg} aria-hidden="true" />

                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Image
                            className={styles.logo}
                            width={85}
                            height={85}
                            src="/images/association_logo.png"
                            alt="Association logo"
                        />
                        <span className={styles.badge}>
                            نشریه دانشگاه تبریز
                        </span>
                        <p>
                            «کیمیا» نشریه دانشجویی دانشکده مهندسی شیمی و نفت
                            دانشگاه تبریز است؛ فضایی برای دیده‌شدن مقاله‌ها،
                            گزارش‌ها و ایده‌های دانشجویان.
                        </p>
                        <div className={styles.social}>
                            {SOCIAL.map((s) => (
                                <a
                                    key={s.key}
                                    href={s.href}
                                    aria-label={s.label}
                                >
                                    <Icon name={s.key} size={17} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <nav className={styles.col} aria-label="دسترسی سریع">
                        <h4>دسترسی سریع</h4>
                        <ul>
                            {QUICK.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href}>{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.col}>
                        <h4>ارتباط با ما</h4>
                        <ul className={styles.contact}>
                            {CONTACT.map((c) => (
                                <li key={c.icon}>
                                    <span className={styles.cIc}>
                                        <Icon name={c.icon} size={15} />
                                    </span>
                                    {c.href ? (
                                        <a
                                            href={c.href}
                                            className={c.ltr ? styles.ltr : ''}
                                        >
                                            {c.text}
                                        </a>
                                    ) : (
                                        <span>{c.text}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {year} نشریه دانشجویی کیمیا. تمامی حقوق محفوظ است.</p>
                    <Link href="#" className={styles.top}>
                        بازگشت به بالا
                        <span>
                            <Icon name="up" size={14} />
                        </span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
