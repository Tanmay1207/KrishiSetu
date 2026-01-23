import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import { Tractor, Users, Calendar, MapPin, MoreHorizontal, ShoppingBag, Clock, ShieldCheck } from 'lucide-react';

const FarmerDashboard = () => {
    const { user, logout } = useAuth();
    const [machinery, setMachinery] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
    const [activeTab, setActiveTab] = useState('browse');

    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;
        if (hash === '#bookings') setActiveTab('bookings');
        else if (hash === '#workforce') setActiveTab('workforce');
        else setActiveTab('browse');
    }, [location.hash]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [macRes, bookRes, workRes] = await Promise.all([
                api.get('/farmer/machinery/search'),
                api.get('/farmer/bookings/history'),
                api.get('/farmer/workers/search')
            ]);
            setMachinery(macRes.data);
            setBookings(bookRes.data);
            setWorkers(workRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const handleBookingSuccess = () => {
        setSelectedItem(null);
        fetchData();
        setActiveTab('bookings');
    };

    const handlePay = (booking) => {
        setSelectedPaymentBooking(booking);
    };

    const handleConfirmPayment = async () => {
        try {
            await api.post(`/farmer/bookings/${selectedPaymentBooking.id}/pay`);
            fetchData();
            setSelectedPaymentBooking(null);
        } catch (err) {
            alert('Payment failed. Please try again.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
    );

    return (
        <DashboardShell title={activeTab === 'browse' ? 'Browse Machinery' : 'My Bookings'}>

            {/* Tabs Selector */}
            <div className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-10 overflow-hidden">
                <TabButton active={activeTab === 'browse'} onClick={() => setActiveTab('browse')} label="Market" icon={<ShoppingBag size={18} />} />
                <TabButton active={activeTab === 'workforce'} onClick={() => setActiveTab('workforce')} label="Workforce" icon={<Users size={18} />} />
                <TabButton active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} label="My Bookings" icon={<Calendar size={18} />} />
            </div>

            {activeTab === 'browse' ? (
                <div className="space-y-8">

                    {/* Machinery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {machinery.map(item => (
                            <div key={item.id} className="group bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={item.imageUrl || `https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-primary-700 uppercase tracking-widest leading-none shadow-sm">
                                            {item.categoryName}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/60 to-transparent">
                                        <div className="flex items-center gap-2 text-white">
                                            <Calendar size={14} className="text-primary-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider italic">
                                                {item.availableDate ? new Date(item.availableDate).toLocaleDateString() : 'Available Now'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight italic uppercase">{item.name}</h3>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-8">
                                            {item.description || 'High-quality machinery for your farm. Well-maintained and ready to use.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rental Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-primary-600 tracking-tighter">₹{item.ratePerDay}</span>
                                                <span className="text-xs font-bold text-slate-400 italic">/ day</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="bg-slate-900 text-white h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-600/20 transition-all active:scale-95"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : activeTab === 'workforce' ? (
                <div className="space-y-8">

                    {/* Workers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {workers.map(worker => (
                            <div key={worker.id} className="group bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-900/20 group-hover:bg-primary-600 transition-colors">
                                            {worker.workerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{worker.workerName}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Experienced Worker</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {worker.skills.split(',').map((skill, idx) => (
                                                    <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio</p>
                                            <p className="text-slate-500 text-xs font-medium line-clamp-3 leading-relaxed">
                                                {worker.bio || 'I am a dedicated farm worker with extensive experience in various agricultural tasks.'}
                                            </p>
                                        </div>
                                        {worker.availableDate && (
                                            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={16} className="text-emerald-600" />
                                                    <div>
                                                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.1em] leading-none mb-1">Available From</p>
                                                        <p className="text-sm font-black text-emerald-600 tracking-tighter">
                                                            {new Date(worker.availableDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Service Fee</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-primary-600 tracking-tighter">₹{worker.hourlyRate}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">/ hour</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(worker)}
                                            className="bg-slate-900 text-white h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95"
                                        >
                                            Hire Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard label="Confirmed" value={bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').length} icon={Tractor} color="bg-emerald-500" />
                        <StatCard label="Pending Payment" value={bookings.filter(b => b.paymentStatus === 'Pending').length} icon={Calendar} color="bg-amber-500" />
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Booking History</h3>
                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><MoreHorizontal /></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Item / Worker</th>
                                        <th className="px-8 py-5">Dates</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-center">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bookings.map(book => (
                                        <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                                        {book.machineryName ? '🚜' : '👷'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-lg tracking-tighter leading-none mb-1 uppercase">{book.machineryName || book.workerName}</p>
                                                        <p className="text-[10px] text-slate-500 font-black tracking-widest italic">{book.machineryName ? 'Machinery' : 'Worker'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 inline-block font-bold text-xs text-slate-600">
                                                    {new Date(book.startDate).toLocaleDateString()}
                                                    {new Date(book.startDate).getTime() !== new Date(book.endDate).getTime() &&
                                                        ` - ${new Date(book.endDate).toLocaleDateString()}`
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-lg font-black text-slate-900 tracking-tighter">₹{book.totalAmount}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`
                                                    flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                                    ${book.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${book.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                                    {book.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 flex justify-center">
                                                {book.paymentStatus === 'Pending' ? (
                                                    <button
                                                        onClick={() => handlePay(book)}
                                                        className="bg-primary-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                                                    >
                                                        Pay Now
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest italic">
                                                        <ShieldCheck size={18} /> Paid
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {selectedItem && (
                <BookingModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onSuccess={handleBookingSuccess}
                />
            )}

            {selectedPaymentBooking && (
                <PaymentModal
                    booking={selectedPaymentBooking}
                    onClose={() => setSelectedPaymentBooking(null)}
                    onConfirm={handleConfirmPayment}
                />
            )}
        </DashboardShell>
    );
};

const TabButton = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300
            ${active ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}
        `}
    >
        {icon}
        {label}
    </button>
);

export default FarmerDashboard;
