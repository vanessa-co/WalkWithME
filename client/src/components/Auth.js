import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5555/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error);
      }

      const { token, user: userData } = await response.json();
      console.log(userData);
      Cookies.set('auth_token', token);

      if (isLogin) {
        setUser(userData);
      } else {
        setUser(userData);
        setIsLogin(true);
      }

      if (userData) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Sign up'}</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Sign up' : 'Login'}
      </button>
    </div>
  );
};

export default Auth;













