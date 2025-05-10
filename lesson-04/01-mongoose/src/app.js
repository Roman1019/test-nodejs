import express from 'express';
import { Student } from './models/student.js';
import mongoose from 'mongoose';
const app = express();

app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json({
    data: students,
  });
});

app.get('/api/students/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid student ID' });
  }
  const student = await Student.findById(id);

  console.log(student);
  if (student === null) {
    return res.status(404).send({ message: 'Student not found' });
  }
  res.json({
    data: student,
  });
});

export default app;
