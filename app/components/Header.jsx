'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 761px)');
    const onMq = (e) => { if (e.matches) setOpen(false); };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      ref={headerRef}
      className={`${styles.siteHeader} ${open ? styles.open : ''}`}
    >
      <div className={styles.hbar}>
        <Link href="/" className={styles.logo} aria-label="صفحه اصلی" />

        <nav className={styles.nav} id="nav" aria-label="منوی اصلی" onClick={(e) => {
          if (e.target.closest('a')) close();
        }}>
          <Link href="#journals">مجلات نشریه</Link>
          <Link href="#news">اخبار و رویداد ها</Link>
          <Link href="#about">درباره ما</Link>
          <Link href="#contact" className={styles.contact}>تماس با ما</Link>
        </nav>

        <button
          className={styles.burger}
          type="button"
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}