import express from 'express';
import {
  getStudentsController,
  getStudentByIdController,
} from '../controllers/student.controllers.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', ctrlWrapper(getStudentByIdController));

export default router;
