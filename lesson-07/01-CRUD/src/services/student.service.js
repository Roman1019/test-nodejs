import { Student } from '../models/student.models.js';

export function getStudents() {
  // throw new Error('Service Error');
  return Student.find();
}

export function getStudentById(id) {
  return Student.findById(id);
}

export function deleteStudent(studentId) {
  return Student.findByIdAndDelete(studentId);
}

export function createStudent(payload) {
  return Student.create(payload);
}

export function updateStudentPatch(studentId, payload) {
  return Student.findByIdAndUpdate(studentId, payload, { new: true });
}

export async function replaceStudentPut(studentId, student) {
  const result = await Student.findByIdAndUpdate(studentId, student, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  return {
    value: result.value,
    updateExsiting: result.lastErrorObject.updatedExisting,
  };
}
