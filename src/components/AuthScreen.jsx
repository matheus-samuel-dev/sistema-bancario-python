import { Landmark, LockKeyhole, Shield } from "lucide-react";
import { useState } from "react";
import styles from "./AuthScreen.module.css";

export function AuthScreen({ onLogin, onRegister, onAdminLogin }) {
  const [activeView, setActiveView] = useState("landing");
  const [loginData, setLoginData] = useState({
    accountNumber: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    holderName: "",
    password: "",
    confirmPassword: ""
  });
  const [adminData, setAdminData] = useState({
    username: "",
    password: ""
  });

  function handleLoginSubmit(event) {
    event.preventDefault();
    onLogin(loginData);
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();
    onRegister(registerData);
  }

  function handleAdminSubmit(event) {
    event.preventDefault();
    onAdminLogin(adminData);
  }

  return (
    <main className={styles.page}>
      <section className={styles.heroPanel}>
        <div className={styles.brandPill}>
          <Landmark size={16} />
          VaultBank
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>Sistema Bancário Web</h1>
          <p className={styles.subtitle}>
            Acesse sua conta, acompanhe seu saldo e realize operações em uma
            interface simples, funcional e pronta para portfólio.
          </p>
        </div>

        <div className={styles.infoCard}>
          <strong>Experiência inspirada em internet banking</strong>
          <p>
            A área pública mostra apenas o essencial. Informações de contas e
            movimentações gerais ficam protegidas na área administrativa.
          </p>
        </div>
      </section>

      <section className={styles.formPanel}>
        {activeView === "landing" ? (
          <div className={styles.landingActions}>
            <header className={styles.formHeader}>
              <h2>Escolha como deseja entrar</h2>
              <p>
                Acesse sua conta ou crie um novo cadastro para testar o sistema.
              </p>
            </header>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setActiveView("login")}
            >
              Acessar conta
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setActiveView("register")}
            >
              Criar conta
            </button>

            <button
              type="button"
              className={styles.adminLink}
              onClick={() => setActiveView("admin")}
            >
              Login administrativo
            </button>
          </div>
        ) : null}

        {activeView === "login" ? (
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <header className={styles.formHeader}>
              <h2>Acessar conta</h2>
              <p>Entre com número da conta e senha.</p>
            </header>

            <label className={styles.field}>
              <span>Número da conta</span>
              <input
                type="number"
                min="1"
                value={loginData.accountNumber}
                onChange={(event) =>
                  setLoginData((current) => ({
                    ...current,
                    accountNumber: event.target.value
                  }))
                }
                placeholder="Ex.: 1"
              />
            </label>

            <label className={styles.field}>
              <span>Senha</span>
              <input
                type="password"
                value={loginData.password}
                onChange={(event) =>
                  setLoginData((current) => ({
                    ...current,
                    password: event.target.value
                  }))
                }
                placeholder="Sua senha"
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              Entrar
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() => setActiveView("landing")}
            >
              Voltar
            </button>
          </form>
        ) : null}

        {activeView === "register" ? (
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <header className={styles.formHeader}>
              <h2>Criar conta</h2>
              <p>Cadastre um titular e defina sua senha de acesso.</p>
            </header>

            <label className={styles.field}>
              <span>Nome do titular</span>
              <input
                type="text"
                value={registerData.holderName}
                onChange={(event) =>
                  setRegisterData((current) => ({
                    ...current,
                    holderName: event.target.value
                  }))
                }
                placeholder="Nome completo"
              />
            </label>

            <label className={styles.field}>
              <span>Senha</span>
              <input
                type="password"
                value={registerData.password}
                onChange={(event) =>
                  setRegisterData((current) => ({
                    ...current,
                    password: event.target.value
                  }))
                }
                placeholder="Mínimo de 4 caracteres"
              />
            </label>

            <label className={styles.field}>
              <span>Confirmar senha</span>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(event) =>
                  setRegisterData((current) => ({
                    ...current,
                    confirmPassword: event.target.value
                  }))
                }
                placeholder="Repita sua senha"
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              Criar conta
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() => setActiveView("landing")}
            >
              Voltar
            </button>
          </form>
        ) : null}

        {activeView === "admin" ? (
          <form className={styles.form} onSubmit={handleAdminSubmit}>
            <header className={styles.formHeader}>
              <div className={styles.adminBadge}>
                <Shield size={16} />
                Área protegida
              </div>
              <h2>Login administrativo</h2>
              <p>
                Acesso reservado para consulta de contas e movimentações do
                sistema.
              </p>
            </header>

            <label className={styles.field}>
              <span>Usuário</span>
              <input
                type="text"
                value={adminData.username}
                onChange={(event) =>
                  setAdminData((current) => ({
                    ...current,
                    username: event.target.value
                  }))
                }
                placeholder="Usuário administrativo"
              />
            </label>

            <label className={styles.field}>
              <span>Senha</span>
              <input
                type="password"
                value={adminData.password}
                onChange={(event) =>
                  setAdminData((current) => ({
                    ...current,
                    password: event.target.value
                  }))
                }
                placeholder="Senha administrativa"
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              <LockKeyhole size={16} />
              Entrar como administrador
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={() => setActiveView("landing")}
            >
              Voltar
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
