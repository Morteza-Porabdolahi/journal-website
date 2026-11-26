import Link from 'next/link';
import { Vazirmatn } from 'next/font/google';

import styles from './admin.module.css';
import './globals.css';

import { requireAdmin } from '@/src/lib/auth';
import { logoutAction } from './actions';

const vazir = Vazirmatn({
    subsets: ['arabic', 'latin'],
    weight: ['400', '500', '700', '800'],
    variable: '--font-vazir',
    display: 'swap',
});

export const metadata = {
    title: 'پنل مدیریت نشریه کیمیا',
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
    await requireAdmin();

    return (
        <html lang="fa" dir="rtl" className={vazir.variable}>
            <body>
                <div className={styles.shell}>
                    <aside className={styles.sidebar}>
                        <div className={styles.brand}>پنل مدیریت کیمیا</div>
                        <Link href="/admin" className={styles.navLink}>
                            نمای کلی
                        </Link>
                        <Link href="/admin/members" className={styles.navLink}>
                            اعضا
                        </Link>
                        <Link href="/admin/issues" className={styles.navLink}>
                            شماره‌های نشریه
                        </Link>
                        <Link href="/admin/news" className={styles.navLink}>
                            اخبار و رویداد پیش‌رو
                        </Link>
                        <Link href="/admin/awards" className={styles.navLink}>
                            افتخارات و جوایز
                        </Link>
                        <Link href="/" className={styles.navLink}>
                            مشاهده سایت اصلی ↗
                        </Link>

                        <form action={logoutAction} className={styles.logoutForm}>
                            <button type="submit" className={styles.logoutBtn}>
                                خروج از حساب
                            </button>
                        </form>
                    </aside>

                    <main className={styles.main}>{children}</main>
                </div>
            </body>
        </html>
    );
}
