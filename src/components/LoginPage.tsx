import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const appName = process.env.REACT_APP_NAME || 'Отдел телекоммуникаций';
  const logoUrl = process.env.REACT_APP_COMPANY_LOGO_URL || '';
  const defaultAdminUsername = process.env.REACT_APP_DEFAULT_ADMIN_USERNAME || 'АДМ';
  const defaultAdminPassword = process.env.REACT_APP_DEFAULT_ADMIN_PASSWORD || '123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Пожалуйста заполните все поля');
      return;
    }

    if (login(username, password)) {
      setUsername('');
      setPassword('');
    } else {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img 
            className="login-logo" 
            src={logoUrl}
            alt="Company Logo"
          />
          <h1>{appName}</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">Войти</button>
        </form>

        <div className="login-hint">
          <p><strong>Для тестирования:</strong></p>
          <p>Логин: <code>{defaultAdminUsername}</code></p>
          <p>Пароль: <code>{defaultAdminPassword}</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
