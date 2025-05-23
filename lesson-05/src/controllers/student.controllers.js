// import { Student } from '../models/student.models.js';
import mongoose from 'mongoose';
import { getStudents, getStudentById } from '../services/student.service.js';
import createHttpError from 'http-errors';

async function getStudentsController(req, res) {
  const students = await getStudents();
  res.json({
    data: students,
  });
}

async function getStudentByIdController(req, res) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid student ID' });
  }
  const student = await getStudentById(id);

  console.log(student);
  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({
    data: student,
  });
}

export { getStudentByIdController, getStudentsController };
