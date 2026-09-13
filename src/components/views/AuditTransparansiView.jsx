import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, Clock, User, HardDrive, FileCheck } from 'lucide-react';

export default function AuditTransparansiView() {
  const [auditLogs] = useState([
    {
      id: 'LOG-9912',
      time: '16 Agt 2026 14:15:22',
      user: 'Staf Usaha Central (Bpk. Rudi)',
      action: 'VERIFIKASI_PENGAJUAN_SIPTB',
      target: 'H. Syamsul Bahri (REQ-SIPTB-2026-001)',
      ip: '192.168.1.45',
      status: 'SUCCESS'
    },
    {
      id: 'LOG-9911',
      time: '16 Agt 2026 11:30:10',
      user: 'Kabag Usaha & Perizinan',
      action: 'PENERBITAN_SP1_DIGITAL',
      target: 'Bapak Herman Sitorus (SP1-2026-088)',
      ip: '192.168.1.10',
      status: 'SUCCESS'
    },
    {
      id: 'LOG-9910',
      time: '15 Agt 2026 16:45:00',
      user: 'Admin Perizinan Pihak-3',
      action: 'PERSETUJUAN_KONTRAK_ATM',
      target: 'PT Bank Rakyat Indonesia (P3-2026-088)',
      ip: '192.168.1.22',
      status: 'SUCCESS'
    }
  ]);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-2xl glass-card-purple space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">8. Menu Audit & Transparansi</h2>
              <p className="text-xs text-slate-400">Log aktivitas operator & transparansi penerbitan izin resmi</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold">
            Immutable Trail
          </span>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {auditLogs.map((log) => (
          <div key={log.id} className="glass-panel p-4 rounded-2xl glass-panel-hover space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] font-bold text-purple-400">{log.id}</span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> {log.time}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">{log.action}</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-extrabold">
                {log.status}
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 font-sans">Operator:</span>
                <span className="font-bold text-white">{log.user}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 font-sans">Target Objek:</span>
                <span className="text-indigo-300">{log.target}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] border-t border-slate-800/80 pt-1">
                <span>IP Address Verified:</span>
                <span>{log.ip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
