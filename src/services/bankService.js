const STORAGE_KEY = "vaultbank.state";
const SESSION_KEY = "vaultbank.session";
const ADMIN_SESSION_KEY = "vaultbank.adminSession";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  name: "Administrador do Sistema"
};

const demoTransactions = {
  account1: [
    {
      id: "tx-1",
      type: "account_created",
      amount: 0,
      description: "Conta criada no sistema.",
      createdAt: "2026-06-01T09:00:00.000Z"
    },
    {
      id: "tx-2",
      type: "deposit",
      amount: 1000,
      description: "Depósito inicial realizado via caixa.",
      createdAt: "2026-06-03T12:30:00.000Z"
    },
    {
      id: "tx-3",
      type: "withdrawal",
      amount: 250,
      description: "Saque em dinheiro.",
      createdAt: "2026-06-05T15:10:00.000Z"
    },
    {
      id: "tx-4",
      type: "transfer_sent",
      amount: 500,
      description: "Transferência enviada para a conta 3.",
      relatedAccount: 3,
      createdAt: "2026-06-06T10:45:00.000Z"
    }
  ],
  account2: [
    {
      id: "tx-5",
      type: "account_created",
      amount: 0,
      description: "Conta criada no sistema.",
      createdAt: "2026-06-02T11:20:00.000Z"
    },
    {
      id: "tx-6",
      type: "deposit",
      amount: 500,
      description: "Depósito em espécie.",
      createdAt: "2026-06-04T08:15:00.000Z"
    },
    {
      id: "tx-7",
      type: "transfer_sent",
      amount: 500,
      description: "Transferência enviada para a conta 3.",
      relatedAccount: 3,
      createdAt: "2026-06-06T10:47:00.000Z"
    }
  ],
  account3: [
    {
      id: "tx-8",
      type: "account_created",
      amount: 0,
      description: "Conta criada no sistema.",
      createdAt: "2026-06-02T16:45:00.000Z"
    },
    {
      id: "tx-9",
      type: "transfer_received",
      amount: 500,
      description: "Transferência recebida da conta 1.",
      relatedAccount: 1,
      createdAt: "2026-06-06T10:45:00.000Z"
    },
    {
      id: "tx-10",
      type: "transfer_received",
      amount: 500,
      description: "Transferência recebida da conta 2.",
      relatedAccount: 2,
      createdAt: "2026-06-06T10:47:00.000Z"
    }
  ]
};

