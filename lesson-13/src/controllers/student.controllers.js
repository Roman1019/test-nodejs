// import { Student } from '../models/student.models.js';
// import mongoose from 'mongoose';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import {
  getStudents,
  getStudentById,
  deleteStudent,
  createStudent,
  updateStudentPatch,
  replaceStudentPut,
} from '../services/student.service.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parcePaginationParams.js';
import { parceSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uloadToCloudinary.js';

import { getEnvVar } from '../utils/getEnvVar.js';

async function getStudentsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parceSortParams(req.query);
  const filter = parseFilterParams(req.query);

  console.log({ sortBy, sortOrder });
  console.log({ page, perPage });

  const students = await getStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    ownerId: req.user._id,
  });
  res.json({
    data: students,
  });
}

async function getStudentByIdController(req, res) {
  const id = req.params.id;
  const student = await getStudentById(id);

  console.log(student);
  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  if (student.ownerId.toString() !== req.user._id.toString()) {
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
  console.log('UPLOAD_TO_CLOUDINARY =', getEnvVar('UPLOAD_TO_CLOUDINARY'));
  console.log('REQ.FILE:', req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  let avatar = null;
  if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(req.file.path);
    console.log(result);
    await fs.unlink(req.file.path);
    avatar = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src', 'uploads', 'avatars', req.file.filename),
    );
    avatar = `http://localhost:8090/avatars/${req.file.filename}`;
  }
  console.log(req.file);

  const student = await createStudent({
    ...req.body,
    ownerId: req.user._id,
    avatar,
  });

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
