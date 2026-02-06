import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, updateTask, deleteTask } from '../api/tasks';
import TaskForm from '../components/TaskForm';

const Dashboard = ({ setIsAuth }) => {
    const [filter, setFilter] = useState('');
    const queryClient = useQueryClient();

    const { data: tasks, isLoading, isError } = useQuery({
        queryKey: ['tasks', filter],
        queryFn: () => getTasks(filter),
    });

    const updateMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries(['tasks'])
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    };

    if (isLoading) return <div>Loading tasks...</div>;
    if (isError) return <div>Error loading tasks</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={handleLogout} style={{ float: 'right', background: '#ff4d4d', color: 'white' }}>
                Logout
            </button>
            <h1>My Tasks</h1>
            <TaskForm />
            
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <button onClick={() => setFilter('')}>All</button>
                <button onClick={() => setFilter('todo')}>Todo</button>
                <button onClick={() => setFilter('in progress')}>In Progress</button>
                <button onClick={() => setFilter('done')}>Done</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks?.map(task => (
                    <li key={task.id} style={{ 
                        border: '1px solid #ccc', 
                        padding: '10px', 
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <strong style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                                {task.title}
                            </strong>
                            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>{task.description}</p>
                            <span>Status: {task.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <select 
                                value={task.status} 
                                onChange={(e) => updateMutation.mutate({ id: task.id, status: e.target.value })}
                            >
                                <option value="todo">Todo</option>
                                <option value="in progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <button 
                                onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(task.id) }}
                                style={{ color: 'red' }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;