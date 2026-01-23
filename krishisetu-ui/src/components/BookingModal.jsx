import { useState } from 'react';
import api from '../services/api';

const BookingModal = ({ item, onClose, onSuccess }) => {
    const isWorker = !!item.workerId;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hours, setHours] = useState('8');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = isWorker
                ? {
                    workerId: item.id,
                    hours: parseInt(hours),
                    // Backend will handle dates based on worker profile
                    startDate: new Date(),
                    endDate: new Date()
                }
                : {
                    machineryId: item.id,
                    startDate: item.availableDate ? new Date(item.availableDate) : startDate,
                    endDate: item.availableDate ? new Date(item.availableDate) : endDate
                };

            await api.post('/farmer/bookings/create', payload);
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Could not create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const rate = isWorker ? item.hourlyRate : item.ratePerDay;
    const rateLabel = isWorker ? 'Hourly Rate' : 'Rental Price';

    // Calculate total
    let total = 0;
    if (isWorker) {
        total = (parseInt(hours) || 0) * rate;
    } else {
        if (item.availableDate) {
            total = rate;
        } else if (startDate && endDate) {
            const days = Math.max(1, (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            total = days * rate;
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Book {isWorker ? item.workerName : item.name}</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {isWorker ? (
                            <>
                                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span>Scheduled Date: {item.availableDate ? new Date(item.availableDate).toLocaleDateString() : 'Available'}</span>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Number of Hours</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span>Scheduled Date: {item.availableDate ? new Date(item.availableDate).toLocaleDateString() : 'Immediate Availability'}</span>
                                </div>
                                {!item.availableDate && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">End Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{rateLabel}</span>
                                <span className="font-black text-slate-900">₹{rate}</span>
                            </div>
                            <div className="flex justify-between text-2xl pt-4 border-t border-emerald-100">
                                <span className="font-black text-slate-900 tracking-tighter italic uppercase text-lg">Total Amount</span>
                                <span className="font-black text-primary-600 tracking-tighter">
                                    ₹{total.toFixed(0)}
                                </span>
                            </div>
                            {isWorker && <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase italic text-center">* Final pay calculated by hours worked</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white h-16 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                            ) : 'Book Now'}
                        </button>
                    </form>
                </div >
            </div >
        </div >
    );
};

export default BookingModal;
