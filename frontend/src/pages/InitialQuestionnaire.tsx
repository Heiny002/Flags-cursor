import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Chip,
  LinearProgress,
  FormHelperText,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface Location {
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  zipCode?: string;
}

interface QuestionnaireData {
  hotTake: string;
  name: string;
  sex: string;
  location: Location | null;
  interestedIn: string;
  importantCategories: string[];
}

const CATEGORIES = [
  'Lifestyle & Habits',
  'Culture & Entertainment',
  'Ethical & Moral Beliefs',
  'Social & Political Views',
  'Relationship Dynamics',
  'Career & Education',
  'Travel & Adventure',
  'Food & Cuisine',
];

const InitialQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [manualZipCode, setManualZipCode] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  const [formData, setFormData] = useState<QuestionnaireData>({
    hotTake: '',
    name: '',
    sex: '',
    location: null,
    interestedIn: '',
    importantCategories: [],
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Add ref for text inputs
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Focus input when step changes
  useEffect(() => {
    if (currentStep === 0 || currentStep === 1) {
      // Focus text inputs
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else if (currentStep === 2 || currentStep === 4) {
      // Open dropdowns
      setDropdownOpen(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 3) {
      getUserLocation();
    }
  }, [currentStep]);

  const getUserLocation = async () => {
    setLocationLoading(true);
    setLocationError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Use reverse geocoding to get city and country
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      );

      setFormData(prev => ({
        ...prev,
        location: {
          city: response.data.address.city || response.data.address.town || response.data.address.village || '',
          country: response.data.address.country || '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      }));
    } catch {
      setLocationError('Unable to get your location. Please enter it manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Submitting questionnaire data:', formData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profiles/initial-questionnaire`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Questionnaire submission response:', response.data);
      navigate('/profile');
    } catch (error) {
      console.error('Questionnaire submission error:', error);
      setError('Failed to save questionnaire data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !isNextDisabled()) {
      if (currentStep === totalSteps - 1) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  const handleZipCodeSubmit = async () => {
    setLocationLoading(true);
    setLocationError('');
    setZipCodeError('');

    try {
      // Use OpenStreetMap Nominatim to get location from zip code
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?postalcode=${manualZipCode}&format=json&countrycodes=us`
      );

      if (response.data && response.data[0]) {
        setFormData(prev => ({
          ...prev,
          location: {
            city: response.data[0].address?.city || response.data[0].address?.town || '',
            country: 'United States',
            latitude: parseFloat(response.data[0].lat),
            longitude: parseFloat(response.data[0].lon),
            zipCode: manualZipCode
          },
        }));
      } else {
        setZipCodeError('Invalid zip code. Please try again.');
      }
    } catch {
      setZipCodeError('Error validating zip code. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const currentCategories = prev.importantCategories;
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          importantCategories: currentCategories.filter(c => c !== category)
        };
      } else if (currentCategories.length < 3) {
        return {
          ...prev,
          importantCategories: [...currentCategories, category]
        };
      }
      return prev;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Share a controversial opinion you have (a "hot take")
            </Typography>
            <TextField
              fullWidth
              value={formData.hotTake}
              onChange={(e) => {
                if (e.target.value.length <= 80) {
                  setFormData(prev => ({ ...prev, hotTake: e.target.value }));
                }
              }}
              multiline
              rows={2}
              placeholder="Your hot take here..."
              helperText={`${formData.hotTake.length}/80 characters`}
              inputRef={inputRef}
              autoFocus
            />
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              What's your name?
            </Typography>
            <TextField
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              inputRef={inputRef}
              autoFocus
            />
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              What's your sex?
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.sex}
                onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                autoFocus
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 3:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Your Location
            </Typography>
            {locationLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <LinearProgress />
              </Box>
            ) : (
              <>
                {formData.location ? (
                  <Box>
                    <Typography>
                      {formData.location.city}, {formData.location.country}
                      {formData.location.zipCode && ` (${formData.location.zipCode})`}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={getUserLocation}
                      sx={{ mt: 2, mr: 1 }}
                    >
                      Refresh Location
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setFormData(prev => ({ ...prev, location: null }))}
                      sx={{ mt: 2 }}
                    >
                      Enter Different Location
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={getUserLocation}
                      sx={{ mb: 2, mr: 2 }}
                    >
                      Get My Location
                    </Button>
                    <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                      Or enter your zip code:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <TextField
                        value={manualZipCode}
                        onChange={(e) => setManualZipCode(e.target.value)}
                        placeholder="Enter ZIP code"
                        error={!!zipCodeError}
                        helperText={zipCodeError}
                        sx={{ width: '150px' }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleZipCodeSubmit}
                        disabled={!manualZipCode || manualZipCode.length !== 5}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )}
                {locationError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {locationError}
                  </Alert>
                )}
              </>
            )}
          </>
        );

      case 4:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Who are you interested in dating?
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.interestedIn}
                onChange={(e) => setFormData(prev => ({ ...prev, interestedIn: e.target.value }))}
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                autoFocus
              >
                <MenuItem value="male">Males</MenuItem>
                <MenuItem value="female">Females</MenuItem>
                <MenuItem value="both">Both</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 5:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Select your top 3 most important categories in dating:
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Please select exactly 3 categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
              {CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryToggle(category)}
                  color={formData.importantCategories.includes(category) ? "primary" : "default"}
                  sx={{ m: 0.5 }}
                  disabled={!formData.importantCategories.includes(category) && formData.importantCategories.length >= 3}
                />
              ))}
            </Box>
            <FormHelperText>
              Selected: {formData.importantCategories.length}/3 categories
            </FormHelperText>
          </>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return formData.hotTake.trim().length === 0;
      case 1:
        return formData.name.trim().length === 0;
      case 2:
        return !formData.sex;
      case 3:
        return !formData.location && !locationError;
      case 4:
        return !formData.interestedIn;
      case 5:
        return formData.importantCategories.length !== 3;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }} onKeyPress={handleKeyPress}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Step {currentStep + 1} of {totalSteps}
            </Typography>
          </Box>

          <Box sx={{ minHeight: '200px', mb: 4 }}>
            {renderStep()}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep === totalSteps - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isNextDisabled() || loading}
              >
                {loading ? 'Saving...' : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isNextDisabled()}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InitialQuestionnaire; 