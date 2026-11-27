import { getMembers } from '@/src/db/queries';
import { addMember, deleteMember } from '../actions';
import styles from '../admin.module.css';

export default async function AdminMembersPage() {
    const list = await getMembers();

    return (
        <div>
            <h1 className={styles.pageTitle}>مدیریت اعضا</h1>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>افزودن عضو جدید</h2>
                <form action={addMember}>
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                نام و نام خانوادگی *
                            </span>
                            <input
                                name="name"
                                required
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>سمت *</span>
                            <input
                                name="role"
                                required
                                placeholder="مثلاً: نویسنده یا سردبیر"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                ترتیب نمایش (عدد کوچکتر بالاتر)
                            </span>
                            <input
                                name="sortOrder"
                                type="number"
                                defaultValue="0"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                آپلود عکس (اختیاری)
                            </span>
                            <input
                                name="photoFile"
                                type="file"
                                accept="image/*"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>یا لینک عکس</span>
                            <input
                                name="photoUrl"
                                placeholder="https://..."
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                تلگرام (اختیاری)
                            </span>
                            <input
                                name="tg"
                                placeholder="https://t.me/username"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                اینستاگرام (اختیاری)
                            </span>
                            <input
                                name="ig"
                                placeholder="https://instagram.com/username"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                ایمیل (اختیاری)
                            </span>
                            <input
                                name="mail"
                                placeholder="username@example.com"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>
                                بیوگرافی کوتاه (اختیاری)
                            </span>
                            <textarea name="bio" className={styles.textarea} />
                        </label>
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        ذخیره عضو
                    </button>
                </form>
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>لیست اعضا ({list.length})</h2>
                <div className={styles.list}>
                    {list.map((m) => (
                        <div key={m.id} className={styles.listItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemTitle}>
                                    {m.name}
                                </span>
                                <span className={styles.itemMeta}>
                                    {m.role} · ترتیب: {m.sortOrder}
                                </span>
                            </div>
                            <form action={deleteMember}>
                                <input type="hidden" name="id" value={m.id} />
                                <button
                                    type="submit"
                                    className={styles.deleteBtn}
                                >
                                    حذف
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
