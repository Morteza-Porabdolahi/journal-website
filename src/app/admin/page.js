import Link from 'next/link';
import {
    getMembers,
    getIssues,
    getNews,
    getAwardsGrouped,
} from '@/src/db/queries';
import styles from './admin.module.css';

export default async function AdminOverviewPage() {
    const [membersList, issuesList, newsList, awardsGroups] = await Promise.all(
        [getMembers(), getIssues(), getNews(), getAwardsGrouped()]
    );

    const totalAwards = awardsGroups.reduce(
        (sum, g) => sum + g.items.length,
        0
    );

    return (
        <div>
            <div className={styles.statsGrid}>
                <Link href="/admin/members" className={styles.statCard}>
                    <div className={styles.statValue}>{membersList.length}</div>
                    <div className={styles.statLabel}>اعضای تحریریه</div>
                </Link>
                <Link href="/admin/issues" className={styles.statCard}>
                    <div className={styles.statValue}>{issuesList.length}</div>
                    <div className={styles.statLabel}>شماره‌های منتشرشده</div>
                </Link>
                <Link href="/admin/news" className={styles.statCard}>
                    <div className={styles.statValue}>{newsList.length}</div>
                    <div className={styles.statLabel}>اخبار</div>
                </Link>
                <Link href="/admin/awards" className={styles.statCard}>
                    <div className={styles.statValue}>{totalAwards}</div>
                    <div className={styles.statLabel}>جوایز و افتخارات</div>
                </Link>
            </div>
        </div>
    );
}
