import { useState } from 'react';
import { X, Briefcase, IndianRupee, BookOpen, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const WorkerProfileModal = ({ profile, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        skills: profile?.skills || '',
        experienceYears: profile?.experienceYears || 0,
        hourlyRate: profile?.hourlyRate || 0,
        bio: profile?.bio || '',
        availableDate: profile?.availableDate ? new Date(profile.availableDate).toISOString().split('T')[0] : ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.put('/worker/profile', formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Edit My Profile</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Update your stats to get more work</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hourly Rate (₹)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    required
                                    className="input-field pl-12 h-12"
                                    value={formData.hourlyRate}
                                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                                />
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years of Experience</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    required
                                    className="input-field pl-12 h-12"
                                    value={formData.experienceYears}
                                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
                                />
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills (Comma separated)</label>
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                className="input-field pl-12 h-12"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="Ploughing, Harvesting, Seeding"
                            />
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                        <div className="relative group">
                            <textarea
                                className="input-field pl-12 py-3 h-20 resize-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell farmers about your expertise..."
                            />
                            <BookOpen className="absolute left-4 top-3 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Available Date</label>
                        <div className="relative group">
                            <input
                                type="date"
                                className="input-field pl-12 h-12"
                                value={formData.availableDate}
                                onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                            />
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkerProfileModal;
