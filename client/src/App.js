

// function App() {
//   return (
//     <div>
//         <p>
//           Walk With Me
//         </p>
     
//     </div>
//   );
// }

// export default App;

// src/App.js
// import React, { useState } from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import Home from './components/Home';
// import Walks from './components/Walks';
// import Reviews from './components/Reviews';
// import Navbar from './components/Navbar';
// import { AuthContext } from './contexts/AuthContext';

// function App() {
//   const [user, setUser] = useState(null);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/walks" element={<Walks />} />
//           <Route path="/reviews" element={<Reviews />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthContext.Provider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Walks from './components/Walks';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/walks" element={<Walks />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
