import { getAwardsGrouped } from '@/src/db/queries';
import { addAward, deleteAward } from '../actions';
import styles from '../admin.module.css';

export default async function AdminAwardsPage() {
  const groups = await getAwardsGrouped();

  return (
    <div>
      <h1 className={styles.pageTitle}>مدیریت افتخارات و جوایز</h1>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>ثبت افتخار جدید</h2>
        <form action={addAward}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>سال *</span>
              <input name="year" required placeholder="۱۴۰۴" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>نوع *</span>
              <select name="type" className={styles.select}>
                <option value="جایزه">جایزه</option>
                <option value="تقدیرنامه">تقدیرنامه</option>
                <option value="انتشار">انتشار</option>
                <option value="رویداد">رویداد</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>آیکن</span>
              <select name="icon" className={styles.select}>
                <option value="trophy">جام (trophy)</option>
                <option value="medal">مدال (medal)</option>
                <option value="star">ستاره (star)</option>
                <option value="book">کتاب (book)</option>
                <option value="users">افراد (users)</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>برگزارکننده / سازمان *</span>
              <input name="org" required placeholder="جشنواره نشریات دانشجویی دانشگاه تبریز" className={styles.input} />
            </label>
            <label className={styles.fieldFull}>
              <span className={styles.label}>عنوان *</span>
              <input name="title" required className={styles.input} />
            </label>
            <label className={styles.fieldFull}>
              <span className={styles.label}>توضیحات *</span>
              <textarea name="text" required className={styles.textarea} />
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" name="best" />
              <span>نمایش به عنوان افتخار ویژه (best)</span>
            </label>
          </div>
          <button type="submit" className={styles.submitBtn}>ذخیره افتخار</button>
        </form>
      </section>

      {groups.map((group) => (
        <section key={group.year} className={styles.card}>
          <h2 className={styles.cardTitle}>سال {group.year}</h2>
          <div className={styles.list}>
            {group.items.map((item) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>
                    {item.title}
                    <span className={styles.badge}>{item.type}</span>
                    {item.best && <span className={styles.badge}>ویژه</span>}
                  </span>
                  <span className={styles.itemMeta}>{item.org}</span>
                </div>
                <form action={deleteAward}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className={styles.deleteBtn}>حذف</button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}