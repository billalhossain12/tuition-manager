import { Types } from 'mongoose';

export interface TTutor {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  profileImg?: string;
  user: Types.ObjectId;
  address: string;
  subjects: string[];
  bio: string;
  experienceYears: number;
  isDeleted: boolean;
}
