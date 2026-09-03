import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const checkProductExists = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    
    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar produto.' });
  }
};