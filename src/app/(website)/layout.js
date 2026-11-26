import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://your-domain.ir'), 

  title: {
    default: 'کیمیا | نشریه دانشجویی دانشکده مهندسی شیمی و نفت دانشگاه تبریز',
  },

description:
  'کیمیا، نشریه دانشجویی دانشکده مهندسی شیمی و نفت دانشگاه تبریز. مقالات علمی، گزارش‌ها و دستاوردهای دانشجویی را بخوانید و دانلود کنید.',

  keywords: [
    'نشریه کیمیا',
    'نشریه دانشجویی',
    'دانشگاه تبریز',
    'مهندسی شیمی',
    'مهندسی نفت',
    'دانلود نشریه',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'کیمیا | نشریه دانشجویی مهندسی شیمی و نفت',
    description: 'مقاله‌ها، گزارش‌ها و مجلات نشریه دانشجویی کیمیا، دانشگاه تبریز.',
    url: '/',
    siteName: 'نشریه کیمیا',
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'نشریه کیمیا' }],
  },


  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <Header />
        {children}
        <Footer />         
      </body>
    </html>
  );
}