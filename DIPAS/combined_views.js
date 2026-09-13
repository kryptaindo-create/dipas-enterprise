

// --- FROM MasterPedagangView.jsx ---

function MasterPedagangView({ marketFilter, tradersData, setTradersData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [billingSchemeFilter, setBillingSchemeFilter] = useState('ALL');
  const [spFilter, setSpFilter] = useState('ALL');
  const [siptbStatusFilter, setSiptbStatusFilter] = useState('ALL');
  const [operasionalFilter, setOperasionalFilter] = useState('ALL'); // ALL, AKTIF, TUTUP, DICABUT
  const [selectedTraderModal, setSelectedTraderModal] = useState(null);
  const [isAddTraderModalOpen, setIsAddTraderModalOpen] = useState(false);
  const [editingTrader, setEditingTrader] = useState(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // BIAYA PERPANJANGAN SIPTB DEFAULT BERVARIASI SESUAI GRADE PASAR
  const DEFAULT_SIPTB_RENEWAL_FEE = {
    'Pasar Pusat Medan': 350000,
    'Pasar Petisah': 350000,
    'Pasar Kemuning': 300000,
    'Pasar Sambas': 300000,
    'Pasar Sukaramai': 300000,
    'Pasar Halat': 300000,
    'Pasar Kampung Lalang': 250000,
    'Pasar Marelan': 250000,
    'Pasar Akik': 250000
  };

  const getSiptbFeeByMarket = (marketName) => {
    return DEFAULT_SIPTB_RENEWAL_FEE[marketName] || 300000;
  };

  const DEFAULT_BUDGET_RATES = {
    BULANAN: {
      TB: { label: 'Tempat Berjualan', amount: 104000 },
      KEB: { label: 'Kebersihan', amount: 50400 },
      LM: { label: 'Listrik Meteran', amount: 90000 },
      LA: { label: 'Listrik Abodemen', amount: 80000 },
      DTB: { label: 'Denda TB', amount: 7000 },
      DKEB: { label: 'Denda Kebersihan', amount: 5000 },
      JAMAL: { label: 'Jaga Malam / Keamanan', amount: 60000 }
    },
    HARIAN: {
      TB: { label: 'Tempat Berjualan Harian', amount: 2000 },
      KEB: { label: 'Kebersihan Harian', amount: 1500 },
      LM: { label: 'Listrik Meteran Harian', amount: 2000 },
      LA: { label: 'Listrik Abodemen Harian', amount: 1500 },
      DTB: { label: 'Denda TB Harian', amount: 1000 },
      DKEB: { label: 'Denda KEB Harian', amount: 1000 },
      JAMAL: { label: 'Jaga Malam Harian', amount: 1500 }
    }
  };

  const getRateAmount = (skema, code, customRatesObj) => {
    if (customRatesObj && customRatesObj[code] !== undefined && customRatesObj[code] !== null && customRatesObj[code] !== '') {
      return Number(customRatesObj[code]);
    }
    const def = DEFAULT_BUDGET_RATES[skema] || DEFAULT_BUDGET_RATES.BULANAN;
    return def[code] ? def[code].amount : 0;
  };

  const calculateTotalRetribusi = (skema, activeCodes = [], customRatesObj = {}) => {
    return activeCodes.reduce((sum, code) => sum + getRateAmount(skema, code, customRatesObj), 0);
  };

  const checkSiptbStatus = (expiryDateStr) => {
    if (!expiryDateStr) return 'AKTIF';
    const today = new Date('2026-08-16');
    const expDate = new Date(expiryDateStr);
    if (isNaN(expDate.getTime())) return 'AKTIF';
    return expDate >= today ? 'AKTIF' : 'MATI';
  };

  const totalSiptbAktif = tradersData.filter(t => checkSiptbStatus(t.siptbEndDate) === 'AKTIF').length;
  const totalSiptbMati = tradersData.filter(t => checkSiptbStatus(t.siptbEndDate) === 'MATI').length;

  const totalOpBuka = tradersData.filter(t => (t.statusOperasional || 'AKTIF') === 'AKTIF').length;
  const totalOpTutup = tradersData.filter(t => t.statusOperasional === 'TUTUP').length;
  const totalOpCabut = tradersData.filter(t => t.statusOperasional === 'DICABUT').length;

  // Form State Tambah Pedagang Baru
  const [newTraderForm, setNewTraderForm] = useState({
    id: `12710${Math.floor(1000 + Math.random() * 9000)}`,
    nik: '1271011608950009',
    name: '',
    phone: '0812-6044-9910',
    market: 'Pasar Pusat Medan',
    stall: 'Blok A No. 12',
    type: 'KIOS',
    jenisJualanCat: 'BUMBU & REMPAH',
    jenisJualanDetail: 'Bumbu Giling Basah, Cabai Merah, Bawang Merah/Putih & Rempah Olahan',
    panjangMeter: 3,
    lebarMeter: 4,
    tanggalPengunjukan: '2026-08-16',
    siptbStartDate: '2026-08-16',
    siptbEndDate: '2027-08-16',
    siptbRenewalFee: 350000,
    statusOperasional: 'AKTIF', // AKTIF | TUTUP | DICABUT
    spCount: 0,
    spStatus: 'Tanpa SP (Patuh)',
    skemaTagihan: 'BULANAN',
    statusTagihan: 'LUNAS (Agt 2026)',
    statusPedagang: 'RAJIN BAYAR',
    statusPembayaran: 'LUNAS',
    budgetItems: ['TB', 'KEB', 'LM', 'LA', 'JAMAL'],
    customRates: { TB: 104000, KEB: 50400, LM: 90000, LA: 80000, DTB: 7000, DKEB: 5000, JAMAL: 60000 }
  });

  const handleAddTraderSubmit = (e) => {
    e.preventDefault();
    if (!newTraderForm.name || !newTraderForm.nik) {
      alert('Mohon isi Nama Lengkap dan NIK KTP Pedagang!');
      return;
    }

    const p = Number(newTraderForm.panjangMeter) || 2;
    const l = Number(newTraderForm.lebarMeter) || 2;
    const statusSiptb = checkSiptbStatus(newTraderForm.siptbEndDate);

    const created = {
      ...newTraderForm,
      stallSize: `${p}m x ${l}m (${p * l} m²)`,
      siptbStatus: statusSiptb,
      marketGrade: newTraderForm.market.includes('Pusat') || newTraderForm.market.includes('Petisah') ? 'GRADE A (PREMIUM)' : 'GRADE B (MENENGAH)'
    };

    setTradersData([created, ...tradersData]);
    setIsAddTraderModalOpen(false);
    
    alert(`✓ Pedagang Baru "${created.name}" Berhasil Ditambahkan!\n⚡ Status Operasional: ${created.statusOperasional} (Otomatis Tersinkron ke Potensi Pasar)`);
  };

  const handleEditTraderSubmit = (e) => {
    e.preventDefault();
    if (!editingTrader) return;
    const p = Number(editingTrader.panjangMeter) || 2;
    const l = Number(editingTrader.lebarMeter) || 2;
    const statusSiptb = checkSiptbStatus(editingTrader.siptbEndDate);

    const updated = {
      ...editingTrader,
      stallSize: `${p}m x ${l}m (${p * l} m²)`,
      siptbStatus: statusSiptb
    };
    setTradersData(tradersData.map(t => t.id === updated.id ? updated : t));
    setEditingTrader(null);
    alert(`✓ Perubahan Data Pedagang ID ${updated.id} (${updated.name}) Berhasil Disimpan!\n⚡ Status Operasional: ${updated.statusOperasional} Tersinkron Real-Time!`);
  };

  const handleStatusOperasionalChange = (traderId, newStatus) => {
    const updated = tradersData.map(t => t.id === traderId ? { ...t, statusOperasional: newStatus } : t);
    setTradersData(updated);
  };

  const updateAddFormRateAmount = (code, value) => {
    setNewTraderForm({
      ...newTraderForm,
      customRates: { ...(newTraderForm.customRates || {}), [code]: Number(value) || 0 }
    });
  };

  const updateEditFormRateAmount = (code, value) => {
    if (!editingTrader) return;
    setEditingTrader({
      ...editingTrader,
      customRates: { ...(editingTrader.customRates || {}), [code]: Number(value) || 0 }
    });
  };

  const toggleBudgetItemInAddForm = (code) => {
    const current = newTraderForm.budgetItems || [];
    const updated = current.includes(code) ? current.filter(c => c !== code) : [...current, code];
    setNewTraderForm({ ...newTraderForm, budgetItems: updated });
  };

  const toggleBudgetItemInEditForm = (code) => {
    if (!editingTrader) return;
    const current = editingTrader.budgetItems || [];
    const updated = current.includes(code) ? current.filter(c => c !== code) : [...current, code];
    setEditingTrader({ ...editingTrader, budgetItems: updated });
  };

  const getSpBadgeClass = (count) => {
    switch (count) {
      case 0: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 1: return 'bg-amber-100 text-amber-900 border-amber-300';
      case 2: return 'bg-orange-100 text-orange-900 border-orange-300 font-black';
      case 3: return 'bg-rose-600 text-white border-rose-700 font-black animate-pulse';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'RAJIN BAYAR': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'KURANG RAJIN': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'TELAT BAYAR': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'BANYAK MENUNGGAK': return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getOperasionalBadge = (opStatus) => {
    switch (opStatus) {
      case 'TUTUP':
        return { label: '🟧 SEMENTARA TUTUP', cls: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'DICABUT':
        return { label: '🔴 IZIN DICABUT', cls: 'bg-rose-600 text-white border-rose-700 animate-pulse font-black' };
      default:
        return { label: '🟢 OPERASIONAL BUKA', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black' };
    }
  };

  const filteredTraders = tradersData.filter(t => {
    const currentStatusSiptb = checkSiptbStatus(t.siptbEndDate);
    const opStatus = t.statusOperasional || 'AKTIF';
    return (marketFilter === 'ALL' || t.market === marketFilter) && 
    (billingSchemeFilter === 'ALL' || t.skemaTagihan === billingSchemeFilter) &&
    (spFilter === 'ALL' || (spFilter === 'TANPA_SP' && t.spCount === 0) || (spFilter === 'SP1' && t.spCount === 1) || (spFilter === 'SP2' && t.spCount === 2) || (spFilter === 'SP3' && t.spCount === 3)) &&
    (siptbStatusFilter === 'ALL' || currentStatusSiptb === siptbStatusFilter) &&
    (operasionalFilter === 'ALL' || opStatus === operasionalFilter) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.id.includes(searchQuery) ||
     t.jenisJualanCat.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.phone.includes(searchQuery));
  });

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white leading-tight">1. Master Data Pedagang</h2>
                <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 rounded-full font-mono text-[9.5px] font-black uppercase flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-950" /> Sync Real-Time Active
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">Status Operasional Pedagang Otomatis Menyerap ke Dashboard Potensi Pasar</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            {/* UPLOAD DATA PEMBAYARAN PEDAGANG BUTTON */}
            <button 
              onClick={() => setIsBankModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 hover:scale-105 transition-all cursor-pointer border border-amber-300 shrink-0"
              title="Upload Berkas Pembayaran / Rekap Setoran Bank Pedagang"
            >
              <span className="text-sm">📂</span>
              <span>Upload Data Pembayaran Pedagang</span>
            </button>

            <button 
              onClick={() => setIsAddTraderModalOpen(true)}
              className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl transition shrink-0 group"
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
              <span>+ Tambah Pedagang Baru</span>
            </button>
          </div>
        </div>

        {/* STATISTIK COUNTER STATUS OPERASIONAL (TRIGGER SINKRONISASI) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10 font-mono">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center gap-2">
            <div className="p-2 bg-emerald-500 text-white rounded-xl font-black">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-emerald-200 font-sans font-bold block">OPERASIONAL BUKA:</span>
              <strong className="text-sm font-black text-emerald-300 font-mono">{totalOpBuka} Pedagang</strong>
            </div>
          </div>

          <div className="p-2.5 bg-amber-500/20 border border-amber-400/30 rounded-2xl flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-xl font-black">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-amber-200 font-sans font-bold block">SEMENTARA TUTUP:</span>
              <strong className="text-sm font-black text-amber-300 font-mono">{totalOpTutup} Pedagang</strong>
            </div>
          </div>

          <div className="p-2.5 bg-rose-500/20 border border-rose-400/30 rounded-2xl flex items-center gap-2">
            <div className="p-2 bg-rose-600 text-white rounded-xl font-black">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-rose-200 font-sans font-bold block">IZIN DICABUT:</span>
              <strong className="text-sm font-black text-rose-300 font-mono">{totalOpCabut} Pedagang</strong>
            </div>
          </div>

          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl flex items-center gap-2">
            <div className="p-2 bg-indigo-500 text-white rounded-xl font-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-indigo-200 font-sans font-bold block">SIPTB AKTIF:</span>
              <strong className="text-sm font-black text-indigo-200 font-mono">{totalSiptbAktif} / {tradersData.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER SEARCH BAR & FILTER STATUS OPERASIONAL */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input type="text" placeholder="Cari ID Numerik / Nama / No Kiosk / Jenis Jualan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 shadow-sm" />
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm shrink-0 gap-1 overflow-x-auto">
          <button onClick={() => setOperasionalFilter('ALL')} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition ${operasionalFilter === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>Semua Status</button>
          <button onClick={() => setOperasionalFilter('AKTIF')} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition ${operasionalFilter === 'AKTIF' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>Buka ({totalOpBuka})</button>
          <button onClick={() => setOperasionalFilter('TUTUP')} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition ${operasionalFilter === 'TUTUP' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>Tutup ({totalOpTutup})</button>
          <button onClick={() => setOperasionalFilter('DICABUT')} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition ${operasionalFilter === 'DICABUT' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>Dicabut ({totalOpCabut})</button>
        </div>
      </div>

      {/* LIST KARTU PEDAGANG WITH REAL-TIME OPERATIONAL TRIGGER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTraders.map((t) => {
          const totalNominal = calculateTotalRetribusi(t.skemaTagihan, t.budgetItems, t.customRates);
          const currentDefaultRates = DEFAULT_BUDGET_RATES[t.skemaTagihan] || DEFAULT_BUDGET_RATES.BULANAN;
          const statusSiptbObj = checkSiptbStatus(t.siptbEndDate);
          const renewalFeeAmount = t.siptbRenewalFee || getSiptbFeeByMarket(t.market);
          const opBadge = getOperasionalBadge(t.statusOperasional || 'AKTIF');

          return (
            <div key={t.id} className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
              
              <div className="space-y-2.5">
                
                {/* 1. HEADER KARTU */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                      {t.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">{t.name}</h3>
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-mono text-[10px] font-black shadow-sm inline-block mt-0.5">
                        ID: {t.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-extrabold border ${getStatusBadgeClass(t.statusPedagang)}`}>
                      {t.statusPedagang}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black border flex items-center gap-0.5 ${getSpBadgeClass(t.spCount)}`}>
                      <AlertTriangle className="w-2.5 h-2.5 shrink-0" /> {t.spCount === 0 ? '0x SP' : `${t.spCount}x SP`}
                    </span>
                  </div>
                </div>

                {/* VISUAL STATUS OPERASIONAL (TRIGGER SINKRONISASI REAL-TIME) */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-inner">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-extrabold text-slate-700 font-sans">Status Operasional:</span>
                  </div>
                  <select 
                    value={t.statusOperasional || 'AKTIF'}
                    onChange={(e) => handleStatusOperasionalChange(t.id, e.target.value)}
                    className={`px-2 py-1 rounded-xl text-[10px] font-mono font-black border cursor-pointer focus:outline-none transition ${opBadge.cls}`}
                  >
                    <option value="AKTIF" className="bg-white text-emerald-800">🟢 BUKA (OPERASIONAL)</option>
                    <option value="TUTUP" className="bg-white text-amber-800">🟧 TUTUP (SEMENTARA)</option>
                    <option value="DICABUT" className="bg-white text-rose-800">🔴 DICABUT (IZIN)</option>
                  </select>
                </div>

                {/* 2. LOKASI PASAR & WA */}
                <div className="p-2.5 bg-slate-900 text-white rounded-2xl space-y-1 text-xs font-mono shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-extrabold text-emerald-400 flex items-center gap-1"><Store className="w-3.5 h-3.5" /> {t.market}</span>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded-full font-black text-[9px]">{t.marketGrade || 'GRADE A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-sans">No WA:</span>
                    <strong className="text-emerald-400 font-mono font-black">{t.phone}</strong>
                  </div>
                </div>

                {/* 3. RINCIAN NO KIOSK & UKURAN */}
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-bold uppercase block">📍 No Kiosk & Jenis</span>
                    <strong className="font-black text-indigo-700 text-[10px] block">{t.stall} ({t.type})</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-bold uppercase block">📐 Ukuran P x L</span>
                    <strong className="font-black text-indigo-700 font-mono text-[10px] block">{t.stallSize}</strong>
                  </div>
                </div>

                {/* 4. RINCIAN JENIS JUALAN */}
                <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-0.5">
                  <span className="text-[9px] text-emerald-900 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-emerald-600" /> Jenis Jualan Pedagang:
                  </span>
                  <strong className="text-emerald-950 font-black text-[11px] block">{t.jenisJualanCat}</strong>
                  <p className="text-[10px] text-slate-600 leading-snug">{t.jenisJualanDetail}</p>
                </div>

                {/* 5. FITUR TANGGAL & BIAYA PERPANJANGAN SIPTB PER TAHUN */}
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[8.5px] text-amber-900 font-sans font-extrabold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" /> Tgl Pengunjukan:
                    </span>
                    <strong className="text-amber-950 text-[10px] block font-black">{t.tanggalPengunjukan}</strong>
                  </div>

                  <div className={`p-2 rounded-xl border space-y-0.5 ${
                    statusSiptbObj === 'AKTIF' ? 'bg-blue-50 border-blue-200' : 'bg-rose-50 border-rose-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[8.5px] text-slate-600 font-sans font-extrabold flex items-center gap-0.5">
                        <CalendarDays className="w-3 h-3 text-indigo-600" /> Masa SIPTB:
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-black ${
                        statusSiptbObj === 'AKTIF' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                      }`}>
                        {statusSiptbObj === 'AKTIF' ? 'AKTIF' : 'KADALUARSA'}
                      </span>
                    </div>
                    <strong className="text-slate-900 text-[9.5px] block font-black leading-tight">
                      {t.siptbStartDate} s/d {t.siptbEndDate}
                    </strong>
                  </div>
                </div>

                {/* HIGHLIGHT RINCIAN BIAYA PERPANJANGAN SIPTB BERVARIASI */}
                <div className="p-2.5 bg-indigo-50/90 rounded-2xl border border-indigo-200 flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[8.5px] text-indigo-900 font-sans font-extrabold uppercase block flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-indigo-600" /> Biaya Perpanjangan SIPTB:
                    </span>
                    <span className="text-[9.5px] text-slate-500 font-sans font-medium">Berlaku 1 Tahun</span>
                  </div>
                  <strong className="text-xs sm:text-sm font-black text-indigo-800 font-mono">
                    Rp {Number(renewalFeeAmount).toLocaleString('id-ID')} <span className="text-[9px] font-sans">/Thn</span>
                  </strong>
                </div>

                {/* 6. TABEL RINCIAN 7 KODE MATA ANGGARAN & TOTAL NOMINAL RETRIBUSI */}
                <div className={`p-2.5 rounded-2xl border space-y-1.5 ${
                  t.skemaTagihan === 'HARIAN' ? 'bg-emerald-50/90 border-emerald-300' : 'bg-blue-50/90 border-blue-300'
                }`}>
                  <div className="flex justify-between items-center border-b border-slate-200/80 pb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-900">
                      {t.skemaTagihan === 'HARIAN' ? '☀️ RINCIAN 7 ANGGARAN HARIAN' : '📅 RINCIAN 7 ANGGARAN BULANAN'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-black uppercase text-white ${
                      t.skemaTagihan === 'HARIAN' ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}>
                      {t.skemaTagihan}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-[9.5px] font-mono">
                    {Object.keys(currentDefaultRates).map((code) => {
                      const isApplied = (t.budgetItems || []).includes(code);
                      const amount = getRateAmount(t.skemaTagihan, code, t.customRates);
                      const label = currentDefaultRates[code].label;

                      return (
                        <div key={code} className={`flex justify-between items-center ${isApplied ? 'text-slate-900 font-bold' : 'text-slate-400 line-through opacity-50'}`}>
                          <span>{code} ({label}):</span>
                          <span className="font-mono">Rp {amount.toLocaleString('id-ID')}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-1.5 border-t border-slate-300/80 flex justify-between items-center font-mono">
                    <div>
                      <span className="text-[8px] text-slate-500 font-extrabold uppercase font-sans block">TOTAL NOMINAL RETRIBUSI:</span>
                      <span className="text-[9px] font-bold text-slate-700">{t.statusTagihan}</span>
                    </div>
                    <strong className={`text-xs sm:text-sm font-black ${t.skemaTagihan === 'HARIAN' ? 'text-emerald-700' : 'text-blue-700'}`}>
                      Rp {totalNominal.toLocaleString('id-ID')} <span className="text-[8.5px] font-sans">/{t.skemaTagihan === 'HARIAN' ? 'Hari' : 'Bulan'}</span>
                    </strong>
                  </div>
                </div>

              </div>

              {/* 7. DUA TOMBOL AKSI */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 mt-2">
                <button onClick={() => setSelectedTraderModal(t)} className="w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 border border-indigo-200 transition"><Eye className="w-3.5 h-3.5" /> Profil</button>
                <button onClick={() => setEditingTrader({...t})} className="w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-md transition"><Edit3 className="w-3.5 h-3.5" /> Edit Pedagang</button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL FITUR + TAMBAH PEDAGANG BARU */}
      {isAddTraderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleAddTraderSubmit} className="bg-white max-w-xl w-full p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-3.5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" /> Form Tambah Pedagang Baru
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">Input Status Operasional (Buka / Tutup / Dicabut) untuk Auto-Sync!</p>
              </div>
              <button type="button" onClick={() => setIsAddTraderModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Tutup</button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NO ID Pedagang (Numerik):</label>
                  <input type="text" required value={newTraderForm.id} onChange={(e) => setNewTraderForm({...newTraderForm, id: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-black text-indigo-700 bg-indigo-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK KTP (16 Digit):</label>
                  <input type="text" required value={newTraderForm.nik} onChange={(e) => setNewTraderForm({...newTraderForm, nik: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Pedagang:</label>
                  <input type="text" required placeholder="Contoh: Bapak Ahmad Fauzi" value={newTraderForm.name} onChange={(e) => setNewTraderForm({...newTraderForm, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Operasional Kiosk:</label>
                  <select 
                    value={newTraderForm.statusOperasional || 'AKTIF'} 
                    onChange={(e) => setNewTraderForm({...newTraderForm, statusOperasional: e.target.value})} 
                    className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-xs font-mono font-black text-slate-900 bg-emerald-50"
                  >
                    <option value="AKTIF">🟢 BUKA (OPERASIONAL)</option>
                    <option value="TUTUP">🟧 TUTUP (SEMENTARA)</option>
                    <option value="DICABUT">🔴 DICABUT (IZIN SIPTB)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Pasar Tradisional:</label>
                  <select 
                    value={newTraderForm.market} 
                    onChange={(e) => {
                      const m = e.target.value;
                      const fee = getSiptbFeeByMarket(m);
                      setNewTraderForm({...newTraderForm, market: m, siptbRenewalFee: fee});
                    }} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Pasar Pusat Medan">Pasar Pusat Medan (Grade A)</option>
                    <option value="Pasar Petisah">Pasar Petisah (Grade A)</option>
                    <option value="Pasar Kemuning">Pasar Kemuning (Grade B)</option>
                    <option value="Pasar Sambas">Pasar Sambas (Grade B)</option>
                    <option value="Pasar Sukaramai">Pasar Sukaramai (Grade B)</option>
                    <option value="Pasar Kampung Lalang">Pasar Kampung Lalang (Grade C)</option>
                    <option value="Pasar Marelan">Pasar Marelan (Grade C)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No WhatsApp / HP:</label>
                  <input type="text" required value={newTraderForm.phone} onChange={(e) => setNewTraderForm({...newTraderForm, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">🛍️ Jenis Jualan Pedagang:</label>
                <input type="text" required placeholder="Contoh: BUMBU & REMPAH" value={newTraderForm.jenisJualanCat} onChange={(e) => setNewTraderForm({...newTraderForm, jenisJualanCat: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-900" />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsAddTraderModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg flex items-center gap-1.5"><Save className="w-4 h-4" /> Simpan & Daftarkan Pedagang Baru</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL EDIT PEDAGANG */}
      {editingTrader && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleEditTraderSubmit} className="bg-white max-w-xl w-full p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-3 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5"><Edit3 className="w-4 h-4 text-indigo-600" /> Edit Status Operasional & Data Pedagang</h3>
                <p className="text-[10.5px] text-slate-500 font-mono">ID: {editingTrader.id} • {editingTrader.name}</p>
              </div>
              <button type="button" onClick={() => setEditingTrader(null)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-2.5 font-sans">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Pedagang:</label>
                  <input type="text" required value={editingTrader.name} onChange={(e) => setEditingTrader({...editingTrader, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Operasional Kiosk:</label>
                  <select 
                    value={editingTrader.statusOperasional || 'AKTIF'} 
                    onChange={(e) => setEditingTrader({...editingTrader, statusOperasional: e.target.value})} 
                    className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-xs font-mono font-black text-slate-900 bg-emerald-50"
                  >
                    <option value="AKTIF">🟢 BUKA (OPERASIONAL)</option>
                    <option value="TUTUP">🟧 TUTUP (SEMENTARA)</option>
                    <option value="DICABUT">🔴 DICABUT (IZIN SIPTB)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button type="button" onClick={() => setEditingTrader(null)} className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Batal</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-md flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Simpan Semua Perubahan</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: UPLOAD DATA PEMBAYARAN PEDAGANG (REKAP BANK INGESTION) */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 text-white text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 rounded-xl text-slate-950 font-black">
                  <span>📂</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Upload Data Pembayaran Pedagang</h3>
                  <p className="text-xs text-slate-400">Pencocokan Setoran Bank Mitra & Update Status Lunas Real-Time</p>
                </div>
              </div>
              <button onClick={() => setIsBankModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 block text-xs">📄 Template Kolom Standar Setoran Bank</span>
                  <span className="text-[11px] text-slate-400 block">NIP_ID_PEDAGANG, NAMA_PEDAGANG, NOMINAL_SETORAN, TANGGAL_BAYAR, BANK_MITRA, NO_REF</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const csvContent = `NIP_ID_PEDAGANG,NAMA_PEDAGANG,NOMINAL_SETORAN,TANGGAL_BAYAR,BANK_MITRA,NO_REF\n127102003,Bapak Herman Sitorus,350000,19/08/2026,Bank Sumut QRIS,REF-SUMUT-20260819-001\n127103004,Sdr. Supriadi Lubis,300000,19/08/2026,Bank Sumut QRIS,REF-SUMUT-20260819-002`;
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'DIPAS_Template_Pembayaran_Pedagang.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition"
                >
                  Download Template CSV
                </button>
              </div>

              {/* Real HTML Input File */}
              <input 
                type="file" 
                id="master-bank-file" 
                accept=".csv, .xlsx, .pdf, .txt" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadedFile(file);
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    const text = evt.target.result || '';
                    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
                    const rows = [];
                    lines.forEach((line, idx) => {
                      if (idx === 0 && (line.toLowerCase().includes('nip') || line.toLowerCase().includes('id'))) return;
                      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
                      if (parts[0]) {
                        rows.push({
                          id: parts[0],
                          name: parts[1] || `Pedagang ${parts[0]}`,
                          nominal: parseInt(parts[2]?.replace(/[^0-9]/g, '')) || 350000,
                          date: parts[3] || '19/08/2026',
                          bank: 'Bank Sumut QRIS',
                          ref: parts[5] || `REF-${Math.floor(100000 + Math.random() * 900000)}`
                        });
                      }
                    });
                    setUploadedFileRows(rows.length > 0 ? rows : [
                      { id: '127102003', name: 'Bapak Herman Sitorus', nominal: 350000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-001' },
                      { id: '127103004', name: 'Sdr. Supriadi Lubis', nominal: 300000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-002' },
                      { id: '127101001', name: 'H. Syamsul Bahri', nominal: 350000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-003' },
                      { id: '127109999', name: 'Pedagang Tidak Ditemukan', nominal: 150000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-004' }
                    ]);
                  };
                  reader.readAsText(file);
                }} 
                className="hidden" 
              />

              <div 
                onClick={() => document.getElementById('master-bank-file')?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950/60 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto text-lg font-bold">📂</div>
                <div className="space-y-0.5">
                  <span className="font-bold text-white text-xs block">Klik atau Seret Berkas Pembayaran Pedagang (.csv, .xlsx, .pdf) Di Sini</span>
                  <span className="text-[10.5px] text-slate-400 block">Sistem otomatis membaca baris demi baris & mencocokkan ID pedagang</span>
                </div>
                {uploadedFile ? (
                  <div className="p-2 bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-[11px] inline-block rounded-xl">
                    📄 Berkas Terpilih: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 text-amber-300 rounded-full text-[10px] font-mono border border-slate-700 inline-block">
                    Pilih Berkas Dari Komputer Anda
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!setTradersData) return;
                  const records = uploadedFileRows.length > 0 ? uploadedFileRows : [
                    { id: '127102003', name: 'Bapak Herman Sitorus', nominal: 350000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-001' },
                    { id: '127103004', name: 'Sdr. Supriadi Lubis', nominal: 300000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-002' },
                    { id: '127101001', name: 'H. Syamsul Bahri', nominal: 350000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-003' },
                    { id: '127109999', name: 'Pedagang Tidak Ditemukan', nominal: 150000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-004' }
                  ];

                  let matchCount = 0;
                  let failCount = 0;
                  let totalRp = 0;

                  const updated = tradersData.map(t => {
                    const match = records.find(r => r.id === t.id || r.id === t.nik);
                    if (match) {
                      matchCount++;
                      totalRp += match.nominal;
                      return {
                        ...t,
                        statusPembayaran: 'LUNAS',
                        statusTagihan: 'LUNAS (Upload Rekap)',
                        statusPedagang: 'RAJIN BAYAR',
                        trxNumber: match.ref,
                        tanggalBayar: '19 Agustus 2026 - 15:40 WIB',
                        metodeBayar: match.bank
                      };
                    }
                    return t;
                  });

                  records.forEach(r => {
                    const found = tradersData.some(t => t.id === r.id || t.nik === r.id);
                    if (!found) failCount++;
                  });

                  setTradersData(updated);
                  setIsBankModalOpen(false);
                  alert(`⚡ PROSES INGESTION UPLOAD DATA PEMBAYARAN SELESAI!\n\n✅ Data Berhasil Terverifikasi (Lunas): ${matchCount} Pedagang\n❌ Data Gagal / Tidak Ditemukan ID: ${failCount} Records\n💵 Total Setoran Uang Masuk: Rp ${totalRp.toLocaleString('id-ID')}\n\nTabel Master Pedagang & Realisasi Pendapatan telah diperbarui secara otomatis!`);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-400/30 transition flex items-center gap-1.5"
              >
                <span>⚡ Proses & Validasi Data Pembayaran</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



// --- FROM PotensiPasarView.jsx ---

function PotensiPasarView({ marketFilter, tradersData = [] }) {
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


// --- FROM TargetRealisasiView.jsx ---

function TargetRealisasiView({ marketFilter, tradersData = [] }) {
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


// --- FROM SiptbView.jsx ---

function SiptbView({ marketFilter, tradersData = [], setTradersData }) {
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


// --- FROM LaporanPembayaranView.jsx ---

function LaporanPembayaranView({ 
  marketFilter, 
  tradersData = [], 
  setTradersData,
  recordAuditLog,
  currentUser
}) {
  const [localMarketFilter, setLocalMarketFilter] = useState('ALL');
  
  // 1. TIME SWITCHER STATES
  const [dateModeFilter, setDateModeFilter] = useState('PER_BULAN'); // 'PER_HARI' | 'PER_BULAN' | 'CUSTOM_RANGE'
  
  // State untuk Mode Per-Hari (Specific Date Picker)
  const [selectedDayDate, setSelectedDayDate] = useState('2026-08-17');
  
  // State untuk Mode Per-Bulan (Month & Year Selector)
  const [selectedMonth, setSelectedMonth] = useState('08'); // Agustus
  const [selectedYear, setSelectedYear] = useState('2026');
  
  // State untuk Mode Custom Rentang Tanggal (Start & End Date Pickers)
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-25');

  // Tab State
  const [activeTab, setActiveTab] = useState('LUNAS'); // 'LUNAS' | 'TUNGGAKAN'
  const [searchQuery, setSearchQuery] = useState('');
  const [sentBillTriggers, setSentBillTriggers] = useState({});

  // --- BANK RECAP UPLOAD & RECONCILIATION STATES ---
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedBankMitra, setSelectedBankMitra] = useState('Bank Sumut QRIS / VA');
  const [selectedPresetSample, setSelectedPresetSample] = useState('sample_sumut_batch1');
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationResult, setReconciliationResult] = useState(null);

  const activeMarket = localMarketFilter !== 'ALL' ? localMarketFilter : marketFilter;
  const relevantTraders = tradersData.filter(t => activeMarket === 'ALL' || t.market === activeMarket);

  // Helper Retribusi Nominal
  const calculateTraderNominal = (t) => {
    if (t.skemaTagihan === 'HARIAN') {
      return (t.budgetItems || []).reduce((sum, code) => {
        const rates = { TB: 2000, KEB: 1500, LM: 2000, LA: 1500, DTB: 1000, DKEB: 1000, JAMAL: 1500 };
        return sum + (rates[code] || 1500);
      }, 0);
    }
    return (t.budgetItems || []).reduce((sum, code) => {
      const rates = { TB: 104000, KEB: 50400, LM: 90000, LA: 80000, DTB: 7000, DKEB: 5000, JAMAL: 60000 };
      return sum + (rates[code] || 50000);
    }, 0);
  };

  const lunasTradersList = relevantTraders.filter(t => t.statusPembayaran === 'LUNAS' || t.statusTagihan.includes('LUNAS'));
  const tunggakanTradersList = relevantTraders.filter(t => t.statusPembayaran === 'BELUM BAYAR' || t.statusTagihan.includes('MENUNGGAK'));

  // 3. SINKRONISASI REALISASI & TARGET BERDASARKAN RENTANG WAKTU YANG DIPILIH
  let modeMultiplier = 1;
  let periodLabelText = 'Bulan Agustus 2026';
  let dateRangeDays = 30;

  if (dateModeFilter === 'PER_HARI') {
    modeMultiplier = 1 / 30;
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dayFormatted = new Date(selectedDayDate).toLocaleDateString('id-ID', options);
    periodLabelText = `Harian (${dayFormatted})`;
    dateRangeDays = 1;
  } else if (dateModeFilter === 'PER_BULAN') {
    modeMultiplier = 1;
    const monthNames = { '01':'Januari','02':'Februari','03':'Maret','04':'April','05':'Mei','06':'Juni','07':'Juli','08':'Agustus','09':'September','10':'Oktober','11':'November','12':'Desember' };
    periodLabelText = `Rekapitulasi Bulan ${monthNames[selectedMonth]} ${selectedYear}`;
    dateRangeDays = 30;
  } else if (dateModeFilter === 'CUSTOM_RANGE') {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    dateRangeDays = diffDays;
    modeMultiplier = diffDays / 30;
    periodLabelText = `Rentang Tanggal Custom: ${startDate} s/d ${endDate} (${diffDays} Hari)`;
  }

  // AUDIT FINANCIAL METRICS (SINKRON REAL-TIME)
  const baseMonthlyTargetAllMarkets = activeMarket === 'ALL' ? 485000000 : (relevantTraders.length * 150000);
  const totalTargetRp = Math.round(baseMonthlyTargetAllMarkets * modeMultiplier);

  const totalLunasRp = lunasTradersList.reduce((sum, t) => sum + calculateTraderNominal(t), 0);
  const totalTunggakanRp = tunggakanTradersList.reduce((sum, t) => sum + calculateTraderNominal(t), 0);

  const totalRealisasiRp = Math.round(totalLunasRp * (dateModeFilter === 'PER_HARI' ? 1 : Math.min(1, modeMultiplier * 1.1)));
  const kpiAuditPct = totalTargetRp > 0 ? Math.min(100, Math.round((totalRealisasiRp / totalTargetRp) * 100)) : 0;

  // --- BANK RECAP SAMPLE DATASETS ---
  const SAMPLE_BANK_RECAPS = {
    sample_sumut_batch1: [
      { id: '127102003', name: 'Bapak Herman Sitorus', nominal: 350000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-001' },
      { id: '127103004', name: 'Sdr. Supriadi Lubis', nominal: 300000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-002' },
      { id: '127101001', name: 'H. Syamsul Bahri', nominal: 350000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-003' },
      { id: '127109999', name: 'Pedagang Tidak Ditemukan', nominal: 150000, date: '19/08/2026', bank: 'Bank Sumut QRIS', ref: 'REF-SUMUT-20260819-004' }
    ],
    sample_mandiri_va: [
      { id: '127104005', name: 'Ibu Maryam Harahap', nominal: 300000, date: '19/08/2026', bank: 'Bank Mandiri VA', ref: 'REF-MDR-20260819-101' },
      { id: '127101002', name: 'Hj. Ratna Juwita', nominal: 350000, date: '19/08/2026', bank: 'Bank Mandiri VA', ref: 'REF-MDR-20260819-102' },
      { id: '888888888', name: 'ID Kode Salah', nominal: 200000, date: '19/08/2026', bank: 'Bank Mandiri VA', ref: 'REF-MDR-20260819-103' }
    ]
  };

  // Handler Download Template CSV
  const handleDownloadBankTemplateCSV = () => {
    const csvContent = `NIP_ID_PEDAGANG,NAMA_PEDAGANG,NOMINAL_SETORAN,TANGGAL_BAYAR,BANK_MITRA,NOMOR_REF_BANK\n127102003,Bapak Herman Sitorus,350000,19/08/2026,Bank Sumut QRIS,REF-SUMUT-20260819-001\n127103004,Sdr. Supriadi Lubis,300000,19/08/2026,Bank Sumut QRIS,REF-SUMUT-20260819-002\n127101001,H. Syamsul Bahri,350000,19/08/2026,Bank Sumut QRIS,REF-SUMUT-20260819-003`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DIPAS_Template_Rekap_Setoran_Bank.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- REAL FILE UPLOAD STATES ---
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileRows, setUploadedFileRows] = useState([]);

  // FileReader Handler for Real File Ingestion
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result || '';
      const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      const parsedRows = [];

      lines.forEach((line, idx) => {
        // Skip CSV header
        if (idx === 0 && (line.toLowerCase().includes('nip') || line.toLowerCase().includes('id_pedagang') || line.toLowerCase().includes('nama'))) {
          return;
        }
        const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 1) {
          const id = parts[0];
          const name = parts[1] || `Pedagang ${id}`;
          const nominal = parseInt(parts[2]?.replace(/[^0-9]/g, '')) || 350000;
          const date = parts[3] || '19/08/2026';
          const bank = parts[4] || selectedBankMitra;
          const ref = parts[5] || `REF-FILE-${Math.floor(100000 + Math.random() * 900000)}`;

          if (id && id.length > 3) {
            parsedRows.push({ id, name, nominal, date, bank, ref });
          }
        }
      });

      if (parsedRows.length > 0) {
        setUploadedFileRows(parsedRows);
      } else {
        // Extract trader IDs from file text
        const foundIds = content.match(/\b1271\d{5}\b/g) || ['127102003', '127103004'];
        const extracted = foundIds.map((id, index) => ({
          id,
          name: `Pedagang (${id})`,
          nominal: 350000,
          date: '19/08/2026',
          bank: selectedBankMitra,
          ref: `REF-FILE-${index + 101}`
        }));
        setUploadedFileRows(extracted);
      }
    };

    reader.readAsText(file);
  };

  // Handler Process Bank Reconciliation
  const handleExecuteBankReconciliation = () => {
    if (!setTradersData) return;
    setIsReconciling(true);

    setTimeout(() => {
      const recordsToProcess = (uploadedFileRows.length > 0) 
        ? uploadedFileRows 
        : (SAMPLE_BANK_RECAPS[selectedPresetSample] || SAMPLE_BANK_RECAPS['sample_sumut_batch1']);

      const matchedList = [];
      const unmatchedList = [];
      let totalNominalMatched = 0;


      const updatedTraders = tradersData.map(trader => {
        const foundBankRecord = recordsToProcess.find(rec => rec.id === trader.id || rec.id === trader.nik);
        if (foundBankRecord) {
          matchedList.push({
            traderId: trader.id,
            traderName: trader.name,
            market: trader.market,
            oldStatus: trader.statusPembayaran,
            newStatus: 'LUNAS',
            nominal: foundBankRecord.nominal,
            refNo: foundBankRecord.ref,
            bank: foundBankRecord.bank
          });
          totalNominalMatched += foundBankRecord.nominal;

          return {
            ...trader,
            statusPembayaran: 'LUNAS',
            statusTagihan: 'LUNAS (Rekap Bank)',
            statusPedagang: 'RAJIN BAYAR',
            trxNumber: foundBankRecord.ref,
            tanggalBayar: `${foundBankRecord.date} - 15:40 WIB`,
            metodeBayar: `${foundBankRecord.bank} (Automated Ingestion)`
          };
        }
        return trader;
      });

      // Find unmatched records in bank file
      recordsToProcess.forEach(rec => {
        const exists = tradersData.some(t => t.id === rec.id || t.nik === rec.id);
        if (!exists) {
          unmatchedList.push({
            traderId: rec.id,
            traderName: rec.name,
            nominal: rec.nominal,
            reason: `ID Pedagang '${rec.id}' tidak terdaftar di database DIPAS.`
          });
        }
      });

      setTradersData(updatedTraders);

      const summaryResult = {
        totalParsed: recordsToProcess.length,
        matchedCount: matchedList.length,
        unmatchedCount: unmatchedList.length,
        totalNominal: totalNominalMatched,
        matchedList,
        unmatchedList
      };

      setReconciliationResult(summaryResult);
      setIsReconciling(false);

      // Record Audit Log
      if (recordAuditLog) {
        recordAuditLog(
          currentUser,
          currentUser?.division || 'Bagian Keuangan',
          'Database Pembayaran',
          'RECONCILIATION_BANK',
          activeMarket === 'ALL' ? 'Semua Pasar Tradisional' : activeMarket,
          `Ingestion File Rekap Setoran Bank (${selectedBankMitra}): ${matchedList.length} Pedagang Otomatis Lunas, Nominal Rp ${totalNominalMatched.toLocaleString('id-ID')}`,
          { totalRows: recordsToProcess.length },
          summaryResult
        );
      }
    }, 1000);
  };

  // Handler Tandai Lunas (Auto-Sync Individual)
  const handleMarkAsPaidAutoSync = (traderId) => {
    if (!setTradersData) return;
    const updated = tradersData.map(t => {
      if (t.id === traderId) {
        return {
          ...t,
          statusPembayaran: 'LUNAS',
          statusTagihan: 'LUNAS (Agt 2026)',
          statusPedagang: 'RAJIN BAYAR',
          trxNumber: `TRX-20260817-${Math.floor(1000 + Math.random() * 9000)}`,
          tanggalBayar: `${selectedDayDate} - 15:25 WIB`,
          metodeBayar: 'QRIS DIGITAL (Bank Sumut)'
        };
      }
      return t;
    });
    setTradersData(updated);
    alert(`⚡ SINKRONISASI REAL-TIME BERHASIL!\n\nPembayaran Pedagang ID ${traderId} telah terverifikasi!\nData otomatis berpindah ke Tab 'Sudah Bayar (Lunas)' dan menyesuaikan grafik realisasi keuangan.`);
  };

  // Handler Kirim Tagihan ke Field Collector Mobile APK
  const handleSendBillFieldApk = (trader) => {
    setSentBillTriggers(prev => ({ ...prev, [trader.id]: true }));
    const nom = calculateTraderNominal(trader);
    alert(`📱 NOTIFIKASI TAGIHAN DITERUSKAN KE MOBILE APK LAPANGAN!\n\nPetugas Pengutip Lapangan menerima instruksi penagihan:\nPedagang: ${trader.name} (${trader.id})\nLokasi: ${trader.market} - ${trader.stall}\nTotal Tunggakan: Rp ${nom.toLocaleString('id-ID')}\nPeriode Audit: ${periodLabelText}\n\nInstruksi langsung muncul di aplikasi ponsel petugas.`);
  };

  const filteredLunasList = lunasTradersList.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.includes(searchQuery) ||
    t.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.stall.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTunggakanList = tunggakanTradersList.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.includes(searchQuery) ||
    t.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.stall.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      
      {/* HEADER BANNER MODUL LAPORAN PEMBAYARAN */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shrink-0">
              <FileText className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white leading-tight">5. Pusat Database Transaksi & Laporan Pembayaran</h2>
                <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-950" /> Multi-Time Sync
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">Database Transaksi Real-Time dengan Multi-Mode Time Filter & Automated Bank Rekap Ingestion</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            {/* CONTRAST VIBRANT '📂 Upload Rekap Bank' BUTTON */}
            <button
              onClick={() => setIsBankModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/40 hover:scale-105 transition-all cursor-pointer border border-amber-300 shrink-0"
              title="Upload Berkas Setoran Rekap Bank Mitra (Manual-ke-Digital Reconciliation)"
            >
              <span className="text-sm">📂</span>
              <span>Upload Rekap Bank</span>
            </button>

            {/* EXPORT BUTTON TO THE RIGHT */}
            <button onClick={() => alert(`✓ Laporan Database Pembayaran (${periodLabelText}) Berhasil Di-Export!`)} className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 shadow-md transition shrink-0">
              <Download className="w-4 h-4 text-amber-400" /> Export PDF / Excel Laporan
            </button>
          </div>
        </div>

        {/* FINANCIAL METRICS SUMMARY CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/10 font-mono">
          <div className="p-3 bg-white/10 border border-white/20 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-emerald-200 font-sans font-bold block">TARGET PENDAPATAN ({dateRangeDays} HARI):</span>
            <strong className="text-base sm:text-lg font-black text-white block">Rp {totalTargetRp.toLocaleString('id-ID')}</strong>
            <span className="text-[9.5px] text-emerald-200 font-sans truncate block">{periodLabelText}</span>
          </div>

          <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-emerald-200 font-sans font-bold block">REALISASI UANG MASUK LUNAS:</span>
            <strong className="text-base sm:text-lg font-black text-emerald-300 block">Rp {totalRealisasiRp.toLocaleString('id-ID')}</strong>
            <span className="text-[9.5px] text-emerald-200 font-sans">{lunasTradersList.length} Transaksi Terverifikasi</span>
          </div>

          <div className="p-3 bg-rose-500/20 border border-rose-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-rose-200 font-sans font-bold block">SISA TUNGGAKAN (UNPAID):</span>
            <strong className="text-base sm:text-lg font-black text-rose-300 block">Rp {totalTunggakanRp.toLocaleString('id-ID')}</strong>
            <span className="text-[9.5px] text-rose-200 font-sans">{tunggakanTradersList.length} Pedagang Menunggak</span>
          </div>

          <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-2xl space-y-0.5">
            <span className="text-[10px] text-amber-200 font-sans font-bold block">KPI AUDIT PENYERAPAN:</span>
            <strong className="text-base sm:text-lg font-black text-amber-300 block">{kpiAuditPct}% KPI</strong>
            <span className="text-[9.5px] text-amber-200 font-sans">
              {kpiAuditPct >= 90 ? '🟢 Laporan Audited Clean' : '🟨 Pengawasan Tunggakan Aktif'}
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE COMPARATIVE PROGRESS BAR (GRAPH) */}
      <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm space-y-2 font-mono">
        <div className="flex justify-between items-center text-xs font-sans">
          <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" /> Komparasi Target vs Realisasi Uang Masuk ({periodLabelText}):
          </span>
          <span className="text-xs font-black text-emerald-700">{kpiAuditPct}% Tercapai</span>
        </div>

        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-slate-200">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, kpiAuditPct)}%` }}></div>
          <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${Math.max(0, 100 - kpiAuditPct)}%` }}></div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-sans text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Realisasi Lunas: <strong>Rp {totalRealisasiRp.toLocaleString('id-ID')}</strong></span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tunggakan / Gap Target: <strong>Rp {Math.max(0, totalTargetRp - totalRealisasiRp).toLocaleString('id-ID')}</strong></span>
        </div>
      </div>

      {/* 1. INTERACTIVE TIME SWITCHER & FILTERS BAR */}
      <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          
          {/* Dropdown Filter Pasar */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl font-extrabold">
            <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-500 text-[11px] whitespace-nowrap">Pilih Pasar:</span>
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
            </select>
          </div>

          {/* TIME SWITCHER (MODE PER-HARI / PER-BULAN / CUSTOM RENTANG TANGGAL) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-extrabold text-[11px] flex items-center gap-1 shrink-0">
              <Calendar className="w-4 h-4 text-emerald-600" /> Mode Waktu:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 font-mono font-black text-[11px] overflow-x-auto">
              <button 
                onClick={() => setDateModeFilter('PER_HARI')} 
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${dateModeFilter === 'PER_HARI' ? 'bg-emerald-600 text-white shadow' : 'text-slate-700 hover:bg-white'}`}
              >
                ☀️ Per-Hari
              </button>
              <button 
                onClick={() => setDateModeFilter('PER_BULAN')} 
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${dateModeFilter === 'PER_BULAN' ? 'bg-emerald-600 text-white shadow' : 'text-slate-700 hover:bg-white'}`}
              >
                📅 Per-Bulan
              </button>
              <button 
                onClick={() => setDateModeFilter('CUSTOM_RANGE')} 
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${dateModeFilter === 'CUSTOM_RANGE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-700 hover:bg-white'}`}
              >
                🛠️ Custom Rentang Tanggal
              </button>
            </div>
          </div>

        </div>

        {/* DYNAMIC TIME PICKERS CONTROLS (TAMPIL SESUAI MODE WAKTU AKTIF) */}
        
        {/* A. Mode Per-Hari: Date Picker Spesifik */}
        {dateModeFilter === 'PER_HARI' && (
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-950 font-extrabold">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Pilih Tanggal Spesifik Transaksi Harian:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="date" 
                value={selectedDayDate} 
                onChange={(e) => setSelectedDayDate(e.target.value)} 
                className="bg-white border border-emerald-300 px-3.5 py-1.5 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600 shadow-sm cursor-pointer"
              />
              <span className="text-[11px] text-emerald-800 font-sans font-bold">
                (Target & Realisasi Otomatis Terkalkulasi)
              </span>
            </div>
          </div>
        )}

        {/* B. Mode Per-Bulan: Dropdown Picker Bulan & Tahun */}
        {dateModeFilter === 'PER_BULAN' && (
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-950 font-extrabold">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Pilih Bulan & Tahun Rekapitulasi Pembayaran:</span>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)} 
                className="bg-white border border-emerald-300 px-3 py-1.5 rounded-xl text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>

              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)} 
                className="bg-white border border-emerald-300 px-3 py-1.5 rounded-xl text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        )}

        {/* C. Mode Custom Rentang Tanggal: Start Date s.d. End Date */}
        {dateModeFilter === 'CUSTOM_RANGE' && (
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-950 font-extrabold">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Masukkan Rentang Tanggal Mulai s/d Selesai:</span>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-white border border-emerald-300 px-3 py-1.5 rounded-xl text-slate-900 font-bold focus:outline-none cursor-pointer"
              />
              <span className="font-sans font-bold text-slate-500">s/d</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-white border border-emerald-300 px-3 py-1.5 rounded-xl text-slate-900 font-bold focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        )}

      </div>

      {/* 2. TABEL TRANSAKSI LUNAS (PAID) VS TUNGGAKAN (UNPAID) */}
      <div className="space-y-4">
        
        {/* TAB TOGGLE & SEARCH */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          
          <div className="flex bg-slate-100 p-1 rounded-xl font-mono text-xs font-black w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('LUNAS')} 
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'LUNAS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-700 hover:bg-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sudah Bayar (Lunas) ({filteredLunasList.length})</span>
            </button>

            <button 
              onClick={() => setActiveTab('TUNGGAKAN')} 
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'TUNGGAKAN' ? 'bg-rose-600 text-white shadow' : 'text-slate-700 hover:bg-white'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Belum Bayar (Tunggakan) ({filteredTunggakanList.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Cari ID / Nama / No Kiosk / TRX..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

        </div>

        {/* TAB 1: LIST SUDAH BAYAR (LUNAS) */}
        {activeTab === 'LUNAS' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-3">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-sm text-white">Daftar Transaksi Lunas Terverifikasi ({filteredLunasList.length} Pedagang)</h3>
              </div>
              <span className="text-xs text-emerald-300 font-mono">Periode: {periodLabelText}</span>
            </div>

            {filteredLunasList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Tidak ada transaksi lunas pada filter pasar/pencarian ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[9.5px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">No. TRX & Waktu Bayar</th>
                      <th className="p-3">Nama Pedagang & WA</th>
                      <th className="p-3">Pasar & No Kiosk</th>
                      <th className="p-3 text-center">Metode Bayar</th>
                      <th className="p-3 text-right">Nominal Retribusi</th>
                      <th className="p-3 text-center">Status Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                    {filteredLunasList.map((t) => {
                      const nominal = calculateTraderNominal(t);
                      return (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="p-3 font-sans">
                            <strong className="font-mono text-indigo-700 text-xs block">{t.trxNumber || `TRX-202608-${t.id}`}</strong>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{t.tanggalBayar || `${selectedDayDate} - 09:00 WIB`}</span>
                          </td>
                          <td className="p-3 font-sans">
                            <strong className="font-extrabold text-slate-900 text-xs block">{t.name} (ID: {t.id})</strong>
                            <span className="text-[10px] text-emerald-700 font-mono block mt-0.5">{t.phone}</span>
                          </td>
                          <td className="p-3 font-sans">
                            <strong className="font-bold text-slate-800 text-xs block">{t.market}</strong>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{t.stall} ({t.type})</span>
                          </td>
                          <td className="p-3 text-center font-sans">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded text-[10px] border border-blue-200">
                              {t.metodeBayar || 'QRIS Digital (Bank Sumut)'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-black text-emerald-700 font-mono text-xs">
                            Rp {nominal.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-center font-sans">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-full text-[9.5px] border border-emerald-300 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIST BELUM BAYAR (TUNGGAKAN FIELD LIST) */}
        {activeTab === 'TUNGGAKAN' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-3">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-black text-sm text-white">Daftar Pedagang Menunggak / Belum Bayar ({filteredTunggakanList.length} Pedagang)</h3>
              </div>
              <span className="text-xs text-rose-300 font-mono">Daftar Tagihan Field Collector Lapangan</span>
            </div>

            {filteredTunggakanList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Tidak ada tunggakan pembayaran pada filter pasar/pencarian ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[9.5px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">ID & Nama Pedagang</th>
                      <th className="p-3">Pasar & No Kiosk</th>
                      <th className="p-3 text-center">Status SP</th>
                      <th className="p-3 text-right">Akumulasi Tunggakan</th>
                      <th className="p-3 text-center min-w-[240px]">Aksi Penagihan Lapangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                    {filteredTunggakanList.map((t) => {
                      const nominal = calculateTraderNominal(t);
                      const isSent = sentBillTriggers[t.id];

                      return (
                        <tr key={t.id} className="hover:bg-rose-50/50">
                          <td className="p-3 font-sans">
                            <strong className="font-extrabold text-slate-900 text-xs block">{t.name} (ID: {t.id})</strong>
                            <span className="text-[10px] text-emerald-700 font-mono block mt-0.5">{t.phone}</span>
                          </td>
                          <td className="p-3 font-sans">
                            <strong className="font-bold text-slate-800 text-xs block">{t.market}</strong>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{t.stall} ({t.type})</span>
                          </td>
                          <td className="p-3 text-center font-sans">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              t.spCount === 0 ? 'bg-slate-100 text-slate-700' :
                              t.spCount === 1 ? 'bg-amber-100 text-amber-900' :
                              'bg-rose-600 text-white font-black animate-pulse'
                            }`}>
                              {t.spCount === 0 ? 'Tanpa SP' : `${t.spCount}x SP Warning`}
                            </span>
                          </td>
                          <td className="p-3 text-right font-black text-rose-700 font-mono text-xs">
                            Rp {nominal.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-center space-y-1.5 font-sans">
                            
                            {/* Kirim Tagihan ke Mobile APK */}
                            <button 
                              onClick={() => handleSendBillFieldApk(t)}
                              className={`w-full py-1.5 px-3 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1 shadow-sm transition ${
                                isSent ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              <Send className="w-3 h-3" />
                              <span>{isSent ? '✓ Tagihan Terkirim ke HP Field' : '📱 Kirim Tagihan ke HP Collector'}</span>
                            </button>

                            {/* Tandai Lunas (Auto-Sync) */}
                            <button 
                              onClick={() => handleMarkAsPaidAutoSync(t.id)}
                              className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1 border border-emerald-200 transition"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>⚡ Tandai Lunas (Auto-Sync)</span>
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
        )}

      </div>

      {/* MODAL: UPLOAD REKAP PEMBAYARAN BANK (MANUAL FILE INGESTION) */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 text-white text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Upload Rekap Pembayaran Bank (Bank Ingestion)</h3>
                  <p className="text-xs text-slate-400">Pencocokan Otomatis (Reconciliation) Setoran Pedagang dari Bank Mitra</p>
                </div>
              </div>
              <button onClick={() => setIsBankModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Download Template */}
              <div className="p-3.5 bg-slate-950 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-indigo-300 block text-xs flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" /> Standard Template Kolom Rekap Bank
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Format resmi kolom: NIP_ID_PEDAGANG, NAMA_PEDAGANG, NOMINAL_SETORAN, TANGGAL_BAYAR, BANK_MITRA, NO_REF_BANK
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBankTemplateCSV}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-700/50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template CSV</span>
                </button>
              </div>

              {/* Option 2: Select Bank Partner & File Sample */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Pilih Bank Mitra Setoran *</label>
                  <select
                    value={selectedBankMitra}
                    onChange={(e) => setSelectedBankMitra(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Bank Sumut QRIS / VA">Bank Sumut (QRIS & Virtual Account)</option>
                    <option value="Bank Mandiri VA">Bank Mandiri (Virtual Account Corporate)</option>
                    <option value="BRI E-Retribusi">Bank BRI (E-Retribusi Digital)</option>
                    <option value="BCA Direct Ingestion">BCA (Corporate Cash Management)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Pilih File Ingestion / Preset Sample *</label>
                  <select
                    value={selectedPresetSample}
                    onChange={(e) => setSelectedPresetSample(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="sample_sumut_batch1">Rekap_Bank_Sumut_QRIS_19Agt2026.csv (3 Match, 1 Unmatched)</option>
                    <option value="sample_mandiri_va">Rekap_Bank_Mandiri_VA_19Agt2026.xlsx (2 Match, 1 Unmatched)</option>
                  </select>
                </div>
              </div>

              {/* Drag & Drop Real File Zone with HTML File Input */}
              <input 
                type="file" 
                id="real-bank-file" 
                accept=".csv, .xlsx, .pdf, .txt" 
                onChange={handleFileInputChange} 
                className="hidden" 
              />

              <div 
                onClick={() => document.getElementById('real-bank-file')?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-400 bg-slate-950/60 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition group"
              >
                <Upload className="w-8 h-8 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white text-xs block group-hover:text-emerald-300 transition-colors">
                    Klik atau Seret Berkas Rekap Bank (.xlsx, .csv, .pdf) Di Sini
                  </span>
                  <span className="text-[10.5px] text-slate-400 block">
                    Sistem akan membaca berkas komputer Anda secara otomatis & mencocokkan ID pedagang
                  </span>
                </div>

                {uploadedFile ? (
                  <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 font-mono text-[11px] inline-block">
                    📄 Berkas Terpilih: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFileRows.length} Baris Data Terdeteksi)
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-mono text-indigo-300 border border-slate-700 inline-block">
                    📁 Pilih Berkas Dari Komputer Anda
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteBankReconciliation}
                disabled={isReconciling}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-2 cursor-pointer"
              >
                {isReconciling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses Rekonsiliasi...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>⚡ Proses & Validasi Setoran Bank</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUMMARY HASIL REKONSILIASI BANK (RECONCILIATION LOG RESULT) */}
      {reconciliationResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-white text-xs my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Ringkasan Hasil Rekonsiliasi Setoran Bank</h3>
                  <p className="text-xs text-slate-400">Pembaruan Status Pembayaran & Realisasi Pendapatan Berhasil</p>
                </div>
              </div>
              <button onClick={() => setReconciliationResult(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Total Data Diproses</span>
                <span className="text-lg font-black text-white">{reconciliationResult.totalParsed} Transaksi</span>
              </div>
              <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/80">
                <span className="text-[10px] text-emerald-300 block font-sans">Cocok & Diubah Lunas</span>
                <span className="text-lg font-black text-emerald-400">{reconciliationResult.matchedCount} Pedagang</span>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-800/80">
                <span className="text-[10px] text-purple-300 block font-sans">Total Nominal Masuk</span>
                <span className="text-base font-black text-purple-300">
                  Rp {reconciliationResult.totalNominal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Matched Data Table */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Daftar Pedagang Status Berubah Menjadi 'LUNAS' ({reconciliationResult.matchedList.length})
              </h4>
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">ID & Nama Pedagang</th>
                      <th className="p-2.5">Lokasi Pasar</th>
                      <th className="p-2.5 text-right">Nominal</th>
                      <th className="p-2.5 text-center">Ref Bank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {reconciliationResult.matchedList.map((m) => (
                      <tr key={m.traderId} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-bold text-white">
                          {m.traderName} <span className="text-indigo-400 font-mono text-[10px]">({m.traderId})</span>
                        </td>
                        <td className="p-2.5 text-slate-300">{m.market}</td>
                        <td className="p-2.5 text-right text-emerald-400 font-bold">
                          Rp {m.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2.5 text-center text-slate-400 font-mono text-[10px]">{m.refNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unmatched / Failed Data Table */}
            {reconciliationResult.unmatchedList.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Daftar Data Setoran Tidak Ditemukan / Gagal ({reconciliationResult.unmatchedList.length})
                </h4>
                <div className="bg-rose-950/20 rounded-2xl border border-rose-900/50 overflow-hidden p-3 space-y-1.5 text-[11px] font-mono">
                  {reconciliationResult.unmatchedList.map((u, i) => (
                    <div key={i} className="flex justify-between items-center bg-rose-950/40 p-2 rounded-xl border border-rose-900/30">
                      <div>
                        <span className="font-bold text-rose-200 block">{u.traderName} (ID: {u.traderId})</span>
                        <span className="text-[10px] text-rose-300">{u.reason}</span>
                      </div>
                      <span className="font-bold text-rose-300 text-xs">Rp {u.nominal.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl text-[11px] text-indigo-200 flex items-center justify-between">
              <span>⚡ Realisasi Pendapatan di Modul 'Target & Realisasi Perpasar' telah diperbarui secara real-time!</span>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setReconciliationResult(null);
                  setIsBankModalOpen(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition"
              >
                Selesai & Tutup Log Rekonsiliasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



// --- FROM InputPembayaranLapanganView.jsx ---

const INFORMAL_SERVICES = [
  { id: 'PKL_RUTIN', name: 'Pedagang Kaki Lima (PKL Rutin)', tariff: 2000, desc: 'Retribusi Harian PKL Area Pasar' },
  { id: 'LAPAK_HARIAN', name: 'Sewa Lapak Harian Pelataran', tariff: 5000, desc: 'Sewa Tempat Berjualan Temporer' },
  { id: 'KEB_PKL', name: 'Retribusi Kebersihan PKL', tariff: 3000, desc: 'Jasa Pengangkutan Sampah PKL' },
  { id: 'MUSIMAN_BAZAR', name: 'Pedagang Musiman / Bazar Event', tariff: 10000, desc: 'Lapak Event Khusus & Bazar' },
  { id: 'BONGKAR_MUAT', name: 'Karcis Parkir & Bongkar Muat', tariff: 5000, desc: 'Retribusi Bongkar Muat Barang' }
];

const VEHICLE_TYPES = [
  { id: 'MOTOR', name: 'Sepeda Motor', tariff: 2000, badge: 'Roda 2' },
  { id: 'MOBIL', name: 'Mobil / SUV / Sedan', tariff: 3000, badge: 'Roda 4' },
  { id: 'TRUK', name: 'Truk / Bus / Kendaraan Berat', tariff: 5000, badge: 'Roda 6+' }
];

const TOILET_SERVICES = [
  { id: 'BAB_BAK', name: 'Buang Air (BAB / BAK)', tariff: 2000, desc: 'Layanan Toilet & Sanitasi Kebersihan', icon: 'droplet' },
  { id: 'MANDI', name: 'Mandi Kebersihan Diri', tariff: 5000, desc: 'Layanan Kamar Mandi Kebersihan', icon: 'bath' }
];

// =========================================================================
// ISOLATED RETRIBUSI TOILET & SANITASI VIEW COMPONENT
// =========================================================================
function ToiletSanitasiView({
  toiletServices = [],
  selectedService = null,
  setSelectedService,
  toiletQty = 1,
  setToiletQty,
  calculatedTotal = 0,
  handleOpenToiletPaymentModal
}) {
  return (
    <form onSubmit={handleOpenToiletPaymentModal} className="space-y-5 font-sans">
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cyan-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">1. Pilih Layanan Retribusi Toilet & Sanitasi</h3>
              <p className="text-xs text-slate-500">Tarif resmi Perda PUD Pasar Kota Medan</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-xs font-mono font-bold">
            Fasilitas Umum
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toiletServices.map((s) => {
            const isSelected = selectedService?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedService(s)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-md ring-2 ring-cyan-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-cyan-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.id === 'BAB_BAK' ? <Droplet className="w-5 h-5" /> : <Bath className="w-5 h-5" />}
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">{s.name}</strong>
                    <span className="text-[11px] text-slate-500 block">{s.desc}</span>
                  </div>
                </div>

                <div className="text-right font-mono ml-2">
                  <span className="text-[10px] text-slate-400 block font-sans">Tarif Flat:</span>
                  <strong className="text-sm font-black text-cyan-700">Rp {s.tariff.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cyan-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">2. Input Jumlah Pengunjung Toilet</h3>
              <p className="text-xs text-slate-500">Kuantitas pengunjung yang menggunakan fasilitas toilet</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-900 rounded-full text-xs font-mono font-bold">
            Multi-Visitor
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs font-bold text-slate-900 block font-sans">Kuantitas Pengunjung *</span>
            <span className="text-[11px] text-slate-500 block font-sans">Total Pengunjung Toilet Pasar</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setToiletQty(Math.max(1, toiletQty - 1))}
              className="w-10 h-10 bg-white hover:bg-cyan-100 text-slate-900 rounded-xl font-black text-xl flex items-center justify-center border-2 border-cyan-300 shadow-sm active:scale-95 cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="500"
              value={toiletQty}
              onChange={(e) => setToiletQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 h-10 bg-white border-2 border-cyan-400 rounded-xl text-center font-mono font-black text-cyan-950 text-base focus:outline-none focus:border-cyan-600 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setToiletQty(toiletQty + 1)}
              className="w-10 h-10 bg-white hover:bg-cyan-100 text-slate-900 rounded-xl font-black text-xl flex items-center justify-center border-2 border-cyan-300 shadow-sm active:scale-95 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-cyan-900 via-slate-900 to-cyan-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono shadow-inner">
          <div className="space-y-0.5 text-center sm:text-left font-sans">
            <span className="text-[10px] text-cyan-200 block">TOTAL RETRIBUSI TOILET:</span>
            <span className="text-xs text-cyan-300 font-bold block">
              {toiletQty} Pengunjung × Rp {(selectedService?.tariff || 2000).toLocaleString('id-ID')} ({selectedService?.name})
            </span>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-cyan-200 font-sans block uppercase font-bold">TOTAL NOMINAL:</span>
            <strong className="text-xl font-black text-cyan-400 block font-mono">
              Rp {calculatedTotal.toLocaleString('id-ID')}
            </strong>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black rounded-2xl text-xs shadow-xl shadow-cyan-500/30 transition flex items-center justify-center gap-2 cursor-pointer border border-cyan-300 uppercase tracking-wider hover:scale-[1.01]"
        >
          <Droplet className="w-5 h-5 text-slate-950" />
          <span>PROSES PEMBAYARAN TOILET</span>
        </button>
      </div>
    </form>
  );
}

function InputPembayaranLapanganView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [transactionType, setTransactionType] = useState('RETRIBUSI_RUTIN');

  const [informalService, setInformalService] = useState(INFORMAL_SERVICES[0]);
  const [informalQty, setInformalQty] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0]);
  const [plateNumber, setPlateNumber] = useState('');

  const [selectedToiletService, setSelectedToiletService] = useState(TOILET_SERVICES[0]);
  const [toiletQty, setToiletQty] = useState(1);

  const [toiletTotalAmount, setToiletTotalAmount] = useState(() => {
    return parseInt(localStorage.getItem('dipas_toilet_total')) || 180000;
  });

  const [parkingTotalAmount, setParkingTotalAmount] = useState(() => {
    return parseInt(localStorage.getItem('dipas_parking_total')) || 450000;
  });

  const [completedReceipt, setCompletedReceipt] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccessAlert, setPrintSuccessAlert] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('dipas_toilet_total', toiletTotalAmount.toString());
      localStorage.setItem('dipas_parking_total', parkingTotalAmount.toString());
    } catch (e) {}
  }, [toiletTotalAmount, parkingTotalAmount]);

  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const collectorName = currentUser?.name || 'Bambang Haryono';
  const collectorId = currentUser?.id || 'KLT-01';

  const calculatedInformalTotal = (informalService?.tariff || 2000) * informalQty;
  const calculatedToiletTotal = (selectedToiletService?.tariff || 2000) * toiletQty;

  const handleConfirmExecutePayment = () => {
    const isToilet = transactionType === 'RETRIBUSI_TOILET';
    const isParking = transactionType === 'KARCIS_PARKIR';

    const generatedTrxNo = isToilet
      ? `TRX-TLT-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`
      : isParking
      ? `TRX-PRK-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`
      : `TRX-INF-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const generatedSecHash = `SEC-AUTH-${isToilet ? 'TLT-' : isParking ? 'PRK-' : 'INF-'}${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (isToilet) {
      setToiletTotalAmount(prev => prev + calculatedToiletTotal);
    } else if (isParking) {
      setParkingTotalAmount(prev => prev + selectedVehicle.tariff);
    }

    setCompletedReceipt({
      isToiletReceipt: isToilet,
      isParkingReceipt: isParking,
      trxNo: generatedTrxNo,
      securityHash: generatedSecHash,
      toiletServiceName: selectedToiletService?.name,
      toiletQty: toiletQty,
      vehicleName: selectedVehicle?.name,
      plateNumber: plateNumber ? plateNumber.toUpperCase() : '-',
      market: 'Pasar Pusat Medan',
      collector: `${collectorName} (${collectorId})`,
      dateTime: `${formattedDate} - ${formattedTime}`,
      totalNominal: isToilet ? calculatedToiletTotal : isParking ? selectedVehicle.tariff : calculatedInformalTotal
    });
  };

  const handlePrintThermalBluetooth = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccessAlert(true);
      setTimeout(() => setPrintSuccessAlert(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* SINGLE MAIN TAB NAVIGATION (INCLUDES TOILET TAB) */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs font-bold text-white max-w-2xl">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'DASHBOARD' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => { setActiveTab('INPUT_PENAGIHAN'); setTransactionType('KARCIS_PARKIR'); }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'INPUT_PENAGIHAN' && transactionType === 'KARCIS_PARKIR' ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4 text-slate-950" />
          <span>Parkir</span>
        </button>

        <button
          onClick={() => { setActiveTab('INPUT_PENAGIHAN'); setTransactionType('RETRIBUSI_TOILET'); }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'INPUT_PENAGIHAN' && transactionType === 'RETRIBUSI_TOILET' ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Droplet className="w-4 h-4 text-slate-950" />
          <span>Toilet</span>
        </button>
      </div>

      {activeTab === 'INPUT_PENAGIHAN' && (
        <div className="space-y-5">
          {transactionType === 'RETRIBUSI_TOILET' ? (
            <ToiletSanitasiView
              toiletServices={TOILET_SERVICES}
              selectedService={selectedToiletService}
              setSelectedService={setSelectedToiletService}
              toiletQty={toiletQty}
              setToiletQty={setToiletQty}
              calculatedTotal={calculatedToiletTotal}
              handleOpenToiletPaymentModal={(e) => {
                if (e && e.preventDefault) e.preventDefault();
                handleConfirmExecutePayment();
              }}
            />
          ) : (
            <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs">Modul Aktif</div>
          )}
        </div>
      )}

      {/* STRUK THERMAL BLUETOOTH */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full my-8 space-y-4">
            
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-400 animate-pulse" />
                <div>
                  <span className="font-mono text-[11px] font-bold text-cyan-300 block">Printer Thermal Bluetooth: POS-5802</span>
                  <span className="text-[9.5px] text-emerald-400 font-mono">Status: Connected</span>
                </div>
              </div>
              <button onClick={() => setCompletedReceipt(null)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            {completedReceipt.isToiletReceipt ? (
              /* COMPACT TOILET RECEIPT (58mm MINI FORMAT) */
              <div className="bg-white text-slate-950 p-4 rounded-t-2xl font-mono text-[10.5px] leading-tight space-y-2 max-w-[280px] mx-auto shadow-2xl">
                <div className="text-center border-b border-dashed border-slate-400 pb-1.5">
                  <strong className="text-xs font-black block uppercase tracking-tight">PUD PASAR KOTA MEDAN</strong>
                  <span className="text-[10px] font-bold block text-slate-800">BUKTI RETRIBUSI TOILET / SANITASI</span>
                </div>

                <div className="space-y-0.5 border-b border-dashed border-slate-400 pb-1.5 text-[10px]">
                  <div className="flex justify-between"><span>No. Resi:</span><strong>{completedReceipt.trxNo}</strong></div>
                  <div className="flex justify-between"><span>Waktu   :</span><span>{completedReceipt.dateTime}</span></div>
                  <div className="flex justify-between"><span>Pasar   :</span><span className="font-bold truncate max-w-[130px]">{completedReceipt.market}</span></div>
                  <div className="flex justify-between"><span>Petugas :</span><span>{completedReceipt.collector}</span></div>
                  <div className="flex justify-between"><span>Layanan :</span><strong className="truncate max-w-[130px]">{completedReceipt.toiletServiceName}</strong></div>
                  <div className="flex justify-between"><span>Pengunjung:</span><strong>{completedReceipt.toiletQty} Orang</strong></div>
                </div>

                <div className="border-b border-dashed border-slate-400 pb-1.5 text-center">
                  <span className="text-[9.5px] font-bold block text-slate-600">TOTAL RETRIBUSI TOILET</span>
                  <strong className="text-base font-black block text-slate-950">
                    Rp {completedReceipt.totalNominal.toLocaleString('id-ID')}
                  </strong>
                </div>

                <div className="text-center pt-0.5 space-y-1">
                  <div className="w-20 h-20 bg-white p-1 mx-auto rounded border border-slate-900 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://dipas.medan.go.id/verify?trx=${completedReceipt.trxNo}%26hash=${completedReceipt.securityHash}`}
                      alt="Security Barcode"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <strong className="text-[9px] font-mono font-bold text-slate-900 block tracking-wider">
                    {completedReceipt.securityHash}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="bg-white text-slate-950 p-4 rounded-t-2xl font-mono text-[10.5px] leading-tight space-y-2 max-w-[280px] mx-auto shadow-2xl">
                <div className="border-b border-dashed border-slate-400 pb-1.5 text-center">
                  <strong className="text-base font-black block text-slate-950">
                    Rp {completedReceipt.totalNominal.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>
            )}

            {printSuccessAlert && (
              <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-2xl text-xs text-center font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>✓ Struk Berhasil Dicetak ke Printer Thermal Bluetooth!</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handlePrintThermalBluetooth}
                disabled={isPrinting}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-2xl text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-emerald-300"
              >
                <Printer className={`w-4 h-4 ${isPrinting ? 'animate-spin' : ''}`} />
                <span>{isPrinting ? 'Mencetak Struk...' : '🖨️ CETAK STRUK (PRINT THERMAL)'}</span>
              </button>

              <button
                onClick={() => setCompletedReceipt(null)}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs border border-slate-700 cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


// --- FROM LogAktivitasITView.jsx ---

function LogAktivitasITView({ auditLogs, currentUser }) {
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


// --- FROM UserManagementITView.jsx ---

const ALL_DIVISIONS = [
  'Bagian IT',
  'Bagian Usaha',
  'Bagian Keuangan',
  'Kepala Pasar',
  'Petugas Lapangan',
  'Vendor'
];

const MASTER_MENUS = [
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

function UserManagementITView({ 
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


// --- FROM AuditTransparansiView.jsx ---

function AuditTransparansiView() {
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


// --- FROM IzinPihakTigaView.jsx ---

function IzinPihakTigaView({ marketFilter }) {
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


// --- FROM PengunjukanPenegakanView.jsx ---

function PengunjukanPenegakanView({ marketFilter }) {
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


// --- FROM PotensiOkupansiView.jsx ---

function PotensiOkupansiView({ marketFilter }) {
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
