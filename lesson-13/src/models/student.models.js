import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    onDuty: {
      type: Boolean,
      required: false,
      default: false,
    },
    ownerId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Student = mongoose.model('Student', studentSchema);
