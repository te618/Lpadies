import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/Dashboard';
import GuestDashboard from './components/guest/Dashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Profile from './components/guest/Profile';
import Guests from './components/admin/Guests';
import Rooms from './components/admin/Rooms';

function App() {
  console.log('App component rendering');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/guest/dashboard" 
            element={
              <ProtectedRoute allowedRole="guest">
                <GuestDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/guest/profile" 
            element={
              <ProtectedRoute allowedRole="guest">
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/guests" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Guests />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/rooms" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Rooms />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 