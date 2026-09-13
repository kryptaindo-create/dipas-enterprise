import React, { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, Building2, CheckCircle2, AlertTriangle, XCircle, 
  BarChart3, PieChart, Search, Eye, Filter, ArrowUpRight, ArrowDownRight, 
  Layers, Download, RefreshCw, CalendarDays, DollarSign, Activity, FileText, AlertCircle, Car, Bike, Truck, Droplet, Bath
} from 'lucide-react';

export default function TargetRealisasiView({ marketFilter, tradersData = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [selectedMarketModal, setSelectedMarketModal] = useState(null);

  // REAL-TIME LOCALSTORAGE PARKING & TOILET REVENUE SYNC
  const [parkingRealtimeTotal, setParkingRealtimeTotal] = useState(() => {
    return parseInt(localStorage.getItem('dipas_parking_total')) || 450000;
  });

  const [toiletRealtimeTotal, setToiletRealtimeTotal] = useState(() => {
    return parseInt(localStorage.getItem('dipas_toilet_total')) || 180000;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const storedParking = parseInt(localStorage.getItem('dipas_parking_total')) || 450000;
      const storedToilet = parseInt(localStorage.getItem('dipas_toilet_total')) || 180000;
      setParkingRealtimeTotal(storedParking);
      setToiletRealtimeTotal(storedToilet);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // DATASET BASELINE REKAPITULASI TARGET, POTENSI PARKIR, POTENSI TOILET, REALISASI RETRIBUSI, PARKIR & TOILET PER PASAR
  const RAW_BRANCHES_DATA = [
    {
      branchId: 'CABANG_I',
      branchName: 'Cabang I',
      headName: 'H. Suhendra, S.E.',
      markets: [
        { no: 1, name: 'Pusat Pasar', kelas: 'I-A', totalUnits: 3494, buka: 3439, targetBulanan: 363800000, realisasiBulanan: 356500000, targetHarian: 4250000, realisasiHarian: 4120000, potensiParkirBulanan: 45000000, realisasiParkirBulanan: 41500000 + parkingRealtimeTotal, potensiToiletBulanan: 12000000, realisasiToiletBulanan: 11200000 + toiletRealtimeTotal, volMotor: 650, volMobil: 180, volTruk: 25, volToilet: 200 },
        { no: 2, name: 'Sambu', kelas: 'III', totalUnits: 738, buka: 42, targetBulanan: 16100000, realisasiBulanan: 14800000, targetHarian: 350000, realisasiHarian: 320000, potensiParkirBulanan: 12000000, realisasiParkirBulanan: 10800000, potensiToiletBulanan: 4500000, realisasiToiletBulanan: 4100000, volMotor: 180, volMobil: 40, volTruk: 5, volToilet: 75 },
        { no: 3, name: 'Timah', kelas: 'III', totalUnits: 332, buka: 137, targetBulanan: 52600000, realisasiBulanan: 49800000, targetHarian: 680000, realisasiHarian: 650000, potensiParkirBulanan: 15000000, realisasiParkirBulanan: 13900000, potensiToiletBulanan: 5500000, realisasiToiletBulanan: 5100000, volMotor: 210, volMobil: 55, volTruk: 8, volToilet: 90 },
        { no: 4, name: 'Halat', kelas: 'II', totalUnits: 538, buka: 311, targetBulanan: 119500000, realisasiBulanan: 112000000, targetHarian: 1450000, realisasiHarian: 1380000, potensiParkirBulanan: 22000000, realisasiParkirBulanan: 20400000, potensiToiletBulanan: 8000000, realisasiToiletBulanan: 7500000, volMotor: 320, volMobil: 85, volTruk: 12, volToilet: 130 },
        { no: 5, name: 'Sukaramai', kelas: 'I', totalUnits: 660, buka: 167, targetBulanan: 64200000, realisasiBulanan: 58900000, targetHarian: 820000, realisasiHarian: 790000, potensiParkirBulanan: 28000000, realisasiParkirBulanan: 26100000, potensiToiletBulanan: 9500000, realisasiToiletBulanan: 8900000, volMotor: 400, volMobil: 110, volTruk: 15, volToilet: 160 },
        { no: 6, name: 'Kemiri', kelas: 'II', totalUnits: 247, buka: 192, targetBulanan: 73800000, realisasiBulanan: 71200000, targetHarian: 950000, realisasiHarian: 920000, potensiParkirBulanan: 18000000, realisasiParkirBulanan: 17200000, potensiToiletBulanan: 6000000, realisasiToiletBulanan: 5700000, volMotor: 250, volMobil: 60, volTruk: 8, volToilet: 100 },
        { no: 7, name: 'Titi Kuning', kelas: 'II', totalUnits: 390, buka: 307, targetBulanan: 118000000, realisasiBulanan: 114500000, targetHarian: 1520000, realisasiHarian: 1480000, potensiParkirBulanan: 24000000, realisasiParkirBulanan: 22800000, potensiToiletBulanan: 7500000, realisasiToiletBulanan: 7100000, volMotor: 340, volMobil: 90, volTruk: 14, volToilet: 120 },
        { no: 8, name: 'Kampung Baru', kelas: 'II', totalUnits: 70, buka: 19, targetBulanan: 7300000, realisasiBulanan: 6800000, targetHarian: 95000, realisasiHarian: 90000, potensiParkirBulanan: 5000000, realisasiParkirBulanan: 4600000, potensiToiletBulanan: 2000000, realisasiToiletBulanan: 1800000, volMotor: 80, volMobil: 15, volTruk: 2, volToilet: 35 },
        { no: 9, name: 'Bakti', kelas: 'II', totalUnits: 544, buka: 383, targetBulanan: 147200000, realisasiBulanan: 139800000, targetHarian: 1920000, realisasiHarian: 1850000, potensiParkirBulanan: 26000000, realisasiParkirBulanan: 24900000, potensiToiletBulanan: 8500000, realisasiToiletBulanan: 8100000, volMotor: 380, volMobil: 95, volTruk: 15, volToilet: 140 },
        { no: 10, name: 'Sambas', kelas: 'I', totalUnits: 490, buka: 369, targetBulanan: 141800000, realisasiBulanan: 138900000, targetHarian: 1840000, realisasiHarian: 1810000, potensiParkirBulanan: 30000000, realisasiParkirBulanan: 28700000, potensiToiletBulanan: 9000000, realisasiToiletBulanan: 8600000, volMotor: 420, volMobil: 120, volTruk: 18, volToilet: 150 },
        { no: 11, name: 'Pandu Baru', kelas: 'II', totalUnits: 95, buka: 95, targetBulanan: 36500000, realisasiBulanan: 36500000, targetHarian: 475000, realisasiHarian: 475000, potensiParkirBulanan: 8000000, realisasiParkirBulanan: 8000000, potensiToiletBulanan: 3000000, realisasiToiletBulanan: 3000000, volMotor: 120, volMobil: 30, volTruk: 4, volToilet: 50 }
      ]
    },
    {
      branchId: 'CABANG_II',
      branchName: 'Cabang II',
      headName: 'Drs. Suparno',
      markets: [
        { no: 1, name: 'Petisah Tahap I', kelas: 'I-A', totalUnits: 1053, buka: 615, targetBulanan: 236400000, realisasiBulanan: 228900000, targetHarian: 3080000, realisasiHarian: 2980000, potensiParkirBulanan: 38000000, realisasiParkirBulanan: 35800000, potensiToiletBulanan: 11000000, realisasiToiletBulanan: 10300000, volMotor: 550, volMobil: 150, volTruk: 20, volToilet: 180 },
        { no: 2, name: 'Petisah Tahap II', kelas: 'I-A', totalUnits: 2445, buka: 1295, targetBulanan: 497800000, realisasiBulanan: 482500000, targetHarian: 6480000, realisasiHarian: 6310000, potensiParkirBulanan: 42000000, realisasiParkirBulanan: 40100000, potensiToiletBulanan: 13000000, realisasiToiletBulanan: 12400000, volMotor: 600, volMobil: 165, volTruk: 22, volToilet: 210 },
        { no: 3, name: 'Meranti Baru', kelas: 'II', totalUnits: 277, buka: 83, targetBulanan: 31900000, realisasiBulanan: 28400000, targetHarian: 415000, realisasiHarian: 380000, potensiParkirBulanan: 9000000, realisasiParkirBulanan: 7900000, potensiToiletBulanan: 3500000, realisasiToiletBulanan: 3100000, volMotor: 140, volMobil: 30, volTruk: 3, volToilet: 60 }
      ]
    }
  ];

  // BREAKDOWN PENERIMAAN 7 MATA ANGGARAN, PARKIR & TOILET
  const calculateBudgetCodeBreakdown = (market) => {
    const targetB = market.targetBulanan;
    const realB = market.realisasiBulanan;
    const kpiPct = Math.round((realB / targetB) * 100);

    const codes = [
      { code: 'TB', name: 'Tempat Berjualan (TB)', weight: 0.35 },
      { code: 'KEB', name: 'Kebersihan Pasar (KEB)', weight: 0.20 },
      { code: 'LM', name: 'Listrik Meteran (LM)', weight: 0.15 },
      { code: 'LA', name: 'Listrik Abodemen (LA)', weight: 0.12 },
      { code: 'DTB', name: 'Denda Tempat Berjualan (DTB)', weight: 0.03 },
      { code: 'DKEB', name: 'Denda Kebersihan (DKEB)', weight: 0.02 },
      { code: 'JAMAL', name: 'Jaga Malam & Keamanan (JAMAL)', weight: 0.13 }
    ];

    return codes.map(c => {
      const codeTarget = Math.round(targetB * c.weight);
      let performanceRatio = 0.96;
      if (c.code === 'DTB' || c.code === 'DKEB') performanceRatio = 0.65;
      if (c.code === 'LA') performanceRatio = 0.88;

      const codeRealisasi = Math.round(codeTarget * (kpiPct / 100) * performanceRatio);
      const codeDefisit = Math.max(0, codeTarget - codeRealisasi);
      const codePct = Math.min(100, Math.round((codeRealisasi / codeTarget) * 100));

      return {
        code: c.code,
        name: c.name,
        target: codeTarget,
        realisasi: codeRealisasi,
        defisit: codeDefisit,
        kpiPct: codePct
      };
    });
  };

  // FILTERED BRANCHES & MARKETS
  const filteredBranches = RAW_BRANCHES_DATA.map(branch => {
    let list = branch.markets;
    if (branchFilter !== 'ALL' && branch.branchId !== branchFilter) {
      list = [];
    }

    if (marketFilter && marketFilter !== 'ALL') {
      list = list.filter(m => m.name.toLowerCase().includes(marketFilter.toLowerCase()));
    }

    if (searchQuery) {
      list = list.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.kelas.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return { ...branch, markets: list };
  }).filter(b => b.markets.length > 0);

  // GLOBAL TOTALS (RETRIBUSI + POTENSI PARKIR + POTENSI TOILET)
  let grandTargetRetribusi = 0;
  let grandRealisasiRetribusi = 0;
  let grandPotensiParkir = 0;
  let grandRealisasiParkir = 0;
  let grandPotensiToilet = 0;
  let grandRealisasiToilet = 0;

  RAW_BRANCHES_DATA.forEach(b => {
    b.markets.forEach(m => {
      grandTargetRetribusi += m.targetBulanan;
      grandRealisasiRetribusi += m.realisasiBulanan;
      grandPotensiParkir += m.potensiParkirBulanan;
      grandRealisasiParkir += m.realisasiParkirBulanan;
      grandPotensiToilet += m.potensiToiletBulanan;
      grandRealisasiToilet += m.realisasiToiletBulanan;
    });
  });

  const grandTargetCombined = grandTargetRetribusi + grandPotensiParkir + grandPotensiToilet;
  const grandRealisasiCombined = grandRealisasiRetribusi + grandRealisasiParkir + grandRealisasiToilet;
  const grandKpiCombinedPct = Math.min(100, Math.round((grandRealisasiCombined / grandTargetCombined) * 100));

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER BANNER UTAMA */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl shrink-0">
              <Target className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">🎯 Target vs Realisasi, Potensi Parkir & Toilet Sanitasi</h2>
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-full text-xs uppercase tracking-wider">
                  Live Mobile Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                Monitoring Capaian Retribusi Rutin, SIPTB, Parkir & Toilet Sanitasi Fasilitas Umum per Pasar Tradisional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="px-3 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Mobile Parkir & Toilet Live
            </span>
          </div>
        </div>

        {/* METRIC CARDS RINGKASAN GABUNGAN */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 font-mono">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
            <span className="text-[10px] text-slate-400 font-sans font-bold block uppercase">TOTAL TARGET GABUNGAN:</span>
            <strong className="text-base sm:text-lg font-black text-white block">
              Rp {grandTargetCombined.toLocaleString('id-ID')}
            </strong>
            <span className="text-[10px] text-slate-400 block font-sans">Retribusi + Parkir + Toilet</span>
          </div>

          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-emerald-300 font-sans font-bold block uppercase">TOTAL REALISASI GABUNGAN:</span>
            <strong className="text-base sm:text-lg font-black text-emerald-400 block">
              Rp {grandRealisasiCombined.toLocaleString('id-ID')}
            </strong>
            <span className="text-[10px] text-emerald-200 block font-sans">Total Capaian Real-Time</span>
          </div>

          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-amber-300 font-sans font-bold block uppercase">POTENSI PARKIR PASAR:</span>
            <strong className="text-base sm:text-lg font-black text-amber-400 block">
              Rp {grandPotensiParkir.toLocaleString('id-ID')}
            </strong>
            <span className="text-[10px] text-amber-200 block font-sans">Realisasi: Rp {grandRealisasiParkir.toLocaleString('id-ID')}</span>
          </div>

          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-cyan-300 font-sans font-bold block uppercase">POTENSI TOILET PASAR:</span>
            <strong className="text-base sm:text-lg font-black text-cyan-300 block">
              Rp {grandPotensiToilet.toLocaleString('id-ID')}
            </strong>
            <span className="text-[10px] text-cyan-200 block font-sans">Realisasi: Rp {grandRealisasiToilet.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* REKAPITULASI CABANG & TABEL DETAIL PER PASAR */}
      <div className="space-y-6">
        {filteredBranches.map((branch) => {
          return (
            <div key={branch.branchId} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{branch.branchName} - Kepala Cabang: {branch.headName}</h3>
                    <p className="text-xs text-slate-500">{branch.markets.length} Pasar Tradisional Terdaftar</p>
                  </div>
                </div>
              </div>

              {/* TABEL PASAR DENGAN KOLOM POTENSI PARKIR & TOILET */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono uppercase text-[10.5px] tracking-wider">
                      <th className="p-3 rounded-l-xl">No</th>
                      <th className="p-3">Nama Pasar</th>
                      <th className="p-3 text-right">Target Retribusi</th>
                      <th className="p-3 text-right text-amber-300">Potensi Parkir</th>
                      <th className="p-3 text-right text-cyan-300">Potensi Toilet</th>
                      <th className="p-3 text-right">Realisasi Combined</th>
                      <th className="p-3 text-center">KPI Capaian</th>
                      <th className="p-3 text-center rounded-r-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {branch.markets.map((m) => {
                      const totalTargetM = m.targetBulanan + m.potensiParkirBulanan + m.potensiToiletBulanan;
                      const totalRealisasiM = m.realisasiBulanan + m.realisasiParkirBulanan + m.realisasiToiletBulanan;
                      const kpiCombinedPct = Math.min(100, Math.round((totalRealisasiM / totalTargetM) * 100));

                      return (
                        <tr key={m.no} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-mono font-bold text-slate-500">{m.no}</td>
                          <td className="p-3">
                            <strong className="font-extrabold text-slate-900 block text-xs">{m.name}</strong>
                            <span className="text-[10.5px] text-slate-500 font-mono">Kelas {m.kelas} • {m.buka}/{m.totalUnits} Kios</span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            Rp {m.targetBulanan.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-amber-700 bg-amber-50/50">
                            Rp {m.potensiParkirBulanan.toLocaleString('id-ID')}
                            <span className="text-[9px] text-slate-500 font-sans block font-normal">
                              🏍️{m.volMotor} 🚗{m.volMobil} 🚚{m.volTruk}/hr
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-cyan-700 bg-cyan-50/50">
                            Rp {m.potensiToiletBulanan.toLocaleString('id-ID')}
                            <span className="text-[9px] text-cyan-800 font-sans block font-bold">
                              💧 {m.volToilet} Pengunjung/hr
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-black text-indigo-900 text-xs">
                            Rp {totalRealisasiM.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-center font-mono">
                            <span className={`px-2.5 py-1 rounded-full font-black text-[11px] ${
                              kpiCombinedPct >= 95 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                            }`}>
                              {kpiCombinedPct}%
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setSelectedMarketModal(m)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[11px] shadow-sm flex items-center justify-center gap-1 mx-auto transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Audit Detail</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL AUDIT FINANCIAL DETAIL PER PASAR */}
      {selectedMarketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-slate-900 text-xs my-8 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Financial Audit Detail: Pasar {selectedMarketModal.name}</h3>
                  <p className="text-xs text-slate-500 font-sans">Audit 7 Mata Anggaran, Retribusi Parkir & Retribusi Toilet</p>
                </div>
              </div>
              <button onClick={() => setSelectedMarketModal(null)} className="text-slate-400 hover:text-slate-700 text-base font-bold">✕</button>
            </div>

            {/* RINCIAN 3 BARIS REALISASI FINANCIAL AUDIT */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-300 font-sans">📊 REKAPITULASI AUDIT REALISASI PASAR</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-mono">Real-Time Sync</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <strong className="text-white font-sans block text-xs">1. Realisasi Retribusi (Rutin / SIPTB / Informal)</strong>
                    <span className="text-[10px] text-slate-400 font-sans">Akumulasi 7 Mata Anggaran + Perizinan SIPTB</span>
                  </div>
                  <strong className="text-emerald-400 font-black text-sm">
                    Rp {selectedMarketModal.realisasiBulanan.toLocaleString('id-ID')}
                  </strong>
                </div>

                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-xl border border-amber-500/30">
                  <div>
                    <strong className="text-amber-300 font-sans block text-xs">2. Realisasi Parkir Pasar (Mobile Parkir APK)</strong>
                    <span className="text-[10px] text-slate-400 font-sans">
                      Volume Harian: 🏍️{selectedMarketModal.volMotor} Motor • 🚗{selectedMarketModal.volMobil} Mobil • 🚚{selectedMarketModal.volTruk} Truk
                    </span>
                  </div>
                  <strong className="text-amber-300 font-black text-sm">
                    Rp {selectedMarketModal.realisasiParkirBulanan.toLocaleString('id-ID')}
                  </strong>
                </div>

                <div className="flex justify-between items-center p-2 bg-slate-950 rounded-xl border border-cyan-500/30">
                  <div>
                    <strong className="text-cyan-300 font-sans block text-xs">3. Realisasi Toilet & Sanitasi (Fasilitas Umum)</strong>
                    <span className="text-[10px] text-slate-400 font-sans">
                      Volume Harian: 💧 {selectedMarketModal.volToilet} Pengunjung Toilet / Hari
                    </span>
                  </div>
                  <strong className="text-cyan-300 font-black text-sm">
                    Rp {selectedMarketModal.realisasiToiletBulanan.toLocaleString('id-ID')}
                  </strong>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-gradient-to-r from-indigo-900 to-slate-950 rounded-xl border border-indigo-500/40 text-sm font-black">
                  <span className="font-sans text-white">TOTAL REALISASI COMBINED AUDIT:</span>
                  <strong className="text-amber-400 text-base">
                    Rp {(selectedMarketModal.realisasiBulanan + selectedMarketModal.realisasiParkirBulanan + selectedMarketModal.realisasiToiletBulanan).toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMarketModal(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Tutup Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
