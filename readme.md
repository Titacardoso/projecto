# Gestão de Frota - Lameiras Mendes Transportes

## Descrição do Projeto

Este projeto foi desenvolvido no âmbito da formação do IEFP na área de Desenvolvimento de Software.

O objetivo é criar um sistema simples de Gestão de Frota para a empresa Lameiras Mendes Transportes, permitindo a consulta e a gestão das viaturas através de uma área reservada.

A aplicação é composta por uma parte pública e uma área privada de gestão.

---

## Funcionalidades

### Área Pública

* Página Inicial
* Página A Nossa Frota
* Página Contactos
* Página Recursos Humanos
* Política de Privacidade

### Área Reservada

* Login de acesso
* Visualização das viaturas por marca
* Pesquisa por matrícula
* Consulta da informação das viaturas
* Alteração do estado das viaturas (Ativa/Inativa)

---

## Tecnologias Utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Base de Dados

* MySQL

### Ferramentas

* Visual Studio Code
* Postman
* GitHub

---

## Estrutura do Projeto

```text
PROJETO

fonts/
frontend/
icons/
imagens/

index.html
frota.html
contactos.html
candidatura.html
login.html
gestao-frota.html
politica-privacidade.html

app.js
projecto.css

server.js
database.js
database.sql

package.json
package-lock.json

.env
.gitignore
```

## API REST

Rotas implementadas:

* GET /api/estado
* GET /api/frota
* GET /api/frota/:id
* POST /api/frota
* PUT /api/frota/:id
* PATCH /api/frota/:id/ativo
* DELETE /api/frota/:id

---

## Como executar o projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

ou

```bash
nodemon server.js
```

### 3. Verificar o estado da API

Abrir no navegador:

```text
http://localhost:3000/api/estado
```

---

## Aprendizagens

Este projeto permitiu consolidar conhecimentos em:

* Desenvolvimento Frontend
* Criação de APIs REST
* Utilização do Node.js e Express
* Ligação a bases de dados MySQL
* Integração entre frontend, backend e base de dados
* Organização e estruturação de projetos web

---

## Projeto desenvolvido por

Projeto realizado no âmbito da formação IEFP.

Grupo de trabalho:

* Luísa Cardoso
* Lurdes
* Magnólia
