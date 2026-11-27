import { getIssues } from '@/src/db/queries';
import { addIssue, deleteIssue, updateIssue } from '../actions';
import { DeleteForm, ActionForm, EditModal } from '../components/ActionForms';

import styles from '../admin.module.css';

export default async function AdminIssuesPage() {
    const list = await getIssues();

    return (
        <div>
            <h1 className={styles.pageTitle}>مدیریت شماره‌های نشریه</h1>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>افزودن شماره جدید</h2>
                <ActionForm action={addIssue} label="افزودن شماره">
                    <div className={styles.formGrid}>
                        <label className={styles.fieldFull}>
                            <span className={styles.label}>عنوان شماره *</span>
                            <input
                                name="title"
                                required
                                placeholder="شماره دوم نشریه کیمیا"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                آپلود تصویر جلد
                            </span>
                            <input
                                name="coverFile"
                                type="file"
                                accept="image/*"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                یا لینک تصویر جلد
                            </span>
                            <input
                                name="coverUrl"
                                placeholder="https://example.com/issue-2.png"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>آپلود فایل PDF</span>
                            <input
                                name="pdfFile"
                                type="file"
                                accept="application/pdf"
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>
                                یا لینک فایل PDF
                            </span>
                            <input
                                name="pdfUrl"
                                placeholder="https://example.com/issue2.pdf"
                                className={styles.input}
                            />
                        </label>
                    </div>
                </ActionForm>
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>
                    شماره‌های ثبت‌شده ({list.length})
                </h2>
                <div className={styles.list}>
                    {list.map((item) => (
                        <div key={item.id} className={styles.listItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemTitle}>
                                    {item.title}
                                </span>
                                <span className={styles.itemMeta}>
                                    فایل: {item.file}
                                </span>
                            </div>
                            <div className={styles.rowActions}>
                                <EditModal action={updateIssue}>
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={item.id}
                                    />

                                    <div className={styles.currentMediaBox}>
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                            className={styles.currentAvatar}
                                        />
                                        <div
                                            className={styles.currentMediaInfo}
                                        >
                                            <span className={styles.label}>
                                                جلد و فایل فعلی
                                            </span>
                                            <a
                                                href={item.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.issuePdfLink}
                                            >
                                                مشاهده PDF فعلی ↗
                                            </a>
                                        </div>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                عنوان شماره *
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
                                                جایگزینی تصویر جلد (اختیاری)
                                            </span>
                                            <input
                                                name="coverFile"
                                                type="file"
                                                accept="image/*"
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.field}>
                                            <span className={styles.label}>
                                                جایگزینی فایل PDF (اختیاری)
                                            </span>
                                            <input
                                                name="pdfFile"
                                                type="file"
                                                accept="application/pdf"
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                یا لینک مستقیم تصویر جلد
                                            </span>
                                            <input
                                                name="coverUrl"
                                                dir="ltr"
                                                defaultValue={item.cover}
                                                className={styles.input}
                                            />
                                        </label>

                                        <label className={styles.fieldFull}>
                                            <span className={styles.label}>
                                                یا لینک مستقیم فایل PDF
                                            </span>
                                            <input
                                                name="fileUrl"
                                                dir="ltr"
                                                defaultValue={item.file}
                                                className={styles.input}
                                            />
                                        </label>
                                    </div>
                                </EditModal>

                                <DeleteForm
                                    action={deleteIssue}
                                    id={item.id}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
