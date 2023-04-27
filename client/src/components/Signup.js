// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// function SignUp() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch('http://127.0.0.1:5555/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setUser(data);
//       navigate('/');
//     } else {
//       // Handle signup error
//     }
//   };

//   return (
//     <div className="signup">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }

// export default SignUp;

import React, { useState } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add your logic to handle signup, e.g., making a request to the backend.
    console.log({ username, email, password });
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;

