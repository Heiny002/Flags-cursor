import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import FooterNav from '../components/FooterNav';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface HotTake {
  _id: string;
  text: string;
  categories: string[];
  author?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  isActive: boolean;
  isInitial: boolean;
  responses: any[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  profile?: {
    age?: number;
    gender?: string;
    location?: string;
  };
}

interface EditHotTakeDialogProps {
  open: boolean;
  hotTake: HotTake | null;
  onClose: () => void;
  onSave: (updatedHotTake: Partial<HotTake>) => Promise<void>;
}

interface EditUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => Promise<void>;
}

function EditHotTakeDialog({ open, hotTake, onClose, onSave }: EditHotTakeDialogProps) {
  const [editedHotTake, setEditedHotTake] = useState<Partial<HotTake>>({});

  useEffect(() => {
    if (hotTake) {
      setEditedHotTake({
        text: hotTake.text,
        categories: hotTake.categories,
        isActive: hotTake.isActive,
      });
    }
  }, [hotTake]);

  const handleSave = async () => {
    await onSave(editedHotTake);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Hot Take</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Text"
          fullWidth
          multiline
          rows={4}
          value={editedHotTake.text || ''}
          onChange={(e) => setEditedHotTake({ ...editedHotTake, text: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Categories (comma-separated)"
          fullWidth
          value={editedHotTake.categories?.join(', ') || ''}
          onChange={(e) => setEditedHotTake({
            ...editedHotTake,
            categories: e.target.value.split(',').map(cat => cat.trim())
          })}
        />
        <FormControlLabel
          control={
            <Switch
              checked={editedHotTake.isActive || false}
              onChange={(e) => setEditedHotTake({ ...editedHotTake, isActive: e.target.checked })}
            />
          }
          label="Active"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditUserDialog({ open, user, onClose, onSave }: EditUserDialogProps) {
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        profile: user.profile,
      });
    }
  }, [user]);

  const handleSave = async () => {
    await onSave(editedUser);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={editedUser.name || ''}
          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          value={editedUser.email || ''}
          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Age"
          type="number"
          fullWidth
          value={editedUser.profile?.age || ''}
          onChange={(e) => setEditedUser({
            ...editedUser,
            profile: { ...editedUser.profile, age: parseInt(e.target.value) }
          })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Gender</InputLabel>
          <Select
            value={editedUser.profile?.gender || ''}
            onChange={(e) => setEditedUser({
              ...editedUser,
              profile: { ...editedUser.profile, gender: e.target.value }
            })}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Location"
          fullWidth
          value={editedUser.profile?.location || ''}
          onChange={(e) => setEditedUser({
            ...editedUser,
            profile: { ...editedUser.profile, location: e.target.value }
          })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Admin: React.FC = () => {
  const { token } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingHotTake, setEditingHotTake] = useState<HotTake | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch hot takes
        const hotTakesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/hot-takes`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setHotTakes(hotTakesResponse.data);

        // Fetch users
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUsers(usersResponse.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditHotTake = async (updatedHotTake: Partial<HotTake>) => {
    try {
      if (!editingHotTake?._id) return;
      
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/hot-takes/${editingHotTake._id}`,
        updatedHotTake,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setHotTakes(hotTakes.map(ht => 
        ht._id === editingHotTake._id ? { ...ht, ...updatedHotTake } : ht
      ));
    } catch (err) {
      console.error('Error updating hot take:', err);
      setError('Failed to update hot take');
    }
  };

  const handleEditUser = async (updatedUser: Partial<User>) => {
    try {
      if (!editingUser?._id) return;
      
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${editingUser._id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsers(users.map(user => 
        user._id === editingUser._id ? { ...user, ...updatedUser } : user
      ));
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24 mt-16 flex items-center justify-center">
          <CircularProgress />
        </div>
        <FooterNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24 mt-16">
          <Alert severity="error">{error}</Alert>
        </div>
        <FooterNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 mt-16">
        <Paper elevation={3} sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Hot Takes" />
              <Tab label="Users" />
              <Tab label="Responses" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Text</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hotTakes.map((hotTake, index) => (
                    <TableRow key={hotTake._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{hotTake.text}</TableCell>
                      <TableCell>
                        {hotTake.categories?.join(', ') || 'No Category'}
                      </TableCell>
                      <TableCell>
                        {hotTake.author?.name || 'Anonymous'}
                      </TableCell>
                      <TableCell>
                        {hotTake.author?.email || 'No email'}
                      </TableCell>
                      <TableCell>
                        {new Date(hotTake.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={hotTake.isActive ? 'Active' : 'Inactive'} 
                          color={hotTake.isActive ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setEditingHotTake(hotTake)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Profile</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.profile && (
                          <Box>
                            <Typography variant="body2">
                              Age: {user.profile.age || 'Not set'}
                            </Typography>
                            <Typography variant="body2">
                              Gender: {user.profile.gender || 'Not set'}
                            </Typography>
                            <Typography variant="body2">
                              Location: {user.profile.location || 'Not set'}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setEditingUser(user)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1" color="text.secondary">
              Response statistics and management coming soon...
            </Typography>
          </TabPanel>
        </Paper>
      </div>
      <FooterNav />

      <EditHotTakeDialog
        open={!!editingHotTake}
        hotTake={editingHotTake}
        onClose={() => setEditingHotTake(null)}
        onSave={handleEditHotTake}
      />

      <EditUserDialog
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleEditUser}
      />
    </div>
  );
};

export default Admin; 