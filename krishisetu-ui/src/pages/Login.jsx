import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, ArrowRight, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (!user.isApproved) {
                setError('Your account is pending admin approval. Please try again later.');
                return;
            }
            if (user.role === 'Admin') navigate('/admin');
            else if (user.role === 'Farmer') navigate('/farmer');
            else if (user.role === 'MachineryOwner') navigate('/owner');
            else if (user.role === 'FarmWorker') navigate('/worker');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('Your account is pending admin approval. Please try again later.');
            } else {
                setError('Login failed. Please check your email and password.');
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-inter">
            {/* Visual Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-white/5 relative items-center justify-center p-20 overflow-hidden group">
                <div className="absolute inset-0 opacity-20 pointer-events-none auth-bg-pattern"></div>
                <div className="absolute top-0 right-0 p-10 grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-1000 rotate-12">
                    <Tractor size={300} />
                </div>

                <div className="relative z-10 max-w-md">
                    <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-10 shadow-2xl shadow-primary-600/40">
                        <Tractor size={32} />
                    </div>
                    <h2 className="text-6xl font-black font-outfit text-white tracking-tighter mb-8 leading-[0.9] italic uppercase">
                        Rent <br />
                        <span className="not-italic text-primary-500">Machinery.</span>
                    </h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Log in to manage your bookings, browse available machinery, and connect with farm owners and workers.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
                <div className="w-full max-w-md relative z-10">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tighter uppercase italic leading-none mb-3">Welcome Back</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Please log in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-14"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                />
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:underline italic">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    className="input-field pl-14"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            </div>
                        </div>

                        <button type="submit" className="w-full h-16 bg-slate-900 text-white rounded-3xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                            Log In Now <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-12 pt-12 border-t border-slate-100 text-center">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            New to KrishiSetu? <Link to="/register" className="text-primary-600 font-bold hover:underline italic">Create An Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
