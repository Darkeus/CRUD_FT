import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Alert from './components/Alert';
import { AlertProvider } from './components/AlertContext';
import api from './api';
import './styles/App.css';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}
function App() {
  const [userData, setUserData] = useState({ username: '', emeraldFunds: 0 });

 
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/user-data/');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    
  

  return (
    <AlertProvider>
      <BrowserRouter>
      <Alert />
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<><Header  username={userData.username} emeraldFunds={userData.emeraldFunds} fechData={fetchUserData}/><Home emeraldFunds={userData.emeraldFunds} /></>} />
            <Route path="logout" element={<Logout />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
