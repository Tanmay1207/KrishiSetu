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

        if (token) {
            localStorage.setItem('token', token);

            // Map backend role to frontend roles array
            let mappedRole = 'ROLE_USER';
            if (role === 'Admin') mappedRole = 'ROLE_ADMIN';
            else if (role === 'Farmer') mappedRole = 'ROLE_FARMER';
            else if (role === 'MachineryOwner') mappedRole = 'ROLE_OWNER';
            else if (role === 'FarmWorker') mappedRole = 'ROLE_WORKER';

            const roles = [mappedRole];

            const userData = { username, email, roles, isApproved };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }

        return response.data;
    };

    const register = async (userData) => {
        // Map frontend roles to backend roles
        // Backend expects: "Farmer", "MachineryOwner", "FarmWorker", "Admin"
        // Frontend sends: "Farmer", "MachineryOwner", "FarmWorker"
        // No mapping needed if we ensure frontend sends exactly what backend expects in Role name lookup
        // However, backend Role table has specific names. Let's check AuthService.cs:
        // var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == registerDto.Role);
        // We need to ensure frontend sends valid Role Names.

        const signupData = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            role: userData.role // "Farmer", "MachineryOwner", "FarmWorker"
        };

        const response = await api.post('/auth/register', signupData);
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
