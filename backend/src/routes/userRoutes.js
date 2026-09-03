import express from 'express';
import { createUser, loginUser, getAllUsers } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', auth, getAllUsers);

export default router;