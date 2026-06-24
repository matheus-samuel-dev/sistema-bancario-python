
# 🏦 Sistema Bancário em Python

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
  &nbsp;
  <img src="https://img.shields.io/badge/Tkinter-GUI-blue?style=for-the-badge">
  &nbsp;
  <img src="https://img.shields.io/badge/POO-Programação%20Orientada%20a%20Objetos-success?style=for-the-badge">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
  &nbsp;
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
  &nbsp;
  <img src="https://img.shields.io/badge/Status-Concluído-blue?style=for-the-badge">
</p>

<p align="center">
  <strong>Sistema bancário desktop desenvolvido em Python para simular operações financeiras e praticar conceitos de Programação Orientada a Objetos e Interfaces Gráficas.</strong>
</p>

<p align="center">
  <a href="https://github.com/matheus-samuel-dev">GitHub</a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/matheus-samuel-dev">LinkedIn</a>
</p>
=======
# Sistema Bancário Web

Versão web publicável do projeto original "Sistema Bancário em Python", recriada com React + Vite para deploy online e apresentação em portfólio.

O sistema desktop em Tkinter foi preservado na pasta `Sistema-Bancario-Tkinter/`. A raiz do repositório agora contém a aplicação web.


## Visão geral


## 📖 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de aplicar conceitos fundamentais de desenvolvimento de software utilizando Python.

A aplicação simula operações bancárias através de uma interface gráfica intuitiva, permitindo o gerenciamento de clientes e movimentações financeiras.

Durante o desenvolvimento foram praticados conceitos como:

* Programação Orientada a Objetos (POO)
* Interface gráfica com Tkinter
* Manipulação de dados
* Organização de código
* Boas práticas de programação
* Tratamento de exceções
=======
Esta versão transforma o fluxo original de contas, depósito, saque, transferência e extrato em uma experiência web mais próxima de um internet banking real. Os dados ficam salvos em `localStorage`, sem necessidade de backend neste primeiro momento.

## Tecnologias usadas


- React 18
- Vite
- CSS Modules
- Lucide React
- jsPDF
- jspdf-autotable
- LocalStorage para persistência
- Vercel para deploy


## ✨ Funcionalidades

### 👤 Gerenciamento de Clientes

* Cadastro de clientes
* Consulta de informações
=======
## Estrutura da aplicação

### Área pública

- Tela inicial limpa
- Acessar conta
- Criar conta
- Login administrativo discreto

### Área do usuário comum


* Depósitos
* Saques
* Transferências entre contas

### 📊 Controle Financeiro

* Consulta de saldo
* Extrato bancário
* Histórico de movimentações
* Registro das operações realizadas
=======
- Dashboard com menu lateral
- Início
- Depósito
- Saque
- Transferência
- Extrato
- Minha conta
- Sair

### Área administrativa

- Login administrativo protegido
- Lista de contas criadas
- Total de contas
- Saldo total do sistema
- Histórico geral de movimentações
- Consulta por nome ou número da conta

## Funcionalidades

- Criação de conta com senha
- Login por número da conta
- Persistência no `localStorage`
- Depósito com validação
- Saque com bloqueio para saldo insuficiente
- Transferência com validação e confirmação
- Extrato completo com:
  - Data
  - Tipo da operação
  - Valor
  - Descrição
  - Saldo após operação
- Exportação do extrato em PDF
- Cadastro e uso demonstrativo de PIX
- Histórico PIX
- Mensagens claras de sucesso e erro
- Layout responsivo para mobile, tablet e desktop

## Regras de negócio aplicadas


## 🛠️ Tecnologias Utilizadas

### Linguagem

* Python

### Interface Gráfica

* Tkinter

### Ferramentas

* Git
* GitHub

---

## 📸 Demonstração do Sistema

<table>
<tr>

<td width="33%">

### 🏠 Tela Principal

<img src="screenshots/Tela Principal.png">

</td>

<td width="33%">

### 🔄 Transferência

<img src="screenshots/Transferencia.png">

</td>

<td width="33%">

### 📄 Extrato Bancário

<img src="screenshots/Extrato.png">

</td>

</tr>
</table>

---

## 🚀 Como Executar

### 1️⃣ Clone o repositório
=======
- Não permite depósito com valor zero ou negativo
- Não permite saque maior que o saldo
- Não permite transferência maior que o saldo
- Não permite transferência para conta inexistente
- Não permite transferência para a própria conta
- Não permite pagamento PIX com saldo insuficiente
- Registra toda movimentação no extrato
- Atualiza o saldo automaticamente após cada operação

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Rode o servidor de desenvolvimento:
>>>>>>> 7561943 (Imitando internet banking)

```bash
npm run dev
```


### 2️⃣ Acesse a pasta do projeto
=======
3. Gere a build de produção:

```bash
npm run build
```


### 3️⃣ Execute a aplicação
=======
## Contas demo

- Conta `1` | Titular `Matheus Samuel` | Senha `1234`
- Conta `2` | Titular `Maria Silva` | Senha `1234`
- Conta `3` | Titular `João Santos` | Senha `1234`

## Acesso administrativo

Para testes da área administrativa:

- Usuário: `admin`
- Senha: `admin123`

Essas credenciais ficam documentadas no repositório, mas não aparecem expostas na tela pública principal.

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Importe o projeto na Vercel.
3. A Vercel deve detectar automaticamente o preset `Vite`.
4. Confirme os comandos:


```bash
Build Command: npm run build
Output Directory: dist
```

5. Clique em deploy.

O arquivo `vercel.json` já deixa essa configuração explícita.

## Projeto original em Python

Se quiser executar a versão desktop antiga, use os arquivos dentro de `Sistema-Bancario-Tkinter/`:

```bash
cd Sistema-Bancario-Tkinter
python app.py
```


---

## 📂 Estrutura do Projeto

```text
sistema-bancario-python/
│
├── screenshots/
│   ├── tela_principal.png
│   ├── transferencia_entre_contas.png
│   └── extrato_bancario.png
│
├── app.py
├── README.md
└── demais arquivos do projeto
```

---

## 🎯 Objetivos do Projeto

* Praticar desenvolvimento desktop com Python
* Aplicar conceitos de Programação Orientada a Objetos
* Simular operações bancárias reais
* Aprimorar organização e arquitetura de software
* Desenvolver interfaces gráficas utilizando Tkinter

---

## 🚀 Melhorias Futuras

- [x] Persistência de dados com SQLite
- [ ] Sistema de autenticação de usuários
- [ ] Geração de relatórios em PDF
- [ ] Exportação de extratos para Excel
- [ ] Testes automatizados
- [ ] Melhorias na interface gráfica

---

## 👨‍💻 Autor

**Matheus Samuel**

Desenvolvedor em constante evolução, apaixonado por tecnologia e desenvolvimento de software.

Sempre buscando novos desafios para aplicar conhecimentos, aprender novas tecnologias e construir soluções que gerem valor.

=======
