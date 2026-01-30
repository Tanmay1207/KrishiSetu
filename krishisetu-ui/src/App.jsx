import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    // Map human-readable roles from props to backend ROLE names
    const roleMap = {
        'Admin': 'ROLE_ADMIN',
        'Farmer': 'ROLE_FARMER',
        'MachineryOwner': 'ROLE_OWNER',
        'FarmWorker': 'ROLE_WORKER'
    };

    const requiredRole = roleMap[role] || 'ROLE_USER';

    if (role && !user.roles?.includes(requiredRole) && !user.roles?.includes('ROLE_SUPER_ADMIN')) {
        return <Navigate to="/" />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Dashboards */}
                    <Route path="/farmer" element={<ProtectedRoute role="Farmer"><FarmerDashboard /></ProtectedRoute>} />
                    <Route path="/owner" element={<ProtectedRoute role="MachineryOwner"><OwnerDashboard /></ProtectedRoute>} />
                    <Route path="/worker" element={<ProtectedRoute role="FarmWorker"><WorkerDashboard /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
