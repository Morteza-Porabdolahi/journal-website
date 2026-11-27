import Link from 'next/link';
import { count, desc, eq, isNull, or } from 'drizzle-orm';
import { db } from '@/src/db';
import { awards, issues, members, news, nextEvent } from '@/src/db/schema';
import styles from './admin.module.css';

export default async function AdminOverviewPage() {
    const [
        [membersTotal],
        [issuesTotal],
        [newsTotal],
        [awardsTotal],
        [missingPhotos],
        latestIssues,
        currentEvents,
        recentNews,
    ] = await Promise.all([
        db.select({ value: count() }).from(members),
        db.select({ value: count() }).from(issues),
        db.select({ value: count() }).from(news),
        db.select({ value: count() }).from(awards),
        db
            .select({ value: count() })
            .from(members)
            .where(or(isNull(members.photo), eq(members.photo, ''))),
        db.select().from(issues).orderBy(desc(issues.createdAt)).limit(1),
        db.select().from(nextEvent).limit(1),
        db.select().from(news).orderBy(desc(news.createdAt)).limit(4),
    ]);

    const latestIssue = latestIssues[0] ?? null;
    const activeEvent = currentEvents[0] ?? null;
    const missingPhotoCount = missingPhotos?.value ?? 0;

    return (
        <>
            {/* Header + Quick Actions */}
            <div className={styles.overviewHeader}>
                <div>
                    <h1
                        className={styles.pageTitle}
                        style={{ marginBottom: '0.25rem' }}
                    >
                        نمای کلی
                    </h1>
                    <p className={styles.pageSubtitle}>
                        وضعیت فعلی محتوای وب‌سایت نشریه کیمیا
                    </p>
                </div>

                <div className={styles.quickActions}>
                    <Link
                        href="/admin/issues"
                        className={styles.quickBtnPrimary}
                    >
                        + شماره جدید
                    </Link>
                    <Link href="/admin/news" className={styles.quickBtn}>
                        + خبر جدید
                    </Link>
                    <Link href="/admin/members" className={styles.quickBtn}>
                        + عضو جدید
                    </Link>
                </div>
            </div>

            {/* Actionable Editor Notice */}
            {missingPhotoCount > 0 && (
                <div className={styles.noticeBar}>
                    <span>
                        <strong>{missingPhotoCount} عضو</strong> هنوز تصویر
                        پروفایل ندارند.
                    </span>
                    <Link href="/admin/members" className={styles.noticeLink}>
                        تکمیل پروفایل‌ها ←
                    </Link>
                </div>
            )}

            {/* Stat Cards */}
            <div className={styles.statsGrid}>
                <Link href="/admin/members" className={styles.statCard}>
                    <div className={styles.statValue}>
                        {membersTotal?.value ?? 0}
                    </div>
                    <div className={styles.statLabel}>اعضای تحریریه</div>
                </Link>
                <Link href="/admin/issues" className={styles.statCard}>
                    <div className={styles.statValue}>
                        {issuesTotal?.value ?? 0}
                    </div>
                    <div className={styles.statLabel}>شماره‌های منتشرشده</div>
                </Link>
                <Link href="/admin/news" className={styles.statCard}>
                    <div className={styles.statValue}>
                        {newsTotal?.value ?? 0}
                    </div>
                    <div className={styles.statLabel}>اخبار و گزارش‌ها</div>
                </Link>
                <Link href="/admin/awards" className={styles.statCard}>
                    <div className={styles.statValue}>
                        {awardsTotal?.value ?? 0}
                    </div>
                    <div className={styles.statLabel}>افتخارات و جوایز</div>
                </Link>
            </div>

            {/* 2-Column Bento Section */}
            <div className={styles.bentoGrid}>
                {/* Right Column: Recent News */}
                <section className={styles.card} style={{ marginBottom: 0 }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.cardTitle} style={{ margin: 0 }}>
                            آخرین اخبار ثبت‌شده
                        </h2>
                        <Link href="/admin/news" className={styles.sectionLink}>
                            مدیریت همه ←
                        </Link>
                    </div>

                    {recentNews.length === 0 ? (
                        <p className={styles.itemMeta}>
                            هنوز خبری ثبت نشده است.
                        </p>
                    ) : (
                        <div className={styles.list}>
                            {recentNews.map((item) => (
                                <div key={item.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemTitle}>
                                            <span className={styles.badge}>
                                                {item.cat}
                                            </span>
                                            <span>{item.title}</span>
                                        </div>
                                        <span className={styles.itemMeta}>
                                            {item.day} {item.month}
                                            {item.place
                                                ? ` • ${item.place}`
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Left Column: Active Event + Latest Issue */}
                <div className={styles.bentoSide}>
                    {/* Active Next Event Spotlight */}
                    <section className={styles.spotlightCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.spotlightTag}>
                                {activeEvent?.tag || 'رویداد پیش‌رو'}
                            </span>
                            <Link
                                href="/admin/news"
                                className={styles.spotlightEdit}
                            >
                                ویرایش
                            </Link>
                        </div>

                        {activeEvent ? (
                            <div className={styles.eventBody}>
                                <div className={styles.eventDateBox}>
                                    <span className={styles.eventDay}>
                                        {activeEvent.day}
                                    </span>
                                    <span className={styles.eventMonth}>
                                        {activeEvent.month}
                                    </span>
                                </div>
                                <div className={styles.eventDetails}>
                                    <div className={styles.eventTitle}>
                                        {activeEvent.title}
                                    </div>
                                    <div className={styles.eventMeta}>
                                        {activeEvent.time} • {activeEvent.place}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className={styles.eventMeta}>
                                رویدادی تنظیم نشده است.
                            </p>
                        )}
                    </section>

                    {/* Latest Issue Card */}
                    <section
                        className={styles.card}
                        style={{ marginBottom: 0 }}
                    >
                        <div className={styles.sectionHeader}>
                            <h2
                                className={styles.cardTitle}
                                style={{ margin: 0 }}
                            >
                                آخرین شماره نشریه
                            </h2>
                            <Link
                                href="/admin/issues"
                                className={styles.sectionLink}
                            >
                                آرشیو ←
                            </Link>
                        </div>

                        {latestIssue ? (
                            <div className={styles.issuePreview}>
                                <img
                                    src={latestIssue.cover}
                                    alt={latestIssue.title}
                                    className={styles.issueThumb}
                                />
                                <div className={styles.issueMeta}>
                                    <div className={styles.itemTitle}>
                                        {latestIssue.title}
                                    </div>
                                    <a
                                        href={latestIssue.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.issuePdfLink}
                                    >
                                        مشاهده فایل PDF ↗
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <p className={styles.itemMeta}>
                                هنوز شماره‌ای منتشر نشده است.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
