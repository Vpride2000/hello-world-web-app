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
          <svg className="login-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#0066CC" stroke="#003399" strokeWidth="2"/>
            <text x="50" y="55" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">Г</text>
          </svg>
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
