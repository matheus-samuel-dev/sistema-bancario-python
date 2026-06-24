import { Copy, KeyRound, QrCode } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import styles from "./PixPanel.module.css";

const pixTypes = ["CPF", "E-mail", "Telefone", "Aleatória"];

const initialPixPayment = {
  pixKey: "",
  amount: "",
  description: ""
};

export function PixPanel({
  currentAccount,
  onRegisterPixKey,
  onPayPix,
  onNotify
}) {
  const [pixType, setPixType] = useState("CPF");
  const [pixKeyValue, setPixKeyValue] = useState("");
  const [paymentData, setPaymentData] = useState(initialPixPayment);

  async function handleCopyKey(key) {
    try {
      await navigator.clipboard.writeText(key);
      onNotify("success", "Chave PIX copiada para a área de transferência.");
    } catch (error) {
      onNotify("error", "Não foi possível copiar a chave PIX.");
    }
  }

  function handlePixKeySubmit(event) {
    event.preventDefault();
    const result = onRegisterPixKey({
      type: pixType,
      keyValue: pixKeyValue
    });

    if (result?.success) {
      setPixKeyValue("");
      setPixType("CPF");
    }
  }

  function handlePixPaymentSubmit(event) {
    event.preventDefault();
    const result = onPayPix(paymentData);

    if (result?.success) {
      setPaymentData(initialPixPayment);
    }
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Minha conta</p>
          <h3>Área PIX</h3>
        </div>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <div className={styles.cardTitle}>
            <KeyRound size={18} />
            <h4>Minhas chaves PIX</h4>
          </div>

          <form className={styles.form} onSubmit={handlePixKeySubmit}>
            <label className={styles.field}>
              <span>Tipo de chave</span>
              <select
                value={pixType}
                onChange={(event) => setPixType(event.target.value)}
              >
                {pixTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Chave</span>
              <input
                value={pixKeyValue}
                onChange={(event) => setPixKeyValue(event.target.value)}
                placeholder={
                  pixType === "Aleatória"
                    ? "Deixe em branco para gerar automaticamente"
                    : "Informe a chave PIX"
                }
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              Salvar chave
            </button>
          </form>

          <div className={styles.keyList}>
            {currentAccount.pixKeys.length ? (
              currentAccount.pixKeys.map((pixKey) => (
                <article key={pixKey.id} className={styles.keyItem}>
                  <div>
                    <span>{pixKey.type}</span>
                    <strong>{pixKey.key}</strong>
                  </div>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => handleCopyKey(pixKey.key)}
                    aria-label={`Copiar chave ${pixKey.key}`}
                  >
                    <Copy size={16} />
                  </button>
                </article>
              ))
            ) : (
              <p className={styles.emptyText}>
                Você ainda não cadastrou nenhuma chave PIX.
              </p>
            )}
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardTitle}>
            <QrCode size={18} />
            <h4>Pagar com PIX</h4>
          </div>

          <form className={styles.form} onSubmit={handlePixPaymentSubmit}>
            <label className={styles.field}>
              <span>Chave PIX de destino</span>
              <input
                value={paymentData.pixKey}
                onChange={(event) =>
                  setPaymentData((current) => ({
                    ...current,
                    pixKey: event.target.value
                  }))
                }
                placeholder="Cole ou digite a chave de destino"
              />
            </label>

            <label className={styles.field}>
              <span>Valor</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={paymentData.amount}
                onChange={(event) =>
                  setPaymentData((current) => ({
                    ...current,
                    amount: event.target.value
                  }))
                }
                placeholder="Ex.: 25.90"
              />
            </label>

            <label className={styles.field}>
              <span>Descrição</span>
              <input
                value={paymentData.description}
                onChange={(event) =>
                  setPaymentData((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
                placeholder="Opcional: motivo do pagamento"
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              Confirmar pagamento
            </button>
          </form>
        </article>
      </div>

      <article className={styles.historyPanel}>
        <div className={styles.cardTitle}>
          <QrCode size={18} />
          <h4>Histórico PIX</h4>
        </div>

        <div className={styles.historyList}>
          {currentAccount.pixHistory.length ? (
            currentAccount.pixHistory.map((item) => (
              <article key={item.id} className={styles.historyItem}>
                <div>
                  <span>
                    {item.direction === "sent" ? "PIX enviado" : "PIX recebido"}
                  </span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
                <p>{item.description}</p>
                <small>
                  {item.counterpartyName} · {formatDateTime(item.createdAt)}
                </small>
              </article>
            ))
          ) : (
            <p className={styles.emptyText}>
              O histórico PIX aparecerá aqui após as primeiras transações.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
