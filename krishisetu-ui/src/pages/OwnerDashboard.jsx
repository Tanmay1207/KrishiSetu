import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';
import { Tractor, Calendar, Wallet, CheckCircle, Clock, Plus } from 'lucide-react';
import AddMachineryModal from '../components/AddMachineryModal';

const OwnerDashboard = () => {
    const { logout } = useAuth();
    const [machinery, setMachinery] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;
        const targetId = hash || '#top';

        setTimeout(() => {
            const element = document.querySelector(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }, [location.hash, loading]);

    const fetchData = async () => {
        try {
            const [macRes, bookRes] = await Promise.all([
                api.get('/owner/machinery/mine'),
                api.get('/owner/bookings')
            ]);
            setMachinery(macRes.data);
            setBookings(bookRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
    );

    return (
        <DashboardShell title="My Machinery Dashboard">
            <div id="top" className="space-y-8">
                {/* Owner Stats */}
                <div id="earnings" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <StatCard
                        label="Active Machinery"
                        value={machinery.length}
                        icon={Tractor}
                        color="bg-emerald-500"
                    />
                    <StatCard
                        label="New Requests"
                        value={bookings.filter(b => b.status === 'Pending').length}
                        icon={Clock}
                        color="bg-amber-500"
                    />
                    <StatCard
                        label="My Total Earnings"
                        value={`₹${bookings.reduce((sum, b) => sum + (b.paymentStatus === 'Paid' ? b.totalAmount : 0), 0)}`}
                        icon={Wallet}
                        color="bg-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Recent Activity List */}
                    <div className="xl:col-span-2 space-y-8">
                        <section id="requests" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Recent Booking Requests</h3>
                                <button className="text-primary-600 font-bold text-sm hover:underline italic">Check All</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {bookings.length === 0 ? (
                                    <div className="p-20 text-center text-slate-500">No bookings yet.</div>
                                ) : (
                                    bookings.map(b => (
                                        <div key={b.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 uppercase italic tracking-tighter">{b.machineryName}</p>
                                                    <p className="text-sm text-slate-500">Farmer: <span className="font-bold text-slate-700">{b.farmerName}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900 font-outfit">₹{b.totalAmount}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Total Amount</p>
                                                </div>
                                                <span className={`
                                            px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                                            ${b.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}
                                          `}>
                                                    {b.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Fleet List */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-fit">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase italic">My Machinery</h3>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 px-4 shadow-lg shadow-primary-600/20"
                            >
                                <Plus size={18} />
                                <span className="text-xs font-black uppercase tracking-widest">Add New</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {machinery.map(m => (
                                <div key={m.id} className="group p-4 rounded-2xl border border-slate-100 hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-primary-50 transition-colors flex items-center justify-center">
                                            <Tractor size={18} className="text-slate-400 group-hover:text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate uppercase italic">{m.name}</p>
                                            <p className="text-xs text-slate-500 font-bold tracking-widest italic">₹{m.ratePerDay}/Day</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${m.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {isAddModalOpen && (
                    <AddMachineryModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={() => {
                            setIsAddModalOpen(false);
                            fetchData();
                        }}
                    />
                )}
            </div>
        </DashboardShell>
    );
};

export default OwnerDashboard;
