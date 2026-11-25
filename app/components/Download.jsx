import Image from 'next/image';
import styles from './Download.module.css';

const ISSUES = [
  { title: 'شماره اول نشریه کیمیا',  cover: '/images/issue-1.png', file: '/files/issue1.pdf' },
  { title: 'شماره دوم نشریه کیمیا',  cover: '/images/issue-2.png', file: '/files/issue2.pdf' },
  { title: 'شماره سوم نشریه کیمیا',  cover: '/images/issue-3.png', file: '/files/issue3.pdf' },
  { title: 'شماره چهارم نشریه کیمیا', cover: '/images/issue-4.png', file: '/files/issue4.pdf' },
];

export default function Download() {
  return (
    <section id="journals" className={styles.download} aria-label="دانلود شماره‌ها">
      <div className={styles.band} />

      <div className={styles.cards}>
        {ISSUES.map((issue) => (
          <article key={issue.file} className={styles.card}>
            <div className={styles.inner}>
              <Image
                src={issue.cover}
                alt={issue.title}
                fill
                sizes="(max-width: 820px) 45vw, 20vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <a className={styles.btn} href={issue.file} download>
              دانلود
              <span className={styles.ic}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 2L4 7l5 5" />
                </svg>
              </span>
            </a>
          </article>
        ))}
      </div>

      <div className={styles.panel}>
        <svg className={styles.deco} viewBox="0 0 2144 402" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
          <path d="M39 350 C29 223 104 158 179 158 C239 158 289 188 312 233" />
          <path d="M304 230 C344 243 374 263 416 261 C456 259 470 223 461 185 C448 143 394 103 347 75" />
          <circle cx="254" cy="293" r="65" />
        </svg>

        <div className={styles.panelBody}>
          <span className={styles.badge}>درباره نشریه دانشجویی کیمیا</span>
          <p>
            «کیمیا» نشریه دانشجویی دانشکده مهندسی شیمی و نفت دانشگاه تبریز است. هدف ما انتشار
            مقاله‌ها و مطالب دانشجویی در حوزه مهندسی و فراهم کردن فضایی برای دیده‌شدن نوشته‌های
            دانشجویان است.
          </p>
        </div>
      </div>
    </section>
  );
}