import axios from "axios"

export const registerUser = async (userData) => {
    try {
        const response = await axios.post("http://localhost:5223/users/register", userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        console.log('Отправляемые данные на сервер:', userData);
        const response = await axios.post("http://localhost:5223/users/login", userData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('Полный ответ сервера при логине:', response);
        console.log('Данные пользователя:', response.data);
        
        // Используем только id, который вернул сервер
        const userId = response.data?.id || response.data?.userId || response.data?.user_id;
        if (userId) {
            localStorage.setItem('userId', userId);
            console.log('ID пользователя сохранен:', userId);
        } else {
            localStorage.removeItem('userId');
            console.error('ID пользователя не найден в ответе сервера');
        }
        
        return {
            ...response.data,
            id: userId
        };
    } catch (error) {
        console.error("Login error:", error);
        if (error.response) {
            console.error('Данные ошибки:', error.response.data);
            console.error('Статус ошибки:', error.response.status);
        }
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('userId');
};