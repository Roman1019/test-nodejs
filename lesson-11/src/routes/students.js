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
import { isValidId } from '../middleware/isValidId.js';

import { validateBody } from '../middleware/validateBody.js';

import { studentSchema, updateStudentSchema } from '../validation/student.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', isValidId, ctrlWrapper(getStudentByIdController));

router.delete('/:id', isValidId, ctrlWrapper(deleteStudentController));

router.post(
  '/',
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(createStudentController),
);

router.patch(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(updateStudentSchema),
  ctrlWrapper(updateStudentControllerPatch),
);

router.put(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(replaceStudentControllerPut),
);

export default router;
