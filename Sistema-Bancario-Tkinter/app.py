import tkinter as tk
from tkinter import ttk, messagebox
from banco import Banco

banco = Banco()

# =====================
# JANELA
# =====================

janela = tk.Tk()
janela.title("🏦 Sistema Bancário")
janela.geometry("1100x900")
janela.configure(bg="#121212")
janela.resizable(False, False)

# =====================
# FUNÇÕES
# =====================

def atualizar_tabela():

    tabela.delete(*tabela.get_children())

    for conta in banco.contas:

        tabela.insert(
            "",
            "end",
            values=(
                conta.numero,
                conta.titular,
                f"R$ {conta.saldo:.2f}"
            )
        )


def criar_conta():

    titular = entry_titular.get().strip()

    if not titular:

        messagebox.showerror(
            "Erro",
            "Digite o nome do titular."
        )
        return

    banco.criar_conta(titular)

    atualizar_tabela()

    entry_titular.delete(0, tk.END)

    messagebox.showinfo(
        "Sucesso",
        "Conta criada com sucesso!"
    )


def depositar():

    try:

        numero = int(entry_numero.get())
        valor = float(entry_valor.get())

        conta = banco.buscar_conta(numero)

        if not conta:
            raise Exception()

        conta.depositar(valor)

        banco.salvar_dados()

        atualizar_tabela()

        messagebox.showinfo(
            "Sucesso",
            "Depósito realizado."
        )

    except:

        messagebox.showerror(
            "Erro",
            "Dados inválidos."
        )


def sacar():

    try:

        numero = int(entry_numero.get())
        valor = float(entry_valor.get())

        conta = banco.buscar_conta(numero)

        if not conta:
            raise Exception()

        if not conta.sacar(valor):

            messagebox.showerror(
                "Erro",
                "Saldo insuficiente."
            )
            return

        banco.salvar_dados()

        atualizar_tabela()

        messagebox.showinfo(
            "Sucesso",
            "Saque realizado."
        )

    except:

        messagebox.showerror(
            "Erro",
            "Dados inválidos."
        )


def mostrar_extrato():

    try:

        numero = int(entry_numero.get())

        conta = banco.buscar_conta(numero)

        if not conta:
            raise Exception()

        texto = "\n".join(conta.extrato)

        if not texto:
            texto = "Nenhuma movimentação."

        messagebox.showinfo(
            f"Extrato da Conta {numero}",
            texto
        )

    except:

        messagebox.showerror(
            "Erro",
            "Conta não encontrada."
        )


def excluir_conta():

    try:

        numero = int(entry_numero.get())

        resposta = messagebox.askyesno(
            "Confirmação",
            f"Deseja excluir a conta {numero}?"
        )

        if not resposta:
            return

        if banco.excluir_conta(numero):

            atualizar_tabela()

            messagebox.showinfo(
                "Sucesso",
                "Conta excluída."
            )

        else:

            messagebox.showerror(
                "Erro",
                "Conta não encontrada."
            )

    except:

        messagebox.showerror(
            "Erro",
            "Número inválido."
        )


def transferir():

    try:

        origem = int(entry_origem.get())
        destino = int(entry_destino.get())
        valor = float(entry_transferencia.get())

        sucesso, msg = banco.transferir(
            origem,
            destino,
            valor
        )

        if sucesso:

            atualizar_tabela()

            messagebox.showinfo(
                "Sucesso",
                msg
            )

        else:

            messagebox.showerror(
                "Erro",
                msg
            )

    except:

        messagebox.showerror(
            "Erro",
            "Dados inválidos."
        )


# =====================
# TÍTULO
# =====================

titulo = tk.Label(
    janela,
    text="🏦 Sistema Bancário",
    font=("Segoe UI", 24, "bold"),
    bg="#121212",
    fg="#4CAF50"
)

titulo.pack(pady=15)

# =====================
# TABELA
# =====================

style = ttk.Style()
style.theme_use("default")

style.configure(
    "Treeview",
    rowheight=30,
    font=("Segoe UI", 10)
)

style.configure(
    "Treeview.Heading",
    font=("Segoe UI", 11, "bold")
)

tabela = ttk.Treeview(
    janela,
    columns=("Conta", "Titular", "Saldo"),
    show="headings",
    height=12
)

tabela.heading("Conta", text="Conta")
tabela.heading("Titular", text="Titular")
tabela.heading("Saldo", text="Saldo")

