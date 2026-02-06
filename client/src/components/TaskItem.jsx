import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../api/tasks';
import { Trash2, Edit3, Check, X, Clock } from 'lucide-react';

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return 'bg-green-100 text-green-700 border-green-200';
            case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <li className="bg-white border border-slate-200 rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start gap-4">
            {isEditing ? (
                <div className="flex flex-col gap-3 flex-1">
                    <input 
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                        value={newTitle} 
                        onChange={(e) => setNewTitle(e.target.value)} 
                        placeholder="Task title"
                    />
                    <textarea 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm"
                        value={newDesc} 
                        onChange={(e) => setNewDesc(e.target.value)} 
                        placeholder="Description"
                        rows="2"
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={() => updateMutation.mutate({ id: task.id, title: newTitle, description: newDesc })}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                            <Check size={16} /> Save
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-semibold ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                        </h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{task.description}</p>
                    <div className="flex items-center text-slate-400 text-[11px] gap-1">
                        <Clock size={12} />
                        <span>Added: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 min-w-[120px]">
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all text-sm"
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                )}
                <select 
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 outline-none cursor-pointer"
                    value={task.status} 
                    onChange={(e) => updateMutation.mutate({ id: task.id, status: e.target.value })}
                >
                    <option value="todo">Todo</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <button 
                    onClick={() => { if(confirm('Delete this task?')) deleteMutation.mutate(task.id) }}
                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-all text-sm"
                >
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </li>
    );
};

export default TaskItem;