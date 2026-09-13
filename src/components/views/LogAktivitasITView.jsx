import React, { useState } from 'react';
import { 
  HardDrive, Search, Filter, ShieldAlert, FileText, Download, Clock, User, 
  Tag, ArrowRight, Eye, ChevronDown, ChevronUp, Layers, RefreshCw
} from 'lucide-react';

export default function LogAktivitasITView({ auditLogs, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLogDiff, setSelectedLogDiff] = useState(null);

  const isITUser = currentUser?.division === 'Bagian IT' || currentUser?.role === 'SUPER_ADMIN_IT';

  if (!isITUser) {
    return (
      <div className="bg-rose-950/40 border border-rose-800/80 p-8 rounded-3xl text-center space-y-4 max-w-2xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 bg-rose-900/60 rounded-full flex items-center justify-center mx-auto text-rose-400 border border-rose-700/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-mono font-bold border border-rose-500/30">
            MODUL EKSKLUSIF BAGIAN IT
          </span>
          <h2 className="text-xl font-black text-white">Akses Audit Trail Ditolak</h2>
          <p className="text-xs text-rose-200 leading-relaxed max-w-md mx-auto">
            Log Aktivitas IT (Audit Trail) berisi rekaman perubahan data sensitif sistem dan hanya dapat diakses oleh akun dengan role <strong className="text-white">Bagian IT (Super Admin)</strong>.
          </p>
        </div>
      </div>
    );
  }

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.changeSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiv = divisionFilter === 'ALL' || log.userRole.toLowerCase().includes(divisionFilter.toLowerCase()) || (log.userDivision && log.userDivision === divisionFilter);
    const matchAction = actionFilter === 'ALL' || log.actionType === actionFilter;
    return matchSearch && matchDiv && matchAction;
  });

  // Export to CSV handler
  const handleExportCSV = () => {
    const headers = ['ID Log', 'Waktu (Timestamp)', 'Nama User', 'Role / Divisi', 'Modul Menu', 'Jenis Aksi', 'Ringkasan Perubahan'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.moduleName}"`,
      `"${l.actionType}"`,
      `"${l.changeSummary.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DIPAS_IT_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 border border-purple-500/30 text-white shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-mono font-bold border border-purple-500/30 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" /> SYSTEM AUDIT TRAIL
              </span>
            </div>
            <h2 className="text-xl font-black text-white">Log Aktivitas IT Terpusat (Audit Log)</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Rekaman otomatis seluruh aktivitas perubahan data (Create, Update, Delete, Block, Hak Akses) oleh semua user. Eksklusif untuk diaudit oleh Bagian IT demi integritas dan keamanan data DIPAS.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari log, user, atau modul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400 font-medium">Jenis Aksi:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Aksi</option>
              <option value="CREATE" className="bg-slate-900 text-emerald-400">CREATE (Tambah Data)</option>
              <option value="UPDATE" className="bg-slate-900 text-blue-400">UPDATE (Ubah Data)</option>
              <option value="DELETE" className="bg-slate-900 text-rose-400">DELETE (Hapus Data)</option>
              <option value="PERMISSION_CHANGE" className="bg-slate-900 text-purple-400">PERMISSION_CHANGE</option>
              <option value="BLOCK_USER" className="bg-slate-900 text-amber-400">BLOCK_USER</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Trail List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Riwayat Log Aktivitas Realtime ({filteredLogs.length} Records)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Status: Secure Immutable Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                <th className="p-4">Waktu & ID Log</th>
                <th className="p-4">Pengguna & Role</th>
                <th className="p-4">Modul & Aksi</th>
                <th className="p-4">Ringkasan Perubahan Data</th>
                <th className="p-4 text-right">Detail Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredLogs.map((log) => {
                const isCreate = log.actionType === 'CREATE' || log.actionType === 'CREATE_USER';
                const isUpdate = log.actionType === 'UPDATE' || log.actionType === 'PERMISSION_CHANGE';
                const isDelete = log.actionType === 'DELETE' || log.actionType === 'DELETE_USER';
                const isBlock = log.actionType === 'BLOCK_USER';

                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono">
                      <span className="text-white font-bold block">{log.timestamp}</span>
                      <span className="text-[10px] text-slate-500">{log.id}</span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{log.userName}</span>
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-purple-300 rounded text-[10px] font-mono inline-block">
                          {log.userRole}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="text-slate-300 font-bold block">{log.moduleName}</span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold font-mono inline-block border ${
                          isCreate ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          isUpdate ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                          isDelete ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                          isBlock ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        }`}>
                          {log.actionType}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="text-slate-200 text-xs leading-relaxed max-w-md">
                        {log.changeSummary}
                      </p>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLogDiff(log)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl border border-slate-700 text-xs font-bold transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit Data</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada rekaman audit log yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DIFF COMPARISON (DATA LAMA VS DATA BARU) */}
      {selectedLogDiff && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Detail Audit Trail: Data Lama vs Data Baru</h3>
                  <p className="text-xs text-slate-400">ID Log: {selectedLogDiff.id} | Waktu: {selectedLogDiff.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogDiff(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Aktor / User:</span>
                  <span className="text-white font-bold">{selectedLogDiff.userName} ({selectedLogDiff.userRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modul Terkait:</span>
                  <span className="text-indigo-400 font-bold">{selectedLogDiff.moduleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ringkasan:</span>
                  <span className="text-slate-200">{selectedLogDiff.changeSummary}</span>
                </div>
              </div>

              {/* Side by side diff */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Data Lama */}
                <div className="bg-rose-950/20 border border-rose-900/50 p-3 rounded-2xl space-y-2">
                  <span className="font-extrabold text-xs text-rose-400 block border-b border-rose-900/50 pb-1">
                    🔴 Data Lama (Before)
                  </span>
                  {selectedLogDiff.oldValue ? (
                    <pre className="font-mono text-[10px] text-rose-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedLogDiff.oldValue, null, 2)}
                    </pre>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Tidak ada (Data Baru Dibuat)</span>
                  )}
                </div>

                {/* Data Baru */}
                <div className="bg-emerald-950/20 border border-emerald-900/50 p-3 rounded-2xl space-y-2">
                  <span className="font-extrabold text-xs text-emerald-400 block border-b border-emerald-900/50 pb-1">
                    🟢 Data Baru (After)
                  </span>
                  {selectedLogDiff.newValue ? (
                    <pre className="font-mono text-[10px] text-emerald-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedLogDiff.newValue, null, 2)}
                    </pre>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Tidak ada (Data Dihapus)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedLogDiff(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
