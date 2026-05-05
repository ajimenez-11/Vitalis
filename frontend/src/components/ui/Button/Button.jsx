import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost'
  size = 'md',         // 'sm' | 'md'
  disabled,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}