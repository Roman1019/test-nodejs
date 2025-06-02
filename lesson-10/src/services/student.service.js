import { Student } from '../models/student.models.js';

export async function getStudents({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  ownerId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const studentQuery = Student.find();

  studentQuery.where('ownerId').equals(ownerId);

  if (typeof filter.minYear !== 'undefined') {
    studentQuery.where('year').gte(filter.minYear);
  }

  if (typeof filter.maxYear !== 'undefined') {
    studentQuery.where('year').lte(filter.maxYear);
  }

  if (typeof filter.gender !== 'undefined') {
    studentQuery.where('gender').equals(filter.gender);
  }

  const [total, students] = await Promise.all([
    Student.countDocuments(studentQuery),
    studentQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

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
