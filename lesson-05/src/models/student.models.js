import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    require: true,
  },
  onDuty: {
    type: Boolean,
    required: false,
    default: false,
  },
});

export const Student = mongoose.model('Student', studentSchema);
