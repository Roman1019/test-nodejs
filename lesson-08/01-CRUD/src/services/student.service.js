import { Student } from '../models/student.models.js';

export async function getStudents({ page, perPage, sortBy, sortOrder }) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const [total, students] = await Promise.all([
    Student.countDocuments(),
    Student.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);
  // ????
  console.log({ total, students });
  const totalPages = Math.ceil(total / perPage);
  return {
    students,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviosPage: page > 1,
  };
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
