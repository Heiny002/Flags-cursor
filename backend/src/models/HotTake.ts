import mongoose from 'mongoose';

export interface IHotTake extends mongoose.Document {
  text: string;
  categories: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const hotTakeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  categories: [{
    type: String,
    required: true,
    enum: [
      'Lifestyle & Habits',
      'Cultural & Entertainment',
      'Ethical & Moral Beliefs',
      'Social & Political Views',
      'Relationship Dynamics',
      'Career & Education',
      'Travel & Adventure',
      'Food & Cuisine',
      'After Dark',
      'Local',
    ],
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
hotTakeSchema.index({ categories: 1, createdAt: -1 });

export default mongoose.model<IHotTake>('HotTake', hotTakeSchema); 