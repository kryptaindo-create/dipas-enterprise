import React, { useState } from 'react';
import { AlertTriangle, Send, FileText, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, Search } from 'lucide-react';

export default function PengunjukanPenegakanView({ marketFilter }) {
  const [spList, setSpList] = useState([
    { 
      id: 'SP1-2026-088', 
      traderName: 'Bapak Herman Sitorus', 
      stall: 'Blok B No. 14', 
      market: 'Pasar Petisah', 
      level: 'SP-1', 
      date: '10 Agt 2026', 
      arrears: 480000, 
      status: 'TERKIRIM_WA',
      reason: 'Tunggakan Retribusi TB & KEB > 3 Bulan'
    },
    { 
      id: 'SP2-2026-012', 
      traderName: 'Sdr. Supriadi Lubis', 
      stall: 'Ruko C-02', 
      market: 'Pasar Kemuning', 
      level: 'SP-2', 
      date: '01 Agt 2026', 
      arrears: 850000, 
      status: 'PERINGATAN_KERAS',
      reason: 'Kios Tutup 60 Hari Berturut & Menunggak Retribusi'
    },
    { 
      id: 'SP3-2026-004', 
      traderName: 'Bpk Suparno', 
      stall: 'Blok D No. 05', 
      market: 'Pasar Pusat Medan', 
      level: 'SP-3 (SESEGEL)', 
      date: '25 Jul 2026', 
      arrears: 1200000, 
      status: 'PROSES_PENGUNJUKAN_ULANG',
      reason: 'Pengakhiran Hak SIPTB & Pengunjukan Kios ke Pedagang Baru'
    }
  ]);

  const handleSendNotice = (id) => {
    setSpList(spList.map(item => item.id === id ? { ...item, status: 'NOTIFIKASI_ULANG_TERKIRIM' } : item));
    alert('✓ Surat Peringatan & Notifikasi WhatsApp Berhasil Terkirim ke Pedagang!');
  };

  const filteredSp = spList.filter(s => marketFilter === 'ALL' || s.market === marketFilter);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-2xl glass-card-amber space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">6. Menu Pengunjukan & Penegakan</h2>
              <p className="text-xs text-slate-400">Penanganan SP1-SP3 & Pengunjukan Ulang Kios Menunggak</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
            {filteredSp.length} Kasus Aktif
          </span>
        </div>
      </div>

      {/* SP Items List */}
      <div className="space-y-3">
        {filteredSp.map((item) => (
          <div key={item.id} className="glass-panel p-4 rounded-2xl glass-panel-hover space-y-3 border-l-4 border-l-amber-500">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-amber-400 font-bold">{item.id}</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-extrabold text-[10px] rounded">
                    {item.level}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white mt-1">{item.traderName}</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {item.market} ({item.stall})
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-sans">Total Tunggakan</span>
                <span className="font-mono font-extrabold text-rose-400 text-sm">
                  Rp {item.arrears.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold block">Alasan Penegakan:</span>
              <p className="text-[11px] text-slate-200 font-medium">{item.reason}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Status: <strong className="text-amber-300">{item.status}</strong>
              </span>
              <button 
                onClick={() => handleSendNotice(item.id)}
                className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" /> Kirim Peringatan WA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
