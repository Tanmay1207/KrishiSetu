import { useState, useEffect } from 'react';
import { X, Tractor, IndianRupee, BookOpen, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const AddMachineryModal = ({ onClose, onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: '',
        name: '', // This will be used for Brand Name
        description: '',
        ratePerHour: 0,
        ratePerDay: 0,
        imageUrl: '',
        availableDate: ''
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // The endpoint is /machinery/categories (lowercase match)
                const res = await api.get('/machinery/categories');
                const catData = res.data || [];
                setCategories(catData);
                if (catData.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
                setError('Failed to load categories. Please check if your backend is running.');
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await api.post('/files/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
        } catch (err) {
            setError('Image upload failed. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.categoryId) {
            setError('Please select a category.');
            return;
        }
        if (!formData.imageUrl) {
            setError('Please upload a machinery image.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/owner/machinery/list', formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Failed to list machinery');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Register New Machinery</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">List your equipment for farmers to book</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Machinery Brand Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12 h-14"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Mahindra Arjun, John Deere"
                                />
                                <Tractor className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select
                                required
                                className="input-field h-14 appearance-none"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                            >
                                <option value="">Select Category</option>
                                {categories && categories.length > 0 ? (
                                    categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))
                                ) : (
                                    <option disabled>Loading categories...</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rate Per Hour (₹)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    required
                                    className="input-field pl-12 h-14"
                                    value={formData.ratePerHour}
                                    onChange={(e) => setFormData({ ...formData, ratePerHour: parseFloat(e.target.value) })}
                                />
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rate Per Day (₹)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    required
                                    className="input-field pl-12 h-14"
                                    value={formData.ratePerDay}
                                    onChange={(e) => setFormData({ ...formData, ratePerDay: parseFloat(e.target.value) })}
                                />
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Available Date (Optional)</label>
                        <div className="relative group">
                            <input
                                type="date"
                                className="input-field pl-12 h-14"
                                value={formData.availableDate}
                                onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                            />
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Machinery Image</label>
                        <div className="relative group">
                            <div className={`
                                border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2
                                ${formData.imageUrl ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-primary-500 hover:bg-white'}
                                ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
                                ) : formData.imageUrl ? (
                                    <>
                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Image Uploaded Successfully</p>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="text-slate-400 group-hover:text-primary-500" size={32} />
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Click or Drop Image Here</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <div className="relative group">
                            <textarea
                                className="input-field pl-12 py-4 h-24 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Details about machinery condition, features, etc."
                            />
                            <BookOpen className="absolute left-4 top-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        </div>
                    </div>

                    <div className="pt-4 sticky bottom-0 bg-white pb-2">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Submit Listing for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMachineryModal;
