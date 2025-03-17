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

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: user?.profile?.age || '',
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
    } catch (err) {
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h1" variant="h5">
              Profile
            </Typography>
            <IconButton onClick={() => setIsEditing(!isEditing)} color="primary">
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Name
                </Typography>
                <Typography>{user.name}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Email
                </Typography>
                <Typography>{user.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!isEditing}
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
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    label="Add Interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    disabled={!isEditing}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddInterest}
                    disabled={!isEditing || !newInterest}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onDelete={isEditing ? () => handleRemoveInterest(interest) : undefined}
                    />
                  ))}
                </Box>
              </Grid>

              {isEditing && (
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 