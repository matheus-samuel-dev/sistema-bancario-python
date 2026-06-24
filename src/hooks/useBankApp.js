import { useEffect, useMemo, useState } from "react";
import {
  authenticateAccount,
  authenticateAdmin,
  clearAdminSession,
  clearSession,
  createAccount,
  getAccountByNumber,
  loadAdminSession,
  loadBankState,
  loadSessionAccountNumber,
  registerPixKey,
  runDeposit,
  runPixPayment,
  runTransfer,
  runWithdraw,
  saveAdminSession,
  saveBankState,
  saveSessionAccountNumber
} from "../services/bankService";

function buildGlobalTransactions(accounts) {
  return accounts
    .flatMap((account) =>
      account.transactions.map((transaction) => ({
        ...transaction,
        accountNumber: account.number,
        holderName: account.holderName
      }))
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

export function useBankApp() {
  const [bankState, setBankState] = useState(() => loadBankState());
  const [sessionAccountNumber, setSessionAccountNumber] = useState(() =>
    loadSessionAccountNumber()
  );
  const [adminSession, setAdminSession] = useState(() => loadAdminSession());

  useEffect(() => {
    saveBankState(bankState);
  }, [bankState]);

  useEffect(() => {
    if (sessionAccountNumber) {
      saveSessionAccountNumber(sessionAccountNumber);
      return;
    }

    clearSession();
  }, [sessionAccountNumber]);

  useEffect(() => {
    if (adminSession) {
      saveAdminSession(adminSession);
      return;
    }

    clearAdminSession();
  }, [adminSession]);

  const currentAccount = getAccountByNumber(bankState, sessionAccountNumber);

  useEffect(() => {
    if (sessionAccountNumber && !currentAccount) {
      setSessionAccountNumber(null);
    }
  }, [currentAccount, sessionAccountNumber]);

  const globalTransactions = useMemo(
    () => buildGlobalTransactions(bankState.accounts),
    [bankState.accounts]
  );

  function login(payload) {
    const result = authenticateAccount(bankState, payload);

    if (result.success) {
      setBankState(result.state);
      setSessionAccountNumber(result.accountNumber);
      setAdminSession(null);
    }

    return result;
  }

  function loginAdmin(payload) {
    const result = authenticateAdmin(payload, adminSession);

    if (result.success) {
      setAdminSession(result.adminSession);
      setSessionAccountNumber(null);
    }

    return result;
  }

  function register(payload) {
    const result = createAccount(bankState, payload);

    if (result.success) {
      setBankState(result.state);
      setSessionAccountNumber(result.accountNumber);
      setAdminSession(null);
    }

    return result;
  }

  function deposit(payload) {
    const result = runDeposit(bankState, sessionAccountNumber, payload);

    if (result.success) {
      setBankState(result.state);
    }

    return result;
  }

  function withdraw(payload) {
    const result = runWithdraw(bankState, sessionAccountNumber, payload);

    if (result.success) {
      setBankState(result.state);
    }

    return result;
  }

  function transfer(payload) {
    const result = runTransfer(bankState, sessionAccountNumber, payload);

    if (result.success) {
      setBankState(result.state);
    }

    return result;
  }

  function registerPixKeyForAccount(payload) {
    const result = registerPixKey(bankState, sessionAccountNumber, payload);

    if (result.success) {
      setBankState(result.state);
    }

    return result;
  }

  function payPix(payload) {
    const result = runPixPayment(bankState, sessionAccountNumber, payload);

    if (result.success) {
      setBankState(result.state);
    }

    return result;
  }

  function logoutUser() {
    setSessionAccountNumber(null);
  }

  function logoutAdmin() {
    setAdminSession(null);
  }

  return {
    accounts: bankState.accounts,
    currentAccount,
    adminSession,
    globalTransactions,
    login,
    loginAdmin,
    register,
    deposit,
    withdraw,
    transfer,
    registerPixKey: registerPixKeyForAccount,
    payPix,
    logoutUser,
    logoutAdmin
  };
}
