'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Banner.module.css';

const IMAGES = [
    '/images/hero.jpg',
    '/images/hero.jpg',
    '/images/hero.jpg',
    '/images/hero.jpg',
];

const INTERVAL = 4000;

export default function Banner() {
    const [index, setIndex] = useState(0);
    const startX = useRef(0);
    const count = IMAGES.length;

    const go = (i) => setIndex((i + count) % count);

    useEffect(() => {
        const timer = setInterval(
            () => setIndex((i) => (i + 1) % count),
            INTERVAL
        );
        return () => clearInterval(timer);
    }, [index, count]);

    const onTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    };

    return (
        <section
            className={styles.banner}
            aria-roledescription="carousel"
            aria-label="بنر نشریه دانشجویی"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div
                className={styles.track}
                style={{ transform: `translateX(${-index * 100}%)` }}
            >
                {IMAGES.map((src, i) => (
                    <div
                        key={i}
                        className={styles.img}
                        style={{ backgroundImage: `url("${src}")` }}
                    />
                ))}
            </div>

            <div className={styles.overlay} />
            <div className={styles.pattern} />

            <svg
                className={styles.deco}
                viewBox="0 0 920 330"
                preserveAspectRatio="xMaxYMid slice"
                aria-hidden="true"
            >
                <g fill="none" stroke="#FFBA3B">
                    <circle cx="900" cy="30" r="95" strokeOpacity=".4" />
                    <circle cx="900" cy="30" r="62" strokeOpacity=".2" />
                    <circle cx="650" cy="330" r="120" strokeOpacity=".3" />
                </g>
            </svg>

            <div className={styles.content}>
                <span className={styles.badge}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="8" fill="currentColor" />
                    </svg>
                    نشریه دانشگاه تبریز
                </span>

                <h1>
                    <span className={styles.w}>کیمیا،</span>{' '}
                    <span className={styles.g}>صدای دانشجویان</span>{' '}
                    <span className={styles.w}>مهندسی شیمی و نفت</span>
                </h1>

                <p>
                    مقاله‌ها، گزارش‌ها و دستاوردهای دانشکده مهندسی شیمی و نفت را
                    در یک‌جا بخوانید و دانلود کنید.
                </p>

                <div className={styles.actions}>
                    <Link
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        href="#journals"
                    >
                        مشاهده آرشیو شماره‌ها
                    </Link>
                    <Link
                        className={`${styles.btn} ${styles.btnGhost}`}
                        href="#about"
                    >
                        درباره نشریه
                    </Link>
                </div>
            </div>

            <div className={styles.dots}>
                {IMAGES.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`${styles.dot} ${i === index ? styles.active : ''}`}
                        aria-label={`تصویر ${i + 1}`}
                        onClick={() => go(i)}
                    />
                ))}
            </div>

            <div className={styles.arrows}>
                <button
                    type="button"
                    className={styles.arrow}
                    aria-label="قبلی"
                    onClick={() => go(index - 1)}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 6l-6 6 6 6" />
                    </svg>
                </button>
                <button
                    type="button"
                    className={styles.arrow}
                    aria-label="بعدی"
                    onClick={() => go(index + 1)}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 6l6 6-6 6" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
