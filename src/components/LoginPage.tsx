import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

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
            src="https://yt3.googleusercontent.com/ytc/AIdro_nJBkQs-ezXCzsiOrwrltHYxUyTCVyuZKYcUBcJWMKyuQ=s900-c-k-c0x00ffffff-no-rj" 
            alt="Company Logo"
          />
          <h1>Отдел телекоммуникаций</h1>
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
          <p>Логин: <code>АДМ</code></p>
          <p>Пароль: <code>123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
