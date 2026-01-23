import { Tractor, Users, Package, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:scale-110 duration-300`}>
                    <Icon className={`${color.replace('bg-', 'text-')} w-6 h-6`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <TrendingUp size={12} className={trend.isUp ? '' : 'rotate-180'} />
                        {trend.value}%
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-slate-500 font-bold text-sm tracking-wide mb-1 uppercase">{label}</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
