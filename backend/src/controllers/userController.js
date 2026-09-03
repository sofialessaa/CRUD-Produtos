import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// POST - rota para criar um novo usuário
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validações básicas
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    return res.status(400).json({ error: 'Usuário já cadastrado.' });
  }

  const salt = await bcrypt.genSalt(10); //adiciona caracteres aleatórios para a senha - bcrypt
  const hashedPassword = await bcrypt.hash(password, salt); //encripta a senha

  try {
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword }, omit: { password: true }}); // uso o omit para retornar o usuário sem a senha;
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Falha ao criar usuário.' });
  }
};

// POST - rota para login do usuário
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // valida a senha do usuário com a senha encriptada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // para gerar o token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5d' });

    res.status(200).json({ message: 'Login bem-sucedido.', user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Erro ao logar:', error);
    res.status(500).json({ error: 'Não foi possível fazer o login.' });
  }
};

// GET - rota para buscar todos usuários
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    return res.status(200).json({message: "Usuários encontrados.", users});
    } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};