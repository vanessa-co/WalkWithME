import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './style.css';


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
      const response = await fetch('/auth', {
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

  // return (
  //   <div>
  //     <h2>{isLogin ? 'Login' : 'Sign up'}</h2>
  //     <form onSubmit={handleSubmit}>
  //       {!isLogin && (
  //         <div>
  //           <label htmlFor="email">Email</label>
  //           <input
  //             type="email"
  //             id="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //           />
  //         </div>
  //       )}
  //       <div>
  //         <label htmlFor="username">Username</label>
  //         <input
  //           type="text"
  //           id="username"
  //           value={username}
  //           onChange={(e) => setUsername(e.target.value)}
  //         />
  //       </div>
  //       <div>
  //         <label htmlFor="password">Password</label>
  //         <input
  //           type="password"
  //           id="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>
  //       <button type="submit">{isLogin ? 'Login' : 'Sign up'}</button>
  //     </form>
  //     {error && <p>{error}</p>}
  //     <button onClick={() => setIsLogin(!isLogin)}>
  //       Switch to {isLogin ? 'Sign up' : 'Login'}
  //     </button>
  //   </div>
  // );
  return (
    <Container fluid className="auth-container d-flex align-items-center">
      <Row className="justify-content-center">
        <Col md={10} lg={10}>
          <div className="form-container">
            <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Sign up'}</h2>
            <Form onSubmit={handleSubmit}>
              {!isLogin && (
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              )}
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 mb-3">
                {isLogin ? 'Login' : 'Sign up'}
              </Button>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button
              variant="outline-secondary"
              onClick={() => setIsLogin(!isLogin)}
              className="w-100"
            >
              Switch to {isLogin ? 'Sign up' : 'Login'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
  



};

export default Auth;













