import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  formatCurrency,
  formatShortDay,
  getTransactionDelta
} from "../utils/formatters";
import styles from "./AnalyticsPanel.module.css";

const distributionColors = {
  "Abertura de conta": "#9ca3af",
  Depósito: "#34d399",
  Saque: "#f87171",
  Transferência: "#60a5fa",
  PIX: "#22d3ee"
};

function buildBalanceSeries(account) {
  const orderedTransactions = [...account.transactions].sort(
    (left, right) => new Date(left.createdAt) - new Date(right.createdAt)
  );

  let runningBalance = 0;

  return orderedTransactions.map((transaction) => {
    runningBalance += getTransactionDelta(transaction);

    return {
      date: formatShortDay(transaction.createdAt),
      saldo: runningBalance,
      descrição: transaction.description
    };
  });
}

function buildDistributionSeries(account) {
  const buckets = {
    "Abertura de conta": 0,
    Depósito: 0,
    Saque: 0,
    Transferência: 0,
    PIX: 0
  };

  account.transactions.forEach((transaction) => {
    if (transaction.type === "account_created") {
      buckets["Abertura de conta"] += 1;
      return;
    }

    if (transaction.type === "deposit") {
      buckets.Depósito += 1;
      return;
    }

    if (transaction.type === "withdrawal") {
      buckets.Saque += 1;
      return;
    }

    if (
      transaction.type === "transfer_sent" ||
      transaction.type === "transfer_received"
    ) {
      buckets.Transferência += 1;
      return;
    }

    if (transaction.type === "pix_sent" || transaction.type === "pix_received") {
      buckets.PIX += 1;
    }
  });

  return Object.entries(buckets)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value
    }));
}

export function AnalyticsPanel({ account }) {
  const balanceSeries = buildBalanceSeries(account);
  const distributionSeries = buildDistributionSeries(account);

  return (
    <section className={styles.grid}>
      <article className={styles.panel}>
        <header className={styles.header}>
          <div>
            <h3>Evolução do saldo</h3>
            <p>Histórico acumulado das movimentações da conta.</p>
          </div>
        </header>

        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceSeries}>
              <XAxis dataKey="date" stroke="#7f9aa5" />
              <YAxis
                stroke="#7f9aa5"
                tickFormatter={(value) => formatCurrency(value)}
                width={100}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "#081527",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#89f2de" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={styles.panel}>
        <header className={styles.header}>
          <div>
            <h3>Distribuição das operações</h3>
            <p>Participação de cada tipo no histórico de transações.</p>
          </div>
        </header>

        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionSeries}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={94}
                paddingAngle={4}
              >
                {distributionSeries.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={distributionColors[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} operação(ões)`}
                contentStyle={{
                  backgroundColor: "#081527",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
