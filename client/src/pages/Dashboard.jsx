import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { LogOut, ListTodo } from 'lucide-react';

const Dashboard = ({ setIsAuth }) => {
    const [filter, setFilter] = useState('');

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks', filter],
        queryFn: () => getTasks(filter),
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <nav className="bg-white border-b border-slate-200 mb-8">
                <div className="max-w-3xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-600">
                        <ListTodo size={24} />
                        <span className="font-bold text-xl text-slate-800">To-Do List</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>
            <main className="max-w-3xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Tasks</h1>
                    <p className="text-slate-500">Manage your daily activities and productivity</p>
                </header>
                <TaskForm />
                <div className="flex flex-wrap gap-2 mb-6">
                    {['', 'todo', 'in progress', 'done'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all border ${
                                filter === status
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {status || 'All'}
                        </button>
                    ))}
                </div>
                {tasks?.length > 0 ? (
                    <ul className="space-y-4">
                        {tasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-400">No tasks found. Start by creating one!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;