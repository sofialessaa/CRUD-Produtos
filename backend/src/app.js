import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { auth } from './middleware/auth.js';
import cors from 'cors';

const app = express();

app.use(cors()); // habilita o CORS para todas as rotas
app.use(express.json());
app.use('/products', auth, productRoutes);
app.use('/users', userRoutes);

export default app;