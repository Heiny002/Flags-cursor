import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface ILocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  sex?: string;
  location?: ILocation;
  interestedIn?: string;
  hotTake?: string;
  importantCategories?: string[];
  hasCompletedInitialQuestionnaire: boolean;
  isAdmin?: boolean;
  profile?: {
    age?: number;
    gender?: string;
    bio?: string;
    location?: string;
    interests?: string[];
  };
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
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'prefer_not_to_say'],
  },
  location: {
    city: String,
    country: String,
    latitude: Number,
    longitude: Number,
  },
  interestedIn: {
    type: String,
    enum: ['male', 'female', 'both', 'prefer_not_to_say'],
  },
  hotTake: {
    type: String,
    maxLength: 80,
  },
  importantCategories: [{
    type: String,
    enum: [
      'Lifestyle & Habits',
      'Culture & Entertainment',
      'Ethical & Moral Beliefs',
      'Social & Political Views',
      'Relationship Dynamics',
      'Career & Education',
      'Travel & Adventure',
      'Food & Cuisine',
    ],
  }],
  hasCompletedInitialQuestionnaire: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profile: {
    age: Number,
    gender: String,
    bio: String,
    location: String,
    interests: [String],
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 