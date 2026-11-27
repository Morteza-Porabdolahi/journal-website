'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import styles from './login.module.css';

const initialState = { error: '' };

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        initialState
    );

    return (
        <form action={formAction} className={styles.form} noValidate>
            {state?.error && (
                <div className={styles.errorBox} role="alert">
                    {state.error}
                </div>
            )}

            <label className={styles.field}>
                <span className={styles.label}>ایمیل</span>
                <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    placeholder="editor@example.com"
                    className={styles.input}
                    disabled={isPending}
                />
            </label>

            <label className={styles.field}>
                <span className={styles.label}>رمز عبور</span>
                <input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    dir="ltr"
                    placeholder="••••••••"
                    className={styles.input}
                    disabled={isPending}
                />
            </label>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={isPending}
            >
                {isPending ? 'در حال بررسی...' : 'ورود به پنل مدیریت'}
            </button>
        </form>
    );
}
