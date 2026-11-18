import mongoose, { Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAdminUser } from '../types';

// ✅ Use HydratedDocument instead of extending Document
export type IAdminDocument = HydratedDocument<IAdminUser> & {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

const AdminSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
AdminSchema.pre('save', async function (next) {
  const doc = this as any;
  if (!doc.isModified('password') || !doc.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password helper
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Serialize _id → string, strip password
AdminSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret._id = ret._id?.toString?.() ?? ret._id;
    delete ret.password;
    return ret;
  },
});

export const Admin = mongoose.model<IAdminUser>('Admin', AdminSchema);