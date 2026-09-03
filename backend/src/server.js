import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // para ler o .env

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando http://localhost:${PORT}`);
});