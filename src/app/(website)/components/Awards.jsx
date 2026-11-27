import { getAwardsGrouped } from '@/src/db/queries';

import SectionHead from './SectionHead';
import styles from './Awards.module.css';
import Icon from './Icon';

export default async function Awards() {
    const awards = await getAwardsGrouped();
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
                {awards.map((y) => (
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
                                                <circle
                                                    cx="12"
                                                    cy="10"
                                                    r="2.5"
                                                />
                                            </svg>
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
