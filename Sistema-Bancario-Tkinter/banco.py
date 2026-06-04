from conta import Conta
import json
import os

ARQUIVO = "dados.json"


class Banco:

    def __init__(self):

        self.contas = []
        self.proximo_numero = 1

        self.carregar_dados()

    def criar_conta(self, titular):

        conta = Conta(
            self.proximo_numero,
            titular
        )

        self.contas.append(conta)

        self.proximo_numero += 1

        self.salvar_dados()

        return conta

    def buscar_conta(self, numero):

        for conta in self.contas:

            if conta.numero == numero:
                return conta

        return None

    def buscar_por_titular(self, nome):

        resultado = []

        for conta in self.contas:

            if nome.lower() in conta.titular.lower():

                resultado.append(conta)

        return resultado

    def excluir_conta(self, numero):

        conta = self.buscar_conta(numero)

        if not conta:
            return False

        self.contas.remove(conta)

        self.salvar_dados()

        return True

    def transferir(
        self,
        origem,
        destino,
        valor
    ):

        conta_origem = self.buscar_conta(origem)
        conta_destino = self.buscar_conta(destino)

        if not conta_origem:
            return False, "Conta origem não encontrada."

        if not conta_destino:
            return False, "Conta destino não encontrada."

        if valor <= 0:
            return False, "Valor inválido."

        if conta_origem.saldo < valor:
            return False, "Saldo insuficiente."

        conta_origem.saldo -= valor
        conta_destino.saldo += valor

        conta_origem.extrato.append(
            f"Transferência enviada: -R$ {valor:.2f}"
        )

        conta_destino.extrato.append(
            f"Transferência recebida: +R$ {valor:.2f}"
        )

        self.salvar_dados()

        return True, "Transferência realizada."

    def salvar_dados(self):

        dados = []

        for conta in self.contas:

            dados.append({
                "numero": conta.numero,
                "titular": conta.titular,
                "saldo": conta.saldo,
                "extrato": conta.extrato
            })

        with open(
            ARQUIVO,
            "w",
            encoding="utf-8"
        ) as arquivo:

            json.dump(
                {
                    "proximo_numero":
                    self.proximo_numero,

                    "contas":
                    dados
                },
                arquivo,
                indent=4,
                ensure_ascii=False
            )

    def carregar_dados(self):

        if not os.path.exists(ARQUIVO):
            return

        try:

            with open(
                ARQUIVO,
                "r",
                encoding="utf-8"
            ) as arquivo:

                dados = json.load(arquivo)

        except:
            return

        self.proximo_numero = dados.get(
            "proximo_numero",
            1
        )

        for item in dados.get(
            "contas",
            []
        ):

            conta = Conta(
                item["numero"],
                item["titular"]
            )

            conta.saldo = item["saldo"]

            conta.extrato = item["extrato"]

            self.contas.append(conta)