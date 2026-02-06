import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/tasks';

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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                placeholder="Task title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Description" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
            />
            <button type="submit" disabled={mutation.isLoading}>Add Task</button>
        </form>
    );
};

export default TaskForm;