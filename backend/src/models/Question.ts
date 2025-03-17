import mongoose from 'mongoose';

export interface IQuestion extends mongoose.Document {
  text: string;
  type: 'text' | 'number' | 'boolean' | 'multiple-choice' | 'slider';
  category: string;
  options?: string[];
  weight: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'number', 'boolean', 'multiple-choice', 'slider'],
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    trim: true,
  }],
  weight: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    max: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
questionSchema.index({ category: 1, order: 1 });
questionSchema.index({ isActive: 1 });

export default mongoose.model<IQuestion>('Question', questionSchema); 