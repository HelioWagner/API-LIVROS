// Importa o framework Express para criar e gerenciar o servidor web
import express from "express"
// Importa o Mongoose para interagir com o banco de dados MongoDB
import mongoose from "mongoose"
// Importa o dotenv para carregar variáveis de ambiente a partir do arquivo .env
import dotenv from "dotenv"

// Importa as funções do controller de livros (operações CRUD)
import {buscaLivro,buscaTodosLivros,gravarLivro,deleteLivro,alterarLivro} from "./controllers/livros.js"

// Cria uma instância do servidor Express
const app  = express()

// Configura o Express para interpretar requisições com corpo em JSON
app.use(express.json())

// Carrega as variáveis de ambiente definidas no arquivo .env
dotenv.config()
// Conecta ao MongoDB usando a string de conexão da variável de ambiente
// Se não encontrar a string, mostra uma mensagem de fallback (não ideal, apenas para desenvolvimento)
mongoose.connect(
  process.env.STRING_CONEXAO_BANCO_DADOS 
    ? process.env.STRING_CONEXAO_BANCO_DADOS 
    : "NPM RUN DEV"
)

// Define a rota GET para buscar um livro específico pelo ID
app.get("/livro/:id", buscaLivro)

// Define a rota GET para buscar todos os livros
app.get("/livro", buscaTodosLivros)

// Define a rota POST para gravar (criar) um novo livro
app.post("/livro", gravarLivro)

// Define a rota DELETE para remover um livro pelo ID
app.delete("/livro/:id", deleteLivro)

// Define a rota PUT para atualizar um livro pelo ID
app.put("/livro/:id", alterarLivro)

// Inicia o servidor na porta 3333 e exibe uma mensagem no console
app.listen(3333, () => console.log("Servidor iniciado com sucesso"))