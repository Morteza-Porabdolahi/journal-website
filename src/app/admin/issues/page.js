import { getIssues } from '@/src/db/queries';
import { addIssue, deleteIssue } from '../actions';
import styles from '../admin.module.css';

export default async function AdminIssuesPage() {
  const list = await getIssues();

  return (
    <div>
      <h1 className={styles.pageTitle}>مدیریت شماره‌های نشریه</h1>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>افزودن شماره جدید</h2>
        <form action={addIssue}>
          <div className={styles.formGrid}>
            <label className={styles.fieldFull}>
              <span className={styles.label}>عنوان شماره *</span>
              <input name="title" required placeholder="شماره دوم نشریه کیمیا" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>آپلود تصویر جلد</span>
              <input name="coverFile" type="file" accept="image/*" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>یا لینک تصویر جلد</span>
              <input name="coverUrl" placeholder="https://example.com/issue-2.png" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>آپلود فایل PDF</span>
              <input name="pdfFile" type="file" accept="application/pdf" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>یا لینک فایل PDF</span>
              <input name="pdfUrl" placeholder="https://example.com/issue2.pdf" className={styles.input} />
            </label>
          </div>
          <button type="submit" className={styles.submitBtn}>انتشار شماره</button>
        </form>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>شماره‌های ثبت‌شده ({list.length})</h2>
        <div className={styles.list}>
          {list.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemMeta}>فایل: {item.file}</span>
              </div>
              <form action={deleteIssue}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className={styles.deleteBtn}>حذف</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}