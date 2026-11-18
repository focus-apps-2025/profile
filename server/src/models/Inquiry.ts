import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { IInquiry } from '../types';

// ✅ Use HydratedDocument instead of extending Document
export type IInquiryDocument = HydratedDocument<IInquiry>;

const InquirySchema = new Schema<IInquiry>(
  {
    portfolioId: { type: String, required: true, index: true },
    portfolioSlug: { type: String, required: true, index: true },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    senderEmail: {
      type: String,
      required: [true, 'Sender email is required'],
      trim: true,
    },
    subject: { type: String, trim: true },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InquirySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret._id = ret._id?.toString?.() ?? ret._id;
    return ret;
  },
});

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);