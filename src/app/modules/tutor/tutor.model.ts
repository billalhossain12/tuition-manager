import { model, Schema } from 'mongoose';
import { TTutor } from './tutor.interface';

const tutorSchema = new Schema<TTutor>(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      required: true,
    },
    profileImg: {
      type: String,
      default: '',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      trim: true,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

// filter out deleted documents
tutorSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

tutorSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Check if tutor already exist
tutorSchema.statics.isTutorExist = async function (id: string) {
  const existingUser = await Tutor.findById(id);
  return existingUser;
};

export const Tutor = model<TTutor>('Tutor', tutorSchema);
