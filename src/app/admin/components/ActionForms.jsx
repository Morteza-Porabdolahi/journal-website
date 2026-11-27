'use client';

import { useActionState } from 'react';
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
  children,
}) {
  const [_, formAction, isPending] = useActionState(
    (_, formData) => runWithToast(action, formData),
    null
  );

  return (
    <form action={formAction}>
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
}) {
  const [_, formAction, isPending] = useActionState(
    (_, formData) => runWithToast(action, formData),
    null
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={isPending} className={styles.deleteBtn}>
        {label}
      </button>
    </form>
  );
}