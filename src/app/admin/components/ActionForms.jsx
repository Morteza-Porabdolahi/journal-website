'use client';

import { useActionState, useRef, useTransition } from 'react';
import { toast } from 'sonner';
import styles from '../admin.module.css';

async function runWithToast(action, formData) {
  try {
    const res = await action(formData);

    if (res?.message) {
      if (res.ok) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }

    return res;
  } catch (err) {
    toast.error('ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید!');
  }
}

export function ActionForm({
  action,
  label = 'ذخیره',
  resetOnSuccess = true,
  children,
}) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await runWithToast(action, formData);
      if (res?.ok && resetOnSuccess) {
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {children}
        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {label}
        </button>
    </form>
  );
}

export function DeleteForm({
  action,
  id,
  label = 'حذف',
  itemName
}) {
   const dialogRef = useRef(null);

  const [, formAction, isPending] = useActionState(async (_, formData) => {
    const res = await runWithToast(action, formData);
    dialogRef.current?.close();
    return res;
  }, null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => {
    if (!isPending) dialogRef.current?.close();
  };

 return (
    <>
      <button type="button" onClick={openModal} className={styles.deleteBtn}>
        {label}
      </button>

      <dialog
        ref={dialogRef}
        dir="rtl"
        className={styles.modalDialog}
        onCancel={(e) => {
          if (isPending) e.preventDefault();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal();
        }}
      >
        <div className={styles.modalCard}>
          <div className={styles.modalIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <h3 className={styles.modalTitle}>تأیید حذف</h3>
          <p className={styles.modalText}>
            {itemName ? (
              <>
                آیا از حذف <strong>«{itemName}»</strong> مطمئن هستید؟ این عملیات
                قابل بازگشت نیست و فایل‌های مرتبط نیز پاک می‌شوند.
              </>
            ) : (
              'آیا از حذف این مورد مطمئن هستید؟ این عملیات قابل بازگشت نیست و فایل‌های مرتبط نیز پاک می‌شوند.'
            )}
          </p>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={closeModal}
              disabled={isPending}
              className={styles.cancelBtn}
            >
              انصراف
            </button>

            <form action={formAction}>
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                disabled={isPending}
                className={styles.confirmDeleteBtn}
              >
                 بله، حذف شود.
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}