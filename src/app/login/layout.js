import { Vazirmatn } from 'next/font/google';

import './globals.css';

const vazir = Vazirmatn({
    subsets: ['arabic', 'latin'],
    weight: ['400', '500', '700', '800'],
    variable: '--font-vazir',
    display: 'swap',
});

export const metadata = {
    title: 'ورود به پنل مدیریت نشریه',
    robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
    return (
        <html lang="fa" dir="rtl" className={vazir.variable}>
            <body>{children}</body>
        </html>
    );
}
