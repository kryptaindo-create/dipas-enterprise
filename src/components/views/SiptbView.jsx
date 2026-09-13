import React, { useState } from 'react';
import { 
  FileCheck, ShieldCheck, XCircle, AlertTriangle, CreditCard, 
  Send, Phone, Search, Filter, RefreshCw, CheckCircle2, Clock, 
  DollarSign, Building2, Store, Eye, Download, Layers, ShieldAlert, Award, Activity, AlertCircle
} from 'lucide-react';

export default function SiptbView({ marketFilter, tradersData = [], setTradersData }) {
  const [localMarketFilter, setLocalMarketFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('ALL');
  const [sentTriggers, setSentTriggers] = useState({});

  // Helper Tarif Perpanjangan SIPTB per Grade Pasar
  const getGradeTarifInfo = (marketName) => {
    if (marketName.includes('Pusat') || marketName.includes('Petisah')) {
      return { grade: 'GRADE A (PREMIUM)', tarif: 350000, color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    if (marketName.includes('Kemuning') || marketName.includes('Sambas') || marketName.includes('Sukaramai') || marketName.includes('Halat')) {
      return { grade: 'GRADE B (MENENGAH)', tarif: 300000, color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    }
    if (marketName.includes('Marelan') || marketName.includes('Kampung Lalang') || marketName.includes('Akik')) {
      return { grade: 'GRADE C (STANDAR)', tarif: 250000, color: 'bg-blue-100 text-blue-900 border-blue-300' };
    }
    return { grade: 'GRADE D (PERINTIS)', tarif: 200000, color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  const checkSiptbStatus = (expiryDateStr) => {
    if (!expiryDateStr) return 'AKTIF';
    const today = new Date('2026-08-17');
    const expDate = new Date(expiryDateStr);
    if (isNaN(expDate.getTime())) return 'AKTIF';
    return expDate >= today ? 'AKTIF' : 'MATI';
  };

  // Helper Kalkulasi Durasi Keterlambatan SIPTB Mati
  const calculateExpiredDuration = (siptbEndDateStr) => {
    if (!siptbEndDateStr) return { formattedDate: '-', durationText: '-', totalMonths: 0, isSevere: false };
    
    const expDate = new Date(siptbEndDateStr);
    const todayDate = new Date('2026-08-17');
    
    if (isNaN(expDate.getTime()) || expDate >= todayDate) {
      return { formattedDate: siptbEndDateStr, durationText: 'Masih Berlaku', totalMonths: 0, isSevere: false };
    }
    
    let years = todayDate.getFullYear() - expDate.getFullYear();
    let months = todayDate.getMonth() - expDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalMonths = years * 12 + months;
    let durationText = '';
    if (years > 0 && months > 0) {
      durationText = `Sudah mati ${years} tahun ${months} bulan`;
    } else if (years > 0) {
      durationText = `Sudah mati ${years} tahun`;
    } else if (months > 0) {
      durationText = `Sudah mati ${months} bulan`;
    } else {
      const days = Math.floor((todayDate - expDate) / (1000 * 60 * 60 * 24));
      durationText = `Sudah mati ${days} hari`;
    }

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = expDate.toLocaleDateString('id-ID', options);

    return {
      formattedDate,
      durationText,
      totalMonths,
      isSevere: totalMonths >= 12
    };
  };

  // Sinkronkan filter global jika berubah
  const activeMarket = localMarketFilter !== 'ALL' ? localMarketFilter : marketFilter;

  // Filter Database Pedagang
  const relevantTraders = tradersData.filter(t => activeMarket === 'ALL' || t.market === activeMarket);

  const activeSiptbList = relevantTraders.filter(t => checkSiptbStatus(t.siptbEndDate) === 'AKTIF');
  const expiredSiptbList = relevantTraders.filter(t => checkSiptbStatus(t.siptbEndDate) === 'MATI');

  // Breakdown Per Grade Pasar untuk SIPTB Mati
  const gradeBreakdown = expiredSiptbList.reduce((acc, t) => {
    const info = getGradeTarifInfo(t.market);
    const tarifAmount = t.siptbRenewalFee || info.tarif;
    if (info.grade.includes('GRADE A')) {
      acc.gradeA.count += 1;
      acc.gradeA.totalRp += tarifAmount;
    } else if (info.grade.includes('GRADE B')) {
      acc.gradeB.count += 1;
      acc.gradeB.totalRp += tarifAmount;
    } else if (info.grade.includes('GRADE C')) {
      acc.gradeC.count += 1;
      acc.gradeC.totalRp += tarifAmount;
    } else {
      acc.gradeD.count += 1;
      acc.gradeD.totalRp += tarifAmount;
    }
    return acc;
  }, {
    gradeA: { label: 'Grade A (Premium)', tarif: 350000, count: 0, totalRp: 0 },
    gradeB: { label: 'Grade B (Menengah)', tarif: 300000, count: 0, totalRp: 0 },
    gradeC: { label: 'Grade C (Standar)', tarif: 250000, count: 0, totalRp: 0 },
    gradeD: { label: 'Grade D (Perintis)', tarif: 200000, count: 0, totalRp: 0 }
  });

  const totalPotensiTertundaRp = expiredSiptbList.reduce((sum, t) => {
    const info = getGradeTarifInfo(t.market);
    return sum + (t.siptbRenewalFee || info.tarif);
  }, 0);

  // Aksi Kirim Tagihan ke Field Mobile APK
  const handleSendBillToMobileApk = (trader) => {
    setSentTriggers(prev => ({ ...prev, [trader.id]: true }));
    const durInfo = calculateExpiredDuration(trader.siptbEndDate);
    alert(`📱 NOTIFIKASI TERKIRIM KE MOBILE APK PETUGAS LAPANGAN!\n\nTagihan Perpanjangan SIPTB Pedagang:\nNama: ${trader.name} (ID: ${trader.id})\nLokasi: ${trader.market} - ${trader.stall}\nBiaya Perpanjangan: Rp ${(trader.siptbRenewalFee || 300000).toLocaleString('id-ID')}\nStatus Expired: ${durInfo.formattedDate} (${durInfo.durationText})\nNo WA Pedagang: ${trader.phone}\n\nPetugas Lapangan akan menerima instruksi penagihan khusus di aplikasi HP mereka.`);
  };

  // Aksi Perpanjang SIPTB Otomatis (Auto-Sync Status dari Mati -> Aktif)
  const handleRenewSiptbAutoSync = (traderId) => {
    if (!setTradersData) return;
    const updatedTraders = tradersData.map(t => {
      if (t.id === traderId) {
        return {
          ...t,
          siptbStartDate: '2026-08-17',
          siptbEndDate: '2027-08-17',
          siptbStatus: 'AKTIF',
          statusPembayaran: 'LUNAS'
        };
      }
      return t;
    });

    setTradersData(updatedTraders);
    alert(`⚡ SINKRONISASI OTOMATIS BERHASIL!\n\nMasa aktif SIPTB Pedagang ID ${traderId} telah diperpanjang hingga 17 Agustus 2027.\nStatus dan nominal potensi tertunda otomatis berpindah dari 'Mati' menjadi 'Aktif' secara real-time!`);
  };

  const filteredExpiredList = expiredSiptbList.filter(t => {
    const info = getGradeTarifInfo(t.market);
    const matchesGrade = selectedGradeFilter === 'ALL' || info.grade.includes(selectedGradeFilter);
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.includes(searchQuery) ||
                          t.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.stall.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-5">
      
      {/* HEADER BANNER MODUL SIPTB */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shrink-0">
              <FileCheck className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white leading-tight">4. Modul SIPTB & Monitoring Potensi Pendapatan Izin</h2>
                <span className="px-2.5 py-0.5 bg-blue-400 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-950" /> Live Database Sync
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">Monitoring Transparan Masa Berlaku, Durasi Keterlambatan, & Mobile APK Field Action</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button onClick={() => alert('✓ Rekapitulasi SIPTB & Potensi Pendapatan Izin Berhasil Di-Export!')} className="w-full sm:w-auto px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition">
              <Download className="w-4 h-4" /> Export Laporan SIPTB
            </button>
          </div>
        </div>

        {/* 2. KARTU RINGKASAN UTAMA (SUMMARY CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 font-mono">
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-emerald-200 font-sans font-bold block flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SIPTB AKTIF (BERLAKU):
            </span>
            <strong className="text-lg sm:text-xl font-black text-emerald-300 block">
              {activeSiptbList.length} Pedagang
            </strong>
            <span className="text-[9.5px] text-emerald-200 font-sans">Izin Legal Berlaku Harian/Bulanan</span>
          </div>

          <div className="p-3.5 bg-rose-500/20 border border-rose-400/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-rose-200 font-sans font-bold block flex items-center gap-1">
              <XCircle className="w-4 h-4 text-rose-400 animate-pulse" /> SIPTB MATI / EXPIRED:
            </span>
            <strong className="text-lg sm:text-xl font-black text-rose-300 block">
              {expiredSiptbList.length} Pedagang
            </strong>
            <span className="text-[9.5px] text-rose-200 font-sans">Masa Berlaku SIPTB Habis</span>
          </div>

          <div className="p-3.5 bg-amber-500/20 border border-amber-400/30 rounded-2xl space-y-1">
            <span className="text-[10px] text-amber-200 font-sans font-bold block flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-amber-400" /> POTENSI PENDAPATAN TERTUNDA:
            </span>
            <strong className="text-lg sm:text-xl font-black text-amber-300 block">
              Rp {totalPotensiTertundaRp.toLocaleString('id-ID')}
            </strong>
            <span className="text-[9.5px] text-amber-200 font-sans">Kalkulasi Otomatis Grade Pasar</span>
          </div>
        </div>
      </div>

      {/* 3. BREAKDOWN RINCIAN BERDASARKAN GRADE PASAR */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-600" /> Rincian Potensi Perpanjangan Per Grade Pasar (SIPTB Mati):
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="font-extrabold text-amber-900">Grade A (Premium)</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-black text-[10px]">Rp 350.000/Thn</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-xs text-slate-500 font-sans">{gradeBreakdown.gradeA.count} Pedagang Mati</span>
              <strong className="text-sm font-black text-amber-700">Rp {gradeBreakdown.gradeA.totalRp.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="font-extrabold text-indigo-900">Grade B (Menengah)</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-black text-[10px]">Rp 300.000/Thn</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-xs text-slate-500 font-sans">{gradeBreakdown.gradeB.count} Pedagang Mati</span>
              <strong className="text-sm font-black text-indigo-700">Rp {gradeBreakdown.gradeB.totalRp.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="font-extrabold text-blue-900">Grade C (Standar)</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-black text-[10px]">Rp 250.000/Thn</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-xs text-slate-500 font-sans">{gradeBreakdown.gradeC.count} Pedagang Mati</span>
              <strong className="text-sm font-black text-blue-700">Rp {gradeBreakdown.gradeC.totalRp.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="font-extrabold text-slate-800">Grade D (Perintis)</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-black text-[10px]">Rp 200.000/Thn</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-xs text-slate-500 font-sans">{gradeBreakdown.gradeD.count} Pedagang Mati</span>
              <strong className="text-sm font-black text-slate-800">Rp {gradeBreakdown.gradeD.totalRp.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 1. FILTER WILAYAH PASAR YANG AKURAT & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Dropdown Filter Wilayah Pasar */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-extrabold">
          <Filter className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-slate-500 text-[11px] whitespace-nowrap">Filter Pasar:</span>
          <select 
            value={localMarketFilter} 
            onChange={(e) => setLocalMarketFilter(e.target.value)} 
            className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Semua 53 Pasar Tradisional</option>
            <option value="Pasar Pusat Medan">Pasar Pusat Medan (Grade A)</option>
            <option value="Pasar Petisah">Pasar Petisah (Grade A)</option>
            <option value="Pasar Kemuning">Pasar Kemuning (Grade B)</option>
            <option value="Pasar Sambas">Pasar Sambas (Grade B)</option>
            <option value="Pasar Sukaramai">Pasar Sukaramai (Grade B)</option>
            <option value="Pasar Halat">Pasar Halat (Grade B)</option>
            <option value="Pasar Marelan">Pasar Marelan (Grade C)</option>
          </select>
        </div>

        {/* Input Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input 
            type="text" 
            placeholder="Cari ID / Nama / WA Pedagang / No Kiosk..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        {/* Dropdown Grade */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0">
          <span className="text-slate-500 text-[11px]">Grade:</span>
          <select value={selectedGradeFilter} onChange={(e) => setSelectedGradeFilter(e.target.value)} className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer">
            <option value="ALL">Semua Grade</option>
            <option value="GRADE A">Grade A (Rp 350k)</option>
            <option value="GRADE B">Grade B (Rp 300k)</option>
            <option value="GRADE C">Grade C (Rp 250k)</option>
            <option value="GRADE D">Grade D (Rp 200k)</option>
          </select>
        </div>

      </div>

      {/* 2. RINCIAN TABEL TINDAK LANJUT PEDAGANG SIPTB MATI (DETAIL TRANSFARAN) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-3">
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-black text-sm text-white">Tabel Tindak Lanjut Pedagang SIPTB Mati ({filteredExpiredList.length} Pedagang)</h3>
          </div>
          <span className="text-xs text-slate-300 font-mono">
            {activeMarket === 'ALL' ? 'Menampilkan seluruh pasar se-Kota Medan' : `Menampilkan khusus: ${activeMarket}`}
          </span>
        </div>

        {filteredExpiredList.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-black text-sm text-slate-800">Semua SIPTB Berstatus AKTIF!</h4>
            <p className="text-xs text-slate-500">Tidak ada pedagang berstatus SIPTB mati pada filter pasar "{activeMarket}".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[9.5px] border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left">ID & Nama Pedagang</th>
                  <th className="p-3 text-left">Lokasi Usaha & No Kiosk</th>
                  <th className="p-3 text-center">Grade & Biaya</th>
                  <th className="p-3 text-left min-w-[210px]">Durasi Keterlambatan (Masa Habis)</th>
                  <th className="p-3 text-center min-w-[230px]">Aksi Cepat Field APK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                {filteredExpiredList.map((t) => {
                  const info = getGradeTarifInfo(t.market);
                  const tarifFee = t.siptbRenewalFee || info.tarif;
                  const durInfo = calculateExpiredDuration(t.siptbEndDate);
                  const isSent = sentTriggers[t.id];

                  return (
                    <tr key={t.id} className="hover:bg-rose-50/40 transition-colors">
                      
                      {/* KOLOM 1: ID & NAMA PEDAGANG + WA */}
                      <td className="p-3 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded font-mono font-bold text-[9.5px]">
                            ID: {t.id}
                          </span>
                          <strong className="font-extrabold text-slate-900 text-xs">{t.name}</strong>
                        </div>
                        <div className="flex items-center gap-1 text-[10.5px] text-emerald-700 font-mono mt-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-bold">{t.phone}</span>
                        </div>
                      </td>

                      {/* KOLOM 2: LOKASI USAHA (PASAR & KIOSK) */}
                      <td className="p-3 font-sans">
                        <strong className="font-black text-slate-900 text-xs flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {t.market}
                        </strong>
                        <span className="text-[10px] text-slate-600 font-mono block mt-0.5">
                          📍 {t.stall} ({t.type})
                        </span>
                      </td>

                      {/* KOLOM 3: GRADE & BIAYA PERPANJANGAN */}
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black border block ${info.color}`}>
                          {info.grade}
                        </span>
                        <strong className="text-xs font-black text-slate-900 font-mono block mt-1">
                          Rp {tarifFee.toLocaleString('id-ID')}
                        </strong>
                      </td>

                      {/* KOLOM 4: DURASI KETERLAMBATAN (KALKULASI OTOMATIS) */}
                      <td className="p-3 font-sans">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <strong className="text-xs font-bold text-slate-900 font-mono">{durInfo.formattedDate}</strong>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black flex items-center gap-1 ${
                              durInfo.isSevere ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}>
                              {durInfo.isSevere && <AlertCircle className="w-3 h-3 text-white" />}
                              ({durInfo.durationText})
                            </span>
                          </div>

                          {durInfo.isSevere && (
                            <span className="text-[9px] text-rose-700 font-black uppercase tracking-wider block font-mono">
                              ⚠️ PRIORITAS PENAGIHAN (MATI &gt; 1 TAHUN)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* KOLOM 5: AKSI CEPAT (ACTION BUTTONS) */}
                      <td className="p-3 text-center space-y-1.5">
                        
                        {/* Tombol Kirim Tagihan ke Field Mobile APK */}
                        <button 
                          onClick={() => handleSendBillToMobileApk(t)}
                          className={`w-full py-1.5 px-3 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1 shadow-sm transition ${
                            isSent ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSent ? '✓ Tagihan Terkirim ke HP Collector' : '📱 Kirim Tagihan ke HP Pengutip'}</span>
                        </button>

                        {/* Tombol Perpanjang & Bayar SIPTB (Auto-Sync) */}
                        <button 
                          onClick={() => handleRenewSiptbAutoSync(t.id)}
                          className="w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 border border-indigo-200 transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>⚡ Perpanjang & Bayar SIPTB (Auto-Sync)</span>
                        </button>

                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
