import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Flags from './pages/Flags';
import Conversations from './pages/Conversations';
import Settings from './pages/Settings';
import HotTakeSubmission from './pages/HotTakeSubmission';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import { useState } from 'react';
import './styles/design-system.css';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [loading] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/flags"
              element={
                <ProtectedRoute>
                  <Flags />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/conversations"
              element={
                <ProtectedRoute>
                  <Conversations />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hot-takes"
              element={
                <ProtectedRoute>
                  <HotTakeSubmission />
                </ProtectedRoute>
              }
            />

            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/flags" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
