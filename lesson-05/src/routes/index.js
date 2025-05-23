import express from 'express';
import studentsRouter from './students.js';

const router = express.Router();

router.use('/students', studentsRouter);

export default router;
