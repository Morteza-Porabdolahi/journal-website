import LoginForm from './LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.dot} aria-hidden="true" />
          <h1 className={styles.title}>پنل مدیریت نشریه کیمیا</h1>
          <p className={styles.subtitle}>برای مدیریت محتوا وارد حساب تحریریه شوید</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}