import mongoose from 'mongoose';

export interface IHotTake extends mongoose.Document {
  text: string;
  categories: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isInitial: boolean;
  category: string;
  isActive: boolean;
  responses: {
    user: mongoose.Types.ObjectId;
    agree: boolean;
    timestamp: Date;
  }[];
}

const hotTakeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
  },
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    default: ['No Category'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isInitial: {
    type: Boolean,
    default: false,
  },
  responses: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agree: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Add indexes for better query performance
hotTakeSchema.index({ author: 1, createdAt: -1 });
hotTakeSchema.index({ isActive: 1, createdAt: -1 });
hotTakeSchema.index({ categories: 1 });

const HotTake = mongoose.model('HotTake', hotTakeSchema);

export default HotTake; 