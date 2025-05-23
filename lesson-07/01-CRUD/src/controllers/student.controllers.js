// import { Student } from '../models/student.models.js';
import mongoose from 'mongoose';
import {
  getStudents,
  getStudentById,
  deleteStudent,
  createStudent,
  updateStudentPatch,
  replaceStudentPut,
} from '../services/student.service.js';
import createHttpError from 'http-errors';

async function getStudentsController(req, res) {
  const students = await getStudents();
  res.json({
    data: students,
  });
}

async function getStudentByIdController(req, res) {
  const id = req.params.id;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({ message: 'Invalid student ID' });
  // }
  const student = await getStudentById(id);

  console.log(student);
  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({
    data: student,
  });
}

async function deleteStudentController(req, res) {
  const studentId = req.params.id;
  const result = await deleteStudent(studentId);
  console.log(result);
  if (result === null) {
    throw new createHttpError.NotFound('Student not found');
  }
  res.status(204).end();
  // res.json({ message: `Delete students ${studentId}` });
}

async function createStudentController(req, res) {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: 'Student created successfully',
    data: student,
  });
}

async function updateStudentControllerPatch(req, res) {
  const studentId = req.params.id;

  const result = await updateStudentPatch(studentId, req.body);
  if (result === null) {
    throw new createHttpError.NotFound('Student not found');
  }
  console.log(result);
  res.json({
    status: 200,
    message: 'Student update successfully',
    data: result,
  });
}

async function replaceStudentControllerPut(req, res) {
  const studentId = req.params.id;

  const { value, updateExsiting } = await replaceStudentPut(
    studentId,
    req.body,
  );

  if (updateExsiting === true) {
    return res.json({
      status: 200,
      message: 'Student updated successfully',
      data: value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Student created successfully',
    data: value,
  });
}

export {
  getStudentByIdController,
  getStudentsController,
  deleteStudentController,
  createStudentController,
  updateStudentControllerPatch,
  replaceStudentControllerPut,
};
