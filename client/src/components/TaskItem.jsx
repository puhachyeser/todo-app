import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../api/tasks';

const TaskItem = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newDesc, setNewDesc] = useState(task.description);
    
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            setIsEditing(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries(['tasks'])
    });

    const handleSave = () => {
        updateMutation.mutate({ 
            id: task.id, 
            title: newTitle, 
            description: newDesc 
        });
    };

    return (
        <li style={{ 
            border: '1px solid #ccc', padding: '15px', marginBottom: '10px',
            borderRadius: '8px', display: 'flex', justifyContent: 'space-between'
        }}>
            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                    <input 
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)} 
                        style={{ fontWeight: 'bold' }}
                    />
                    <textarea 
                        value={newDesc} 
                        onChange={(e) => setNewDesc(e.target.value)} 
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={handleSave} style={{ color: 'green' }}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1 }}>
                    <strong style={{ 
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        fontSize: '18px'
                    }}>
                        {task.title}
                    </strong>
                    <p style={{ margin: '5px 0', color: '#555' }}>{task.description}</p>
                    <div style={{ fontSize: '12px', color: '#888' }}>Status: {task.status}</div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)}>Edit Text</button>
                )}
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
    );
};

export default TaskItem;