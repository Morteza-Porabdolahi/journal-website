import styles from './SectionHead.module.css';

export default function SectionHead({ title, subtitle, children, className = '' }) {
  return (
    <div className={`${styles.sh} ${className}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
}