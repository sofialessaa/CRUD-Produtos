import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST - rota para criar um novo produto
export const createProduct = async (req, res) => {
  const {name, description, price, category, stock} = req.body;
  const userId = req.user.id; // pega o ID do usuário autenticado do middleware auth

  try {
    const product = await prisma.product.create({data: {name, description, price, category, stock, userId}});
    return res.status(201).json(product);
  } catch (error) {
    // validacao caso o produto ja exista
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe um produto cadastrado com este nome.' });
    }
    return res.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
};

// GET - rota para listar todos os produtos
export const getAllProducts = async (req, res) => {
  const userId = req.user.id;
  try {
    const getProducts = await prisma.product.findMany({where: { userId: userId }});
    return res.status(200).json(getProducts);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({error: 'Erro ao buscar produtos.'});
  }
};

// GET - rota para buscar um produto específico
export const getProductById = async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id;

  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(id), userId: userId } });
    return res.status(200).json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
};

// PUT - rota para atualizar um produto 
export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const {name, description, price, category, stock} = req.body;
  const userId = req.user.id;
  try { 
    const updatedProduct = await prisma.product.update({ where: { id: parseInt(id), userId: userId }, data: { name, description, price, category, stock }});
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({error: 'Erro ao atualizar produto.'});
  }
};

// DELETE - rota para deletar um produto
export const deleteProduct = async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id;
  try {
    const deletedProduct = await prisma.product.delete({where: {id: parseInt(id), userId: userId}});
    return res.status(200).json(deletedProduct);
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({error: 'Erro ao deletar produto.'});
  }   
};