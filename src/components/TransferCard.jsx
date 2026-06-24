import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";
import { ConfirmationModal } from "./ConfirmationModal";
import styles from "./OperationCard.module.css";

const initialFormState = {
  destinationAccount: "",
  amount: "",
  description: ""
};

export function TransferCard({ currentAccount, onTransfer }) {
  const [formState, setFormState] = useState(initialFormState);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const confirmationDetails = useMemo(
    () => [
      {
        label: "Conta de origem",
        value: String(currentAccount.number)
      },
      {
        label: "Conta de destino",
        value: formState.destinationAccount || "-"
      },
      {
        label: "Valor",
        value: formatCurrency(Number(formState.amount) || 0)
      }
    ],
    [currentAccount.number, formState.amount, formState.destinationAccount]
  );

  function handleSubmit(event) {
    event.preventDefault();
    setShowConfirmation(true);
  }

  function handleConfirm() {
    const result = onTransfer(formState);

    if (result?.success) {
      setFormState(initialFormState);
    }

    setShowConfirmation(false);
  }

  return (
    <>
      <article className={styles.card}>
        <header className={styles.header}>
          <h3>Transferência</h3>
          <p>Envie valores para outra conta cadastrada no sistema.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Conta destino</span>
            <input
              name="destinationAccount"
              type="number"
              min="1"
              step="1"
              value={formState.destinationAccount}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  destinationAccount: event.target.value
                }))
              }
              placeholder="Ex.: 3"
            />
          </label>

          <label className={styles.field}>
            <span>Valor</span>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={formState.amount}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  amount: event.target.value
                }))
              }
              placeholder="Ex.: 80.00"
            />
          </label>

          <label className={styles.field}>
            <span>Descrição</span>
            <input
              name="description"
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  description: event.target.value
                }))
              }
              placeholder="Opcional: motivo da transferência"
            />
          </label>

          <button className={styles.button} type="submit">
            Revisar transferência
          </button>
        </form>
      </article>

      <ConfirmationModal
        open={showConfirmation}
        title="Confirmar transferência"
        description="Confira os dados antes de concluir a movimentação."
        details={confirmationDetails}
        confirmLabel="Confirmar agora"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
