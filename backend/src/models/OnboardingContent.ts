import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  hasInput: { type: Boolean, default: false },
  inputType: { type: String },
  inputPlaceholder: { type: String },
});

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  steps: [stepSchema],
});

const onboardingContentSchema = new mongoose.Schema({
  pages: [pageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

const OnboardingContent = mongoose.model('OnboardingContent', onboardingContentSchema);

export default OnboardingContent; 