tabela.column("Conta", width=120, anchor="center")
tabela.column("Titular", width=450, anchor="center")
tabela.column("Saldo", width=180, anchor="center")

tabela.pack(pady=15)

# =====================
# CRIAR CONTA
# =====================

frame_conta = tk.LabelFrame(
    janela,
    text="Criar Conta",
    bg="#121212",
    fg="white",
    padx=10,
    pady=10
)

frame_conta.pack(pady=10)

tk.Label(
    frame_conta,
    text="Titular:",
    bg="#121212",
    fg="white"
).grid(row=0, column=0, padx=5)

entry_titular = tk.Entry(
    frame_conta,
    width=40
)

entry_titular.grid(row=0, column=1, padx=5)

tk.Button(
    frame_conta,
    text="Criar Conta",
    bg="#4CAF50",
    fg="white",
    command=criar_conta
).grid(row=0, column=2, padx=10)

# =====================
# OPERAÇÕES
# =====================

frame_operacoes = tk.LabelFrame(
    janela,
    text="Operações",
    bg="#121212",
    fg="white",
    padx=10,
    pady=10
)

frame_operacoes.pack(pady=10)

tk.Label(
    frame_operacoes,
    text="Conta:",
    bg="#121212",
    fg="white"
).grid(row=0, column=0)

entry_numero = tk.Entry(
    frame_operacoes,
    width=10
)

entry_numero.grid(row=0, column=1, padx=5)

tk.Label(
    frame_operacoes,
    text="Valor:",
    bg="#121212",
    fg="white"
).grid(row=0, column=2)

entry_valor = tk.Entry(
    frame_operacoes,
    width=12
)

entry_valor.grid(row=0, column=3, padx=5)

tk.Button(
    frame_operacoes,
    text="Depositar",
    bg="#2196F3",
    fg="white",
    command=depositar
).grid(row=0, column=4, padx=4)

tk.Button(
    frame_operacoes,
    text="Sacar",
    bg="#F44336",
    fg="white",
    command=sacar
).grid(row=0, column=5, padx=4)

tk.Button(
    frame_operacoes,
    text="Extrato",
    bg="#9C27B0",
    fg="white",
    command=mostrar_extrato
).grid(row=0, column=6, padx=4)

tk.Button(
    frame_operacoes,
    text="Excluir",
    bg="#795548",
    fg="white",
    command=excluir_conta
).grid(row=0, column=7, padx=4)

# =====================
# TRANSFERÊNCIA
# =====================

frame_transferencia = tk.LabelFrame(
    janela,
    text="Transferência entre Contas",
    bg="#121212",
    fg="white",
    font=("Segoe UI", 10, "bold"),
    padx=15,
    pady=15
)

frame_transferencia.pack(
    pady=15,
    padx=20,
    fill="x"
)

tk.Label(
    frame_transferencia,
    text="Conta Origem:",
    bg="#121212",
    fg="white",
    font=("Segoe UI", 10)
).grid(
    row=0,
    column=0,
    padx=5
)

entry_origem = tk.Entry(
    frame_transferencia,
    width=12,
    font=("Segoe UI", 10)
)
entry_origem.grid(
    row=0,
    column=1,
    padx=5
)

tk.Label(
    frame_transferencia,
    text="Conta Destino:",
    bg="#121212",
    fg="white",
    font=("Segoe UI", 10)
).grid(
    row=0,
    column=2,
    padx=10
)

entry_destino = tk.Entry(
    frame_transferencia,
    width=12,
    font=("Segoe UI", 10)
)
entry_destino.grid(
    row=0,
    column=3,
    padx=5
)

tk.Label(
    frame_transferencia,
    text="Valor:",
    bg="#121212",
    fg="white",
    font=("Segoe UI", 10)
).grid(
    row=0,
    column=4,
    padx=10
)

entry_transferencia = tk.Entry(
    frame_transferencia,
    width=15,
    font=("Segoe UI", 10)
)
entry_transferencia.grid(
    row=0,
    column=5,
    padx=5
)

btn_transferir = tk.Button(
    frame_transferencia,
    text="Transferir",
    bg="#FF9800",
    fg="white",
    font=("Segoe UI", 10, "bold"),
    width=15,
    command=transferir
)

btn_transferir.grid(
    row=0,
    column=6,
    padx=15
)

atualizar_tabela()

janela.mainloop()