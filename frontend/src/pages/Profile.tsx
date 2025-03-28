import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import FooterNav from '../components/FooterNav';
import axios from 'axios';

interface HotTakeStats {
  text: string;
  categories: string[];
  createdAt: string;
  stats: {
    totalResponses: number;
    averagePosition: number | null;
    skipCount: number;
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, updateProfile } = useAuth();
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
  const [hotTakes, setHotTakes] = useState<HotTakeStats[]>([]);
  const [selectedHotTake, setSelectedHotTake] = useState<HotTakeStats | null>(null);
  const [loadingHotTakes, setLoadingHotTakes] = useState(false);

  useEffect(() => {
    const fetchHotTakes = async () => {
      if (!token) return;
      
      setLoadingHotTakes(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/hot-takes/my-hot-takes`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setHotTakes(response.data);
      } catch (error) {
        console.error('Error fetching hot takes:', error);
        setError('Failed to fetch your hot takes');
      } finally {
        setLoadingHotTakes(false);
      }
    };

    fetchHotTakes();
  }, [token]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

        {/* My Hot Takes Section */}
        <Paper elevation={3} className="card">
          <Typography variant="h5" component="h2" className="heading-1 mb-4">
            My Hot Takes
          </Typography>

          {loadingHotTakes ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : hotTakes.length > 0 ? (
            <List>
              {hotTakes.map((hotTake, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button 
                    onClick={() => setSelectedHotTake(hotTake)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <div className="flex flex-wrap gap-1">
                          <Typography variant="body1" component="span">
                            {hotTake.text}
                          </Typography>
                          {hotTake.categories && hotTake.categories.length > 0 && (
                            <Chip
                              label={hotTake.categories[0]}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </div>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(hotTake.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < hotTakes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={3}>
              You haven't submitted any hot takes yet.
            </Typography>
          )}
        </Paper>
      </Container>

      {/* Stats Dialog */}
      <Dialog 
        open={!!selectedHotTake} 
        onClose={() => setSelectedHotTake(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Hot Take Stats</DialogTitle>
        <DialogContent>
          {selectedHotTake && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedHotTake.text}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Posted on {formatDate(selectedHotTake.createdAt)}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Categories:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {selectedHotTake.categories.map((category) => (
                    <Chip key={category} label={category} size="small" />
                  ))}
                </Box>
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Statistics:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Total Responses"
                      secondary={selectedHotTake.stats.totalResponses}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Average Position"
                      secondary={
                        selectedHotTake.stats.averagePosition 
                          ? selectedHotTake.stats.averagePosition.toFixed(2)
                          : 'No responses yet'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Times Skipped"
                      secondary={selectedHotTake.stats.skipCount}
                    />
                  </ListItem>
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedHotTake(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <FooterNav />
    </div>
  );
};

export default Profile; 