import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, IconButton, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import OnboardingContent from '../components/OnboardingContent';
import FooterNav from '../components/FooterNav';
import { api } from '../utils/api';

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

interface OnboardingData {
  pages: Page[];
  lastUpdated: string;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hotTakeInput, setHotTakeInput] = useState('');

  useEffect(() => {
    fetchOnboardingContent();
  }, []);

  const fetchOnboardingContent = async () => {
    try {
      const response = await api.get<OnboardingData>('/onboarding/content');
      setPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching onboarding content:', error);
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const currentStep = pages[activePage].steps[activeStep];
    
    if (currentStep.hasInput && hotTakeInput.trim()) {
      try {
        // Save the hot take
        await api.post('/hot-takes', {
          content: hotTakeInput.trim(),
          isActive: true,
        });
        setHotTakeInput(''); // Clear the input after saving
      } catch (error) {
        console.error('Error saving hot take:', error);
        return; // Don't proceed if saving fails
      }
    }

    if (activeStep < pages[activePage].steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (activePage < pages.length - 1) {
      setActivePage((prev) => prev + 1);
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else if (activePage > 0) {
      setActivePage((prev) => prev - 1);
      setActiveStep(pages[activePage - 1].steps.length - 1);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleSaveText = async (pageIndex: number, stepIndex: number, field: 'label' | 'description', value: string) => {
    try {
      const updatedPages = [...pages];
      if (stepIndex === -1) {
        // Updating page title
        updatedPages[pageIndex].title = value;
      } else {
        // Updating step content
        updatedPages[pageIndex].steps[stepIndex][field] = value;
      }
      
      // Save to backend
      const response = await api.post<OnboardingData>('/onboarding/content', { pages: updatedPages });
      setPages(response.data.pages);
    } catch (error) {
      console.error('Error saving onboarding content:', error);
      // Revert changes on error
      fetchOnboardingContent();
    }
  };

  const progress = ((activePage * 100) / pages.length) + 
    ((activeStep * 100) / (pages[activePage]?.steps.length || 1)) / pages.length;

  if (loading) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mb: 3, position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mb: 3 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>

        <OnboardingContent
          pages={pages}
          activePage={activePage}
          activeStep={activeStep}
          onNext={handleNext}
          onBack={handleBack}
          onSaveText={handleSaveText}
          hotTakeInput={hotTakeInput}
          setHotTakeInput={setHotTakeInput}
        />
      </Paper>

      <FooterNav />
    </Container>
  );
};

export default Onboarding; 