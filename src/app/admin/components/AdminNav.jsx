'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'نمای کلی', exact: true },
  { href: '/admin/members', label: 'اعضا' },
  { href: '/admin/issues', label: 'شماره‌های نشریه' },
  { href: '/admin/news', label: 'اخبار و رویداد پیش‌رو' },
  { href: '/admin/awards', label: 'افتخارات و جوایز' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.navList} aria-label="منوی مدیریت">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}