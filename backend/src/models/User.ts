import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  profile: {
    age: number;
    gender: string;
    bio: string;
    location: string;
    interests: string[];
  };
  questionnaireResponses: {
    questionId: mongoose.Types.ObjectId;
    answer: string | number | boolean;
    timestamp: Date;
  }[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    age: Number,
    gender: String,
    bio: String,
    location: String,
    interests: [String],
  },
  questionnaireResponses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    answer: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model<IUser>('User', userSchema); 