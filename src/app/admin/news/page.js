import { getNews, getNextEvent } from '@/src/db/queries';
import { addNews, deleteNews, updateNextEvent, updateNews } from '../actions';
import { ActionForm, DeleteForm, EditModal } from '../components/ActionForms';

import styles from '../admin.module.css';

export default async function AdminNewsPage() {
    const [newsList, event] = await Promise.all([getNews(), getNextEvent()]);

    return (
        <div>
            <h1 className={styles.pageTitle}>اخبار و رویداد پیش‌رو</h1>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                    ویرایش رویداد پیش‌رو (بنر اصلی)
                </h2>
                <ActionForm
                    action={updateNextEvent}
                    label="به‌روزرسانی رویداد"
                    resetOnSuccess={false}
                >
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>برچسب</span>
                            <input
                                name="tag"
                                defaultValue={event?.tag || 'رویداد پیش‌رو'}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>روز *</span>
                            <input
                                name="day"
                                required
                                defaultValue={event?.day || ''}
                                placeholder="۲۵"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>ماه *</span>
                            <select
                                name="month"
                                required
                                className={styles.select}
                                defaultValue={event?.month || ''}
                            >
                                <option value="فروردین">فروردین</option>
                                <option value="اردیبهشت">اردیبهشت</option>
                                <option value="خرداد">خرداد</option>
                                <option value="تیر">تیر</option>
                                <option value="مرداد">مرداد</option>
                                <option value="شهریور">شهریور</option>
                                <option value="مهر">مهر</option>
                                <option value="آبان">آبان</option>
                                <option value="آذر">آذر</option>
                                <option value="دی">دی</option>
                                <option value="بهمن">بهمن</option>
                                <option value="اسفند">اسفند</option>
                            </select>
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>ساعت *</span>
                            <input
                                name="time"
                                required
                                defaultValue={event?.time || ''}
                                placeholder="ساعت ۹ تا ۱۶"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>عنوان رویداد *</span>
                            <input
                                name="title"
                                required
                                defaultValue={event?.title || ''}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>مکان *</span>
                            <input
                                name="place"
                                required
                                defaultValue={event?.place || ''}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                لینک ثبت‌نام / جزئیات
                            </span>
                            <input
                                name="href"
                                defaultValue={event?.href || '#'}
                                className={styles.input}
                            />
                        </label>
                    </div>
                </ActionForm>
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>افزودن خبر جدید</h2>
                <ActionForm action={addNews} label="افزودن خبر">
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>دسته‌بندی</span>
                            <input
                                name="cat"
                                defaultValue="خبر"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>روز *</span>
                            <input
                                name="day"
                                required
                                placeholder="۱۸"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>ماه *</span>
                            <select
                                name="month"
                                required
                                className={styles.select}
                            >
                                <option value="فروردین">فروردین</option>
                                <option value="اردیبهشت">اردیبهشت</option>
                                <option value="خرداد">خرداد</option>
                                <option value="تیر">تیر</option>
                                <option value="مرداد">مرداد</option>
                                <option value="شهریور">شهریور</option>
                                <option value="مهر">مهر</option>
                                <option value="آبان">آبان</option>
                                <option value="آذر">آذر</option>
                                <option value="دی">دی</option>
                                <option value="بهمن">بهمن</option>
                                <option value="اسفند">اسفند</option>
                            </select>
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>مکان</span>
                            <input
                                name="place"
                                placeholder="دانشکده مهندسی شیمی و نفت"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>عنوان خبر *</span>
                            <input
                                name="title"
                                required
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>متن خلاصه *</span>
                            <textarea
                                name="text"
                                required
                                className={styles.textarea}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                آپلود تصویر خبر
                            </span>
                            <input
                                name="imgFile"
                                type="file"
                                accept="image/*"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>یا لینک تصویر</span>
                            <input
                                name="imgUrl"
                                placeholder="https://example.com/hero.jpg"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>لینک خبر</span>
                            <input
                                name="href"
                                defaultValue="#"
                                className={styles.input}
                            />
                        </label>
                    </div>
                </ActionForm>
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                    لیست اخبار ({newsList.length})
                </h2>
                <div className={styles.list}>
                    {newsList.map((item) => (
                        <div key={item.id} className={styles.listItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemTitle}>
                                    {item.title}
                                    <span className={styles.badge}>
                                        {item.cat}
                                    </span>
                                </span>
                                <span className={styles.itemMeta}>
                                    {item.day} {item.month} · {item.place}
                                </span>
                            </div>
                            <div className={styles.rowActions}>
                                <EditModal
                                    action={updateNews}
                                    title="ویرایش خبر"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={item.id}
                                    />

                                    {item.img && (
                                        <div className={styles.currentMediaBox}>
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className={styles.currentAvatar}
                                            />
                                            <div
                                                className={
                                                    styles.currentMediaInfo
                                                }
                                            >
                                                <span className={styles.label}>
                                                    تصویر فعلی خبر
                                                </span>
                                                <label
                                                    className={
                                                        styles.checkboxRow
                                                    }
                                                    style={{ paddingTop: 0 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="removeImg"
                                                    />
                                                    <span>حذف تصویر فعلی</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.formGrid}>
                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                عنوان خبر *
                                            </span>
                                            <input
                                                name="title"
                                                required
                                                defaultValue={item.title}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                دسته‌بندی
                                            </span>
                                            <input
                                                name="cat"
                                                defaultValue={item.cat}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                مکان
                                            </span>
                                            <input
                                                name="place"
                                                defaultValue={item.place || ''}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                روز *
                                            </span>
                                            <input
                                                name="day"
                                                required
                                                defaultValue={item.day}
                                                className={styles.input}
                                            />
                                        </label>
                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                ماه *
                                            </span>
                                            <select
                                                name="month"
                                                defaultValue={item.month}
                                                required
                                                className={styles.select}
                                            >
                                                <option value="فروردین">
                                                    فروردین
                                                </option>
                                                <option value="اردیبهشت">
                                                    اردیبهشت
                                                </option>
                                                <option value="خرداد">
                                                    خرداد
                                                </option>
                                                <option value="تیر">تیر</option>
                                                <option value="مرداد">
                                                    مرداد
                                                </option>
                                                <option value="شهریور">
                                                    شهریور
                                                </option>
                                                <option value="مهر">مهر</option>
                                                <option value="آبان">
                                                    آبان
                                                </option>
                                                <option value="آذر">آذر</option>
                                                <option value="دی">دی</option>
                                                <option value="بهمن">
                                                    بهمن
                                                </option>
                                                <option value="اسفند">
                                                    اسفند
                                                </option>
                                            </select>
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                آپلود تصویر جدید (اختیاری)
                                            </span>
                                            <input
                                                name="imgFile"
                                                type="file"
                                                accept="image/*"
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                لینک خبر
                                            </span>
                                            <input
                                                name="href"
                                                dir="ltr"
                                                defaultValue={item.href || '#'}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                یا لینک مستقیم تصویر
                                            </span>
                                            <input
                                                name="imgUrl"
                                                dir="ltr"
                                                defaultValue={item.img || ''}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                متن خبر *
                                            </span>
                                            <textarea
                                                name="text"
                                                required
                                                defaultValue={item.text}
                                                className={styles.textarea}
                                            />
                                        </label>
                                    </div>
                                </EditModal>

                                <DeleteForm action={deleteNews} id={item.id} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
