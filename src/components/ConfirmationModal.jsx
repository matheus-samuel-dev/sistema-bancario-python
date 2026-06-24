import { AlertTriangle } from "lucide-react";
import styles from "./ConfirmationModal.module.css";

export function ConfirmationModal({
  open,
  title,
  description,
  details,
  confirmLabel,
  onCancel,
  onConfirm
}) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <AlertTriangle size={20} />
        </div>

        <div className={styles.content}>
          <h3>{title}</h3>
          <p>{description}</p>

          <div className={styles.detailGrid}>
            {details.map((detail) => (
              <div key={detail.label} className={styles.detailItem}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
