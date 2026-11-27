import { getAwardsGrouped } from '@/src/db/queries';
import { addAward, deleteAward, updateAward } from '../actions';
import { DeleteForm, ActionForm, EditModal } from '../components/ActionForms';

import styles from '../admin.module.css';
import Icon, { ICONS } from '@/src/app/(website)/components/Icon';

export default async function AdminAwardsPage() {
    const groups = await getAwardsGrouped();

    return (
        <div>
            <h1 className={styles.pageTitle}>مدیریت افتخارات و جوایز</h1>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>ثبت افتخار جدید</h2>
                <ActionForm action={addAward} label="ذخیره">
                    <div className={styles.formGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>سال *</span>
                            <input
                                name="year"
                                required
                                placeholder="۱۴۰۴"
                                className={styles.input}
                            />
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
                        <div className={styles.fieldFull}>
                            <span className={styles.label}>آیکن</span>
                            <div
                                className={styles.iconPicker}
                                role="radiogroup"
                                aria-label="انتخاب آیکن"
                            >
                                {Object.keys(ICONS).map((opt, idx) => (
                                    <label
                                        key={opt}
                                        className={styles.iconOption}
                                    >
                                        <input
                                            type="radio"
                                            name="icon"
                                            value={opt}
                                            defaultChecked={idx === 0}
                                            className={styles.iconRadio}
                                        />
                                        <span className={styles.iconTile}>
                                            <span className={styles.iconSvg}>
                                                <Icon name={opt} />
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                برگزارکننده / سازمان *
                            </span>
                            <input
                                name="org"
                                required
                                placeholder="جشنواره نشریات دانشجویی دانشگاه تبریز"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>عنوان *</span>
                            <input
                                name="title"
                                required
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>توضیحات *</span>
                            <textarea
                                name="text"
                                required
                                className={styles.textarea}
                            />
                        </label>
                        <label className={styles.checkboxRow}>
                            <input type="checkbox" name="best" />
                            <span>نمایش به عنوان افتخار ویژه</span>
                        </label>
                    </div>
                </ActionForm>
            </section>

            {groups.map((group) => (
                <section key={group.year} className={styles.card}>
                    <h2 className={styles.cardTitle}>سال {group.year}</h2>
                    <div className={styles.list}>
                        {group.items.map((award) => (
                            <div key={award.id} className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemTitle}>
                                        {award.title}
                                        <span className={styles.badge}>
                                            {award.type}
                                        </span>
                                        {award.best && (
                                            <span className={styles.badge}>
                                                ویژه
                                            </span>
                                        )}
                                    </span>
                                    <span className={styles.itemMeta}>
                                        {award.org}
                                    </span>
                                </div>
                                <div className={styles.rowActions}>
                                    <EditModal action={updateAward}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={award.id}
                                        />

                                        <div className={styles.formGrid}>
                                            <label className={styles.field}>
                                                <span className={styles.label}>
                                                    سال *
                                                </span>
                                                <input
                                                    name="year"
                                                    required
                                                    defaultValue={group.year}
                                                    className={styles.input}
                                                />
                                            </label>
                                            <label className={styles.field}>
                                                <span className={styles.label}>
                                                    نوع *
                                                </span>
                                                <select
                                                    name="type"
                                                    defaultValue={award.type}
                                                    required
                                                    className={styles.select}
                                                >
                                                    <option value="جایزه">
                                                        جایزه
                                                    </option>
                                                    <option value="تقدیرنامه">
                                                        تقدیرنامه
                                                    </option>
                                                    <option value="انتشار">
                                                        انتشار
                                                    </option>
                                                    <option value="رویداد">
                                                        رویداد
                                                    </option>
                                                </select>
                                            </label>

                                            <label className={styles.fieldFull}>
                                                <span className={styles.label}>
                                                    عنوان *
                                                </span>
                                                <input
                                                    name="title"
                                                    required
                                                    defaultValue={award.title}
                                                    className={styles.input}
                                                />
                                            </label>

                                            <label className={styles.fieldFull}>
                                                <span className={styles.label}>
                                                    برگزارکننده / نهاد *
                                                </span>
                                                <input
                                                    name="org"
                                                    required
                                                    defaultValue={award.org}
                                                    className={styles.input}
                                                />
                                            </label>

                                            <div className={styles.fieldFull}>
                                                <span className={styles.label}>
                                                    آیکن
                                                </span>
                                                <div
                                                    className={
                                                        styles.iconPicker
                                                    }
                                                    role="radiogroup"
                                                    aria-label="انتخاب آیکن"
                                                >
                                                    {Object.keys(ICONS).map(
                                                        (opt) => (
                                                            <label
                                                                key={opt}
                                                                className={
                                                                    styles.iconOption
                                                                }
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="icon"
                                                                    value={opt}
                                                                    defaultChecked={
                                                                        (award.icon ||
                                                                            'trophy') ===
                                                                        opt
                                                                    }
                                                                    className={
                                                                        styles.iconRadio
                                                                    }
                                                                />
                                                                <span
                                                                    className={
                                                                        styles.iconTile
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.iconSvg
                                                                        }
                                                                    >
                                                                        <Icon
                                                                            name={
                                                                                opt
                                                                            }
                                                                        />
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <label className={styles.fieldFull}>
                                                <span className={styles.label}>
                                                    توضیحات *
                                                </span>
                                                <textarea
                                                    name="text"
                                                    required
                                                    defaultValue={award.text}
                                                    className={styles.textarea}
                                                />
                                            </label>

                                            <div className={styles.fieldFull}>
                                                <label
                                                    className={
                                                        styles.checkboxRow
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="best"
                                                        defaultChecked={Boolean(
                                                            award.best
                                                        )}
                                                    />
                                                    <span>
                                                        نمایش به‌عنوان افتخار
                                                        ویژه (برتر)
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </EditModal>

                                    <DeleteForm
                                        action={deleteAward}
                                        id={award.id}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
