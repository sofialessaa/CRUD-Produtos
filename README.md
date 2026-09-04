# CRUD Produtos 

Este repositório contém os arquivos e códigos desenvolvidos para um teste técnico da empresa Nuel Tech.

## Descrição do Teste
Desenvolver uma aplicação de cadastro de produtos com um backend em Node.js e frontend em React ou Angular. A aplicação deve permitir que os usuários adicionem, visualizem, editem e excluam produtos.

Foi desenvolvido um sistema web (NodeJS e React) para o cadastro de produtos com CRUD completo + autenticação de usuário + testes unitários para backend e frontend.

## Guia de Instalação

Este guia oferece instruções detalhadas sobre como baixar, configurar e executar este projeto em sua máquina local.

### Pré-requisitos
- **VSCode**: Editor de código para visualização e edição do projeto. [Baixe o VSCode](https://code.visualstudio.com/download)
- **MySQL**: Banco de dados para armazenar informações necessárias ao sistema. [Baixe o MYSQL](https://dev.mysql.com/downloads/installer/)
- **Node.js**: Ambiente de execução de JavaScript open-source. [Baixe o Node.js](https://nodejs.org/en/download)

---

### Instalação

#### 1. Baixando o Projeto
- No repositório do GitHub, clique em **"Code"** e selecione **"Download ZIP"** ou [Clique aqui](https://github.com/sofialessaa/CRUD-Produtos/archive/refs/heads/main.zip).
- Localize o arquivo ZIP baixado e extraia-o para uma pasta de sua escolha.

#### 2. Abrindo o Projeto no VSCode
- Inicie o VSCode.
- Clique em **File > Open Folder...** e selecione a pasta extraída para abrir o projeto.

---

### Passos para Executar o Backend

#### 1. Crie um arquivo .env e adicione suas credenciais
  ```bash
  PORT=3000
  DATABASE_URL="mysql://username:password@localhost:3306/database_name"
  JWT_SECRET="chave_secreta"

  # comando para gerar um jwt secret key
  # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
#### 2. Preparação do Projeto no VSCode
> Abra o terminal no VSCode e navegue até a pasta do backend:
  ```bash
  cd backend
  ```
#### 3. Instalação de Dependências
> No terminal, instale as dependências do projeto:
  ```bash
  npm install
  ```
#### 4. Executando as Migrations
> Aplique as migrations para configurar as tabelas no banco de dados:
  ```bash
  npx prisma migrate dev
  ```
#### 5. Iniciando o Servidor Backend
> Inicie o servidor backend com o comando:
  ```bash
  npm start
  ```

---

###  Passos para Executar o Frontend
    
#### 1. Abrindo um Novo Terminal
> Abra um novo terminal no VSCode para configurar o frontend.

#### 2. Configuração e Execução do Frontend
> Navegue até a pasta do frontend:
  ```bash
  cd frontend
  ```
> Instale as dependências do frontend:
  ```bash
  npm install
  ```
> Inicie o frontend com o comando:
  ```bash
  npm start
  ```
#### 3. Acessando a Aplicação
> No terminal, copie o link que aparece e abra-o no navegador de sua preferência para acessar a aplicação.

## Testes unitários

O teste prático trazia testes unitários como item opcional ("Extra"). Foram implementados nos dois lados da aplicação (backend e frontend), cobrindo as operações de CRUD de produtos.

| Camada   | Ferramentas                                      |
|----------|--------------------------------------------------|
| Backend  | Jest + Babel (`@babel/preset-env`), mock manual do PrismaClient           |
| Frontend | Jest + React Testing Library (via `react-scripts`)|

Os testes não dependem de banco, servidor ou rede — todas as dependências externas são mockadas.
Basta rodar `npm install` e `npm test`.

### Como rodar

Backend:

```bash
cd backend
npm test
```
Frontend:

```bash
cd frontend
npm test          # modo watch
npm test -- --watchAll=false   # execução única (CI)
```
