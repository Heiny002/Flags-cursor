import React from 'react';
import { Box, Stepper, Step, StepLabel, StepContent, Button, TextField, Typography } from '@mui/material';
import EditableText from './EditableText';

interface Step {
  label: string;
  description: string;
  hasInput?: boolean;
  inputType?: string;
  inputPlaceholder?: string;
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
}) => {
  const currentPage = pages[activePage];
  const currentStep = currentPage.steps[activeStep];

  const handleNext = () => {
    if (currentStep.hasInput && !hotTakeInput.trim()) {
      return; // Don't proceed if input is required but empty
    }
    onNext();
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
                        fontSize: '0.875rem', // 14px
                        lineHeight: 1.5,
                      },
                    }}
                  />
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={
                    (index === currentPage.steps.length - 1 && activePage === pages.length - 1) ||
                    (step.hasInput && !hotTakeInput.trim())
                  }
                >
                  {index === currentPage.steps.length - 1 && activePage === pages.length - 1
                    ? 'Finish'
                    : 'Continue'}
                </Button>
                <Button
                  disabled={index === 0 && activePage === 0}
                  onClick={onBack}
                  sx={{ mt: 1, mr: 1 }}
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