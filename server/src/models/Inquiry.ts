import mongoose, { Schema, Document } from 'mongoose';
import { IInquiry } from '../types';

export interface IInquiryDocument extends IInquiry, Document {}

const InquirySchema = new Schema<IInquiryDocument>(
  {
    portfolioId: {
      type: String,
      required: true,
      index: true,
    },
    portfolioSlug: {
      type: String,
      required: true,
      index: true,
    },
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
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry = mongoose.model<IInquiryDocument>('Inquiry', InquirySchema);
