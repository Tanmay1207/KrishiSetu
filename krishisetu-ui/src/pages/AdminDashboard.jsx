import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';
import { Users, ShieldCheck, Package, AlertCircle, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [machinery, setMachinery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN');

    const [adminForm, setAdminForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [adminMsg, setAdminMsg] = useState('');

    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;
        if (isSuperAdmin) {
            setActiveTab('admins');
        } else {
            if (hash === '#users') {
                setActiveTab('users');
            } else if (hash === '#approvals') {
                setActiveTab('machinery');
            } else {
                setActiveTab('users');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [location.hash, isSuperAdmin]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [statsRes, usersRes, machineryRes] = await Promise.all([
                api.get('/admin/stats').catch(e => { console.error("Stats fail", e); return { data: null }; }),
                api.get('/admin/users').catch(e => { console.error("Users fail", e); return { data: [] }; }),
                api.get('/admin/machinery/pending').catch(e => { console.error("Pending fail", e); return { data: [] }; })
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data || []);
            setMachinery(machineryRes.data || []);

            console.log("Admin Dashboard Fetch:", {
                stats: statsRes.data,
                usersCount: (usersRes.data || []).length,
                machineryCount: (machineryRes.data || []).length,
                machineryData: machineryRes.data
            });
        } catch (err) {
            console.error("Dashboard general error:", err);
            setError('Failed to fetch some dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const approveUser = async (userId, approve) => {
        try {
            await api.post(`/admin/users/${userId}/approve?approve=${approve}`);
            fetchData();
        } catch (err) {
            console.error("Action failed", err);
            setError('User approval action failed.');
        }
    };

    const approveMachinery = async (id, approve) => {
        try {
            await api.post(`/admin/machinery/${id}/approve?approve=${approve}`);
            fetchData();
        } catch (err) {
            console.error("Action failed", err);
            setError('Machinery approval action failed.');
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminMsg('');
        try {
            await api.post('/auth/create-admin', adminForm);
            setAdminMsg('Admin created successfully! No verification required.');
            setAdminForm({ firstName: '', lastName: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin.');
        }
    };

    if (loading && !stats && !isSuperAdmin) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
    );

    return (
        <DashboardShell title="Admin Control Panel">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">System Overview</h2>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchData}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 hover:shadow-lg transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Stats Grid - Only for Regulat Admin */}
            {!isSuperAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        label="Total Farmers"
                        value={stats?.totalFarmers || 0}
                        icon={Users}
                        color="bg-emerald-500"
                    />
                    <StatCard
                        label="Machinery Owners"
                        value={stats?.totalMachineryOwners || 0}
                        icon={ShieldCheck}
                        color="bg-blue-500"
                    />
                    <StatCard
                        label="Active Machinery"
                        value={stats?.totalMachineryListings || 0}
                        icon={Package}
                        color="bg-amber-500"
                    />
                </div>
            )}



            {/* Tabs Selector - Only for Regular Admin */}
            {!isSuperAdmin && (
                <div className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-10 overflow-hidden mx-auto">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-12 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-primary-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        User Approvals ({(users || []).filter(u => !u.isApproved).length})
                    </button>
                    <button
                        onClick={() => setActiveTab('machinery')}
                        className={`px-12 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'machinery' ? 'bg-white text-primary-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Machinery Requests ({machinery.length})
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-10">
                {activeTab === 'users' && (
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Pending User Approvals</h3>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Review new registrations before they can use the platform.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-8 py-5">User Profile</th>
                                        <th className="px-8 py-5">Role</th>
                                        <th className="px-8 py-5">Date Joined</th>
                                        <th className="px-8 py-5 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(users || []).filter(u => !u.isApproved).length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center text-slate-500 font-medium tracking-tight">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-slate-50 rounded-full">
                                                        <ShieldCheck size={48} className="text-slate-300" />
                                                    </div>
                                                    <p>All users have been verified. No pending approvals.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        (users || []).filter(u => !u.isApproved).map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                                            {u.firstName?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-lg uppercase italic tracking-tighter">
                                                                {u.firstName} {u.lastName}
                                                            </p>
                                                            <p className="text-xs text-slate-500 font-bold tracking-widest">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-wrap gap-1">
                                                        {u.roles?.map(r => (
                                                            <span key={r.id} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black tracking-widest uppercase">
                                                                {r.name.replace('ROLE_', '')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => approveUser(u.id, true)}
                                                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => approveUser(u.id, false)}
                                                            className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'machinery' && (
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Pending Machinery Listings</h3>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verify equipment details and rates before they appear in the market.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-8 py-5">Equipment</th>
                                        <th className="px-8 py-5">Owner</th>
                                        <th className="px-8 py-5">Rates</th>
                                        <th className="px-8 py-5 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {machinery.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center text-slate-500 font-medium tracking-tight">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-slate-50 rounded-full">
                                                        <Package size={48} className="text-slate-300" />
                                                    </div>
                                                    <p>No machinery listings pending approval.</p>
                                                    <button onClick={fetchData} className="text-primary-600 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                                                        <RefreshCw size={14} /> Refresh List
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        machinery.map(m => (
                                            <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                                                            {m.imageUrl ? (
                                                                <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <Package size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 uppercase italic tracking-tighter">{m.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{m.category?.name || 'Uncategorized'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 uppercase italic tracking-tight">
                                                            {m.owner?.firstName} {m.owner?.lastName}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{m.owner?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-xs font-black text-primary-600 uppercase italic">₹{m.ratePerHour}/hr</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">₹{m.ratePerDay}/day</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => approveMachinery(m.id, true)}
                                                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => approveMachinery(m.id, false)}
                                                            className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === 'admins' && isSuperAdmin && (
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">Add New Admin</h3>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Create an administrative account with full access. No OTP required.</p>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="p-8 space-y-6">
                            {adminMsg && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={16} />
                                    {adminMsg}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text" required
                                        className="input-field h-12"
                                        value={adminForm.firstName}
                                        onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text" required
                                        className="input-field h-12"
                                        value={adminForm.lastName}
                                        onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email" required
                                    className="input-field h-12"
                                    value={adminForm.email}
                                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                    placeholder="admin@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
                                <input
                                    type="password" required
                                    className="input-field h-12"
                                    value={adminForm.password}
                                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <ShieldCheck size={18} /> Create Admin Account
                            </button>
                        </form>
                    </section>
                )}
            </div>
        </DashboardShell>
    );
};

export default AdminDashboard;
