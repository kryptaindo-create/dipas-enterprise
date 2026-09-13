import React, { useState } from 'react';
import { 
  Users, UserPlus, ShieldCheck, ShieldAlert, Lock, Unlock, Edit3, Trash2, 
  CheckSquare, Square, Search, Filter, RefreshCw, Key, Shield, UserX, AlertOctagon, CheckCircle2, ChevronRight
} from 'lucide-react';

export const ALL_DIVISIONS = [
  'Bagian IT',
  'Bagian Usaha',
  'Bagian Keuangan',
  'Kepala Pasar',
  'Petugas Lapangan',
  'Vendor'
];

export const MASTER_MENUS = [
  { id: 1, name: 'Master Data Pedagang', category: 'Usaha' },
  { id: 2, name: 'Potensi Retribusi Pasar', category: 'Usaha' },
  { id: 3, name: 'Target & Realisasi (KPI)', category: 'Usaha' },
  { id: 4, name: 'Menu SIPTB & Perizinan', category: 'Usaha' },
  { id: 5, name: 'Database Pembayaran Retribusi', category: 'Keuangan' },
  { id: 6, name: 'Izin Pihak Ke-3 & Kerjasama', category: 'Mitra' },
  { id: 7, name: 'Pengunjukan & Penegakan SP1-SP3', category: 'Lapangan' },
  { id: 8, name: 'Potensi Okupansi Pasar', category: 'Usaha' },
  { id: 9, name: 'Audit & Transparansi Public', category: 'Publik' },
  { id: 10, name: 'Manajemen Akses & User IT', category: 'Kontrol IT (Eksklusif)' },
  { id: 11, name: 'Log Aktivitas IT (Audit Trail)', category: 'Kontrol IT (Eksklusif)' }
];

