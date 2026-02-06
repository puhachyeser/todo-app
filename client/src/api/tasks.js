import $api from './axios';

export const getTasks = async (status) => {
    const { data } = await $api.get('/tasks', {
        params: status ? { status } : {}
    });
    return data;
};

export const createTask = async (taskData) => {
    const { data } = await $api.post('/tasks', taskData);
    return data;
};

export const updateTask = async ({ id, ...updateData }) => {
    const { data } = await $api.patch(`/tasks/${id}`, updateData);
    return data;
};

export const deleteTask = async (id) => {
    const { data } = await $api.delete(`/tasks/${id}`);
    return data;
};