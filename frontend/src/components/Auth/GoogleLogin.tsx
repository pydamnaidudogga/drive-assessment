import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './GoogleLogin.css'; // We'll create this CSS file

const GoogleLogin: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Google login error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png" 
            alt="Letter Editor Logo" 
            className="logo"
          />
          <h1>Letter Editor</h1>
        </div>
        
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to access your documents</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="google-login-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Signing in...
            </>
          ) : (
            <>
              <img 
                src="https://www.gstatic.com/marketing-cms/assets/images/99/af/03183eb3413fbc8ed2c9df8591ed/g-nest-vertical.webp=n-w38-h48-fcrop64=1,00000000ffffffff-rw" 
                alt="Google logo" 
                className="google-logo"
              />
              Sign in with Google
            </>
          )}
        </button>

        <div className="terms">
          <p>By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;