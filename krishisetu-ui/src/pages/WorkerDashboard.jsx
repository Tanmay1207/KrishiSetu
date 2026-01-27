import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';
import { Briefcase, MapPin, Star, Clock, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import WorkerProfileModal from '../components/WorkerProfileModal';

const WorkerDashboard = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;
        const targetId = hash || '#board';

        // Small timeout to ensure DOM is ready
        setTimeout(() => {
            const element = document.querySelector(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }, [location.hash, loading]);

    const fetchData = async () => {
        try {
            const [profRes, bookRes] = await Promise.all([
                api.get('/worker/profile/mine'),
                api.get('/worker/bookings')
            ]);
            setProfile(profRes.data);
            setBookings(bookRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = bookings
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);

    const completedJobs = bookings.filter(b => b.status === 'Completed').length;

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
    );

    return (
        <DashboardShell title="Farm Worker Portal">
            <div id="board" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Side: Stats & History */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            label="Total Jobs Done"
                            value={completedJobs}
                            icon={Briefcase}
                            color="bg-amber-500"
                        />
                        <StatCard
                            label="My Hourly Rate"
                            value={`₹${profile?.hourlyRate || 0}`}
                            icon={Clock}
                            color="bg-blue-500"
                        />
                    </div>

                    <div id="history" className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Work History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Farmer</th>
                                        <th className="px-8 py-5">Date</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium">
                                                No work history found.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map(book => (
                                            <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-black">
                                                            {book.farmerName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{book.farmerName}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Farmer</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                                        <Calendar size={14} />
                                                        {new Date(book.startDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`
                                                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                        ${book.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                                                    `}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${book.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {book.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={`text-lg font-black tracking-tighter ${book.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-slate-300'}`}>
                                                        ₹{book.totalAmount}
                                                    </span>
                                                    {book.paymentStatus === 'Paid' && (
                                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                                                            Paid <ShieldCheck size={10} />
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Side: Profile Info */}
                <div className="space-y-8">
                    <section id="profile" className="bg-slate-900 rounded-4xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                            <Briefcase size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-3xl bg-primary-500 flex items-center justify-center font-black text-2xl shadow-xl shadow-primary-500/20">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black tracking-tight uppercase italic">{user?.email}</h4>
                                    <span className="text-xs font-black text-primary-400 uppercase tracking-widest italic tracking-tighter">Farm Worker</span>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Availability</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <p className="font-bold text-emerald-400 uppercase tracking-tighter text-sm">Available for Work</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earnings</p>
                                    <p className="text-3xl font-black tracking-tighter text-emerald-400">₹{totalEarnings}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-primary-100 transition-colors uppercase tracking-[0.2em]"
                                >
                                    Edit My Profile
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {isEditModalOpen && (
                <WorkerProfileModal
                    profile={profile}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        fetchData();
                    }}
                />
            )}
        </DashboardShell>
    );
};

export default WorkerDashboard;
