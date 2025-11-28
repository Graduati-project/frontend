import api from "../lib/apis";



export async function signup(data){
    const response = await api.post('/auth/signup',data);
    return response.data;
}
export async function login(data){
    const response = await api.post('/auth/login',data);
    return response.data;
}

export async function sendResetPassword(email) {
    const response = await api.patch('/auth/send-reset-password', { email });
    return response.data;
}
export async function ResetPassword(data) {
    const response = await api.patch('/auth/reset-password', data);
    return response.data;
}