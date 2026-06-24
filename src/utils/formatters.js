const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

const longDateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "medium"
});

const shortDayFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short"
});

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium"
});

const operationLabels = {
  account_created: "Abertura de conta",
  deposit: "Depósito",
  withdrawal: "Saque",
  transfer_sent: "Transferência enviada",
  transfer_received: "Transferência recebida",
  pix_sent: "PIX enviado",
  pix_received: "PIX recebido"
};

export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatLongDateTime(value) {
  return longDateTimeFormatter.format(new Date(value));
}

export function formatShortDay(value) {
  return shortDayFormatter.format(new Date(value));
}

export function formatDate(value) {
  return fullDateFormatter.format(new Date(value));
}

export function formatOperation(type) {
  return operationLabels[type] ?? "Movimentação";
}

export function getOperationSignal(type) {
  if (
    type === "withdrawal" ||
    type === "transfer_sent" ||
    type === "pix_sent"
  ) {
    return "-";
  }

  if (
    type === "deposit" ||
    type === "transfer_received" ||
    type === "pix_received"
  ) {
    return "+";
  }

  return "";
}

export function getOperationTone(type) {
  if (type === "deposit") {
    return "success";
  }

  if (type === "withdrawal") {
    return "danger";
  }

  if (type === "transfer_sent" || type === "transfer_received") {
    return "info";
  }

  if (type === "pix_sent" || type === "pix_received") {
    return "pix";
  }

  return "neutral";
}

export function getAvatarInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getTransactionDelta(transaction) {
  if (
    transaction.type === "deposit" ||
    transaction.type === "transfer_received" ||
    transaction.type === "pix_received"
  ) {
    return transaction.amount;
  }

  if (
    transaction.type === "withdrawal" ||
    transaction.type === "transfer_sent" ||
    transaction.type === "pix_sent"
  ) {
    return transaction.amount * -1;
  }

  return 0;
}

export function getAccountMetrics(account) {
  return account.transactions.reduce(
    (metrics, transaction) => {
      if (transaction.type === "deposit") {
        metrics.totalDeposited += transaction.amount;
      }

      if (transaction.type === "withdrawal") {
        metrics.totalWithdrawn += transaction.amount;
      }

      if (
        transaction.type === "transfer_sent" ||
        transaction.type === "pix_sent"
      ) {
        metrics.totalTransferred += transaction.amount;
      }

      if (
        transaction.type === "transfer_received" ||
        transaction.type === "pix_received"
      ) {
        metrics.totalReceived += transaction.amount;
      }

      return metrics;
    },
    {
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalTransferred: 0,
      totalReceived: 0
    }
  );
}
