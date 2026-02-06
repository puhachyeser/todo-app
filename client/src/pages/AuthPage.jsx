import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login, registration } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                <div className="text-center mb-8">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex justify-center items-center mx-auto mb-4">
                        {isLogin ? <LogIn className="text-blue-600" size={28} /> : <UserPlus className="text-blue-600" size={28} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        {isLogin ? 'Please enter your details to sign in' : 'Join us to start managing your tasks'}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="Email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={mutation.isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {mutation.isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Get Started')}
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-slate-600">
                    <span>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button 
                        onClick={() => navigate(isLogin ? '/register' : '/login')}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;