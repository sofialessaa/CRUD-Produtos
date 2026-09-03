import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { auth } from './middleware/auth.js';

const app = express();

app.use(express.json());
app.use('/products', auth, productRoutes);
app.use('/users', userRoutes);

export default app;