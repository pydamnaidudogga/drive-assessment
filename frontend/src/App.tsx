import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/editor" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
          <Route path="/editor/:id" element={<PrivateRoute><EditorPage /></PrivateRoute>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;