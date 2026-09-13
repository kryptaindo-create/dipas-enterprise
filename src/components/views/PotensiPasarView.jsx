import React, { useState } from 'react';
import { 
  TrendingUp, Building2, Store, ShoppingBag, LayoutGrid, Users, 
  Search, Eye, AlertOctagon, BarChart3, PieChart, ChevronDown, ChevronUp,
  Filter, Download, CheckCircle2, XCircle, AlertTriangle, Layers, Maximize2, Activity, RefreshCw, Printer, CalendarDays, DollarSign, FileText, ArrowRight
} from 'lucide-react';

export default function PotensiPasarView({ marketFilter, tradersData = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [expandedBranches, setExpandedBranches] = useState({
    CABANG_I: true,
    CABANG_II: true,
    CABANG_III: true
  });
  const [mobileExpandedCard, setMobileExpandedCard] = useState(null);
  const [selectedMarketModal, setSelectedMarketModal] = useState(null);

  // DATASET BASELINE REKAPITULASI UNTUK 37 PASAR TRADISIONAL
  const RAW_BRANCHES_DATA = [
    {
      branchId: 'CABANG_I',
      branchName: 'Cabang I',
      headName: 'H. Suhendra, S.E.',
      color: 'emerald',
      markets: [
        { no: 1, name: 'Pusat Pasar', kelas: 'I-A', kiosk: { buka: 2951, tutup: 0 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 488, tutup: 0 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 33, sm: 22, toko: 0, inf: 0 }, total: 3494 },
        { no: 2, name: 'Sambu', kelas: 'III', kiosk: { buka: 10, tutup: 25 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 32, tutup: 0 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 180, sm: 491, toko: 0, inf: 0 }, total: 738 },
        { no: 3, name: 'Timah', kelas: 'III', kiosk: { buka: 106, tutup: 120 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 31, tutup: 75 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 0, sm: 0, toko: 0, inf: 0 }, total: 332 },
        { no: 4, name: 'Halat', kelas: 'II', kiosk: { buka: 98, tutup: 12 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 213, tutup: 21 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 9, sm: 185, toko: 0, inf: 0 }, total: 538 },
        { no: 5, name: 'Sukaramai', kelas: 'I', kiosk: { buka: 47, tutup: 372 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 120, tutup: 91 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 9, sm: 21, toko: 0, inf: 0 }, total: 660 },
        { no: 6, name: 'Kemiri', kelas: 'II', kiosk: { buka: 12, tutup: 2 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 161, tutup: 42 }, informal: { buka: 19, tutup: 7 }, dicabut: { kiosk: 0, sm: 4, toko: 0, inf: 0 }, total: 247 },
        { no: 7, name: 'Titi Kuning', kelas: 'II', kiosk: { buka: 135, tutup: 38 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 124, tutup: 44 }, informal: { buka: 40, tutup: 9 }, dicabut: { kiosk: 0, sm: 0, toko: 0, inf: 0 }, total: 390 },
        { no: 8, name: 'Kampung Baru', kelas: 'II', kiosk: { buka: 2, tutup: 6 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 13, tutup: 4 }, informal: { buka: 4, tutup: 1 }, dicabut: { kiosk: 16, sm: 24, toko: 0, inf: 0 }, total: 70 },
        { no: 9, name: 'Bakti', kelas: 'II', kiosk: { buka: 172, tutup: 46 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 188, tutup: 33 }, informal: { buka: 23, tutup: 14 }, dicabut: { kiosk: 24, sm: 36, toko: 0, inf: 8 }, total: 544 },
        { no: 10, name: 'Sambas', kelas: 'I', kiosk: { buka: 198, tutup: 0 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 171, tutup: 0 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 28, sm: 93, toko: 0, inf: 0 }, total: 490 },
        { no: 11, name: 'Pandu Baru', kelas: 'II', kiosk: { buka: 95, tutup: 0 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 0, tutup: 0 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 0, sm: 0, toko: 0, inf: 0 }, total: 95 }
      ]
    },
    {
      branchId: 'CABANG_II',
      branchName: 'Cabang II',
      headName: 'Drs. Suparno',
      color: 'blue',
      markets: [
        { no: 1, name: 'Petisah Tahap I', kelas: 'I-A', kiosk: { buka: 577, tutup: 207 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 18, tutup: 0 }, informal: { buka: 20, tutup: 25 }, dicabut: { kiosk: 202, sm: 4, toko: 0, inf: 0 }, total: 1053 },
        { no: 2, name: 'Petisah Tahap II', kelas: 'I-A', kiosk: { buka: 926, tutup: 614 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 294, tutup: 340 }, informal: { buka: 75, tutup: 96 }, dicabut: { kiosk: 69, sm: 31, toko: 0, inf: 0 }, total: 2445 },
        { no: 3, name: 'Meranti Baru', kelas: 'II', kiosk: { buka: 13, tutup: 19 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 70, tutup: 159 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 3, sm: 13, toko: 0, inf: 0 }, total: 277 },
        { no: 4, name: 'Padang Bulan', kelas: 'II', kiosk: { buka: 98, tutup: 125 }, toko: { buka: 21, tutup: 0 }, stand: { buka: 52, tutup: 38 }, informal: { buka: 6, tutup: 0 }, dicabut: { kiosk: 1, sm: 1, toko: 0, inf: 0 }, total: 342 },
        { no: 5, name: 'Sei Sikambing', kelas: 'II', kiosk: { buka: 383, tutup: 182 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 156, tutup: 91 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 29, sm: 10, toko: 0, inf: 0 }, total: 851 },
        { no: 6, name: 'Desa Lalang', kelas: 'II', kiosk: { buka: 103, tutup: 80 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 123, tutup: 106 }, informal: { buka: 86, tutup: 164 }, dicabut: { kiosk: 186, sm: 151, toko: 0, inf: 0 }, total: 999 },
        { no: 7, name: 'Sunggal', kelas: 'II', kiosk: { buka: 34, tutup: 14 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 32, tutup: 38 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 0, sm: 0, toko: 0, inf: 0 }, total: 118 },
        { no: 8, name: 'Simalingkar', kelas: 'II', kiosk: { buka: 466, tutup: 193 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 132, tutup: 78 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 40, sm: 30, toko: 0, inf: 0 }, total: 939 },
        { no: 9, name: 'Muara Takus', kelas: 'III', kiosk: { buka: 10, tutup: 10 }, toko: { buka: 12, tutup: 0 }, stand: { buka: 45, tutup: 12 }, informal: { buka: 9, tutup: 4 }, dicabut: { kiosk: 40, sm: 98, toko: 8, inf: 8 }, total: 256 },
        { no: 10, name: 'Ikan Lama', kelas: 'III', kiosk: { buka: 44, tutup: 0 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 0, tutup: 0 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 0, sm: 0, toko: 0, inf: 0 }, total: 44 },
        { no: 11, name: 'Kwala Bekala', kelas: 'II', kiosk: { buka: 311, tutup: 91 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 156, tutup: 128 }, informal: { buka: 3, tutup: 3 }, dicabut: { kiosk: 0, sm: 6, toko: 0, inf: 0 }, total: 698 },
        { no: 12, name: 'Helvetia', kelas: 'II', kiosk: { buka: 176, tutup: 126 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 146, tutup: 68 }, informal: { buka: 0, tutup: 3 }, dicabut: { kiosk: 79, sm: 50, toko: 0, inf: 0 }, total: 648 },
        { no: 13, name: 'Induk Tuntungan', kelas: 'I', kiosk: { buka: 8, tutup: 416 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 777, tutup: 1297 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 113, sm: 796, toko: 0, inf: 0 }, total: 3407 },
        { no: 14, name: 'Pringgan', kelas: 'II', kiosk: { buka: 88, tutup: 215 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 97, tutup: 62 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 231, sm: 115, toko: 0, inf: 0 }, total: 808 }
      ]
    },
    {
      branchId: 'CABANG_III',
      branchName: 'Cabang III',
      headName: 'Ahmad Fauzi',
      color: 'purple',
      markets: [
        { no: 1, name: 'Pendidikan', kelas: 'II', kiosk: { buka: 43, tutup: 72 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 186, tutup: 173 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 71, sm: 25, toko: 0, inf: 0 }, total: 570 },
        { no: 2, name: 'Sentosa Baru', kelas: 'II', kiosk: { buka: 40, tutup: 5 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 76, tutup: 4 }, informal: { buka: 2, tutup: 6 }, dicabut: { kiosk: 2, sm: 15, toko: 0, inf: 9 }, total: 159 },
        { no: 3, name: 'Glugur Kota', kelas: 'II', kiosk: { buka: 15, tutup: 26 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 11, tutup: 83 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 32, sm: 111, toko: 0, inf: 0 }, total: 278 },
        { no: 4, name: 'Medan Deli', kelas: 'II', kiosk: { buka: 130, tutup: 38 }, toko: { buka: 9, tutup: 0 }, stand: { buka: 370, tutup: 165 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 7, sm: 288, toko: 0, inf: 0 }, total: 1007 },
        { no: 5, name: 'Titi Papan', kelas: 'II', kiosk: { buka: 42, tutup: 25 }, toko: { buka: 6, tutup: 6 }, stand: { buka: 149, tutup: 95 }, informal: { buka: 19, tutup: 5 }, dicabut: { kiosk: 12, sm: 9, toko: 0, inf: 2 }, total: 370 },
        { no: 6, name: 'Imp. Labuhan', kelas: 'III', kiosk: { buka: 40, tutup: 141 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 24, tutup: 227 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 6, sm: 22, toko: 0, inf: 0 }, total: 460 },
        { no: 7, name: 'Paus Belawan', kelas: 'III', kiosk: { buka: 30, tutup: 24 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 45, tutup: 124 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 4, sm: 3, toko: 0, inf: 0 }, total: 230 },
        { no: 8, name: 'Jawa Belawan', kelas: 'II', kiosk: { buka: 111, tutup: 156 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 58, tutup: 64 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 27, sm: 27, toko: 0, inf: 0 }, total: 443 },
        { no: 9, name: 'Kapuas Belawan', kelas: 'II', kiosk: { buka: 45, tutup: 124 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 0, tutup: 0 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 41, sm: 0, toko: 0, inf: 0 }, total: 210 },
        { no: 10, name: 'Pisang Belawan', kelas: 'III', kiosk: { buka: 0, tutup: 0 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 14, tutup: 27 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 0, sm: 79, toko: 0, inf: 0 }, total: 120 },
        { no: 11, name: 'Marelan', kelas: 'I', kiosk: { buka: 15, tutup: 226 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 294, tutup: 282 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 0, sm: 30, toko: 0, inf: 0 }, total: 847 },
        { no: 12, name: 'Aksara', kelas: 'II', kiosk: { buka: 12, tutup: 449 }, toko: { buka: 0, tutup: 0 }, stand: { buka: 0, tutup: 162 }, informal: { buka: 0, tutup: 0 }, dicabut: { kiosk: 48, sm: 36, toko: 0, inf: 0 }, total: 707 }
      ]
    }
  ];

  // LOGIKA AGREGASI AUTOMATIS REAL-TIME DARI MASTER PEDAGANG
  const getMarketTotals = (m) => {
    let buka = m.kiosk.buka + m.toko.buka + m.stand.buka + m.informal.buka;
    let tutup = m.kiosk.tutup + m.toko.tutup + m.stand.tutup + m.informal.tutup;
    let cabut = m.dicabut.kiosk + m.dicabut.sm + m.dicabut.toko + m.dicabut.inf;

    const marketTraders = (tradersData || []).filter(t => 
      t.market === m.name || 
      (m.name.includes('Petisah') && t.market.includes('Petisah')) ||
      (m.name.includes('Pusat') && t.market.includes('Pusat'))
    );

    const liveTutup = marketTraders.filter(t => t.statusOperasional === 'TUTUP').length;
    const liveCabut = marketTraders.filter(t => t.statusOperasional === 'DICABUT').length;

    if (liveTutup > 0) {
      tutup += liveTutup;
      buka = Math.max(0, buka - liveTutup);
    }
    if (liveCabut > 0) {
      cabut += liveCabut;
      buka = Math.max(0, buka - liveCabut);
    }

    const total = m.total || (buka + tutup + cabut);
    const pBuka = total > 0 ? Math.round((buka / total) * 100) : 0;
    const pTutup = total > 0 ? Math.round((tutup / total) * 100) : 0;
    const pCabut = total > 0 ? Math.round((cabut / total) * 100) : 0;

    return { buka, tutup, cabut, total, pBuka, pTutup, pCabut, syncedCount: marketTraders.length, marketTraders };
  };

  // KALKULASI DETAIL POTENSI SPLIT BULANAN & HARIAN UNTUK MODAL RINCIAN PASAR
  const calculateMarketPotensiSplit = (m) => {
    const totals = getMarketTotals(m);
    const totalBuka = totals.buka;

    // Rates Default Per Unit Usaha Buka
    // Bulanan Standard per Unit Buka (TB 104k + KEB 50.4k + LM 90k + LA 80k + JAMAL 60k = Rp 384.400 /Bulan)
    // Harian Standard per Unit Buka (TB 2k + KEB 1.5k + LM 2k + LA 1.5k + JAMAL 1.5k = Rp 8.500 /Hari)
    
    // Asumsi perbandingan pedagang Bulanan vs Harian (misal 70% Bulanan, 30% Harian)
    const countBulanan = Math.round(totalBuka * 0.75);
    const countHarian = Math.max(1, totalBuka - countBulanan);

    const bulananItems = [
      { code: 'TB', name: 'Tempat Berjualan (TB) Bulanan', rate: 104000, count: countBulanan, subtotal: countBulanan * 104000 },
      { code: 'KEB', name: 'Kebersihan Pasar (KEB) Bulanan', rate: 50400, count: countBulanan, subtotal: countBulanan * 50400 },
      { code: 'LM', name: 'Listrik Meteran (LM) Bulanan', rate: 90000, count: countBulanan, subtotal: countBulanan * 90000 },
      { code: 'LA', name: 'Listrik Abodemen (LA) Bulanan', rate: 80000, count: countBulanan, subtotal: countBulanan * 80000 },
      { code: 'DTB', name: 'Denda Tempat Berjualan (DTB)', rate: 7000, count: Math.round(countBulanan * 0.05), subtotal: Math.round(countBulanan * 0.05) * 7000 },
      { code: 'DKEB', name: 'Denda Kebersihan (DKEB)', rate: 5000, count: Math.round(countBulanan * 0.05), subtotal: Math.round(countBulanan * 0.05) * 5000 },
      { code: 'JAMAL', name: 'Jaga Malam & Keamanan (JAMAL)', rate: 60000, count: countBulanan, subtotal: countBulanan * 60000 }
    ];

    const harianItems = [
      { code: 'TB_H', name: 'Tempat Berjualan (TB) Harian', ratePerHari: 2000, count: countHarian, subtotalPerHari: countHarian * 2000, subtotalProyeksi30Hari: countHarian * 2000 * 30 },
      { code: 'KEB_H', name: 'Kebersihan Pasar (KEB) Harian', ratePerHari: 1500, count: countHarian, subtotalPerHari: countHarian * 1500, subtotalProyeksi30Hari: countHarian * 1500 * 30 },
      { code: 'LM_H', name: 'Listrik Meteran (LM) Harian', ratePerHari: 2000, count: countHarian, subtotalPerHari: countHarian * 2000, subtotalProyeksi30Hari: countHarian * 2000 * 30 },
      { code: 'LA_H', name: 'Listrik Abodemen (LA) Harian', ratePerHari: 1500, count: countHarian, subtotalPerHari: countHarian * 1500, subtotalProyeksi30Hari: countHarian * 1500 * 30 },
      { code: 'DTB_H', name: 'Denda TB Harian', ratePerHari: 1000, count: Math.round(countHarian * 0.08), subtotalPerHari: Math.round(countHarian * 0.08) * 1000, subtotalProyeksi30Hari: Math.round(countHarian * 0.08) * 1000 * 30 },
      { code: 'DKEB_H', name: 'Denda KEB Harian', ratePerHari: 1000, count: Math.round(countHarian * 0.08), subtotalPerHari: Math.round(countHarian * 0.08) * 1000, subtotalProyeksi30Hari: Math.round(countHarian * 0.08) * 1000 * 30 },
      { code: 'JAMAL_H', name: 'Jaga Malam Harian', ratePerHari: 1500, count: countHarian, subtotalPerHari: countHarian * 1500, subtotalProyeksi30Hari: countHarian * 1500 * 30 }
    ];

    const totalBulananRp = bulananItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalHarianPerHariRp = harianItems.reduce((sum, item) => sum + item.subtotalPerHari, 0);
    const totalHarianProyeksi30HariRp = harianItems.reduce((sum, item) => sum + item.subtotalProyeksi30Hari, 0);

    return {
      totals,
      totalBuka,
      countBulanan,
      countHarian,
      bulananItems,
      harianItems,
      totalBulananRp,
      totalHarianPerHariRp,
      totalHarianProyeksi30HariRp,
      grandTotalProyeksiBulananRp: totalBulananRp + totalHarianProyeksi30HariRp
    };
  };

  const filteredBranches = RAW_BRANCHES_DATA.filter(b => branchFilter === 'ALL' || b.branchId === branchFilter).map(branch => {
    const matchingMarkets = branch.markets.filter(m => {
      const matchesMarketGlobal = marketFilter === 'ALL' || m.name === marketFilter;
      const matchesClass = classFilter === 'ALL' || m.kelas === classFilter;
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.kelas.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMarketGlobal && matchesClass && matchesSearch;
    });

    const summary = matchingMarkets.reduce((acc, m) => {
      const t = getMarketTotals(m);
      acc.buka += t.buka;
      acc.tutup += t.tutup;
      acc.cabut += t.cabut;
      acc.total += t.total;
      acc.kioskBuka += m.kiosk.buka; acc.kioskTutup += m.kiosk.tutup;
      acc.tokoBuka += m.toko.buka; acc.tokoTutup += m.toko.tutup;
      acc.standBuka += m.stand.buka; acc.standTutup += m.stand.tutup;
      acc.infBuka += m.informal.buka; acc.infTutup += m.informal.tutup;
      acc.cabutKiosk += m.dicabut.kiosk; acc.cabutSM += m.dicabut.sm; acc.cabutToko += m.dicabut.toko; acc.cabutInf += m.dicabut.inf;
      return acc;
    }, {
      buka: 0, tutup: 0, cabut: 0, total: 0,
      kioskBuka: 0, kioskTutup: 0, tokoBuka: 0, tokoTutup: 0,
      standBuka: 0, standTutup: 0, infBuka: 0, infTutup: 0,
      cabutKiosk: 0, cabutSM: 0, cabutToko: 0, cabutInf: 0
    });

    return { ...branch, markets: matchingMarkets, summary };
  });

  const grandSummary = filteredBranches.reduce((acc, b) => {
    acc.buka += b.summary.buka;
    acc.tutup += b.summary.tutup;
    acc.cabut += b.summary.cabut;
    acc.total += b.summary.total;
    acc.totalMarkets += b.markets.length;
    return acc;
  }, { buka: 0, tutup: 0, cabut: 0, total: 0, totalMarkets: 0 });

  const toggleAccordion = (bId) => {
    setExpandedBranches(prev => ({ ...prev, [bId]: !prev[bId] }));
  };

  return (
    <div className="space-y-5">
      
      {/* HEADER BANNER SINKRONISASI REAL-TIME */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shrink-0">
              <Activity className="w-7 h-7 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white leading-tight">2. Potensi Pasar — Split Detail Bulanan & Harian</h2>
                <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-slate-950 animate-spin" /> Click Row for Detail
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">Klik Baris Pasar Mana Saja untuk Melihat Rincian 7 Mata Anggaran (Bulanan vs Harian 30 Hari)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button onClick={() => alert('✓ Rekapitulasi Modern Data Table Berhasil Di-Export ke Excel (.xlsx)!')} className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        {/* TOP ENTERPRISE KPI METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 font-mono">
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-emerald-200 font-sans font-bold block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> TOTAL UNIT BUKA:
            </span>
            <strong className="text-base sm:text-xl font-black text-emerald-300 block">
              {grandSummary.buka.toLocaleString('id-ID')}
            </strong>
            <span className="text-[9.5px] text-emerald-200 font-sans">{grandSummary.total > 0 ? Math.round((grandSummary.buka / grandSummary.total) * 100) : 0}% Dari Total Unit</span>
          </div>

          <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-amber-200 font-sans font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> TOTAL UNIT TUTUP:
            </span>
            <strong className="text-base sm:text-xl font-black text-amber-300 block">
              {grandSummary.tutup.toLocaleString('id-ID')}
            </strong>
            <span className="text-[9.5px] text-amber-200 font-sans">{grandSummary.total > 0 ? Math.round((grandSummary.tutup / grandSummary.total) * 100) : 0}% Dari Total Unit</span>
          </div>

          <div className="p-3 bg-rose-500/20 border border-rose-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-rose-200 font-sans font-bold block flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-400" /> TOTAL DI CABUT:
            </span>
            <strong className="text-base sm:text-xl font-black text-rose-300 block">
              {grandSummary.cabut.toLocaleString('id-ID')}
            </strong>
            <span className="text-[9.5px] text-rose-200 font-sans">SIPTB Izin Dicabut</span>
          </div>

          <div className="p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-indigo-200 font-sans font-bold block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-300" /> GRAND TOTAL UNIT:
            </span>
            <strong className="text-base sm:text-xl font-black text-white block">
              {grandSummary.total.toLocaleString('id-ID')}
            </strong>
            <span className="text-[9.5px] text-indigo-200 font-sans">{grandSummary.totalMarkets} Pasar Terdata</span>
          </div>
        </div>
      </div>

      {/* ADVANCED SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Cari Nama Pasar (Petisah, Pusat Pasar, Sambu, Marelan, dll)..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Cabang Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-extrabold">
            <span className="text-slate-500 text-[11px]">Cabang:</span>
            <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer">
              <option value="ALL">Semua Cabang (I, II, III)</option>
              <option value="CABANG_I">Cabang I</option>
              <option value="CABANG_II">Cabang II</option>
              <option value="CABANG_III">Cabang III</option>
            </select>
          </div>

          {/* Kelas Pasar Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-extrabold">
            <span className="text-slate-500 text-[11px]">Kelas:</span>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer">
              <option value="ALL">Semua Kelas Pasar</option>
              <option value="I-A">Kelas I-A (Premium)</option>
              <option value="I">Kelas I</option>
              <option value="II">Kelas II</option>
              <option value="III">Kelas III</option>
            </select>
          </div>

          {/* Expand/Collapse All Button */}
          <button 
            onClick={() => {
              const allExpanded = Object.values(expandedBranches).every(v => v);
              setExpandedBranches({ CABANG_I: !allExpanded, CABANG_II: !allExpanded, CABANG_III: !allExpanded });
            }} 
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-slate-200 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{Object.values(expandedBranches).every(v => v) ? 'Tutup Semua' : 'Buka Semua'}</span>
          </button>

        </div>
      </div>

      {/* ACCORDION GROUPING PER CABANG */}
      <div className="space-y-4">
        {filteredBranches.map((branch) => {
          const isExpanded = expandedBranches[branch.branchId];
          const hasMarkets = branch.markets.length > 0;

          if (!hasMarkets) return null;

          return (
            <div key={branch.branchId} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all">
              
              {/* ACCORDION GROUP HEADER BAR */}
              <div 
                onClick={() => toggleAccordion(branch.branchId)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                  branch.branchId === 'CABANG_I' ? 'bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white' :
                  branch.branchId === 'CABANG_II' ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white' :
                  'bg-gradient-to-r from-purple-900 via-slate-900 to-slate-900 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base sm:text-lg text-white">{branch.branchName}</h3>
                      <span className="px-2.5 py-0.5 bg-white/20 text-white font-mono font-bold rounded-full text-xs">
                        {branch.markets.length} Pasar
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Kepala Cabang: {branch.headName}</p>
                  </div>
                </div>

                {/* ACCORDION HEADER SUMMARY BADGES */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Buka: {branch.summary.buka.toLocaleString('id-ID')}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-xl font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Tutup: {branch.summary.tutup.toLocaleString('id-ID')}
                    </span>
                    <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-400/30 rounded-xl font-bold flex items-center gap-1 hidden md:flex">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      Dicabut: {branch.summary.cabut.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-1.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* ACCORDION CONTENT BODY */}
              {isExpanded && (
                <div>
                  
                  {/* --- DESKTOP & TABLET SHADCN ENTERPRISE DATA TABLE --- */}
                  <div className="hidden md:block overflow-x-auto max-h-[600px]">
                    <table className="w-full text-xs text-left border-collapse">
                      
                      {/* STICKY MULTI-ROW HEADER */}
                      <thead className="sticky top-0 z-20 bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider shadow-md">
                        <tr>
                          <th rowSpan="2" className="p-3 text-center w-12 border-b border-r border-slate-800 bg-slate-900">No</th>
                          <th rowSpan="2" className="p-3 border-b border-r border-slate-800 bg-slate-900 min-w-[170px]">Nama Pasar (Klik untuk Detail)</th>
                          <th rowSpan="2" className="p-3 text-center border-b border-r border-slate-800 bg-slate-900 w-20">Kelas</th>
                          <th colSpan="2" className="p-2 text-center border-b border-r border-slate-800 bg-slate-800/90 text-emerald-300 font-extrabold">Kiosk</th>
                          <th colSpan="2" className="p-2 text-center border-b border-r border-slate-800 bg-slate-800/90 text-indigo-300 font-extrabold">Toko</th>
                          <th colSpan="2" className="p-2 text-center border-b border-r border-slate-800 bg-slate-800/90 text-blue-300 font-extrabold">Stand / Meja</th>
                          <th colSpan="2" className="p-2 text-center border-b border-r border-slate-800 bg-slate-800/90 text-amber-300 font-extrabold">Informal</th>
                          <th colSpan="4" className="p-2 text-center border-b border-r border-slate-800 bg-rose-950/80 text-rose-300 font-extrabold">Di Cabut</th>
                          <th rowSpan="2" className="p-3 text-center border-b border-r border-slate-800 bg-slate-900 min-w-[140px]">Mini Sparkline (Buka/Tutup)</th>
                          <th rowSpan="2" className="p-3 text-right border-b border-slate-800 bg-slate-900 font-black min-w-[90px]">Jumlah</th>
                        </tr>
                        <tr className="bg-slate-950 text-slate-300 text-[9.5px]">
                          <th className="p-2 text-center border-b border-r border-slate-800 text-emerald-400 font-extrabold bg-emerald-950/40">Buka</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-amber-400 font-extrabold bg-amber-950/40">Tutup</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-emerald-400 font-extrabold bg-emerald-950/40">Buka</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-amber-400 font-extrabold bg-amber-950/40">Tutup</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-emerald-400 font-extrabold bg-emerald-950/40">Buka</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-amber-400 font-extrabold bg-amber-950/40">Tutup</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-emerald-400 font-extrabold bg-emerald-950/40">Buka</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-amber-400 font-extrabold bg-amber-950/40">Tutup</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-rose-400 bg-rose-950/60">Kiosk</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-rose-400 bg-rose-950/60">S/M</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-rose-400 bg-rose-950/60">Toko</th>
                          <th className="p-2 text-center border-b border-r border-slate-800 text-rose-400 bg-rose-950/60">Inf</th>
                        </tr>
                      </thead>

                      {/* DATA ROWS WITH CLICKABLE MODAL TRIGGER */}
                      <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                        {branch.markets.map((m, idx) => {
                          const t = getMarketTotals(m);
                          return (
                            <tr 
                              key={idx} 
                              onClick={() => setSelectedMarketModal(m)}
                              className="even:bg-slate-50/70 odd:bg-white hover:bg-indigo-50/70 transition-colors cursor-pointer group"
                              title="Klik untuk melihat Rincian Potensi Split Bulanan & Harian"
                            >
                              <td className="p-2.5 text-center font-bold text-slate-500 border-r border-slate-200">{m.no}</td>
                              <td className="p-2.5 font-sans font-black text-slate-900 border-r border-slate-200 group-hover:text-indigo-600 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {m.name}
                                  </span>
                                  {t.syncedCount > 0 && (
                                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-black rounded">
                                      ⚡ {t.syncedCount} Sync
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 text-center border-r border-slate-200">
                                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black border ${
                                  m.kelas === 'I-A' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                  m.kelas === 'I' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' :
                                  m.kelas === 'II' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                                  'bg-slate-100 text-slate-700 border-slate-300'
                                }`}>
                                  {m.kelas}
                                </span>
                              </td>

                              {/* KIOSK */}
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.kiosk.buka > 0 ? 'text-emerald-700 font-extrabold bg-emerald-50/30' : 'text-slate-300'}`}>{m.kiosk.buka > 0 ? m.kiosk.buka.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.kiosk.tutup > 0 ? 'text-amber-700 font-extrabold bg-amber-50/30' : 'text-slate-300'}`}>{m.kiosk.tutup > 0 ? m.kiosk.tutup.toLocaleString('id-ID') : '-'}</td>

                              {/* TOKO */}
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.toko.buka > 0 ? 'text-emerald-700 font-extrabold bg-emerald-50/30' : 'text-slate-300'}`}>{m.toko.buka > 0 ? m.toko.buka.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.toko.tutup > 0 ? 'text-amber-700 font-extrabold bg-amber-50/30' : 'text-slate-300'}`}>{m.toko.tutup > 0 ? m.toko.tutup.toLocaleString('id-ID') : '-'}</td>

                              {/* STAND / MEJA */}
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.stand.buka > 0 ? 'text-emerald-700 font-extrabold bg-emerald-50/30' : 'text-slate-300'}`}>{m.stand.buka > 0 ? m.stand.buka.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.stand.tutup > 0 ? 'text-amber-700 font-extrabold bg-amber-50/30' : 'text-slate-300'}`}>{m.stand.tutup > 0 ? m.stand.tutup.toLocaleString('id-ID') : '-'}</td>

                              {/* INFORMAL */}
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.informal.buka > 0 ? 'text-emerald-700 font-extrabold bg-emerald-50/30' : 'text-slate-300'}`}>{m.informal.buka > 0 ? m.informal.buka.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.informal.tutup > 0 ? 'text-amber-700 font-extrabold bg-amber-50/30' : 'text-slate-300'}`}>{m.informal.tutup > 0 ? m.informal.tutup.toLocaleString('id-ID') : '-'}</td>

                              {/* DI CABUT */}
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.dicabut.kiosk > 0 ? 'text-rose-700 font-extrabold bg-rose-50/40' : 'text-slate-300'}`}>{m.dicabut.kiosk > 0 ? m.dicabut.kiosk.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.dicabut.sm > 0 ? 'text-rose-700 font-extrabold bg-rose-50/40' : 'text-slate-300'}`}>{m.dicabut.sm > 0 ? m.dicabut.sm.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.dicabut.toko > 0 ? 'text-rose-700 font-extrabold bg-rose-50/40' : 'text-slate-300'}`}>{m.dicabut.toko > 0 ? m.dicabut.toko.toLocaleString('id-ID') : '-'}</td>
                              <td className={`p-2.5 text-right border-r border-slate-200 ${m.dicabut.inf > 0 ? 'text-rose-700 font-extrabold bg-rose-50/40' : 'text-slate-300'}`}>{m.dicabut.inf > 0 ? m.dicabut.inf.toLocaleString('id-ID') : '-'}</td>

                              {/* VISUAL MINI SPARKLINE BAR */}
                              <td className="p-2.5 border-r border-slate-200">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono leading-none">
                                    <span className="text-emerald-700 font-bold">{t.pBuka}% Buka</span>
                                    <span className="text-amber-700 font-bold">{t.pTutup}% Tutup</span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex shadow-inner">
                                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${t.pBuka}%` }}></div>
                                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${t.pTutup}%` }}></div>
                                    <div className="bg-rose-500 h-full transition-all" style={{ width: `${t.pCabut}%` }}></div>
                                  </div>
                                </div>
                              </td>

                              {/* JUMLAH */}
                              <td className="p-2.5 text-right font-black text-slate-900 text-xs bg-slate-50/80">
                                {t.total.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>

                      {/* BRANCH TOTAL SUMMARY FOOTER ROW */}
                      <tfoot className="bg-slate-900 text-white font-mono text-xs border-t-2 border-slate-800">
                        <tr>
                          <td colSpan="3" className="p-3 text-left font-black uppercase text-amber-300">
                            Jumlah {branch.branchName} ({branch.markets.length} Pasar)
                          </td>
                          
                          {/* KIOSK */}
                          <td className="p-3 text-right text-emerald-400 font-black">{branch.summary.kioskBuka.toLocaleString('id-ID')}</td>
                          <td className="p-3 text-right text-amber-400 font-black">{branch.summary.kioskTutup.toLocaleString('id-ID')}</td>

                          {/* TOKO */}
                          <td className="p-3 text-right text-emerald-400 font-black">{branch.summary.tokoBuka > 0 ? branch.summary.tokoBuka.toLocaleString('id-ID') : '-'}</td>
                          <td className="p-3 text-right text-amber-400 font-black">{branch.summary.tokoTutup > 0 ? branch.summary.tokoTutup.toLocaleString('id-ID') : '-'}</td>

                          {/* STAND / MEJA */}
                          <td className="p-3 text-right text-emerald-400 font-black">{branch.summary.standBuka.toLocaleString('id-ID')}</td>
                          <td className="p-3 text-right text-amber-400 font-black">{branch.summary.standTutup.toLocaleString('id-ID')}</td>

                          {/* INFORMAL */}
                          <td className="p-3 text-right text-emerald-400 font-black">{branch.summary.infBuka > 0 ? branch.summary.infBuka.toLocaleString('id-ID') : '-'}</td>
                          <td className="p-3 text-right text-amber-400 font-black">{branch.summary.infTutup > 0 ? branch.summary.infTutup.toLocaleString('id-ID') : '-'}</td>

                          {/* DI CABUT */}
                          <td className="p-3 text-right text-rose-400 font-black">{branch.summary.cabutKiosk > 0 ? branch.summary.cabutKiosk.toLocaleString('id-ID') : '-'}</td>
                          <td className="p-3 text-right text-rose-400 font-black">{branch.summary.cabutSM > 0 ? branch.summary.cabutSM.toLocaleString('id-ID') : '-'}</td>
                          <td className="p-3 text-right text-rose-400 font-black">{branch.summary.cabutToko > 0 ? branch.summary.cabutToko.toLocaleString('id-ID') : '-'}</td>
                          <td className="p-3 text-right text-rose-400 font-black">{branch.summary.cabutInf > 0 ? branch.summary.cabutInf.toLocaleString('id-ID') : '-'}</td>

                          <td className="p-3 text-center text-[10px] text-slate-400 font-sans">Total Cabang</td>

                          {/* GRAND TOTAL CABANG */}
                          <td className="p-3 text-right font-black text-emerald-300 text-sm bg-slate-950">
                            {branch.summary.total.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>

                    </table>
                  </div>

                  {/* --- MOBILE APK RESPONSIVE CARD VIEW --- */}
                  <div className="block md:hidden p-3 space-y-3 bg-slate-100">
                    {branch.markets.map((m, idx) => {
                      const t = getMarketTotals(m);
                      return (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-bold text-slate-400">#{m.no}</span>
                                <h4 className="font-extrabold text-sm text-slate-900">{m.name}</h4>
                              </div>
                              <span className={`px-2 py-0.5 rounded font-mono text-[9.5px] font-black inline-block mt-1 ${
                                m.kelas === 'I-A' ? 'bg-amber-100 text-amber-900' :
                                m.kelas === 'I' ? 'bg-indigo-100 text-indigo-900' :
                                m.kelas === 'II' ? 'bg-blue-100 text-blue-900' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                Kelas {m.kelas}
                              </span>
                            </div>

                            <button 
                              onClick={() => setSelectedMarketModal(m)}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md"
                            >
                              <Eye className="w-3.5 h-3.5" /> Detail Potensi
                            </button>
                          </div>

                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-emerald-700 font-bold">Buka: {t.buka}</span>
                              <span className="text-amber-700 font-bold">Tutup: {t.tutup}</span>
                              <span className="text-rose-700 font-bold">Dicabut: {t.cabut}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex shadow-inner">
                              <div className="bg-emerald-500 h-full" style={{ width: `${t.pBuka}%` }}></div>
                              <div className="bg-amber-400 h-full" style={{ width: `${t.pTutup}%` }}></div>
                              <div className="bg-rose-500 h-full" style={{ width: `${t.pCabut}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* --- MODAL DETAIL RINCIAN SPLIT POTENSI BULANAN & HARIAN --- */}
      {selectedMarketModal && (() => {
        const split = calculateMarketPotensiSplit(selectedMarketModal);

        return (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white max-w-4xl w-full p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xl space-y-5 text-xs max-h-[92vh] overflow-y-auto">
              
              {/* 1. HEADER INFORMASI PASAR */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-xl font-black text-slate-900">{selectedMarketModal.name}</h3>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-mono font-black rounded-full text-xs border border-amber-300">
                        Kelas {selectedMarketModal.kelas}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Laporan Rincian Potensi Retribusi Usaha (Split Skema Bulanan vs Harian)</p>
                  </div>
                </div>

                {/* Live Buka Real-Time Counter Badge */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl font-mono text-right">
                    <span className="text-[9.5px] text-emerald-800 font-sans font-bold block">🟢 TOTAL UNIT BUKA (REAL-TIME):</span>
                    <strong className="text-sm font-black text-emerald-700">{split.totalBuka.toLocaleString('id-ID')} Unit Usaha</strong>
                  </div>
                  <button onClick={() => setSelectedMarketModal(null)} className="p-2 text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
                </div>
              </div>

              {/* 2. KARTU RINGKASAN (TWO LARGE SUMMARY CARDS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                
                {/* Kartu 1: Total Potensi Bulanan */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl space-y-2 relative overflow-hidden border border-indigo-700">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-indigo-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-indigo-400" /> TOTAL POTENSI BULANAN:
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 rounded-full font-mono text-[10px] font-bold">
                      {split.countBulanan} Pedagang Bulanan
                    </span>
                  </div>
                  <strong className="text-xl sm:text-2xl font-black text-white block">
                    Rp {split.totalBulananRp.toLocaleString('id-ID')} <span className="text-xs text-indigo-300 font-normal font-sans">/Bulan</span>
                  </strong>
                  <p className="text-[10.5px] text-indigo-200 font-sans">Akumulasi 7 Mata Anggaran Skema Tagihan Bulanan (TB, KEB, LM, LA, JAMAL)</p>
                </div>

                {/* Kartu 2: Total Potensi Harian */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900 text-white shadow-xl space-y-2 relative overflow-hidden border border-emerald-700">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-emerald-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> TOTAL POTENSI HARIAN:
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded-full font-mono text-[10px] font-bold">
                      {split.countHarian} Pedagang Harian
                    </span>
                  </div>
                  <strong className="text-xl sm:text-2xl font-black text-emerald-300 block">
                    Rp {split.totalHarianPerHariRp.toLocaleString('id-ID')} <span className="text-xs text-emerald-200 font-normal font-sans">/Hari</span>
                  </strong>
                  <div className="pt-1.5 border-t border-emerald-800/80 flex justify-between items-center text-[10.5px] font-sans">
                    <span className="text-emerald-200">Proyeksi 30 Hari:</span>
                    <strong className="text-amber-300 font-mono font-black text-xs">
                      Rp {split.totalHarianProyeksi30HariRp.toLocaleString('id-ID')} /Bulan
                    </strong>
                  </div>
                </div>

              </div>

              {/* 3. TABEL RINCIAN 7 MATA ANGGARAN YANG DIPISAH */}
              <div className="space-y-4">
                
                {/* BAGIAN A: SKEMA BULANAN */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h4 className="font-extrabold text-xs text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" /> BAGIAN A: RINCIAN 7 MATA ANGGARAN SKEMA BULANAN ({split.countBulanan} UNIT)
                    </h4>
                    <span className="text-xs font-mono font-black text-indigo-700">Total: Rp {split.totalBulananRp.toLocaleString('id-ID')} /Bulan</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-slate-200 text-slate-800 uppercase text-[9.5px]">
                        <tr>
                          <th className="p-2 w-10 text-center">Kode</th>
                          <th className="p-2">Uraian Mata Anggaran Retribusi</th>
                          <th className="p-2 text-right">Tarif Rate</th>
                          <th className="p-2 text-center">Jumlah Unit</th>
                          <th className="p-2 text-right">Subtotal Potensi Bulanan (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                        {split.bulananItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 text-center font-bold text-indigo-700 bg-indigo-50/50">{item.code}</td>
                            <td className="p-2 font-sans font-bold text-slate-800">{item.name}</td>
                            <td className="p-2 text-right">Rp {item.rate.toLocaleString('id-ID')}</td>
                            <td className="p-2 text-center font-bold text-slate-700">{item.count.toLocaleString('id-ID')} Unit</td>
                            <td className="p-2 text-right font-black text-indigo-900">Rp {item.subtotal.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-indigo-900 text-white font-black text-xs">
                        <tr>
                          <td colSpan="4" className="p-2.5 text-left font-sans">SUBTOTAL POTENSI SKEMA BULANAN</td>
                          <td className="p-2.5 text-right text-emerald-300">Rp {split.totalBulananRp.toLocaleString('id-ID')} /Bulan</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* BAGIAN B: SKEMA HARIAN (PLUS PROYEKSI 30 HARI) */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                    <h4 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" /> BAGIAN B: RINCIAN 7 MATA ANGGARAN SKEMA HARIAN ({split.countHarian} UNIT)
                    </h4>
                    <span className="text-xs font-mono font-black text-emerald-800">
                      Rp {split.totalHarianPerHariRp.toLocaleString('id-ID')} /Hari (Proyeksi 30 Hari: Rp {split.totalHarianProyeksi30HariRp.toLocaleString('id-ID')})
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-emerald-200 text-emerald-950 uppercase text-[9.5px]">
                        <tr>
                          <th className="p-2 w-10 text-center">Kode</th>
                          <th className="p-2">Uraian Mata Anggaran Retribusi Harian</th>
                          <th className="p-2 text-right">Tarif /Hari</th>
                          <th className="p-2 text-center">Jumlah Unit</th>
                          <th className="p-2 text-right">Per Hari (Rp)</th>
                          <th className="p-2 text-right bg-emerald-300 text-emerald-950">Proyeksi 30 Hari (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-200/80 bg-white text-[11px]">
                        {split.harianItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/50">
                            <td className="p-2 text-center font-bold text-emerald-800 bg-emerald-50">{item.code}</td>
                            <td className="p-2 font-sans font-bold text-slate-800">{item.name}</td>
                            <td className="p-2 text-right">Rp {item.ratePerHari.toLocaleString('id-ID')}</td>
                            <td className="p-2 text-center font-bold text-slate-700">{item.count.toLocaleString('id-ID')} Unit</td>
                            <td className="p-2 text-right font-black text-emerald-800">Rp {item.subtotalPerHari.toLocaleString('id-ID')}</td>
                            <td className="p-2 text-right font-black text-emerald-950 bg-emerald-50">Rp {item.subtotalProyeksi30Hari.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-900 text-white font-black text-xs">
                        <tr>
                          <td colSpan="4" className="p-2.5 text-left font-sans">SUBTOTAL POTENSI SKEMA HARIAN</td>
                          <td className="p-2.5 text-right text-emerald-400">Rp {split.totalHarianPerHariRp.toLocaleString('id-ID')} /Hari</td>
                          <td className="p-2.5 text-right text-amber-300 bg-slate-950">Rp {split.totalHarianProyeksi30HariRp.toLocaleString('id-ID')} /30 Hari</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* GRAND TOTAL REKAPITULASI PROYEKSI GABUNGAN */}
                <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-2 font-mono shadow-md">
                  <div>
                    <span className="text-[10px] text-indigo-300 font-sans uppercase font-bold block">GRAND TOTAL PROYEKSI POTENSI BULANAN (BULANAN + HARIAN 30 HARI):</span>
                    <span className="text-xs text-slate-300 font-sans">Kalkulasi Otomatis Berdasarkan Tarif Resmi Perizinan Pasar</span>
                  </div>
                  <strong className="text-lg sm:text-xl font-black text-emerald-300">
                    Rp {split.grandTotalProyeksiBulananRp.toLocaleString('id-ID')} <span className="text-xs font-normal font-sans text-white">/Bulan</span>
                  </strong>
                </div>

              </div>

              {/* 4. TOMBOL AKSI EXPORT */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-[10.5px] text-slate-500 font-sans italic">
                  * Laporan ini ditarik langsung secara real-time dari database Master Pedagang DIPAS Enterprise.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    type="button" 
                    onClick={() => alert(`✓ Laporan Detail Potensi "${selectedMarketModal.name}" Berhasil Di-Export ke Format PDF / Excel Siap Cetak Rapat Direksi!`)} 
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <Download className="w-4 h-4" /> Export PDF / Excel Laporan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedMarketModal(null)} 
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
