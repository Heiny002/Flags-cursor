import React, { useState, useRef, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, StepContent, Button, TextField, Typography, Paper, Divider } from '@mui/material';
import EditableText from './EditableText';
import { Rating } from '@mui/material';
import HotTakeCard from './HotTakeCard';
import CardWalkthrough from './CardWalkthrough';

interface WalkthroughStep {
  element: string;
  description: string;
  position: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
}

interface Step {
  label: string;
  description: string;
  hasInput?: boolean;
  inputType?: string;
  inputPlaceholder?: string;
  hasSampleCard?: boolean;
  hasSampleCardBack?: boolean;
  sampleHotTake?: {
    text: string;
    categories: string[];
    authorName: string;
  };
  walkthrough?: WalkthroughStep[];
}

interface Page {
  title: string;
  steps: Step[];
}

interface OnboardingContentProps {
  pages: Page[];
  activePage: number;
  activeStep: number;
  onNext: () => void;
  onBack: () => void;
  onSaveText: (pageIndex: number, stepIndex: number, field: 'label' | 'description', newText: string) => void;
  hotTakeInput: string;
  setHotTakeInput: (value: string) => void;
  userEmail?: string;
  canBypassValidation: boolean;
}

const OnboardingContent: React.FC<OnboardingContentProps> = ({
  pages,
  activePage,
  activeStep,
  onNext,
  onBack,
  onSaveText,
  hotTakeInput,
  setHotTakeInput,
  userEmail,
  canBypassValidation,
}) => {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughSteps, setWalkthroughSteps] = useState<Array<WalkthroughStep & { highlightArea: any }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show walkthrough when step 2 is active and has walkthrough steps
    const currentStep = pages[activePage]?.steps[activeStep];
    if (currentStep?.walkthrough && Array.isArray(currentStep.walkthrough) && currentStep.hasSampleCard) {
      // Wait for card to render before calculating positions
      setTimeout(() => {
        const card = cardRef.current;
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const hotTakeElement = card.querySelector('h5');
          const categoryElement = card.querySelector('h6');
          const authorElement = card.querySelector('caption');
          const flagsElement = card.querySelector('[role="radiogroup"]');

          const updatedSteps = currentStep.walkthrough.map(step => {
            let highlightArea = { top: 0, left: 0, width: 0, height: 0 };

            switch (step.element) {
              case 'hot-take':
                if (hotTakeElement) {
                  const rect = hotTakeElement.getBoundingClientRect();
                  highlightArea = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                  };
                }
                break;
              case 'category':
                if (categoryElement) {
                  const rect = categoryElement.getBoundingClientRect();
                  highlightArea = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                  };
                }
                break;
              case 'author':
                if (authorElement) {
                  const rect = authorElement.getBoundingClientRect();
                  highlightArea = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                  };
                }
                break;
              case 'flags':
                if (flagsElement) {
                  const rect = flagsElement.getBoundingClientRect();
                  highlightArea = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                  };
                }
                break;
            }

            return {
              ...step,
              highlightArea
            };
          });

          setWalkthroughSteps(updatedSteps);
          setShowWalkthrough(true);
        }
      }, 500);
    }
  }, [activePage, activeStep, pages]);

  if (!pages || pages.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading onboarding content...
        </Typography>
      </Box>
    );
  }

  const currentPage = pages[activePage];
  if (!currentPage) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Invalid page content
        </Typography>
      </Box>
    );
  }

  const currentStep = currentPage.steps[activeStep];
  if (!currentStep) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Invalid step content
        </Typography>
      </Box>
    );
  }

  const [sampleRating, setSampleRating] = React.useState<number | null>(null);

  const handleNext = () => {
    // Skip validation for admin user
    if (canBypassValidation) {
      onNext();
      return;
    }

    if (currentStep.hasInput && !hotTakeInput.trim()) {
      return; // Don't proceed if input is required but empty
    }
    if (currentStep.hasSampleCard && !sampleRating) {
      return; // Don't proceed if sample card rating is required but not selected
    }
    onNext();
  };

  const handleSampleRatingChange = (event: React.SyntheticEvent, value: number | null) => {
    setSampleRating(value);
  };

  return (
    <Box>
      <EditableText
        text={currentPage.title}
        onSave={(newText) => onSaveText(activePage, -1, 'label', newText)}
        variant="h4"
        sx={{ mb: 4, textAlign: 'center' }}
      />

      <Stepper activeStep={activeStep} orientation="vertical">
        {currentPage.steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <EditableText
                text={step.label}
                onSave={(newText) => onSaveText(activePage, index, 'label', newText)}
                variant="h6"
              />
            </StepLabel>
            <StepContent>
              <EditableText
                text={step.description}
                onSave={(newText) => onSaveText(activePage, index, 'description', newText)}
                multiline
                rows={6}
                sx={{ mb: 2 }}
              />
              
              {step.hasInput && index === activeStep && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    My First Hot Take
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={hotTakeInput}
                    onChange={(e) => setHotTakeInput(e.target.value)}
                    placeholder={step.inputPlaceholder}
                    variant="outlined"
                    sx={{ 
                      mb: 2,
                      '& .MuiInputBase-input::placeholder': {
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      },
                    }}
                  />
                </Box>
              )}

              {step.hasSampleCard && index === activeStep && (
                <Box sx={{ mb: 3, mt: 4 }} ref={cardRef}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Try Rating This Hot Take:
                  </Typography>
                  <HotTakeCard
                    title={step.sampleHotTake?.text || ''}
                    category={step.sampleHotTake?.categories?.[0] || ''}
                    author={`by ${step.sampleHotTake?.authorName || ''}`}
                    onResponseChange={(value) => {
                      setSampleRating(value);
                    }}
                    onMatchChange={() => {}}
                    onDealbreakerChange={() => {}}
                    onNext={() => {}}
                    onPrevious={() => {}}
                    onSkip={() => {}}
                    cardKey="sample-card"
                    disableAutoFlip={true}
                    hideSkip={true}
                    hideFlip={true}
                  />
                  {showWalkthrough && walkthroughSteps.length > 0 && (
                    <CardWalkthrough
                      steps={walkthroughSteps}
                      onComplete={() => setShowWalkthrough(false)}
                    />
                  )}
                </Box>
              )}

              {step.hasSampleCardBack && index === activeStep && (
                <Box sx={{ mb: 3, mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Set Your Match Preferences:
                  </Typography>
                  <HotTakeCard
                    title={step.sampleHotTake?.text || ''}
                    category={step.sampleHotTake?.categories?.[0] || ''}
                    author={`by ${step.sampleHotTake?.authorName || ''}`}
                    onResponseChange={() => {}}
                    onMatchChange={(range) => {
                      setSampleRating(range ? 1 : null);
                    }}
                    onDealbreakerChange={() => {}}
                    onNext={() => {}}
                    onPrevious={() => {}}
                    onSkip={() => {}}
                    cardKey="sample-card-back"
                    disableAutoFlip={true}
                    hideSkip={true}
                    startFlipped={true}
                    hideFlip={true}
                  />
                </Box>
              )}

              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1 }}
                  disabled={
                    (index === currentPage.steps.length - 1 && activePage === pages.length - 1) ||
                    (!canBypassValidation && (
                      (step.hasInput && !hotTakeInput.trim()) ||
                      (step.hasSampleCard && !sampleRating)
                    ))
                  }
                >
                  {index === currentPage.steps.length - 1 && activePage === pages.length - 1
                    ? 'Finish'
                    : 'Continue'}
                </Button>
                <Button
                  disabled={index === 0 && activePage === 0}
                  onClick={onBack}
                  sx={{ mt: 1 }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OnboardingContent; 