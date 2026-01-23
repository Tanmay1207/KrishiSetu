import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, ArrowRight, User, Mail, Phone, Lock, ChevronDown, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        role: 'Farmer'
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation Patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!phoneRegex.test(formData.phoneNumber)) {
            setError('Please enter a valid Indian mobile number (10 digits starting with 6-9).');
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 chars, include a letter, number, and special character.');
            return;
        }

        try {
            const user = await register(formData);
            if (user.isApproved) {
                if (user.role === 'Admin') navigate('/admin');
                else if (user.role === 'Farmer') navigate('/farmer');
                else if (user.role === 'MachineryOwner') navigate('/owner');
                else if (user.role === 'FarmWorker') navigate('/worker');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Could not create account. Please check your information.');
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-inter">
            {/* Form Side */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
                <div className="w-full max-w-xl py-12">
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform duration-300 italic">
                            ◀ Back to Home
                        </Link>
                        <h1 className="text-5xl font-black font-outfit text-slate-900 tracking-tighter uppercase italic leading-none mb-3">Create Your Profile</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Join our growing network of farmers and workers</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl mb-10 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[3rem] text-center">
                            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black font-outfit text-slate-900 mb-4 italic uppercase tracking-tighter">Registration Successful!</h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                Your account has been created but is currently <span className="text-primary-600 font-bold italic">pending admin approval</span>.
                                You will be able to log in once an administrator approves your profile.
                            </p>
                            <Link to="/login" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">
                                Go to Terminal <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                    <div className="relative group">
                                        <input
                                            type="text" required
                                            className="input-field pl-12 h-14"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Choose a username"
                                        />
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text" required
                                        className="input-field h-14"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email" required
                                            className="input-field pl-12 h-14"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="example@email.com"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <input
                                            type="tel" required
                                            className="input-field pl-12 h-14"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            placeholder="+91"
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">What is your role?</label>
                                <div className="relative group">
                                    <select
                                        className="input-field h-14 appearance-none pr-10"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Farmer">I am a Farmer</option>
                                        <option value="MachineryOwner">I own Machinery</option>
                                        <option value="FarmWorker">I am a Farm Worker</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary-600 transition-colors" size={20} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Choose a Password</label>
                                <div className="relative group">
                                    <input
                                        type="password" required
                                        className="input-field pl-12 h-14"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                </div>
                            </div>

                            <button type="submit" className="w-full h-20 bg-slate-900 text-white rounded-[2.5rem] font-bold text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 mt-10">
                                Create Account <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline italic">Log In Now</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Side */}
            <div className="hidden xl:flex xl:w-[45%] bg-slate-50 relative p-24 items-end overflow-hidden">
                <div className="absolute inset-0 opacity-40 pointer-events-none auth-bg-pattern"></div>

                <div className="relative z-10 max-w-sm">
                    <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100 mb-10 translate-x-12 relative group hover:translate-x-8 transition-transform duration-700">
                        <div className="bg-emerald-50 w-16 h-16 rounded-3xl flex items-center justify-center text-emerald-600 mb-6">
                            <CheckCircle size={32} />
                        </div>
                        <h4 className="text-2xl font-black font-outfit text-slate-900 mb-2 italic uppercase tracking-tighter leading-none">Safe Network</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">Join thousands of verified farmers and owners across the country.</p>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-900/40 text-white relative z-20 hover:-translate-y-4 transition-transform duration-700">
                        <Tractor className="text-primary-500 mb-6" size={48} />
                        <h4 className="text-2xl font-black font-outfit mb-2 italic uppercase tracking-tighter leading-none">Smart Farming.</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed italic">Our goal is to make modern farming tools accessible to every Indian farmer.</p>
                    </div>
                </div>

                <div className="absolute top-1/2 right-[-20%] transform -translate-y-1/2 grayscale opacity-5 rotate-45 pointer-events-none">
                    <Tractor size={800} />
                </div>
            </div>
        </div>
    );
};

export default Register;
