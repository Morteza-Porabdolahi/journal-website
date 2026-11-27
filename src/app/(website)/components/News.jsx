'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SectionHead from './SectionHead';
import styles from './News.module.css';

const Arrow = () => (
    <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M9 2L4 7l5 5" />
    </svg>
);
const Pin = () => (
    <svg
        className={styles.i}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);
const Clock = () => (
    <svg
        className={styles.i}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </svg>
);

export default function News({ news, next_event }) {
    const trackRef = useRef(null);
    const cardRefs = useRef([]);
    const [cur, setCur] = useState(0);

    useEffect(() => {
        const track = trackRef.current;
        let raf = 0;

        const update = () => {
            const tr = track.getBoundingClientRect().right;
            let best = 0,
                min = Infinity;
            cardRefs.current.forEach((c, i) => {
                if (!c) return;
                const d = Math.abs(c.getBoundingClientRect().right - tr);
                if (d < min) {
                    min = d;
                    best = i;
                }
            });
            setCur(best);
        };
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(update);
        };

        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', update);
        update();
        return () => {
            cancelAnimationFrame(raf);
            track.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', update);
        };
    }, []);

    const goTo = (i) => {
        i = Math.max(0, Math.min(news.length - 1, i));
        const d =
            cardRefs.current[i].getBoundingClientRect().right -
            trackRef.current.getBoundingClientRect().right;
        trackRef.current.scrollBy({ left: d, behavior: 'smooth' });
    };

    return (
        <section
            id="news"
            className={styles.news}
            aria-label="اخبار و رویدادها"
        >
            <SectionHead title="اخبار و رویدادها" className={styles.sh}>
                {/* <Link className={styles.all} href="#all-news">
                    مشاهده همه
                </Link> */}
            </SectionHead>

            <section className={styles.next}>
                <div className={styles.bigdate}>
                    <b>{next_event.day}</b>
                    <span>{next_event.month}</span>
                </div>
                <div className={styles.nextbody}>
                    <span className={styles.tag}>{next_event.tag}</span>
                    <h3>{next_event .title}</h3>
                    <div className={styles.meta}>
                        <span>
                            <Clock />
                            {next_event.time}
                        </span>
                        <span>
                            <Pin />
                            {next_event.place}
                        </span>
                    </div>
                </div>
                {/* <span className={styles.cta}>
                    ثبت‌نام و جزئیات <Arrow />
                </span> */}
            </section>

            <div className={styles.grid} ref={trackRef}>
                {news.map((n, i) => (
                    <Link
                        key={n.id}
                        href={n.href}
                        className={styles.card}
                        ref={(el) => (cardRefs.current[i] = el)}
                    >
                        <div className={styles.thumb}>
                            <div
                                className={styles.ph}
                                style={{ backgroundImage: `url("${n.img}")` }}
                            />
                            <span className={styles.tag}>{n.cat}</span>
                            <div className={styles.cdate}>
                                <b>{n.day}</b>
                                <span>{n.month}</span>
                            </div>
                        </div>
                        <div className={styles.body}>
                            <h4>{n.title}</h4>
                            <p>{n.text}</p>
                            <div className={styles.foot}>
                                <span className={styles.pl}>
                                    <Pin />
                                    <b>{n.place}</b>
                                </span>
                                <span className={styles.go}>
                                    <Arrow />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.ctrl}>
                <div className={styles.dots}>
                    {news.map((n, i) => (
                        <button
                            key={n.id}
                            type="button"
                            className={`${styles.dot} ${i === cur ? styles.active : ''}`}
                            aria-label={`خبر ${i + 1}`}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>
                <div className={styles.arrows}>
                    <button
                        type="button"
                        className={styles.arr}
                        aria-label="قبلی"
                        disabled={cur === 0}
                        onClick={() => goTo(cur - 1)}
                    >
                        <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 2l5 5-5 5" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className={styles.arr}
                        aria-label="بعدی"
                        disabled={cur === news.length - 1}
                        onClick={() => goTo(cur + 1)}
                    >
                        <Arrow />
                    </button>
                </div>
            </div>
        </section>
    );
}
