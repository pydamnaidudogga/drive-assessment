import React from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import GoogleLogin from '../components/Auth/GoogleLogin';


const LoginPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
       
         <GoogleLogin />
    </div>
  );
};

export default LoginPage;