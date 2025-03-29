import mongoose from 'mongoose';

const walkthroughStepSchema = new mongoose.Schema({
  element: { type: String, required: true },
  description: { type: String, required: true },
  position: {
    top: { type: mongoose.Schema.Types.Mixed },
    bottom: { type: mongoose.Schema.Types.Mixed },
    left: { type: mongoose.Schema.Types.Mixed },
    right: { type: mongoose.Schema.Types.Mixed }
  }
});

const stepSchema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  hasInput: { type: Boolean, default: false },
  inputType: { type: String },
  inputPlaceholder: { type: String },
  hasSampleCard: { type: Boolean, default: false },
  hasSampleCardBack: { type: Boolean, default: false },
  sampleHotTake: {
    text: { type: String },
    categories: [{ type: String }],
    authorName: { type: String }
  },
  walkthrough: [walkthroughStepSchema]
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