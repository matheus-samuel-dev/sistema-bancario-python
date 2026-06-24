import { useCallback, useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { FeedbackBanner } from "./components/FeedbackBanner";
import { useBankApp } from "./hooks/useBankApp";
import styles from "./App.module.css";

function createToast(type, message) {
  return {
    id: crypto.randomUUID(),
    type,
    message
  };
}

function App() {
  const bankApp = useBankApp();
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  const pushToast = useCallback(
    (type, message) => {
      const toast = createToast(type, message);

      setToasts((currentToasts) => [...currentToasts, toast]);

      window.setTimeout(() => {
        dismissToast(toast.id);
      }, 4200);
    },
    [dismissToast]
  );

  function handleResult(result) {
    pushToast(result.success ? "success" : "error", result.message);
  }

  function handleLogin(payload) {
    const result = bankApp.login(payload);
    handleResult(result);
    return result;
  }

  function handleAdminLogin(payload) {
    const result = bankApp.loginAdmin(payload);
    handleResult(result);
    return result;
  }

  function handleRegister(payload) {
    const result = bankApp.register(payload);
    handleResult(result);
    return result;
  }

  function handleDeposit(payload) {
    const result = bankApp.deposit(payload);
    handleResult(result);
    return result;
  }

  function handleWithdraw(payload) {
    const result = bankApp.withdraw(payload);
    handleResult(result);
    return result;
  }

  function handleTransfer(payload) {
    const result = bankApp.transfer(payload);
    handleResult(result);
    return result;
  }

  function handleRegisterPixKey(payload) {
    const result = bankApp.registerPixKey(payload);
    handleResult(result);
    return result;
  }

  function handlePayPix(payload) {
    const result = bankApp.payPix(payload);
    handleResult(result);
    return result;
  }

  function handleUserLogout() {
    bankApp.logoutUser();
    pushToast("success", "Sessão encerrada com segurança.");
  }

  function handleAdminLogout() {
    bankApp.logoutAdmin();
    pushToast("success", "Sessão administrativa encerrada.");
  }

  return (
    <div className={styles.appShell}>
      <FeedbackBanner toasts={toasts} onDismiss={dismissToast} />

      {bankApp.adminSession ? (
        <AdminDashboard
          adminSession={bankApp.adminSession}
          accounts={bankApp.accounts}
          globalTransactions={bankApp.globalTransactions}
          onLogout={handleAdminLogout}
        />
      ) : bankApp.currentAccount ? (
        <Dashboard
          currentAccount={bankApp.currentAccount}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onTransfer={handleTransfer}
          onRegisterPixKey={handleRegisterPixKey}
          onPayPix={handlePayPix}
          onLogout={handleUserLogout}
          onNotify={pushToast}
        />
      ) : (
        <AuthScreen
          onLogin={handleLogin}
          onRegister={handleRegister}
          onAdminLogin={handleAdminLogin}
        />
      )}
    </div>
  );
}

export default App;
