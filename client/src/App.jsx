import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { checkAuth } from './api/auth';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(() => {
    return !!localStorage.getItem('token'); 
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      checkAuth()
        .then(() => setIsAuth(true))
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuth(false);
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <AuthPage isLogin={true} setIsAuth={setIsAuth} />} />
        <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <AuthPage isLogin={false} setIsAuth={setIsAuth} />} />
        <Route 
          path="/dashboard" 
          element={isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;