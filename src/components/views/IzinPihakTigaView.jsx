import React, { useState } from 'react';
import { Handshake, Building, Calendar, DollarSign, PlusCircle, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export default function IzinPihakTigaView({ marketFilter }) {
  const [partnerPermits] = useState([
    {
      id: 'P3-2026-088',
      partnerName: 'PT Bank Rakyat Indonesia (BRI)',
      category: 'Sewa Lahan Galeri ATM Center',
      market: 'Pasar Pusat Medan',
      contractValue: 45000000,
      duration: '1 Tahun (Agt 2026 - Agt 2027)',
      status: 'AKTIF',
      docRef: 'KONTRAK-ATM-BRI-088.pdf'
    },
    {
      id: 'P3-2026-092',
      partnerName: 'PT Telkomsel Indonesia',
      category: 'Sewa Space Billboard Iklan Digital',
      market: 'Pasar Petisah',
      contractValue: 75000000,
      duration: '1 Tahun (Jul 2026 - Jul 2027)',
      status: 'AKTIF',
      docRef: 'KONTRAK-ADV-TELKOMSEL-092.pdf'
    },
    {
      id: 'P3-2026-104',
      partnerName: 'CV Mitra Kuliner Nusantara',
      category: 'Izin Stand Temporary Food Bazaar',
      market: 'Pasar Pusat Medan',
      contractValue: 15000000,
      duration: '1 Bulan (15 Agt - 15 Sep 2026)',
      status: 'PROSES_VERIFIKASI',
      docRef: 'PROPOSAL-BAZAAR-KULINER.pdf'
    }
  ]);

  const filteredPartners = partnerPermits.filter(p => marketFilter === 'ALL' || p.market === marketFilter);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-2xl glass-card-emerald space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">5. Menu Izin Pihak Ke-3</h2>
              <p className="text-xs text-slate-400">Pengelolaan perizinan sewa space, booth vendor & sponsorship</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg transition">
            <PlusCircle className="w-3.5 h-3.5" /> Kerjasama Baru
          </button>
        </div>
      </div>

      {/* Partners List */}
      <div className="space-y-3">
        {filteredPartners.map((item) => (
          <div key={item.id} className="glass-panel p-4 rounded-2xl glass-panel-hover space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">{item.id}</span>
                <h3 className="font-bold text-sm text-white mt-0.5">{item.partnerName}</h3>
                <p className="text-[11px] text-slate-300 font-medium">{item.category}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                item.status === 'AKTIF' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Lokasi Area</span>
                <span className="text-white font-bold">{item.market}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-sans block">Nilai Kontrak</span>
                <span className="text-emerald-400 font-bold">Rp {item.contractValue.toLocaleString('id-ID')}</span>
              </div>
              <div className="col-span-2 border-t border-slate-800 pt-1.5 flex justify-between text-[11px]">
                <span className="text-slate-400 font-sans">Masa Berlaku:</span>
                <span className="text-indigo-300 font-bold">{item.duration}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-slate-400 font-mono flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> {item.docRef}
              </span>
              <button onClick={() => alert(`Membuka berkas dokumen digital ${item.docRef}`)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition">
                Lihat Kontrak
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
