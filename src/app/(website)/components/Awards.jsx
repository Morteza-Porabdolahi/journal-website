import SectionHead from './SectionHead';
import { AWARDS } from '../data/awards';
import styles from './Awards.module.css';

const ICONS = {
    trophy: (
        <>
            <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
            <path d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3" />
        </>
    ),
    medal: (
        <>
            <circle cx="12" cy="15" r="5" />
            <path d="M8.5 3h7L14 10.2M9.5 10.2L8.5 3" />
        </>
    ),
    star: (
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    ),
    book: (
        <>
            <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" />
            <path d="M4 19a2 2 0 012-2h13" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
            <path d="M16 4.6a3.5 3.5 0 010 6.8M18 14.4c2 .7 3.5 2.5 3.5 5.6" />
        </>
    ),
};

const Icon = ({ name }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {ICONS[name]}
    </svg>
);

const Pin = () => (
    <svg
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

export default function Awards() {
    return (
        <section
            id="awards"
            className={styles.awards}
            aria-label="افتخارات و دستاوردها"
        >
            <SectionHead
                title="افتخارات و دستاوردها"
                subtitle="مسیر رشد نشریه کیمیا"
                className={styles.sh}
            />

            <div className={styles.tl}>
                {AWARDS.map((y) => (
                    <div key={y.year} className={styles.yr}>
                        <div className={styles.yrLabel}>{y.year}</div>
                        <div className={styles.items}>
                            {y.items.map((a) => (
                                <article
                                    key={a.title}
                                    className={`${styles.it} ${a.best ? styles.best : ''}`}
                                >
                                    <div className={styles.ic}>
                                        <Icon name={a.icon} />
                                    </div>
                                    <div className={styles.bd}>
                                        <div className={styles.meta}>
                                            <span className={styles.type}>
                                                {a.type}
                                            </span>
                                            {a.best && (
                                                <span
                                                    className={styles.bestTag}
                                                >
                                                    برترین دستاورد
                                                </span>
                                            )}
                                        </div>
                                        <h4>{a.title}</h4>
                                        <p>{a.text}</p>
                                        <span className={styles.org}>
                                            <Pin />
                                            {a.org}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
