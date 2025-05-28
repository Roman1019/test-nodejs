import express from 'express';
import studentsRouter from './students.js';
import authRouter from './auth.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/students', studentsRouter);

export default router;
