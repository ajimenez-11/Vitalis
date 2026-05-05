import styles from './Badge.module.css';

// variant: 'success' | 'warning' | 'danger' | 'neutral' | 'info'
export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}