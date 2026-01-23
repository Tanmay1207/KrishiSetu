import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, username, role, isApproved } = response.data;

        if (isApproved && token) {
            localStorage.setItem('token', token);
            const userData = { username, role, isApproved };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }

        return { username, role, isApproved };
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token, username, role, isApproved } = response.data;

        if (isApproved && token) {
            localStorage.setItem('token', token);
            const user = { username, role, isApproved };
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        }

        return { username, role, isApproved };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