export default function UserManagementITView({ 
  usersData, 
  setUsersData, 
  currentUser, 
  recordAuditLog 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    id: '',
    nip: '',
    name: '',
    email: '',
    phone: '',
    division: 'Bagian Usaha',
    status: 'ACTIVE',
    permissions: [1, 2, 4]
  });

  const isITUser = currentUser?.division === 'Bagian IT' || currentUser?.role === 'SUPER_ADMIN_IT';

  if (!isITUser) {
    return (
      <div className="bg-rose-950/40 border border-rose-800/80 p-8 rounded-3xl text-center space-y-4 max-w-2xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 bg-rose-900/60 rounded-full flex items-center justify-center mx-auto text-rose-400 border border-rose-700/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-mono font-bold border border-rose-500/30">
            ISOLASI KEAMANAN IT
          </span>
          <h2 className="text-xl font-black text-white">Akses Ditolak - Terisolasi Keamanan</h2>
          <p className="text-xs text-rose-200 leading-relaxed max-w-md mx-auto">
            Anda login sebagai <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.division}). Modul Manajemen Akses & Hak Akses Pengguna berada di bawah kontrol eksklusif <strong className="text-white">Bagian IT</strong>.
          </p>
        </div>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = usersData.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        u.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiv = divisionFilter === 'ALL' || u.division === divisionFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchDiv && matchStatus;
  });

  // Handlers
  const handleOpenAddModal = () => {
    setFormData({
      id: `USR-${Date.now().toString().slice(-4)}`,
      nip: `199${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      name: '',
      email: '',
      phone: '0812-3456-7890',
      division: 'Bagian Usaha',
      status: 'ACTIVE',
      permissions: [1, 2, 3, 4]
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
  };

  const togglePermission = (menuId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(menuId);
      const newPerms = exists 
        ? prev.permissions.filter(id => id !== menuId)
        : [...prev.permissions, menuId].sort((a, b) => a - b);
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSelectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: MASTER_MENUS.map(m => m.id)
    }));
  };

  const handleClearPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      // Edit mode
      const oldUser = usersData.find(u => u.id === editingUser.id);
      setUsersData(prev => prev.map(u => u.id === editingUser.id ? formData : u));

      recordAuditLog(
        currentUser,
        currentUser.division,
        'Manajemen Akses IT',
        'PERMISSION_CHANGE',
        'Sistem Sentral IT',
        `Pembaruan profil & hak akses akun ${formData.name} (${formData.division}). Total menu diizinkan: ${formData.permissions.length}`,
        oldUser,
        formData
      );
      setEditingUser(null);
    } else {
      // Create mode
      const newUser = {
        ...formData,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Belum pernah login'
      };
      setUsersData(prev => [newUser, ...prev]);

      recordAuditLog(
        currentUser,
        currentUser.division,
        'Manajemen Akses IT',
        'CREATE_USER',
        'Sistem Sentral IT',
        `Pembuatan akun baru: ${newUser.name} (${newUser.division}) dengan NIP ${newUser.nip}. Hak akses ${newUser.permissions.length} menu`,
        null,
        newUser
      );
      setIsAddModalOpen(false);
    }
  };

  const handleToggleBlockStatus = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const updatedUser = { ...user, status: newStatus };

    setUsersData(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    recordAuditLog(
      currentUser,
      currentUser.division,
      'Manajemen Akses IT',
      'BLOCK_USER',
      'Sistem Sentral IT',
      `Perubahan status akun ${user.name} (${user.division}) dari ${user.status} -> ${newStatus}`,
      user,
      updatedUser
    );
  };

  const handleDeleteUserConfirm = () => {
    if (!deletingUser) return;
    setUsersData(prev => prev.filter(u => u.id !== deletingUser.id));

    recordAuditLog(
      currentUser,
      currentUser.division,
      'Manajemen Akses IT',
      'DELETE_USER',
      'Sistem Sentral IT',
      `Penghapusan permanen akun user: ${deletingUser.name} (${deletingUser.division}) - NIP ${deletingUser.nip}`,
      deletingUser,
      null
    );
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-indigo-500/30 text-white relative overflow-hidden shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono font-bold border border-indigo-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> KONTROL BAGIAN IT (SUPER ADMIN)
              </span>
            </div>
            <h2 className="text-xl font-black text-white">Manajemen Akun & Hak Akses Menu (Role & Permissions)</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Pusat kendali hak akses pengguna per divisi (Usaha, Keuangan, Kepala Pasar, Petugas Lapangan, Vendor). Bagian IT berhak penuh membuat, memetakan izin menu, memblokir, atau menghapus akun.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Pengguna</span>
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Total Akun Terdaftar</span>
            <span className="text-lg font-black text-white">{usersData.length} User</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Akun Status Aktif</span>
            <span className="text-lg font-black text-emerald-400">
              {usersData.filter(u => u.status === 'ACTIVE').length} User
            </span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Akun Diblokir (Restricted)</span>
            <span className="text-lg font-black text-rose-400">
              {usersData.filter(u => u.status === 'BLOCKED').length} User
            </span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Total Divisi Terintegrasi</span>
            <span className="text-lg font-black text-indigo-400">{ALL_DIVISIONS.length} Divisi</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIP, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Divisi:</span>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Divisi ({ALL_DIVISIONS.length})</option>
              {ALL_DIVISIONS.map(d => (
                <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Status</option>
              <option value="ACTIVE" className="bg-slate-900 text-emerald-400">AKTIF</option>
              <option value="BLOCKED" className="bg-slate-900 text-rose-400">DIBLOKIR</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Accounts Table / Card List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Daftar Akun Pengguna & Mapping Hak Akses Menu ({filteredUsers.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Diperbarui Realtime</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                <th className="p-4">Pengguna & NIP</th>
                <th className="p-4">Divisi / Role</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4">Izin Akses Menu ({MASTER_MENUS.length} Total)</th>
                <th className="p-4 text-right">Aksi IT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredUsers.map((user) => {
                const isBlocked = user.status === 'BLOCKED';
                const isSelf = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{user.name}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-400 text-[9px] font-bold rounded border border-indigo-500/30">
                                Anda
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">NIP: {user.nip}</span>
                          <span className="text-[10px] text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          user.division === 'Bagian IT' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                          user.division === 'Bagian Keuangan' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          user.division === 'Bagian Usaha' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                          user.division === 'Kepala Pasar' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          user.division === 'Petugas Lapangan' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {user.division}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">Role: {user.role}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {isBlocked ? (
                        <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold border border-rose-500/40 flex items-center gap-1 w-max">
                          <Lock className="w-3 h-3" /> DIBLOKIR IT
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> AKTIF
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="space-y-1.5 max-w-sm">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-300">
                            {user.permissions.length} dari {MASTER_MENUS.length} Menu Diizinkan
                          </span>
                          <span className="text-[10px] font-mono text-indigo-400">
                            {Math.round((user.permissions.length / MASTER_MENUS.length) * 100)}% Akses
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all ${
                              user.permissions.length === MASTER_MENUS.length 
                                ? 'bg-purple-500' 
                                : user.permissions.length > 5 
                                ? 'bg-indigo-500' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${(user.permissions.length / MASTER_MENUS.length) * 100}%` }}
                          ></div>
                        </div>

                        {/* Badges preview */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {user.permissions.map(mId => {
                            const menuObj = MASTER_MENUS.find(m => m.id === mId);
                            return (
                              <span key={mId} className="px-1.5 py-0.2 bg-slate-950 border border-slate-800 rounded text-[9.5px] font-mono text-slate-300">
                                #{mId} {menuObj?.name.split(' ')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 rounded-xl border border-indigo-700/50 transition"
                          title="Mapping Permission & Edit Akun"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {!isSelf && (
                          <>
                            <button
                              onClick={() => handleToggleBlockStatus(user)}
                              className={`p-2 rounded-xl border transition ${
                                isBlocked 
                                  ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800' 
                                  : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border-amber-800'
                              }`}
                              title={isBlocked ? "Buka Blokir Akun" : "Blokir Akun Pengguna"}
                            >
                              {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => setDeletingUser(user)}
                              className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800 transition"
                              title="Hapus Akun Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Tidak ada akun pengguna yang cocok dengan kriteria pencarian/filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / EDIT USER & PERMISSION MAPPING */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingUser ? `Edit Akun & Permission Mapping: ${editingUser.name}` : 'Buat Akun Pengguna Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">Atur profil dan petakan hak akses menu aplikasi per divisi</p>
                </div>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Nama Lengkap User *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Contoh: Ahmad Fauzi, S.T."
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">NIP / Nomor Identitas *</label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="19880101..."
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Email Resmi *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="user@medan.go.id"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Divisi Pengguna *</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold focus:outline-none focus:border-indigo-500"
                  >
                    {ALL_DIVISIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PERMISSION MAPPING CHECKBOX GRID */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-2">
                  <div>
                    <h4 className="font-extrabold text-xs text-indigo-300 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-indigo-400" />
                      Role & Menu Permission Mapping (Hak Akses Menu)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Centang menu yang diizinkan untuk diakses oleh akun divisi ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      [Pilih Semua]
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={handleClearPermissions}
                      className="text-rose-400 hover:underline font-bold"
                    >
                      [Hapus Semua]
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {MASTER_MENUS.map((menu) => {
                    const isChecked = formData.permissions.includes(menu.id);
                    return (
                      <div
                        key={menu.id}
                        onClick={() => togglePermission(menu.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                          isChecked 
                            ? 'bg-indigo-950/60 border-indigo-500/80 text-white' 
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-xs block leading-tight">
                            Menu #{menu.id}: {menu.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Kategori: {menu.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 transition"
                >
                  Simpan Hak Akses & Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/80 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-950 rounded-2xl border border-rose-800">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Konfirmasi Hapus Akun</h3>
                <p className="text-xs text-slate-400">Tindakan ini akan dicatat di Log Aktivitas IT</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.division}) NIP <span className="font-mono text-amber-400">{deletingUser.nip}</span> secara permanen?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-rose-600/30 transition"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
