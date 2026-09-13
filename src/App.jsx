import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import MenuGridNav from './components/MenuGridNav';
import BottomNav from './components/BottomNav';
import ApkBuildModal from './components/ApkBuildModal';

import MasterPedagangView from './components/views/MasterPedagangView';
import PotensiPasarView from './components/views/PotensiPasarView';
import TargetRealisasiView from './components/views/TargetRealisasiView';
import SiptbView from './components/views/SiptbView';
import LaporanPembayaranView from './components/views/LaporanPembayaranView';
import InputPembayaranLapanganView from './components/views/InputPembayaranLapanganView';
import IzinPihakTigaView from './components/views/IzinPihakTigaView';
import PengunjukanPenegakanView from './components/views/PengunjukanPenegakanView';
import PotensiOkupansiView from './components/views/PotensiOkupansiView';
import AuditTransparansiView from './components/views/AuditTransparansiView';
import UserManagementITView from './components/views/UserManagementITView';
import LogAktivitasITView from './components/views/LogAktivitasITView';

import { 
  Building2, Users, TrendingUp, Target, FileCheck, 
  Handshake, AlertTriangle, ShieldCheck, ChevronRight, Filter, Download, UserCog, HardDrive, ShieldAlert
} from 'lucide-react';

const INITIAL_USERS = [
  {
    id: 'USR-IT-001',
    nip: '198504122010011001',
    name: 'Bambang Haryono, S.T.',
    email: 'bambang.it@medan.go.id',
    role: 'SUPER_ADMIN_IT',
    division: 'Bagian IT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    phone: '0812-6011-8899',
    createdAt: '2025-01-10',
    lastLogin: 'Hari ini, 09:41 WIB',
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: 'USR-USH-002',
    nip: '198809152012022003',
    name: 'Siti Rahmawati, S.E.',
    email: 'siti.usaha@medan.go.id',
    role: 'STAFF_USAHA',
    division: 'Bagian Usaha',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    phone: '0813-7522-4411',
    createdAt: '2025-02-01',
    lastLogin: 'Kemarin, 14:20 WIB',
    permissions: [1, 2, 3, 4, 8, 9]
  },
  {
    id: 'USR-KEU-003',
    nip: '199011202015031002',
    name: 'Dedi Kurniawan, S.Ak.',
    email: 'dedi.keuangan@medan.go.id',
    role: 'STAFF_KEUANGAN',
    division: 'Bagian Keuangan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    phone: '0852-6199-3300',
    createdAt: '2025-02-15',
    lastLogin: '18 Agt 2026, 11:10 WIB',
    permissions: [2, 3, 5, 9]
  },
  {
    id: 'USR-KPS-004',
    nip: '198203042008011005',
    name: 'Heri Syafutra, S.Sos.',
    email: 'heri.kepala@medan.go.id',
    role: 'KEPALA_PASAR',
    division: 'Kepala Pasar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    phone: '0821-6500-1122',
    createdAt: '2025-03-01',
    lastLogin: 'Hari ini, 08:15 WIB',
    permissions: [1, 2, 3, 4, 7, 8]
  },
  {
    id: 'USR-LPG-005',
    nip: '199506122019031008',
    name: 'Rizky Ramadhan',
    email: 'rizky.lapangan@medan.go.id',
    role: 'PETUGAS_LAPANGAN',
    division: 'Petugas Lapangan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    phone: '0812-9988-1122',
    createdAt: '2025-03-20',
    lastLogin: 'Hari ini, 07:30 WIB',
    permissions: [1, 4, 5, 7]
  },
  {
    id: 'USR-VND-006',
    nip: 'NPWP-99.888.777.6-111',
    name: 'PT Mitra Digital Nusantara',
    email: 'support@mitradigital.co.id',
    role: 'VENDOR_THIRD_PARTY',
    division: 'Vendor',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    phone: '021-5544-3322',
    createdAt: '2025-04-01',
    lastLogin: '15 Agt 2026, 16:00 WIB',
    permissions: [6, 9]
  }
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState(0); // 0 = Beranda, 1..11 = Sub Menus
  const [marketFilter, setMarketFilter] = useState('ALL');
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // IT Super Admin User Management & Role Permissions State
  const [usersData, setUsersData] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Default: Bambang Haryono (Bagian IT)

  // IT Audit Trail Log State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'LOG-20260819-001',
      userId: 'USR-IT-001',
      userName: 'Bambang Haryono, S.T.',
      userRole: 'SUPER_ADMIN_IT',
      userDivision: 'Bagian IT',
      timestamp: '19/08/2026 19:40:15 WIB',
      moduleName: 'Manajemen Akses IT',
      actionType: 'PERMISSION_CHANGE',
      marketName: 'Sistem Sentral IT',
      changeSummary: 'Pemetaan Izin Menu untuk Dedi Kurniawan (Bagian Keuangan). Diberikan hak akses Menu #2, #3, #5, #9',
      oldValue: { name: 'Dedi Kurniawan', permissions: [2, 3] },
      newValue: { name: 'Dedi Kurniawan', permissions: [2, 3, 5, 9] }
    },
    {
      id: 'LOG-20260819-002',
      userId: 'USR-USH-002',
      userName: 'Siti Rahmawati, S.E.',
      userRole: 'STAFF_USAHA',
      userDivision: 'Bagian Usaha',
      timestamp: '19/08/2026 14:20:45 WIB',
      moduleName: 'Menu SIPTB & Perizinan',
      actionType: 'UPDATE',
      marketName: 'Pasar Pusat Medan',
      changeSummary: 'Verifikasi Perpanjangan SIPTB Pedagang ID 127101001 (H. Syamsul Bahri) s.d. 17 Agustus 2027',
      oldValue: { traderId: '127101001', statusSiptb: 'MATI' },
      newValue: { traderId: '127101001', statusSiptb: 'AKTIF' }
    },
    {
      id: 'LOG-20260819-003',
      userId: 'USR-LPG-005',
      userName: 'Rizky Ramadhan',
      userRole: 'PETUGAS_LAPANGAN',
      userDivision: 'Petugas Lapangan',
      timestamp: '19/08/2026 11:15:22 WIB',
      moduleName: 'Database Pembayaran',
      actionType: 'CREATE',
      marketName: 'Pasar Pusat Medan',
      changeSummary: 'Input Pembayaran Retribusi Rp 104.000 via Portable POS (TRX-202608-1005)',
      oldValue: null,
      newValue: { traderId: '127104005', amount: 104000, trxNumber: 'TRX-202608-1005' }
    }
  ]);

  const recordAuditLog = (user, division, moduleName, actionType, marketName, changeSummary, oldValue = null, newValue = null) => {
    const newLog = {
      id: `LOG-20260819-${Math.floor(100 + Math.random() * 900)}`,
      userId: user?.id || 'USR-IT-001',
      userName: user?.name || 'Bambang Haryono, S.T.',
      userRole: user?.role || 'SUPER_ADMIN_IT',
      userDivision: division || user?.division || 'Bagian IT',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
      moduleName: moduleName,
      actionType: actionType,
      marketName: marketName || 'Sistem Sentral',
      changeSummary: changeSummary,
      oldValue: oldValue,
      newValue: newValue
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const userPerms = currentUser?.permissions || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const isMenuAllowed = activeMenu === 0 || userPerms.includes(activeMenu);

  return (
    <div className={`min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between ${isMobileFrame ? 'p-2 sm:p-6' : ''}`}>
      {/* Smartphone Device Wrapper Condition */}
      <div className={isMobileFrame ? 'mobile-device-frame bg-[#070913] flex flex-col justify-between shadow-2xl' : 'flex flex-col justify-between flex-1'}>
        
        {isMobileFrame && <div className="mobile-notch"></div>}

        <div>
          {/* Header Bar with Role Switcher Session */}
          <HeaderBar 
            onOpenApkModal={() => setIsApkModalOpen(true)}
            isMobileFrame={isMobileFrame}
            setIsMobileFrame={setIsMobileFrame}
            usersData={usersData}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />

          {/* Main Content Body */}
          <main className="px-4 py-4 max-w-5xl mx-auto w-full space-y-5 pb-24">
            
            {/* Global Market Filter Header */}
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400 font-medium">Filter Wilayah:</span>
                <select
                  value={marketFilter}
                  onChange={(e) => setMarketFilter(e.target.value)}
                  className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900 text-white">Semua 53 Pasar Tradisional</option>
                  <option value="Pasar Pusat Medan" className="bg-slate-900 text-white">Pasar Pusat Medan</option>
                  <option value="Pasar Petisah" className="bg-slate-900 text-white">Pasar Petisah</option>
                  <option value="Pasar Kemuning" className="bg-slate-900 text-white">Pasar Kemuning</option>
                </select>
              </div>

              {activeMenu !== 0 && (
                <button 
                  onClick={() => setActiveMenu(0)}
                  className="text-[11px] text-indigo-400 hover:underline font-bold flex items-center gap-0.5"
                >
                  ← Beranda
                </button>
              )}
            </div>

            {/* SECURITY ISOLATION CHECK */}
            {!isMenuAllowed && (
              <div className="bg-rose-950/60 border border-rose-800 p-8 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-8 shadow-2xl">
                <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
                <div className="space-y-2">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-mono font-bold border border-rose-500/30">
                    ISOLASI HAK AKSES MENU (ACCESS CONTROL)
                  </span>
                  <h3 className="text-lg font-black text-white">Menu #{activeMenu} Tidak Diizinkan untuk {currentUser?.division}</h3>
                  <p className="text-xs text-rose-200">
                    Akun Anda <strong className="text-white">{currentUser?.name}</strong> tidak memiliki izin untuk membuka menu ini. Silakan hubungi Administrator <strong className="text-white">Bagian IT</strong> untuk meminta tambahan hak akses menu.
                  </p>
                </div>
                <button
                  onClick={() => setActiveMenu(0)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Kembali ke Beranda
                </button>
              </div>
            )}

            {/* BERANDA / DASHBOARD UTAMA (ACTIVE MENU = 0) */}
            {activeMenu === 0 && (
              <div className="space-y-5">
                {/* Hero Banner */}
                <div className="glass-panel p-5 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 relative overflow-hidden space-y-3">
                  <div className="relative z-10 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-extrabold border border-indigo-500/30">
                        SUPER ADMIN IT & ACCESS CONTROL v2.0
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        Role: {currentUser?.division}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-white">
                      Bagian IT - Sistem Sentral & Perizinan DIPAS
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      Modul kontrol terpusat Bagian IT: Manajemen Akun Pengguna (Role Permissions), Log Aktivitas Audit Trail, SIPTB, & Pembayaran Retribusi Pasar.
                    </p>
                  </div>
                </div>

                {/* MENU UTAMA LAUNCHER GRID (Dynamic Filtered by Role Permissions) */}
                <MenuGridNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} currentUser={currentUser} />

                {/* Quick IT Management & Payment Upload Shortcut Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => setActiveMenu(5)}
                    className="glass-panel p-3.5 rounded-2xl glass-panel-hover cursor-pointer space-y-1 border border-amber-500/40 bg-amber-950/20 group"
                  >
                    <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1 font-bold">
                      <span className="text-xs">📂</span> Upload Pembayaran Pedagang
                    </span>
                    <div className="text-base font-black text-amber-300 group-hover:scale-105 transition-transform">Auto Bank Ingestion</div>
                    <span className="text-[10px] text-slate-400 block font-sans">Match NIP & Update Lunas</span>
                  </div>

                  <div 
                    onClick={() => setActiveMenu(10)}
                    className="glass-panel p-3.5 rounded-2xl glass-panel-hover cursor-pointer space-y-1 border border-purple-500/30 bg-purple-950/20"
                  >
                    <span className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                      <UserCog className="w-3.5 h-3.5 text-purple-400" /> Control Akses IT
                    </span>
                    <div className="text-base font-black text-white font-mono">{usersData.length} Akun User</div>
                    <span className="text-[10px] text-slate-400 block font-sans">Role Permission Mapping</span>
                  </div>

                  <div 
                    onClick={() => setActiveMenu(11)}
                    className="glass-panel p-3.5 rounded-2xl glass-panel-hover cursor-pointer space-y-1 border border-indigo-500/30 bg-indigo-950/20"
                  >
                    <span className="text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Audit Trail IT
                    </span>
                    <div className="text-base font-black text-indigo-300 font-mono">{auditLogs.length} Records</div>
                    <span className="text-[10px] text-slate-400 block font-sans">Immutable System Log</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-MENUS RENDERING (WITH SECURITY GUARDS) */}
            {isMenuAllowed && (
              <>
                {activeMenu === 1 && <MasterPedagangView marketFilter={marketFilter} setMarketFilter={setMarketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} />}
                {activeMenu === 2 && <PotensiPasarView marketFilter={marketFilter} />}
                {activeMenu === 3 && <TargetRealisasiView marketFilter={marketFilter} />}
                {activeMenu === 4 && <SiptbView marketFilter={marketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} />}
                {activeMenu === 5 && <LaporanPembayaranView marketFilter={marketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} tradersData={tradersData} setTradersData={setTradersData} />}
                {activeMenu === 12 && <InputPembayaranLapanganView marketFilter={marketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} tradersData={tradersData} setTradersData={setTradersData} />}
                {activeMenu === 6 && <IzinPihakTigaView marketFilter={marketFilter} />}
                {activeMenu === 7 && <PengunjukanPenegakanView marketFilter={marketFilter} />}
                {activeMenu === 8 && <PotensiOkupansiView marketFilter={marketFilter} />}
                {activeMenu === 9 && <AuditTransparansiView />}
                {activeMenu === 10 && (
                  <UserManagementITView 
                    usersData={usersData}
                    setUsersData={setUsersData}
                    currentUser={currentUser}
                    recordAuditLog={recordAuditLog}
                  />
                )}
                {activeMenu === 11 && (
                  <LogAktivitasITView 
                    auditLogs={auditLogs}
                    currentUser={currentUser}
                  />
                )}
              </>
            )}

          </main>
        </div>

        {/* Bottom Nav Bar (Dynamic Permissions) */}
        <BottomNav activeMenu={activeMenu} setActiveMenu={setActiveMenu} currentUser={currentUser} />

        {/* APK Build Simulation Modal */}
        {isApkModalOpen && (
          <ApkBuildModal onClose={() => setIsApkModalOpen(false)} />
        )}

      </div>
    </div>
  );
}

