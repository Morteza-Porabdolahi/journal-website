import { Vazirmatn } from 'next/font/google';
import { Toaster } from 'sonner';

import styles from './admin.module.css';
import './globals.css';

import { requireAdmin } from '@/src/lib/auth';
import { logoutAction } from './actions';

import AdminNav from './components/AdminNav';

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
                        <AdminNav />

                        <form
                            action={logoutAction}
                            className={styles.logoutForm}
                        >
                            <button type="submit" className={styles.logoutBtn}>
                                خروج از حساب
                            </button>
                        </form>
                    </aside>

                    <main className={styles.main}>{children}</main>
                    <Toaster
                        dir="rtl"
                        position="top-left"
                        closeButton
                        toastOptions={{
                            style: {
                                fontFamily: 'inherit',
                                borderRadius: '0.875rem',
                            },
                        }}
                    />
                </div>
            </body>
        </html>
    );
}
