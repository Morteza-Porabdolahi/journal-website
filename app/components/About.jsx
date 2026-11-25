import Image from 'next/image';
import Link from 'next/link';
import SectionHead from './SectionHead';
import styles from './About.module.css';

const Chevron = () => (
  <span className={styles.mgIc}>
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 2L4 7l5 5" />
    </svg>
  </span>
);

export default function About() {
  return (
    <section id="about" className={styles.mag}>
      <SectionHead title="معرفی نشریه" />

      <div className={styles.mgGrid}>
        <div className={styles.mgVisual}>
          <div className={`${styles.mgPat} ${styles.mgPatBr}`} aria-hidden="true">
            <Image src="/images/pattern.png" alt="" fill sizes="(max-width: 820px) 70vw, 30vw" style={{ objectFit: 'contain' }} />
          </div>

          <div className={styles.mgTop}>
            <div className={styles.mgBar} />
            <div className={styles.mgChip}>
              <Image src="/images/chip.png" alt="" fill sizes="10vw" style={{ objectFit: 'cover' }} />
            </div>
          </div>

          <div className={styles.mgHero}>
            <Image
              src="/images/hero.jpg"
              alt="دانشکده مهندسی شیمی و نفت دانشگاه تبریز"
              fill
              sizes="(max-width: 820px) 90vw, 45vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className={styles.mgText}>
          <span className={styles.mgBadge}>درباره نشریه دانشجویی کیمیا</span>
          <p>
            «کیمیا» نشریه دانشجویی دانشکده مهندسی شیمی و نفت دانشگاه تبریز است. این نشریه با هدف
            انتشار مقاله‌ها، گزارش‌ها و تجربه‌های دانشجویی در حوزه مهندسی شیمی و نفت شکل گرفته و
            فضایی برای دیده‌شدن نوشته‌ها و ایده‌های دانشجویان فراهم می‌کند. شماره‌های نشریه با
            همکاری تیم تحریریه و با نظارت علمی اساتید دانشکده تهیه می‌شود و برای دانلود در
            دسترس همه علاقه‌مندان است.            «کیمیا» نشریه دانشجویی دانشکده مهندسی شیمی و نفت دانشگاه تبریز است. این نشریه با هدف
            انتشار مقاله‌ها، گزارش‌ها و تجربه‌های دانشجویی در حوزه مهندسی شیمی و نفت شکل گرفته و
            فضایی برای دیده‌شدن نوشته‌ها و ایده‌های دانشجویان فراهم می‌کند. شماره‌های نشریه با
            همکاری تیم تحریریه و با نظارت علمی اساتید دانشکده تهیه می‌شود و برای دانلود در
            دسترس همه علاقه‌مندان است.            انتشار مقاله‌ها، گزارش‌ها و تجربه‌های دانشجویی در حوزه مهندسی شیمی و نفت شکل گرفته و
 
          </p>
          <div className={styles.mgActions}>
            <Link className={styles.mgBtn} href="#contact">ارتباط با ما<Chevron /></Link>
            <Link className={styles.mgBtn} href="#journals">مجلات نشریه<Chevron /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}