const defaultState = {
  nextAccountNumber: 4,
  accounts: [
    {
      number: 1,
      holderName: "Matheus Samuel",
      password: "1234",
      balance: 250,
      createdAt: "2026-06-01T09:00:00.000Z",
      lastAccess: "2026-06-20T19:05:00.000Z",
      previousAccess: "2026-06-16T14:20:00.000Z",
      scheduledEntries: [],
      pixKeys: [
        {
          id: "pix-1",
          type: "CPF",
          key: "123.456.789-10",
          createdAt: "2026-06-01T09:15:00.000Z"
        }
      ],
      pixHistory: [],
      transactions: demoTransactions.account1
    },
    {
      number: 2,
      holderName: "Maria Silva",
      password: "1234",
      balance: 0,
      createdAt: "2026-06-02T11:20:00.000Z",
      lastAccess: "2026-06-18T10:10:00.000Z",
      previousAccess: "2026-06-12T08:40:00.000Z",
      scheduledEntries: [],
      pixKeys: [
        {
          id: "pix-2",
          type: "E-mail",
          key: "maria@vaultbank.dev",
          createdAt: "2026-06-02T11:40:00.000Z"
        }
      ],
      pixHistory: [],
      transactions: demoTransactions.account2
    },
    {
      number: 3,
      holderName: "João Santos",
      password: "1234",
      balance: 1000,
      createdAt: "2026-06-02T16:45:00.000Z",
      lastAccess: "2026-06-21T08:05:00.000Z",
      previousAccess: "2026-06-19T17:15:00.000Z",
      scheduledEntries: [],
      pixKeys: [
        {
          id: "pix-3",
          type: "Telefone",
          key: "+55 11 99999-0303",
          createdAt: "2026-06-02T17:00:00.000Z"
        }
      ],
      pixHistory: [],
      transactions: demoTransactions.account3
    }
  ]
};

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `tx-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function normalizeAmount(value) {
  const parsedValue = Number.parseFloat(String(value).replace(",", "."));

  if (!Number.isFinite(parsedValue)) {
    return NaN;
  }

  return Math.round(parsedValue * 100) / 100;
}

function normalizePixKey(key) {
  return key.trim().toLowerCase();
}

function getTransactionDelta(transaction) {
  if (
    transaction.type === "deposit" ||
    transaction.type === "transfer_received" ||
    transaction.type === "pix_received"
  ) {
    return Number(transaction.amount);
  }

  if (
    transaction.type === "withdrawal" ||
    transaction.type === "transfer_sent" ||
    transaction.type === "pix_sent"
  ) {
    return Number(transaction.amount) * -1;
  }

  return 0;
}

function buildSuccess(message, extra = {}) {
  return {
    success: true,
    message,
    ...extra
  };
}

function buildError(message) {
  return {
    success: false,
    message
  };
}

function resolveAccountIndex(state, accountNumber) {
  return state.accounts.findIndex((account) => account.number === accountNumber);
}

function sortTransactionsDescending(transactions) {
  return [...transactions].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
  );
}

function withComputedBalances(transactions) {
  const ascendingTransactions = [...transactions].sort(
    (left, right) => new Date(left.createdAt) - new Date(right.createdAt)
  );

  let runningBalance = 0;

  const balancedTransactions = ascendingTransactions.map((transaction) => {
    runningBalance += getTransactionDelta(transaction);

    return {
      ...transaction,
      balanceAfter:
        transaction.balanceAfter !== undefined
          ? Number(transaction.balanceAfter)
          : Math.round(runningBalance * 100) / 100
    };
  });

  return sortTransactionsDescending(balancedTransactions);
}

function createTransaction(type, amount, description, balanceAfter, relatedAccount) {
  return {
    id: createId(),
    type,
    amount,
    description,
    relatedAccount,
    balanceAfter,
    createdAt: new Date().toISOString()
  };
}

function createPixHistory(direction, key, amount, description, counterparty) {
  return {
    id: createId(),
    direction,
    key,
    amount,
    description,
    status: "Concluído",
    counterpartyAccount: counterparty.number,
    counterpartyName: counterparty.holderName,
    createdAt: new Date().toISOString()
  };
}

function ensurePixKeyShape(pixKey) {
  return {
    id: pixKey.id ?? createId(),
    type: pixKey.type ?? "Aleatória",
    key: pixKey.key ?? "",
    createdAt: pixKey.createdAt ?? new Date().toISOString()
  };
}

function ensurePixHistoryShape(item) {
  return {
    id: item.id ?? createId(),
    direction: item.direction ?? "sent",
    key: item.key ?? "",
    amount: Number(item.amount ?? 0),
    description: item.description ?? "Operação PIX registrada.",
    status: item.status ?? "Concluído",
    counterpartyAccount: item.counterpartyAccount ?? null,
    counterpartyName: item.counterpartyName ?? "Conta externa",
    createdAt: item.createdAt ?? new Date().toISOString()
  };
}

function ensureScheduledEntryShape(item) {
  return {
    id: item.id ?? createId(),
    title: item.title ?? "Lançamento futuro",
    amount: Number(item.amount ?? 0),
    dueDate: item.dueDate ?? new Date().toISOString(),
    type: item.type ?? "debit"
  };
}

function ensureTransactionShape(transaction) {
  return {
    id: transaction.id ?? createId(),
    type: transaction.type ?? "account_created",
    amount: Number(transaction.amount ?? 0),
    description: transaction.description ?? "Movimentação registrada.",
    relatedAccount: transaction.relatedAccount ?? null,
    createdAt: transaction.createdAt ?? new Date().toISOString(),
    balanceAfter:
      transaction.balanceAfter !== undefined
        ? Number(transaction.balanceAfter)
        : undefined
  };
}

function ensureAccountShape(account, fallbackNumber) {
  return {
    number: account.number ?? fallbackNumber,
    holderName: account.holderName ?? "Titular",
    password: account.password ?? "1234",
    balance: Number(account.balance ?? 0),
    createdAt: account.createdAt ?? new Date().toISOString(),
    lastAccess: account.lastAccess ?? account.createdAt ?? null,
    previousAccess: account.previousAccess ?? null,
    scheduledEntries: Array.isArray(account.scheduledEntries)
      ? account.scheduledEntries.map(ensureScheduledEntryShape)
      : [],
    pixKeys: Array.isArray(account.pixKeys)
      ? account.pixKeys.map(ensurePixKeyShape)
      : [],
    pixHistory: Array.isArray(account.pixHistory)
      ? account.pixHistory.map(ensurePixHistoryShape)
      : [],
    transactions: withComputedBalances(
      Array.isArray(account.transactions)
        ? account.transactions.map(ensureTransactionShape)
        : [createTransaction("account_created", 0, "Conta criada no sistema.", 0)]
    )
  };
}

function normalizeState(rawState) {
  const stateToNormalize = rawState?.accounts ? rawState : defaultState;

  return {
    nextAccountNumber:
      stateToNormalize.nextAccountNumber ?? stateToNormalize.accounts.length + 1,
    accounts: stateToNormalize.accounts.map((account, index) =>
      ensureAccountShape(account, index + 1)
    )
  };
}

function createPixKeyValue(type, keyValue, accountNumber) {
  if (type === "Aleatória" && !keyValue.trim()) {
    const randomChunk = Math.random().toString(36).slice(2, 10);
    return `vaultbank-${accountNumber}-${randomChunk}`;
  }

  return keyValue.trim();
}

function findPixOwner(state, pixKey) {
  const normalizedKey = normalizePixKey(pixKey);

  for (const account of state.accounts) {
    const matchedKey = account.pixKeys.find(
      (item) => normalizePixKey(item.key) === normalizedKey
    );

    if (matchedKey) {
      return {
        account,
        pixKey: matchedKey
      };
    }
  }

  return null;
}

export function loadBankState() {
  const savedState = window.localStorage.getItem(STORAGE_KEY);

  if (savedState) {
    try {
      return normalizeState(JSON.parse(savedState));
    } catch (error) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  return normalizeState(cloneState(defaultState));
}

export function saveBankState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadSessionAccountNumber() {
  const savedSession = window.localStorage.getItem(SESSION_KEY);

  if (!savedSession) {
    return null;
  }

  const parsedValue = Number.parseInt(savedSession, 10);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function saveSessionAccountNumber(accountNumber) {
  window.localStorage.setItem(SESSION_KEY, String(accountNumber));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function loadAdminSession() {
  const savedSession = window.localStorage.getItem(ADMIN_SESSION_KEY);

  if (!savedSession) {
    return null;
  }

  try {
    return JSON.parse(savedSession);
  } catch (error) {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

export function saveAdminSession(adminSession) {
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function authenticateAdmin(payload, previousSession) {
  const username = payload.username.trim();
  const password = payload.password.trim();

  if (!username || !password) {
    return buildError("Informe usuário e senha do administrador.");
  }

  if (
    username !== ADMIN_CREDENTIALS.username ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    return buildError("Credenciais administrativas inválidas.");
  }

  const nextSession = {
    username: ADMIN_CREDENTIALS.username,
    name: ADMIN_CREDENTIALS.name,
    lastAccess: new Date().toISOString(),
    previousAccess: previousSession?.lastAccess ?? null
  };

  return buildSuccess("Login administrativo realizado com sucesso.", {
    adminSession: nextSession
  });
}

export function getAccountByNumber(state, accountNumber) {
  if (!accountNumber) {
    return null;
  }

  return state.accounts.find((account) => account.number === accountNumber) ?? null;
}

export function authenticateAccount(state, payload) {
  const accountNumber = Number.parseInt(payload.accountNumber, 10);
  const password = payload.password.trim();

  if (!Number.isFinite(accountNumber)) {
    return buildError("Informe um número de conta válido.");
  }

  if (!password) {
    return buildError("Informe a senha para entrar.");
  }

  const account = getAccountByNumber(state, accountNumber);

  if (!account || account.password !== password) {
    return buildError("Conta ou senha incorretos.");
  }

  const nextState = cloneState(state);
  const accountIndex = resolveAccountIndex(nextState, accountNumber);
  const accountToUpdate = nextState.accounts[accountIndex];

  accountToUpdate.previousAccess =
    accountToUpdate.lastAccess ?? accountToUpdate.createdAt ?? null;
  accountToUpdate.lastAccess = new Date().toISOString();

  return buildSuccess(
    `Login realizado com sucesso. Bem-vindo(a), ${account.holderName}.`,
    {
      accountNumber,
      state: nextState
    }
  );
}

export function createAccount(state, payload) {
  const holderName = payload.holderName.trim();
  const password = payload.password.trim();
  const confirmPassword = payload.confirmPassword.trim();

  if (holderName.length < 3) {
    return buildError("Informe o nome do titular com pelo menos 3 caracteres.");
  }

  if (password.length < 4) {
    return buildError("Crie uma senha com no mínimo 4 caracteres.");
  }

  if (password !== confirmPassword) {
    return buildError("A confirmação da senha não confere.");
  }

  const nextState = cloneState(state);
  const accountNumber = nextState.nextAccountNumber;
  const timestamp = new Date().toISOString();

  nextState.accounts.unshift({
    number: accountNumber,
    holderName,
    password,
    balance: 0,
    createdAt: timestamp,
    lastAccess: timestamp,
    previousAccess: null,
    scheduledEntries: [],
    pixKeys: [],
    pixHistory: [],
    transactions: [
      createTransaction("account_created", 0, "Conta criada no sistema.", 0)
    ]
  });
  nextState.nextAccountNumber += 1;

  return buildSuccess(
    `Conta ${accountNumber} criada com sucesso. A sessão já está liberada.`,
    {
      state: nextState,
      accountNumber
    }
  );
}

export function runDeposit(state, sessionAccountNumber, payload) {
  const amount = normalizeAmount(payload.amount);
  const description =
    payload.description.trim() || "Depósito realizado pelo painel web.";

  if (!Number.isFinite(amount) || amount <= 0) {
    return buildError("Informe um valor de depósito maior que zero.");
  }

  const nextState = cloneState(state);
  const accountIndex = resolveAccountIndex(nextState, sessionAccountNumber);

  if (accountIndex === -1) {
    return buildError("Sessão inválida. Entre novamente.");
  }

  const account = nextState.accounts[accountIndex];
  account.balance += amount;
  account.transactions.unshift(
    createTransaction("deposit", amount, description, account.balance)
  );

  return buildSuccess("Depósito realizado com sucesso.", {
    state: nextState
  });
}

export function runWithdraw(state, sessionAccountNumber, payload) {
  const amount = normalizeAmount(payload.amount);
  const description =
    payload.description.trim() || "Saque realizado pelo painel web.";

  if (!Number.isFinite(amount) || amount <= 0) {
    return buildError("Informe um valor de saque maior que zero.");
  }

  const nextState = cloneState(state);
  const accountIndex = resolveAccountIndex(nextState, sessionAccountNumber);

  if (accountIndex === -1) {
    return buildError("Sessão inválida. Entre novamente.");
  }

  const account = nextState.accounts[accountIndex];

  if (amount > account.balance) {
    return buildError("Saldo insuficiente para concluir o saque.");
  }

  account.balance -= amount;
  account.transactions.unshift(
    createTransaction("withdrawal", amount, description, account.balance)
  );

  return buildSuccess("Saque realizado com sucesso.", {
    state: nextState
  });
}

export function runTransfer(state, sessionAccountNumber, payload) {
  const amount = normalizeAmount(payload.amount);
  const destinationNumber = Number.parseInt(payload.destinationAccount, 10);
  const description = payload.description.trim();

  if (!Number.isFinite(destinationNumber)) {
    return buildError("Informe uma conta de destino válida.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return buildError("Informe um valor de transferência maior que zero.");
  }

  const nextState = cloneState(state);
  const originIndex = resolveAccountIndex(nextState, sessionAccountNumber);
  const destinationIndex = resolveAccountIndex(nextState, destinationNumber);

  if (originIndex === -1) {
    return buildError("Sessão inválida. Entre novamente.");
  }

  if (destinationIndex === -1) {
    return buildError("A conta de destino não existe.");
  }

  if (sessionAccountNumber === destinationNumber) {
    return buildError("Escolha outra conta para transferir.");
  }

  const originAccount = nextState.accounts[originIndex];
  const destinationAccount = nextState.accounts[destinationIndex];

  if (amount > originAccount.balance) {
    return buildError("Saldo insuficiente para concluir a transferência.");
  }

  originAccount.balance -= amount;
  destinationAccount.balance += amount;

  const sentDescription =
    description || `Transferência enviada para a conta ${destinationNumber}.`;
  const receivedDescription =
    description || `Transferência recebida da conta ${sessionAccountNumber}.`;

  originAccount.transactions.unshift(
    createTransaction(
      "transfer_sent",
      amount,
      sentDescription,
      originAccount.balance,
      destinationNumber
    )
  );
  destinationAccount.transactions.unshift(
    createTransaction(
      "transfer_received",
      amount,
      receivedDescription,
      destinationAccount.balance,
      sessionAccountNumber
    )
  );

  return buildSuccess("Transferência realizada com sucesso.", {
    state: nextState
  });
}

export function registerPixKey(state, sessionAccountNumber, payload) {
  const type = payload.type || "Aleatória";
  const nextState = cloneState(state);
  const accountIndex = resolveAccountIndex(nextState, sessionAccountNumber);

  if (accountIndex === -1) {
    return buildError("Sessão inválida. Entre novamente.");
  }

  const account = nextState.accounts[accountIndex];
  const keyValue = createPixKeyValue(type, payload.keyValue ?? "", account.number);

  if (!keyValue) {
    return buildError("Informe uma chave PIX válida.");
  }

  const existingOwner = findPixOwner(nextState, keyValue);

  if (existingOwner) {
    return buildError("Essa chave PIX já está cadastrada no sistema.");
  }

  account.pixKeys.unshift({
    id: createId(),
    type,
    key: keyValue,
    createdAt: new Date().toISOString()
  });

  return buildSuccess("Chave PIX cadastrada com sucesso.", {
    state: nextState
  });
}

export function runPixPayment(state, sessionAccountNumber, payload) {
  const pixKey = payload.pixKey.trim();
  const amount = normalizeAmount(payload.amount);
  const description = payload.description.trim();

  if (!pixKey) {
    return buildError("Informe a chave PIX de destino.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return buildError("Informe um valor de pagamento PIX maior que zero.");
  }

  const nextState = cloneState(state);
  const originIndex = resolveAccountIndex(nextState, sessionAccountNumber);

  if (originIndex === -1) {
    return buildError("Sessão inválida. Entre novamente.");
  }

  const destination = findPixOwner(nextState, pixKey);

  if (!destination) {
    return buildError("Nenhuma conta foi encontrada com essa chave PIX.");
  }

  if (destination.account.number === sessionAccountNumber) {
    return buildError("Escolha uma chave PIX de outra conta.");
  }

  const originAccount = nextState.accounts[originIndex];

  if (amount > originAccount.balance) {
    return buildError("Saldo insuficiente para concluir o pagamento PIX.");
  }

  const destinationIndex = resolveAccountIndex(
    nextState,
    destination.account.number
  );
  const destinationAccount = nextState.accounts[destinationIndex];

  originAccount.balance -= amount;
  destinationAccount.balance += amount;

  const sentDescription =
    description || `Pagamento PIX para ${destinationAccount.holderName}.`;
  const receivedDescription = `Recebimento PIX de ${originAccount.holderName}.`;

  originAccount.transactions.unshift(
    createTransaction(
      "pix_sent",
      amount,
      sentDescription,
      originAccount.balance,
      destinationAccount.number
    )
  );
  destinationAccount.transactions.unshift(
    createTransaction(
      "pix_received",
      amount,
      receivedDescription,
      destinationAccount.balance,
      originAccount.number
    )
  );

  originAccount.pixHistory.unshift(
    createPixHistory(
      "sent",
      destination.pixKey.key,
      amount,
      sentDescription,
      destinationAccount
    )
  );
  destinationAccount.pixHistory.unshift(
    createPixHistory(
      "received",
      destination.pixKey.key,
      amount,
      receivedDescription,
      originAccount
    )
  );

  return buildSuccess("Pagamento PIX realizado com sucesso.", {
    state: nextState
  });
}
