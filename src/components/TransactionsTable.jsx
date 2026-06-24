import { Download } from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  formatOperation,
  getOperationSignal,
  getOperationTone
} from "../utils/formatters";
import styles from "./TransactionsTable.module.css";

async function exportStatementPdf(account) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);

  const document = new jsPDF();

  document.setFontSize(18);
  document.text("Extrato Bancário", 14, 18);
  document.setFontSize(11);
  document.text(`Conta ${account.number} - ${account.holderName}`, 14, 26);
  document.text(`Gerado em ${formatDateTime(new Date())}`, 14, 32);

  autoTable(document, {
    startY: 40,
    head: [["Data", "Operação", "Valor", "Descrição", "Saldo após"]],
    body: account.transactions.map((transaction) => [
      formatDateTime(transaction.createdAt),
      formatOperation(transaction.type),
      `${getOperationSignal(transaction.type)}${formatCurrency(transaction.amount)}`,
      transaction.description,
      formatCurrency(transaction.balanceAfter ?? 0)
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [20, 184, 166]
    }
  });

  document.save(`extrato-conta-${account.number}.pdf`);
}

export function TransactionsTable({ account, onNotify }) {
  async function handleExportPdf() {
    try {
      await exportStatementPdf(account);
      onNotify("success", "Extrato exportado em PDF com sucesso.");
    } catch (error) {
      onNotify("error", "Não foi possível exportar o extrato em PDF.");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div>
          <h3>Extrato da conta</h3>
          <p>Histórico completo das movimentações registradas.</p>
        </div>

        <button
          type="button"
          className={styles.exportButton}
          onClick={handleExportPdf}
        >
          <Download size={16} />
          Exportar PDF
        </button>
      </div>

      <div className={styles.tableArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Operação</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Saldo após</th>
            </tr>
          </thead>

          <tbody>
            {account.transactions.map((transaction) => {
              const signal = getOperationSignal(transaction.type);
              const valueClass =
                signal === "+"
                  ? styles.positive
                  : signal === "-"
                    ? styles.negative
                    : styles.neutral;
              const tone = getOperationTone(transaction.type);

              return (
                <tr key={transaction.id}>
                  <td>{formatDateTime(transaction.createdAt)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[tone]}`}>
                      {formatOperation(transaction.type)}
                    </span>
                  </td>
                  <td className={valueClass}>
                    {signal}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>{transaction.description}</td>
                  <td>{formatCurrency(transaction.balanceAfter ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.mobileList}>
          {account.transactions.map((transaction) => {
            const signal = getOperationSignal(transaction.type);
            const valueClass =
              signal === "+"
                ? styles.positive
                : signal === "-"
                  ? styles.negative
                  : styles.neutral;
            const tone = getOperationTone(transaction.type);

            return (
              <article key={transaction.id} className={styles.mobileItem}>
                <div className={styles.mobileHeader}>
                  <span className={`${styles.badge} ${styles[tone]}`}>
                    {formatOperation(transaction.type)}
                  </span>
                  <strong className={valueClass}>
                    {signal}
                    {formatCurrency(transaction.amount)}
                  </strong>
                </div>
                <p>{transaction.description}</p>
                <small>{formatDateTime(transaction.createdAt)}</small>
                <small>Saldo após: {formatCurrency(transaction.balanceAfter ?? 0)}</small>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
