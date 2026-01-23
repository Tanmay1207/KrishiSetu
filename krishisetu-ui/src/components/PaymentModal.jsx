import { useState } from 'react';
import { ShieldCheck, Calendar, Info } from 'lucide-react';

const PaymentModal = ({ booking, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Confirm Payment</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Transaction</p>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 space-y-4">
                        <div className="flex items-center gap-4 border-b border-slate-200/50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">
                                {booking.machineryName ? '🚜' : '👷'}
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{booking.machineryName || booking.workerName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{booking.machineryName ? 'Machinery' : 'Worker'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Scheduled For</p>
                                <p className="font-bold text-slate-700 text-xs">
                                    {new Date(booking.startDate).toLocaleDateString()}
                                    {new Date(booking.startDate).getTime() !== new Date(booking.endDate).getTime() &&
                                        ` - ${new Date(booking.endDate).toLocaleDateString()}`
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200/50 flex justify-between items-end">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total to Pay</span>
                            <span className="text-3xl font-black text-emerald-600 tracking-tighter">₹{booking.totalAmount}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onClose}
                            className="bg-slate-100 text-slate-600 h-14 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="bg-emerald-600 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> : 'Pay Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
