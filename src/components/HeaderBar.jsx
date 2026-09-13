import React, { useState } from 'react';
import { Building2, Smartphone, Download, ShieldCheck, UserCheck, ChevronDown, Lock } from 'lucide-react';

export default function HeaderBar({ 
  onOpenApkModal, 
  isMobileFrame, 
  setIsMobileFrame, 
  usersData, 
  currentUser, 
  setCurrentUser 
}) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="glass-panel sticky top-0 z-40 px-4 py-3 border-b border-indigo-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center glow-effect shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-sm text-white tracking-wide">DIPAS Enterprise</h1>
              <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded text-[9px] font-extrabold border border-purple-500/30">
                IT CONTROL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Perizinan & Manajemen Hak Akses Sentral</p>
          </div>
        </div>

        {/* Action Controls & Active Session Switcher */}
        <div className="flex items-center gap-2">
          {/* STANDALONE MOBILE APK APP LINK */}
          <a
            href="/mobile-apk.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 border border-cyan-300 transition"
            title="Buka Aplikasi Mobile Standalone APK Pengutip Lapangan di Jendela Baru"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">📱 Standalone APK Mobile</span>
          </a>

          {/* Active Session & Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs transition"
              title="Simulasi Ganti Role / Akun Pengguna"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-600"
              />
              <div className="text-left hidden md:block">
                <span className="font-extrabold text-white text-[11px] block leading-none">
                  {currentUser?.name}
                </span>
                <span className="text-[9px] text-indigo-400 font-mono font-bold">
                  {currentUser?.division}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1">
                <div className="px-3 py-2 border-b border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">Simulasi Login Akun & Role:</span>
                  <span className="text-white font-bold">Pilih Akun untuk Tes Izin Menu</span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1">
                  {usersData?.map((u) => {
                    const isSelected = u.id === currentUser?.id;
                    const isBlocked = u.status === 'BLOCKED';

                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center gap-2 transition ${
                          isSelected 
                            ? 'bg-indigo-600 text-white font-bold' 
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="flex-1 truncate">
                          <span className="block truncate font-bold text-xs">{u.name}</span>
                          <span className={`text-[9.5px] block font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {u.division} {isBlocked && '🔴 DIBLOKIR'}
                          </span>
                        </div>
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Frame Switcher Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Tampilan Fullscreen Desktop" : "Simulasi Frameless Smartphone"}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs flex items-center gap-1 transition"
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Build APK Button */}
          <button
            onClick={onOpenApkModal}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Build</span> APK
          </button>
        </div>
      </div>
    </header>
  );
}

