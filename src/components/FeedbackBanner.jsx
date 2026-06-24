import {
  AlertCircle,
  CheckCircle2,
  Info,
  X
} from "lucide-react";
import styles from "./FeedbackBanner.module.css";

function getToastIcon(type) {
  if (type === "success") {
    return CheckCircle2;
  }

  if (type === "error") {
    return AlertCircle;
  }

  return Info;
}

export function FeedbackBanner({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className={styles.stack} role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = getToastIcon(toast.type);

        return (
          <article
            key={toast.id}
            className={`${styles.toast} ${
              toast.type === "success" ? styles.success : styles.error
            }`}
          >
            <div className={styles.iconWrap}>
              <Icon size={18} />
            </div>

            <p className={styles.message}>{toast.message}</p>

            <button
              type="button"
              className={styles.closeButton}
              onClick={() => onDismiss(toast.id)}
              aria-label="Fechar mensagem"
            >
              <X size={16} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
