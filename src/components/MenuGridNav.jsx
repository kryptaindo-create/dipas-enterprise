import React from 'react';
import { 
  Users, TrendingUp, Target, FileCheck, 
  Handshake, AlertTriangle, Building2, ShieldCheck, UserCog, HardDrive, Lock
} from 'lucide-react';

export default function MenuGridNav({ activeMenu, setActiveMenu, currentUser }) {
  const masterMenuList = [
    { id: 1, name: 'Master Data Pedagang', icon: Users, color: 'from-indigo-600 to-indigo-800', badge: 'Master' },
    { id: 2, name: 'Potensi Pasar Retribusi', icon: TrendingUp, color: 'from-emerald-600 to-teal-800', badge: 'Potensi' },
    { id: 3, name: 'Target & Realisasi (KPI)', icon: Target, color: 'from-purple-600 to-indigo-900', badge: 'KPI' },
    { id: 4, name: 'Menu SIPTB & Perizinan', icon: FileCheck, color: 'from-blue-600 to-indigo-800', badge: 'E-Permit' },
    { id: 5, name: 'Database Pembayaran', icon: Handshake, color: 'from-teal-600 to-blue-900', badge: 'Bayar 🗓️' },
    { id: 12, name: 'Input Pembayaran Lapangan', icon: Handshake, color: 'from-cyan-500 to-blue-800', badge: '📱 APK Field' },
    { id: 6, name: 'Izin Pihak Ke-3', icon: Handshake, color: 'from-cyan-600 to-blue-900', badge: 'Mitra' },
    { id: 7, name: 'Pengunjukan & Penegakan', icon: AlertTriangle, color: 'from-amber-600 to-orange-900', badge: 'SP1-SP3' },
    { id: 8, name: 'Potensi & Okupansi Pasar', icon: Building2, color: 'from-emerald-600 to-green-900', badge: '95.1%' },
    { id: 9, name: 'Audit & Transparansi Public', icon: ShieldCheck, color: 'from-violet-600 to-purple-900', badge: 'Publik' },
    { id: 10, name: 'Manajemen Akses & User IT', icon: UserCog, color: 'from-purple-700 to-indigo-950', badge: 'IT Control 🔒' },
    { id: 11, name: 'Log Aktivitas IT (Audit Trail)', icon: HardDrive, color: 'from-slate-800 to-purple-950', badge: 'Audit Trail 🔒' }
  ];

  const userPerms = currentUser?.permissions || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const isBlocked = currentUser?.status === 'BLOCKED';

  // Filter menus based on user permission array
  const visibleMenus = masterMenuList.filter(m => userPerms.includes(m.id));

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Daftar Menu Diizinkan ({visibleMenus.length}/{masterMenuList.length})
          </h2>
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9.5px] font-mono font-bold border border-indigo-500/30">
            Role: {currentUser?.division || 'Bagian IT'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono font-bold">
          {isBlocked ? '🔴 AKUN DIBLOKIR' : 'Akses Terverifikasi IT'}
        </span>
      </div>

      {isBlocked ? (
        <div className="bg-rose-950/60 border border-rose-800 p-6 rounded-2xl text-center space-y-2 text-rose-300">
          <Lock className="w-8 h-8 mx-auto text-rose-400" />
          <h3 className="font-black text-sm text-white">Akun Anda Dalam Status Diblokir oleh Bagian IT</h3>
          <p className="text-xs text-rose-200">Seluruh akses menu ditutup sementara. Hubungi Administrator Bagian IT Medan untuk membuka blokir.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {visibleMenus.map((m) => {
            const IconComp = m.icon;
            const isActive = activeMenu === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMenu(m.id)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border relative overflow-hidden group ${
                  isActive 
                    ? 'bg-indigo-600/40 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white' 
                    : 'glass-panel hover:border-indigo-500/40 hover:bg-slate-900/90 text-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-tr ${m.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="px-1.5 py-0.5 bg-slate-950/80 rounded-md text-[9px] font-mono text-slate-300 font-bold border border-slate-800">
                    {m.badge}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block font-bold">Menu #{m.id}</span>
                  <span className="font-bold text-xs line-clamp-2 group-hover:text-white leading-tight">
                    {m.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

