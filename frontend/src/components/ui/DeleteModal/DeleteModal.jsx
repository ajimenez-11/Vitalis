import { MdDeleteOutline, MdWarningAmber, MdErrorOutline } from 'react-icons/md';
import Modal from '../Modal/Modal';
import { Button } from '../index';
import styles from './DeleteModal.module.css';

export default function DeleteModal({ title, itemName, onClose, onConfirm, deleting, error }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel·lar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={deleting}>
            <MdDeleteOutline size={15} />
            {deleting ? 'Eliminant...' : 'Eliminar'}
          </Button>
        </>
      }
    >
      {error && (
        <div className={styles.errorBox}>
          <MdErrorOutline size={15} />
          <span>{error}</span>
        </div>
      )}
      <div className={styles.warningBox}>
        <MdWarningAmber size={16} />
        <p className={styles.warningText}>Estàs a punt d'eliminar permanentment:</p>
      </div>
      {itemName && (
        <div className={styles.itemName}>
          <span>{itemName}</span>
        </div>
      )}
    </Modal>
  );
}