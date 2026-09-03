import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado.' });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {id: decoded.id};
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};