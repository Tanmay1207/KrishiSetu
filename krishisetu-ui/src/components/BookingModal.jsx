import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ item, onClose, onSuccess }) => {
    const { user } = useAuth();
    const isWorker = !!item.workerId;
    const [hours, setHours] = useState('8');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Strict Date Handling: Always use the machine/worker's set availableDate
            const bookingDate = item.availableDate;
            if (!bookingDate) {
                setError('This resource does not have an available date set by the owner.');
                setLoading(false);
                return;
            }

            const payload = isWorker
                ? {
                    workerProfileId: item.id,
                    hours: parseInt(hours),
                    startDate: bookingDate,
                    endDate: bookingDate
                }
                : {
                    machineryId: item.id,
                    startDate: bookingDate,
                    endDate: bookingDate
                };

            const response = await api.post('/farmer/bookings/create', payload);
            const { orderId, amount, currency, keyId } = response.data;

            const options = {
                key: keyId,
                amount: amount * 100,
                currency: currency,
                name: "KrishiSetu",
                description: "Farm Services Booking",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        await api.post('/farmer/bookings/verify', {
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        onSuccess();
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user ? `${user.firstName} ${user.lastName}` : "Farmer",
                    email: user ? user.email : "farmer@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#059669",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data || 'Could not create booking. Please try again.');
            setLoading(false);
        }
    };

    const rate = isWorker ? item.hourlyRate : item.ratePerDay;
    const rateLabel = isWorker ? 'Hourly Rate' : 'Rental Price';

    // Calculate total
    const total = isWorker ? (parseInt(hours) || 0) * rate : rate;

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

                        <div>
                            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
                                <span>Booking Slot: {item.availableDate ? new Date(item.availableDate).toLocaleDateString() : 'Immediate'}</span>
                            </div>

                            {isWorker && (
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Working Hours</label>
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
                            )}
                        </div>

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
