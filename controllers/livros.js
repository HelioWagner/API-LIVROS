// Importa o framework Express (não está sendo usado diretamente aqui, mas pode ser útil futuramente)
import express from "express"

// Importa o mongoose para manipulação do MongoDB
import mongoose from "mongoose"

// Importa o modelo de dados 'Livros'
import Livros from "../models/livro.js"

// --------------------------
// BUSCAR UM LIVRO POR ID
// --------------------------
export const buscaLivro = async (request, response) => {
  const id = request.params.id;

  // Valida se o ID fornecido tem o formato válido do MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({
      message: "ID do livro informado é inválido."
    });
  }

  try {
    // Busca o livro diretamente pelo ID
    const livro = await Livros.findById(id);

    // Caso o livro não exista
    if (!livro) {
      return response.status(404).json({
        message: "Livro não encontrado com o ID fornecido."
      });
    }

    // Retorna o livro encontrado
    return response.status(200).json({
      message: "Livro encontrado com sucesso.",
      data: {
        id: livro._id,
        titulo: livro.titulo,
        autor: livro.autor,
        ano: livro.ano,
        genero: livro.genero
      }
    });

  } catch (error) {
    // Tratamento de erro interno
    return response.status(500).json({
      message: "Erro interno ao buscar o livro.",
      error: error.message
    });
  }
};

// --------------------------
// BUSCAR TODOS OS LIVROS
// --------------------------
export const buscaTodosLivros = async (request, response) => {
  try {
    // Busca todos os livros cadastrados
    const livros = await Livros.find();

    return response.status(200).json({
      message: "Livros encontrados com sucesso.",
      total: livros.length,
      data: livros
    });

  } catch (error) {
    return response.status(500).json({
      message: "Erro ao buscar livros.",
      error: error.message
    });
  }
}

// --------------------------
// CADASTRAR UM NOVO LIVRO
// --------------------------
export const gravarLivro = async (request, response) => {
  try {
    const body = request.body;

    // Valida os campos obrigatórios
    if (!body.titulo) {
      return response.status(400).json({ message: "Título deve ser informado." });
    }

    if (!body.autor) {
      return response.status(400).json({ message: "Autor deve ser informado." });
    }

    if (!body.ano) {
      return response.status(400).json({ message: "Ano deve ser informado." });
    }

    const ano = parseInt(body.ano, 10);
    if (isNaN(ano)) {
      return response.status(400).json({ message: "Ano deve ser um número válido." });
    }

    if (!body.genero) {
      return response.status(400).json({ message: "Gênero deve ser informado." });
    }

    // Cria o livro no banco de dados
    const idLivro = await Livros.create({
      titulo: body.titulo,
      autor: body.autor,
      ano: body.ano,
      genero: body.genero
    });

    return response.status(201).json({
      message: "Livro cadastrado com sucesso.",
      id: idLivro._id
    });

  } catch (error) {
    return response.status(500).json({
      message: "Erro interno ao cadastrar livro.",
      error: error.message
    });
  }
}

// --------------------------
// DELETAR UM LIVRO POR ID
// --------------------------
export const deleteLivro = async (request, response) => {
  try {
    const id = request.params.id;

    // Verifica se o ID foi fornecido
    if (!id) {
      return response.status(400).json({ message: "ID do livro não foi informado." });
    }

    // Valida o formato do ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "ID do livro informado é inválido."
      });
    }

    // Tenta deletar o livro pelo ID
    const livro = await Livros.findOneAndDelete({ _id: id });

    if (!livro) {
      return response.status(404).json({
        message: "Livro não encontrado para exclusão."
      });
    }

    return response.status(200).json({
      message: "Livro excluído com sucesso."
    });

  } catch (error) {
    return response.status(500).json({
      message: "Erro interno ao excluir o livro.",
      error: error.message
    });
  }
}

// --------------------------
// ATUALIZAR UM LIVRO POR ID
// --------------------------
export const alterarLivro = async (request, response) => {
  try {
    const { id } = request.params;
    const { titulo, autor, ano, genero } = request.body;

    // Valida o ID
    if (!id) {
      return response.status(400).json({ message: "ID do livro não foi informado." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "ID do livro informado é inválido." });
    }

    // Valida os campos obrigatórios
    if (!titulo || titulo.trim() === "") {
      return response.status(400).json({ message: "Título deve ser informado." });
    }

    if (!autor || autor.trim() === "") {
      return response.status(400).json({ message: "Autor deve ser informado." });
    }

    if (!ano || ano.toString().trim() === "") {
      return response.status(400).json({ message: "Ano deve ser informado." });
    }

    const anoValido = parseInt(ano, 10);
    if (isNaN(anoValido)) {
      return response.status(400).json({ message: "Ano deve ser um número válido." });
    }

    if (!genero || genero.trim() === "") {
      return response.status(400).json({ message: "Gênero deve ser informado." });
    }

    // Atualiza o livro e retorna o novo documento atualizado
    const livroAtualizado = await Livros.findByIdAndUpdate(
      id,
      { titulo, autor, ano: anoValido, genero },
      { new: true }
    );

    // Verifica se o livro foi encontrado
    if (!livroAtualizado) {
      return response.status(404).json({ message: "Livro não encontrado para atualização." });
    }

    // Retorna o livro atualizado
    return response.status(200).json({
      message: "Livro atualizado com sucesso.",
      data: {
        id: livroAtualizado._id,
        titulo: livroAtualizado.titulo,
        autor: livroAtualizado.autor,
        ano: livroAtualizado.ano,
        genero: livroAtualizado.genero
      }
    });

  } catch (error) {
    return response.status(500).json({
      message: "Erro interno ao alterar livro.",
      error: error.message
    });
  }
}
