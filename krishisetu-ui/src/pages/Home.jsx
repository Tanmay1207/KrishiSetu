import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, ArrowRight, ShieldCheck, Zap, Globe, Users } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-inter text-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-600 p-2 rounded-xl text-white">
                            <Tractor size={24} />
                        </div>
                        <span className="text-2xl font-black font-outfit tracking-tighter uppercase italic text-emerald-700">KrishiSetu</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-900">About Us</Link>
                        <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">Our Services</Link>
                        <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">Help Center</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to={user.role === 'Admin' ? '/admin' : user.role === 'Farmer' ? '/farmer' : user.role === 'MachineryOwner' ? '/owner' : '/worker'}
                                className="bg-slate-900 text-white px-8 h-12 rounded-2xl flex items-center font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-slate-900 px-4">Log In</Link>
                                <Link to="/register" className="bg-primary-600 text-white px-8 h-12 rounded-2xl flex items-center font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95">
                                    Register Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full mb-8 border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">A Modern Farmer & Worker Network</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black font-outfit tracking-tighter text-slate-900 mb-10 leading-[0.9] italic">
                            Easily Rent <br />
                            <span className="text-primary-600 not-italic">Smart Machinery.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium mb-12 max-w-xl leading-relaxed">
                            The easiest way for farmers to book tractors, harvesters, and hire workers. Modern tools for better farming, all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto bg-slate-900 text-white px-12 h-16 rounded-3xl flex items-center justify-center font-bold text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-primary-500 transition-colors">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Quick Booking</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Find and book the machinery you need in just a few clicks. No more endless waiting.</p>
                        </div>
                        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-emerald-500 transition-colors">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Safe & Verified</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">We verify all owners and workers so you can work with people you trust.</p>
                        </div>
                        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-amber-500 transition-colors">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Online Payments</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Secure and easy online payments. Track all your expenses in one place.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3 grayscale opacity-30">
                        <Tractor size={20} />
                        <span className="text-lg font-black font-outfit tracking-tighter uppercase italic">KrishiSetu</span>
                    </div>
                    <div className="flex items-center gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-primary-600 transition-colors">How it Works</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">© 2024 KrishiSetu - Smart Farming Made Simple</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
