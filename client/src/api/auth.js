import $api from './axios';

export const login = async ({ email, password }) => {
    const { data } = await $api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
};

export const registration = async ({ email, password }) => {
    const { data } = await $api.post('/auth/registration', { email, password });
    localStorage.setItem('token', data.token);
    return data;
};

export const checkAuth = async () => {
    const { data } = await $api.get('/auth/check');
    localStorage.setItem('token', data.token);
    return data;
};