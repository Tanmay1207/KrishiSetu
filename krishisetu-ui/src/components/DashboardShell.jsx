import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart2,
    Home,
    User,
    Search,
    Briefcase,
    Calendar,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Tractor,
    Settings,
    Layout
} from 'lucide-react';
import { useState } from 'react';

const DashboardShell = ({ children, title }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const farmerLinks = [
        { name: 'Home', path: '/farmer', icon: <Layout size={20} /> },
        { name: 'Rent Machinery', path: '#browse', icon: <Tractor size={20} /> },
        { name: 'My Bookings', path: '#bookings', icon: <Calendar size={20} /> },
    ];

    const ownerLinks = [
        { name: 'My Machinery', path: '#top', icon: <Tractor size={20} /> },
        { name: 'Booking Requests', path: '#requests', icon: <Calendar size={20} /> },
        { name: 'Earnings', path: '#earnings', icon: <BarChart2 size={20} /> },
    ];

    const workerLinks = [
        { name: 'Job Board', path: '#board', icon: <Briefcase size={20} /> },
        { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
        { name: 'Work History', path: '#history', icon: <Calendar size={20} /> },
    ];

    const profileLink = { name: 'My Profile', path: '/profile', icon: <User size={20} /> };

    const superAdminLinks = [
        { name: 'Manage Admins', path: '/admin#admins', icon: <ShieldCheck size={20} /> },
    ];

    const adminLinks = [
        { name: 'System Overview', path: '/admin', icon: <BarChart2 size={20} /> },
        { name: 'User List', path: '/admin#users', icon: <User size={20} /> },
        { name: 'Approvals', path: '/admin#approvals', icon: <ShieldCheck size={20} /> },
    ];

    const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN');
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isFarmer = user?.roles?.includes('ROLE_FARMER');
    const isOwner = user?.roles?.includes('ROLE_OWNER');
    const isWorker = user?.roles?.includes('ROLE_WORKER');

    const links = (isSuperAdmin ? superAdminLinks :
        isAdmin ? adminLinks :
            isFarmer ? farmerLinks :
                isOwner ? ownerLinks :
                    workerLinks).concat([profileLink]);

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden font-inter">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-500 p-2 rounded-xl">
                                <Tractor size={24} className="text-white" />
                            </div>
                            <span className="text-2xl font-black font-outfit tracking-tighter uppercase italic text-emerald-400">KrishiSetu</span>
                        </div>
                        <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                                <span className="font-bold">{link.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="px-4 py-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center gap-3 px-4 py-2">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm truncate">{user?.email}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                    {isSuperAdmin ? 'Super Admin' :
                                        isAdmin ? 'Admin' :
                                            isFarmer ? 'Farmer' :
                                                isOwner ? 'Machinery Owner' :
                                                    isWorker ? 'Farm Worker' : 'User'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-bold uppercase tracking-widest text-xs">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative items-center">
                            <input
                                type="text"
                                placeholder="Search now..."
                                className="bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                            <Search size={16} className="absolute left-3 text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardShell;
