import { getNews, getNextEvent } from '@/src/db/queries';
import { addNews, deleteNews, updateNextEvent } from '../actions';
import styles from '../admin.module.css';

export default async function AdminNewsPage() {
  const [newsList, event] = await Promise.all([getNews(), getNextEvent()]);

  return (
    <div>
      <h1 className={styles.pageTitle}>اخبار و رویداد پیش‌رو</h1>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>ویرایش رویداد پیش‌رو (بنر اصلی)</h2>
        <form action={updateNextEvent}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>برچسب</span>
              <input name="tag" defaultValue={event?.tag || 'رویداد پیش‌رو'} className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>روز *</span>
              <input name="day" required defaultValue={event?.day || ''} placeholder="۲۵" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>ماه *</span>
              <input name="month" required defaultValue={event?.month || ''} placeholder="آذر" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>ساعت *</span>
              <input name="time" required defaultValue={event?.time || ''} placeholder="ساعت ۹ تا ۱۶" className={styles.input} />
            </label>
            <label className={styles.fieldFull}>
              <span className={styles.label}>عنوان رویداد *</span>
              <input name="title" required defaultValue={event?.title || ''} className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>مکان *</span>
              <input name="place" required defaultValue={event?.place || ''} className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>لینک ثبت‌نام / جزئیات</span>
              <input name="href" defaultValue={event?.href || '#'} className={styles.input} />
            </label>
          </div>
          <button type="submit" className={styles.submitBtn}>به‌روزرسانی رویداد</button>
        </form>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>افزودن خبر جدید</h2>
        <form action={addNews}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>دسته‌بندی</span>
              <input name="cat" defaultValue="خبر" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>روز *</span>
              <input name="day" required placeholder="۱۸" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>ماه *</span>
              <input name="month" required placeholder="آذر" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>مکان</span>
              <input name="place" placeholder="دانشکده مهندسی شیمی و نفت" className={styles.input} />
            </label>
            <label className={styles.fieldFull}>
              <span className={styles.label}>عنوان خبر *</span>
              <input name="title" required className={styles.input} />
            </label>
            <label className={styles.fieldFull}>
              <span className={styles.label}>متن خلاصه *</span>
              <textarea name="text" required className={styles.textarea} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>آپلود تصویر خبر</span>
              <input name="imgFile" type="file" accept="image/*" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>یا لینک تصویر</span>
              <input name="imgUrl" placeholder="/images/hero.jpg" className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>لینک خبر</span>
              <input name="href" defaultValue="#" className={styles.input} />
            </label>
          </div>
          <button type="submit" className={styles.submitBtn}>انتشار خبر</button>
        </form>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>لیست اخبار ({newsList.length})</h2>
        <div className={styles.list}>
          {newsList.map((n) => (
            <div key={n.id} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>
                  {n.title}
                  <span className={styles.badge}>{n.cat}</span>
                </span>
                <span className={styles.itemMeta}>{n.day} {n.month} · {n.place}</span>
              </div>
              <form action={deleteNews}>
                <input type="hidden" name="id" value={n.id} />
                <button type="submit" className={styles.deleteBtn}>حذف</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}