class Conta:

    def __init__(self, numero, titular):
        self.numero = numero
        self.titular = titular
        self.saldo = 0.0
        self.extrato = ["Conta criada"]

    def depositar(self, valor):

        if valor <= 0:
            return False

        self.saldo += valor

        self.extrato.append(
            f"Depósito: +R$ {valor:.2f}"
        )

        return True

    def sacar(self, valor):

        if valor <= 0:
            return False

        if valor > self.saldo:
            return False

        self.saldo -= valor

        self.extrato.append(
            f"Saque: -R$ {valor:.2f}"
        )

        return True