import express from 'express';
import studentsRouter from './students.js';
import authRouter from './auth.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/students', auth, studentsRouter);

export default router;
