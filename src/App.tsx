import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { storage } from './utils/storage';
import { User } from './types';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { OnboardingForm } from './components/onboarding/OnboardingForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/settings/Settings';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = storage.getUser();
    const authToken = storage.getAuth();
    
    if (storedUser && authToken) {
      setUser(storedUser);
    } else {
      storage.clearAll(); // Clear any inconsistent state
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginForm />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} 
          />
          <Route 
            path="/onboarding" 
            element={!user ? <Navigate to="/login" /> : <OnboardingForm />} 
          />
          <Route 
            path="/dashboard" 
            element={!user ? <Navigate to="/login" /> : <Dashboard />} 
          />
          <Route 
            path="/settings" 
            element={!user ? <Navigate to="/login" /> : <Settings />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;