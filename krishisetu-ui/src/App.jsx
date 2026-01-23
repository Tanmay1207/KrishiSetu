import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
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
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
