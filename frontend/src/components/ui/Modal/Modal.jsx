import styles from './Modal.module.css';

export default function Modal({ title, children, actions, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}