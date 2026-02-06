import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login, registration } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ isLogin, setIsAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: isLogin ? login : registration,
        onSuccess: () => {
            setIsAuth(true);
            navigate('/dashboard');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Something went wrong');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h2>{isLogin ? 'Login' : 'Registration'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Processing...' : (isLogin ? 'Enter' : 'Create Account')}
                </button>
            </form>
            <p onClick={() => navigate(isLogin ? '/register' : '/login')} style={{ cursor: 'pointer', color: 'blue' }}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default AuthPage;