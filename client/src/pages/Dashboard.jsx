import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = ({ setIsAuth }) => {
    const [filter, setFilter] = useState('');

    const { data: tasks, isLoading, isError } = useQuery({
        queryKey: ['tasks', filter],
        queryFn: () => getTasks(filter),
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
                    <TaskItem key={task.id} task={task} />
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;