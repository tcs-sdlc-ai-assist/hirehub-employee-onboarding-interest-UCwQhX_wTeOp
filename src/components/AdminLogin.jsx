import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginAdmin } from '../utils/auth';

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    setError('');
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setError('');
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(username, password);

    if (success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Invalid username or password');
    }
  }, [username, password, onLoginSuccess]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card-title">Admin Login</h1>
        <p className="login-card-subtitle">
          Enter your credentials to access the dashboard.
        </p>

        {error && (
          <div className="login-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

AdminLogin.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default AdminLogin;