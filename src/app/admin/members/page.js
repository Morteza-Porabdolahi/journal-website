import { getMembers } from '@/src/db/queries';
import { addMember, deleteMember, updateMember } from '../actions';
import { ActionForm, DeleteForm, EditModal } from '../components/ActionForms';

import styles from '../admin.module.css';

export default async function AdminMembersPage() {
    const list = await getMembers();

    return (
        <div>
            <h1 className={styles.pageTitle}>مدیریت اعضا</h1>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>افزودن عضو جدید</h2>
                <ActionForm action={addMember} label="افزودن عضو">
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
                </ActionForm>
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
                            <div className={styles.rowActions}>
                                <EditModal action={updateMember}>
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={m.id}
                                    />

                                    {m.photo && (
                                        <div className={styles.currentMediaBox}>
                                            <img
                                                src={m.photo}
                                                alt={m.name}
                                                className={styles.currentAvatar}
                                            />
                                            <div
                                                className={
                                                    styles.currentMediaInfo
                                                }
                                            >
                                                <span className={styles.label}>
                                                    تصویر فعلی
                                                </span>
                                                <label
                                                    className={
                                                        styles.checkboxRow
                                                    }
                                                    style={{ paddingTop: 0 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="removePhoto"
                                                    />
                                                    <span>حذف تصویر فعلی</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.formGrid}>
                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                نام و نام خانوادگی *
                                            </span>
                                            <input
                                                name="name"
                                                required
                                                defaultValue={m.name}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                سمت *
                                            </span>
                                            <input
                                                name="role"
                                                required
                                                defaultValue={m.role}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                ترتیب نمایش
                                            </span>
                                            <input
                                                name="sortOrder"
                                                type="number"
                                                defaultValue={m.sortOrder ?? 0}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                آپلود تصویر جدید (اختیاری)
                                            </span>
                                            <input
                                                name="photoFile"
                                                type="file"
                                                accept="image/*"
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                یا لینک مستقیم تصویر
                                            </span>
                                            <input
                                                name="photoUrl"
                                                dir="ltr"
                                                defaultValue={m.photo || ''}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                تلگرام
                                            </span>
                                            <input
                                                name="tg"
                                                dir="ltr"
                                                defaultValue={m.tg || ''}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                اینستاگرام
                                            </span>
                                            <input
                                                name="ig"
                                                dir="ltr"
                                                defaultValue={m.ig || ''}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                ایمیل
                                            </span>
                                            <input
                                                name="mail"
                                                dir="ltr"
                                                defaultValue={m.mail || ''}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                معرفی کوتاه
                                            </span>
                                            <textarea
                                                name="bio"
                                                defaultValue={m.bio || ''}
                                                className={styles.textarea}
                                            />
                                        </label>
                                    </div>
                                </EditModal>
                                <DeleteForm
                                    action={deleteMember}
                                    id={m.id}
                                    itemName={m.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
