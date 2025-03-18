import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import FooterNav from '../components/FooterNav';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: user?.profile?.age || 0,
    gender: user?.profile?.gender || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    interests: user?.profile?.interests || [],
  });
  const [newInterest, setNewInterest] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (newInterest && !profile.interests.includes(newInterest)) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== interest),
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page-container">
      <Container maxWidth="sm" className="py-6">
        <Paper elevation={3} className="card">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" className="heading-1">
              Profile
            </Typography>
            <IconButton 
              onClick={() => setIsEditing(!isEditing)} 
              color="primary"
              className="hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} className="rounded-md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={user?.name || ''}
                  disabled
                  className="input"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  className="input"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Age"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  disabled={!isEditing}
                  className="input"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Gender"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  disabled={!isEditing}
                  className="input"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
                  className="input"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  className="input"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Add Interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    disabled={!isEditing}
                    className="input"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddInterest}
                    disabled={!isEditing || !newInterest}
                    className="btn btn-primary"
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profile.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onDelete={isEditing ? () => handleRemoveInterest(interest) : undefined}
                      className="badge badge-secondary"
                    />
                  ))}
                </Box>
              </Grid>
              {isEditing && (
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
      <FooterNav />
    </div>
  );
};

export default Profile; 