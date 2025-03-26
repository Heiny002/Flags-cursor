import mongoose from 'mongoose';

export interface IHotTakeResponse extends mongoose.Document {
  hotTake: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userResponse: number | null;
  matchResponse: [number, number] | null;
  isDealbreaker: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hotTakeResponseSchema = new mongoose.Schema({
  hotTake: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotTake',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userResponse: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
  },
  matchResponse: {
    type: [Number],
    required: false,
    validate: {
      validator: function(v: number[]) {
        return v.length === 2 && v[0] >= 1 && v[0] <= 5 && v[1] >= 1 && v[1] <= 5 && v[0] <= v[1];
      },
      message: 'Match response must be a valid range between 1 and 5'
    }
  },
  isDealbreaker: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Index for efficient querying
hotTakeResponseSchema.index({ hotTake: 1, user: 1 }, { unique: true });

export default mongoose.model<IHotTakeResponse>('HotTakeResponse', hotTakeResponseSchema); 