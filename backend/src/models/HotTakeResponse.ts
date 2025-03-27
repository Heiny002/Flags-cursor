import mongoose, { Schema, Document } from 'mongoose';

// Interface defining the structure of a hot take response
// CRITICAL: This interface must match the frontend's expected response structure
export interface IHotTakeResponse extends Document {
  // Reference to the hot take being responded to
  // CRITICAL: This field name must match what's used in the frontend (hotTakeId)
  hotTakeId: mongoose.Types.ObjectId;
  
  // Reference to the user who submitted the response
  // CRITICAL: This field name must match what's used in the frontend (userId)
  userId: mongoose.Types.ObjectId;
  
  // User's rating of the hot take (1-5)
  userResponse: number;
  
  // Range of acceptable responses from potential matches (1-5)
  matchResponse: number[];
  
  // Whether this hot take is a dealbreaker for the user
  isDealbreaker: boolean;
  
  // Timestamps for when the response was created/updated
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition for hot take responses
// CRITICAL: The unique index on {hotTakeId, userId} ensures one response per user per hot take
const hotTakeResponseSchema = new Schema<IHotTakeResponse>({
  // Reference to the hot take being responded to
  // CRITICAL: This field name must match what's used in the frontend (hotTakeId)
  hotTakeId: {
    type: Schema.Types.ObjectId,
    ref: 'HotTake',
    required: true
  },
  
  // Reference to the user who submitted the response
  // CRITICAL: This field name must match what's used in the frontend (userId)
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User's rating of the hot take (1-5)
  userResponse: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Range of acceptable responses from potential matches (1-5)
  matchResponse: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr: number[]) {
        return arr.length === 2 && arr[0] <= arr[1] && arr[0] >= 1 && arr[1] <= 5;
      },
      message: 'Match response must be an array of two numbers between 1 and 5, with first number less than or equal to second'
    }
  },
  
  // Whether this hot take is a dealbreaker for the user
  isDealbreaker: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// CRITICAL: This unique index ensures one response per user per hot take
// DO NOT MODIFY: Changing this index will affect the uniqueness constraint
hotTakeResponseSchema.index({ hotTakeId: 1, userId: 1 }, { unique: true });

// Create and export the model
// CRITICAL: The model name 'HotTakeResponse' must match what's used in the routes
const HotTakeResponse = mongoose.model<IHotTakeResponse>('HotTakeResponse', hotTakeResponseSchema);

export default HotTakeResponse; 