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
        const response = await api.post('/auth/signin', { email, password });
        const { token, id, roles } = response.data;

        if (token) {
            localStorage.setItem('token', token);
            const userData = { id, email, roles };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }

        return response.data;
    };

    const register = async (userData) => {
        // Map frontend roles to backend roles
        let apiRole = 'ROLE_FARMER';
        if (userData.role === 'MachineryOwner') apiRole = 'ROLE_OWNER';
        if (userData.role === 'FarmWorker') apiRole = 'ROLE_WORKER';
        if (userData.role === 'Admin') apiRole = 'ROLE_ADMIN';

        const signupData = {
            firstName: userData.fullName.split(' ')[0],
            lastName: userData.fullName.split(' ').slice(1).join(' ') || ' ',
            email: userData.email,
            password: userData.password,
            role: apiRole
        };

        const response = await api.post('/auth/signup', signupData);
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyOtp, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
