import { LogOut, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatCurrency,
  formatDateTime,
  formatLongDateTime,
  formatOperation
} from "../utils/formatters";
import styles from "./AdminDashboard.module.css";

function getSystemBalance(accounts) {
  return accounts.reduce((total, account) => total + account.balance, 0);
}

export function AdminDashboard({
  adminSession,
  accounts,
  globalTransactions,
  onLogout
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return accounts;
    }

    return accounts.filter((account) => {
      return (
        account.holderName.toLowerCase().includes(normalizedTerm) ||
        String(account.number).includes(normalizedTerm)
      );
    });
  }, [accounts, searchTerm]);

  const systemBalance = getSystemBalance(accounts);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.badge}>
            <ShieldCheck size={16} />
            Área administrativa
          </div>
          <h1>Painel de administração</h1>
          <p>
            Controle de contas, consulta de usuários e histórico geral de
            movimentações.
          </p>
        </div>

        <div className={styles.headerAside}>
          <div className={styles.sessionCard}>
            <strong>{adminSession.name}</strong>
            
            <span>
              Último acesso: {formatLongDateTime(adminSession.lastAccess)}
            </span>
          </div>

          <button className={styles.logoutButton} type="button" onClick={onLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <nav className={styles.nav}>
        <button
          type="button"
          className={activeSection === "overview" ? styles.activeNav : styles.navButton}
          onClick={() => setActiveSection("overview")}
        >
          Resumo
        </button>
        <button
          type="button"
          className={activeSection === "accounts" ? styles.activeNav : styles.navButton}
          onClick={() => setActiveSection("accounts")}
        >
          Contas
        </button>
        <button
          type="button"
          className={activeSection === "movements" ? styles.activeNav : styles.navButton}
          onClick={() => setActiveSection("movements")}
        >
          Movimentações
        </button>
      </nav>

      {activeSection === "overview" ? (
        <section className={styles.grid}>
          <article className={styles.statCard}>
            <span>Total de contas</span>
            <strong>{accounts.length}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Saldo total do sistema</span>
            <strong>{formatCurrency(systemBalance)}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Movimentações registradas</span>
            <strong>{globalTransactions.length}</strong>
          </article>
        </section>
      ) : null}

      {activeSection === "accounts" ? (
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Contas criadas</h2>
              <p>Consulta protegida de usuários e saldo atual.</p>
            </div>

            <label className={styles.searchField}>
              <Search size={16} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome ou conta"
              />
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Conta</th>
                  <th>Titular</th>
                  <th>Saldo</th>
                  <th>Último acesso</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.number}>
                    <td>{account.number}</td>
                    <td>{account.holderName}</td>
                    <td>{formatCurrency(account.balance)}</td>
                    <td>
                      {account.lastAccess
                        ? formatDateTime(account.lastAccess)
                        : "Sem acesso"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.mobileList}>
              {filteredAccounts.map((account) => (
                <article key={account.number} className={styles.mobileCard}>
                  <strong>Conta {account.number}</strong>
                  <span className={styles.mobileMeta}>{account.holderName}</span>
                  <span>Saldo: {formatCurrency(account.balance)}</span>
                  <small>
                    Último acesso:{" "}
                    {account.lastAccess
                      ? formatDateTime(account.lastAccess)
                      : "Sem acesso"}
                  </small>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeSection === "movements" ? (
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Histórico geral de movimentações</h2>
              <p>Últimos lançamentos registrados em todo o sistema.</p>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Conta</th>
                  <th>Titular</th>
                  <th>Operação</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {globalTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDateTime(transaction.createdAt)}</td>
                    <td>{transaction.accountNumber}</td>
                    <td>{transaction.holderName}</td>
                    <td>{formatOperation(transaction.type)}</td>
                    <td>{formatCurrency(transaction.amount)}</td>
                    <td>{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.mobileList}>
              {globalTransactions.map((transaction) => (
                <article key={transaction.id} className={styles.mobileCard}>
                  <strong>{formatOperation(transaction.type)}</strong>
                  <span className={styles.mobileMeta}>
                    Conta {transaction.accountNumber} · {transaction.holderName}
                  </span>
                  <span>{formatCurrency(transaction.amount)}</span>
                  <small>{formatDateTime(transaction.createdAt)}</small>
                  <small>{transaction.description}</small>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
