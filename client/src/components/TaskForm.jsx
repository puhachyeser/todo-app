import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/tasks';
import { PlusCircle } from 'lucide-react';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            setTitle('');
            setDescription('');
            queryClient.invalidateQueries(['tasks']);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ title, description });
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col gap-4"
        >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Create New Task</h2>
            <div className="flex flex-col gap-1">
                <input 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    placeholder="What needs to be done?" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                />
            </div>
            <div className="flex flex-col gap-1">
                <textarea 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 min-h-[80px]"
                    placeholder="Add more details (optional)" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                />
            </div>
            <button 
                type="submit" 
                disabled={mutation.isLoading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-blue-200"
            >
                {mutation.isLoading ? (
                    <span className="animate-pulse">Creating...</span>
                ) : (
                    <>
                        <PlusCircle size={20} />
                        <span>Add Task</span>
                    </>
                )}
            </button>
        </form>
    );
};

export default TaskForm;