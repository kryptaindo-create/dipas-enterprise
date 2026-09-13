import React, { useState } from 'react';
import { Building2, PieChart, CheckCircle2, XCircle, AlertCircle, Layers } from 'lucide-react';

export default function PotensiOkupansiView({ marketFilter }) {
  const [occupancyData] = useState([
    { market: 'Pasar Pusat Medan', totalUnits: 1450, openUnits: 1380, closedUnits: 50, emptyUnits: 20, rate: 95.17 },
    { market: 'Pasar Petisah', totalUnits: 1200, openUnits: 1150, closedUnits: 35, emptyUnits: 15, rate: 95.83 },
    { market: 'Pasar Kemuning', totalUnits: 850, openUnits: 780, closedUnits: 45, emptyUnits: 25, rate: 91.76 },
    { market: 'Pasar Sambas', totalUnits: 600, openUnits: 570, closedUnits: 20, emptyUnits: 10, rate: 95.00 }
  ]);

  const filteredOccupancy = occupancyData.filter(o => marketFilter === 'ALL' || o.market === marketFilter);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-2xl glass-card-indigo space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">7. Menu Potensi & Okupansi Pasar</h2>
              <p className="text-xs text-slate-400">Visualisasi unit usaha terisi, buka vs tutup & unit kosong</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-bold">
            Real-time Occupancy
          </span>
        </div>
      </div>

      {/* Occupancy List */}
      <div className="space-y-3">
        {filteredOccupancy.map((item, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-2xl glass-panel-hover space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" /> {item.market}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Total Kapasitas: {item.totalUnits} Unit</p>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-indigo-400 font-mono">{item.rate}%</span>
                <span className="text-[9px] text-slate-400 block font-sans">Tingkat Okupansi</span>
              </div>
            </div>

            {/* Progress Bar Okupansi */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden flex border border-slate-800">
              <div style={{ width: `${item.rate}%` }} className="bg-emerald-500 h-full" title="Buka"></div>
              <div style={{ width: `${(item.closedUnits/item.totalUnits)*100}%` }} className="bg-amber-500 h-full" title="Tutup"></div>
              <div style={{ width: `${(item.emptyUnits/item.totalUnits)*100}%` }} className="bg-rose-500 h-full" title="Kosong"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <span className="text-[9px] text-emerald-300 block font-sans">Unit Buka</span>
                <span className="font-bold text-emerald-400">{item.openUnits}</span>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <span className="text-[9px] text-amber-300 block font-sans">Unit Tutup</span>
                <span className="font-bold text-amber-400">{item.closedUnits}</span>
              </div>
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <span className="text-[9px] text-rose-300 block font-sans">Kios Kosong</span>
                <span className="font-bold text-rose-400">{item.emptyUnits}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
