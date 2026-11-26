import Image from 'next/image';
import SectionHead from './SectionHead';
import styles from './Members.module.css';

import { getMembers } from '@/src/db/queries';

const ICONS = {
    tg: (
        <>
            <path d="M21.5 3.5L2.5 11l6 2.2 2.3 6.3 3-4 5 3.7z" />
            <path d="M8.5 13.2l9-6.2" />
        </>
    ),
    ig: (
        <>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M3.5 7.5l8.5 6 8.5-6" />
        </>
    ),
};
const LABELS = { tg: 'تلگرام', ig: 'اینستاگرام', mail: 'ایمیل' };

const Social = ({ name }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {ICONS[name]}
    </svg>
);

const UserIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
);

export default async function Members() {
    const members = await getMembers();

    return (
        <section id="fm" className={styles.fm} aria-label="اعضای ویژه نشریه">
            <SectionHead
                title="اعضای ویژه"
                subtitle="کسانی که کیمیا را می‌سازند"
                className={styles.sh}
            />

            <div className={styles.grid}>
                {members.map((m) => {
                    const links = ['tg', 'ig', 'mail'].filter((k) => m[k]);
                    return (
                        <article key={m.id} className={styles.card}>
                            <div className={styles.ph}>
                                {m.photo ? (
                                    <Image
                                        src={m.photo}
                                        alt={m.name}
                                        fill
                                        sizes="(max-width: 820px) 45vw, 22vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <UserIcon />
                                )}

                                {links.length > 0 && (
                                    <div className={styles.soc}>
                                        {links.map((k) => (
                                            <a
                                                key={k}
                                                href={m[k]}
                                                aria-label={`${LABELS[k]} ${m.name}`}
                                            >
                                                <Social name={k} />
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <span className={styles.role}>{m.role}</span>
                            </div>

                            <div className={styles.info}>
                                <h3>{m.name}</h3>
                                <p>{m.bio}</p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
