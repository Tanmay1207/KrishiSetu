import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardShell from '../components/DashboardShell';
import { User, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

const UserProfile = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestForm, setRequestForm] = useState({
        requestedRole: '',
        reason: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/user/role-requests');
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!requestForm.requestedRole) {
            setMessage({ type: 'error', text: 'Please select a role.' });
            return;
        }

        try {
            await api.post('/user/role-request', requestForm);
            setMessage({ type: 'success', text: 'Role request submitted successfully!' });
            setRequestForm({ requestedRole: '', reason: '' });
            fetchRequests();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit request.' });
        }
    };

    // Determine available roles to request
    const availableRoles = [
        { value: 'ROLE_FARMER', label: 'Farmer' },
        { value: 'ROLE_OWNER', label: 'Machinery Owner' },
        { value: 'ROLE_WORKER', label: 'Farm Worker' }
    ].filter(role => !user?.roles?.includes(role.value));

    return (
        <DashboardShell title="My Profile & Roles">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* User Info Card */}
                <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-black">
                        {user?.firstName?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{user?.email}</p>
                        <div className="flex gap-2">
                            {user?.roles?.map(role => (
                                <span key={role} className="px-4 py-2 bg-primary-100 text-primary-700 rounded-xl text-xs font-black uppercase tracking-widest">
                                    {role.replace('ROLE_', '')}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Request Role Form */}
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 h-fit">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tight">Become a Service Provider</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Request additional roles to expand your capabilities.</p>
                        </div>

                        {availableRoles.length === 0 ? (
                            <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                <CheckCircle size={20} />
                                You have all available roles!
                            </div>
                        ) : (
                            <form onSubmit={handleRequestSubmit} className="space-y-4">
                                {message.text && (
                                    <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {message.text}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select New Role</label>
                                    <select
                                        className="input-field h-12 w-full"
                                        value={requestForm.requestedRole}
                                        onChange={(e) => setRequestForm({ ...requestForm, requestedRole: e.target.value })}
                                    >
                                        <option value="">-- Choose Role --</option>
                                        {availableRoles.map(role => (
                                            <option key={role.value} value={role.value}>{role.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason / Experience</label>
                                    <textarea
                                        className="input-field w-full h-32 py-3"
                                        placeholder="Tell us why you want this role..."
                                        value={requestForm.reason}
                                        onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <ShieldCheck size={18} /> Submit Request
                                </button>
                            </form>
                        )}
                    </section>

                    {/* Request History */}
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 h-fit">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tight">Request History</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Track the status of your role applications.</p>
                        </div>

                        <div className="space-y-4">
                            {requests.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest py-8">No requests found.</p>
                            ) : (
                                requests.map(req => (
                                    <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-900 text-sm uppercase italic">
                                                {req.requestedRole.replace('ROLE_', '')}
                                            </span>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                    req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{req.reason}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </DashboardShell>
    );
};

export default UserProfile;
