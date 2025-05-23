import express from 'express';
import {
  getStudentsController,
  getStudentByIdController,
  deleteStudentController,
  createStudentController,
  updateStudentControllerPatch,
  replaceStudentControllerPut,
} from '../controllers/student.controllers.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', ctrlWrapper(getStudentByIdController));

router.delete('/:id', ctrlWrapper(deleteStudentController));

router.post('/', jsonParser, ctrlWrapper(createStudentController));

router.patch('/:id', jsonParser, ctrlWrapper(updateStudentControllerPatch));

router.put('/:id', jsonParser, ctrlWrapper(replaceStudentControllerPut));

export default router;
