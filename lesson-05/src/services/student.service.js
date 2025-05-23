import { Student } from '../models/student.models.js';

export function getStudents() {
  // throw new Error('Service Error');
  return Student.find();
}

export function getStudentById(id) {
  return Student.findById(id);
}
