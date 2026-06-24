import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Clock3,
  Home,
  Landmark,
  LogOut,
  ReceiptText,
  UserRound
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatCurrency,
  formatDate,
  formatDateTime
} from "../utils/formatters";
import { OperationCard } from "./OperationCard";
import { PixPanel } from "./PixPanel";
import { TransactionsTable } from "./TransactionsTable";
import { TransferCard } from "./TransferCard";
import styles from "./Dashboard.module.css";

const menuItems = [
  { id: "home", label: "Início", icon: Home },
  { id: "deposit", label: "Depósito", icon: ArrowDownToLine },
  { id: "withdraw", label: "Saque", icon: ArrowUpFromLine },
  { id: "transfer", label: "Transferência", icon: ArrowLeftRight },
  { id: "statement", label: "Extrato", icon: ReceiptText },
  { id: "account", label: "Minha conta", icon: UserRound }
];

export function Dashboard({
  currentAccount,
  onDeposit,
  onWithdraw,
  onTransfer,
  onRegisterPixKey,
  onPayPix,
  onLogout,
  onNotify
}) {
  const [activeSection, setActiveSection] = useState("home");

  const recentTransactions = useMemo(
    () => currentAccount.transactions.slice(0, 5),
    [currentAccount.transactions]
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.badge}>
            <Landmark size={16} />
            VaultBank
          </div>
          <h1>Internet Banking</h1>
          <p>
            Olá, {currentAccount.holderName}. Conta {currentAccount.number} ativa
            e pronta para movimentações.
          </p>
        </div>

        <div className={styles.headerAside}>
          <article className={styles.sessionCard}>
            <span>Último acesso</span>
            <strong>
              {currentAccount.previousAccess
                ? formatDateTime(currentAccount.previousAccess)
                : "Primeiro acesso nesta conta"}
            </strong>
          </article>

          <button className={styles.logoutButton} type="button" onClick={onLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.menu}>
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={
                    activeSection === item.id ? styles.activeMenuItem : styles.menuItem
                  }
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              className={styles.menuItem}
              onClick={onLogout}
            >
              <LogOut size={17} />
              Sair
            </button>
          </nav>
        </aside>

        <section className={styles.content}>
          {activeSection === "home" ? (
            <div className={styles.sectionStack}>
              <section className={styles.balancePanel}>
                <div>
                  <p className={styles.panelEyebrow}>Saldo atual</p>
                  <strong>{formatCurrency(currentAccount.balance)}</strong>
                  <span>Conta {currentAccount.number}</span>
                </div>
              </section>

              <section className={styles.quickActions}>
                <button
                  type="button"
                  className={styles.quickAction}
                  onClick={() => setActiveSection("deposit")}
                >
                  <ArrowDownToLine size={18} />
                  <span>Depósito</span>
                </button>
                <button
                  type="button"
                  className={styles.quickAction}
                  onClick={() => setActiveSection("withdraw")}
                >
                  <ArrowUpFromLine size={18} />
                  <span>Saque</span>
                </button>
                <button
                  type="button"
                  className={styles.quickAction}
                  onClick={() => setActiveSection("transfer")}
                >
                  <ArrowLeftRight size={18} />
                  <span>Transferência</span>
                </button>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Últimas movimentações</h2>
                    <p>Resumo rápido das operações mais recentes.</p>
                  </div>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => setActiveSection("statement")}
                  >
                    Ver extrato completo
                  </button>
                </div>

                <div className={styles.recentList}>
                  {recentTransactions.map((transaction) => (
                    <article key={transaction.id} className={styles.recentItem}>
                      <div>
                        <strong>{transaction.description}</strong>
                        <span>{formatDateTime(transaction.createdAt)}</span>
                      </div>
                      <b>{formatCurrency(transaction.amount)}</b>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Lançamentos futuros</h2>
                    <p>Compromissos agendados para a conta.</p>
                  </div>
                </div>

                {currentAccount.scheduledEntries.length ? (
                  <div className={styles.futureList}>
                    {currentAccount.scheduledEntries.map((entry) => (
                      <article key={entry.id} className={styles.futureItem}>
                        <div>
                          <strong>{entry.title}</strong>
                          <span>{formatDate(entry.dueDate)}</span>
                        </div>
                        <b>{formatCurrency(entry.amount)}</b>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <Clock3 size={18} />
                    <span>Nenhum lançamento futuro cadastrado.</span>
                  </div>
                )}
              </section>
            </div>
          ) : null}

          {activeSection === "deposit" ? (
            <OperationCard
              title="Depósito"
              subtitle="Informe o valor e, se quiser, adicione uma descrição."
              buttonLabel="Confirmar depósito"
              onSubmit={onDeposit}
              fields={[
                {
                  name: "amount",
                  label: "Valor",
                  type: "number",
                  min: "0.01",
                  step: "0.01",
                  placeholder: "Ex.: 250.00"
                },
                {
                  name: "description",
                  label: "Descrição",
                  placeholder: "Opcional: origem do valor"
                }
              ]}
            />
          ) : null}

          {activeSection === "withdraw" ? (
            <OperationCard
              title="Saque"
              subtitle="O sistema bloqueia saques maiores que o saldo disponível."
              buttonLabel="Confirmar saque"
              onSubmit={onWithdraw}
              fields={[
                {
                  name: "amount",
                  label: "Valor",
                  type: "number",
                  min: "0.01",
                  step: "0.01",
                  placeholder: "Ex.: 120.00"
                },
                {
                  name: "description",
                  label: "Descrição",
                  placeholder: "Opcional: finalidade"
                }
              ]}
            />
          ) : null}

          {activeSection === "transfer" ? (
            <TransferCard
              currentAccount={currentAccount}
              onTransfer={onTransfer}
            />
          ) : null}

          {activeSection === "statement" ? (
            <TransactionsTable account={currentAccount} onNotify={onNotify} />
          ) : null}

          {activeSection === "account" ? (
            <div className={styles.sectionStack}>
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Minha conta</h2>
                    <p>Informações principais da conta e dados de acesso.</p>
                  </div>
                </div>

                <dl className={styles.accountDetails}>
                  <div>
                    <dt>Titular</dt>
                    <dd>{currentAccount.holderName}</dd>
                  </div>
                  <div>
                    <dt>Número da conta</dt>
                    <dd>{currentAccount.number}</dd>
                  </div>
                  <div>
                    <dt>Saldo atual</dt>
                    <dd>{formatCurrency(currentAccount.balance)}</dd>
                  </div>
                  <div>
                    <dt>Último acesso</dt>
                    <dd>
                      {currentAccount.lastAccess
                        ? formatDateTime(currentAccount.lastAccess)
                        : "Sem registro"}
                    </dd>
                  </div>
                </dl>
              </section>

              <PixPanel
                currentAccount={currentAccount}
                onRegisterPixKey={onRegisterPixKey}
                onPayPix={onPayPix}
                onNotify={onNotify}
              />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
