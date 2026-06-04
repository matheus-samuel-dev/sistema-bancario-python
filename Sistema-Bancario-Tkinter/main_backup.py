from banco import Banco

banco = Banco()

while True:

    print("\n==========================")
    print("    SISTEMA BANCÁRIO")
    print("==========================")

    print("1 - Criar Conta")
    print("2 - Depositar")
    print("3 - Listar Contas")
    print("4 - Sacar")
    print("5 - Transferir")
    print("6 - Extrato")
    print("0 - Sair")

    opcao = input("\nEscolha: ")

    if opcao == "1":

        nome = input(
            "Nome do titular: "
        )

        conta = banco.criar_conta(nome)

        print("\nConta criada com sucesso!")
        print(
            f"Número da conta: {conta.numero}"
        )

    elif opcao == "2":

        numero = int(
            input("Número da conta: ")
        )

        conta = banco.buscar_conta(numero)

        if conta:

            valor = float(
                input("Valor do depósito: ")
            )

            conta.depositar(valor)

            banco.salvar_dados()

            print(
                "Depósito realizado com sucesso!"
            )

        else:

            print(
                "Conta não encontrada!"
            )

    elif opcao == "3":

        banco.listar_contas()

    elif opcao == "4":

        numero = int(
            input("Número da conta: ")
        )

        conta = banco.buscar_conta(numero)

        if conta:

            valor = float(
                input("Valor do saque: ")
            )

            conta.sacar(valor)

            banco.salvar_dados()

        else:

            print(
                "Conta não encontrada!"
            )

    elif opcao == "5":

        origem_numero = int(
            input("Conta origem: ")
        )

        destino_numero = int(
            input("Conta destino: ")
        )

        valor = float(
            input("Valor da transferência: ")
        )

        origem = banco.buscar_conta(
            origem_numero
        )

        destino = banco.buscar_conta(
            destino_numero
        )

        if origem and destino:

            if origem.sacar(valor):

                destino.depositar(valor)

                origem.extrato.append(
                    f"Transferência enviada: -R${valor} para conta {destino.numero}"
                )

                destino.extrato.append(
                    f"Transferência recebida: +R${valor} da conta {origem.numero}"
                )

                banco.salvar_dados()

                print(
                    "Transferência realizada!"
                )

        else:

            print(
                "Conta não encontrada!"
            )

    elif opcao == "6":

        numero = int(
            input("Número da conta: ")
        )

        conta = banco.buscar_conta(numero)

        if conta:

            conta.mostrar_extrato()

        else:

            print(
                "Conta não encontrada!"
            )

    elif opcao == "0":

        print(
            "\nEncerrando sistema..."
        )

        break

    else:

        print(
            "\nOpção inválida!"
        )