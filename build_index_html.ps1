$utf8 = [System.Text.Encoding]::UTF8
$arrow = [char]0x2190

$header = @'
<!DOCTYPE html>
<html lang="id" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>DIPAS Enterprise v2.0 - Sentral Kontrol IT & Perizinan</title>
  
  <script>
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      var root = document.getElementById('root');
      if (root) {
        root.innerHTML = '<div style="padding:24px;background:#fff1f2;border:2px solid #f43f5e;color:#9f1239;font-family:sans-serif;margin:20px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.15);">' +
          '<h2 style="font-size:18px;font-weight:800;margin-bottom:8px;color:#e11d48;">⚠️ DIPAS JavaScript Error Detector</h2>' +
          '<p style="font-size:13px;margin-bottom:12px;">Terjadi kesalahan saat memuat skrip browser:</p>' +
          '<pre style="background:#ffe4e6;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre-wrap;color:#881337;">' + msg + '\nFile: ' + url + '\nLine: ' + lineNo + '</pre>' +
          '<button onclick="location.reload()" style="margin-top:12px;padding:8px 16px;background:#e11d48;color:#fff;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Refresh Halaman</button>' +
          '</div>';
      }
      return false;
    };
  </script>

  <!-- Offline / Fast Vendor Scripts -->
  <script src="/vendor/react.min.js"></script>
  <script src="/vendor/react-dom.min.js"></script>
  <script src="/vendor/babel.min.js"></script>
  <script src="/vendor/lucide.min.js"></script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    if (!window.tailwind) document.write('<script src="/vendor/tailwindcss.js"><\/script>');
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Inconsolata:wght@500;700;900&display=swap" rel="stylesheet">

  <style>
    * { font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif; box-sizing: border-box; }
    .font-mono-thermal { font-family: 'Inconsolata', 'Courier New', monospace; }
    body { background-color: #f8fafc; color: #0f172a; -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
    .glass-header { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(226, 232, 240, 0.9); }
    .gradient-hero-indigo { background: linear-gradient(135deg, #4338ca 0%, #3730a3 50%, #1e1b4b 100%); box-shadow: 0 16px 35px -10px rgba(67, 56, 202, 0.35); }
    .gradient-card-dark { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
    
    .mobile-device-frame-modern {
      max-width: 410px;
      width: 100%;
      margin: 12px auto;
      border-radius: 46px;
      border: 10px solid #0f172a;
      box-shadow: 0 25px 70px -15px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
      overflow: hidden;
      position: relative;
      height: 850px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      background-color: #f8fafc;
    }
    .mobile-notch-modern {
      width: 130px;
      height: 24px;
      background: #0f172a;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-center;
      gap: 6px;
    }
    .mobile-notch-camera {
      width: 8px;
      height: 8px;
      background: #1e293b;
      border-radius: 50%;
      border: 1px solid #334155;
    }
    .mobile-notch-speaker {
      width: 36px;
      height: 3px;
      background: #334155;
      border-radius: 999px;
    }
    .mobile-status-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 30px;
      padding: 4px 18px 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 800;
      color: #0f172a;
      z-index: 55;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
    }
    .mobile-scroll-container {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding-top: 30px;
      padding-bottom: 65px;
      -webkit-overflow-scrolling: touch;
      width: 100%;
    }
    .mobile-bottom-nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 58px;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(51, 65, 85, 0.8);
      display: flex;
      align-items: center;
      justify-around;
      z-index: 50;
      padding: 0 2px;
    }

    .thermal-receipt-paper {
      background: #fff;
      color: #0f172a;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      position: relative;
    }

    .live-pulse {
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse-ring {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.1); }
    }

    /* Mobile Responsive Utility Rules */
    .mobile-device-frame-modern * {
      max-w-full;
    }
    .mobile-device-frame-modern select {
      max-width: 100% !important;
    }
  </style>
</head>
<body class="antialiased selection:bg-indigo-600 selection:text-white bg-slate-100 text-slate-900">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error("DIPAS React Runtime Error:", error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return (
            <div style={{ padding: '30px', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif', minHeight: '100vh' }}>
              <h2 style={{ color: '#f43f5e', fontSize: '20px', fontWeight: 'bold' }}>⚠️ DIPAS React Component Error</h2>
              <pre style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', color: '#fb7185', overflowX: 'auto', marginTop: '12px' }}>
                {this.state.error?.toString()}
              </pre>
              <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>
                Refresh Halaman
              </button>
            </div>
          );
        }
        return this.props.children;
      }
    }

    // --- LUCIDE ICON HELPER COMPONENTS ---
    const createLucideComponent = (iconName) => ({ className = "w-4 h-4 inline-block", ...props }) => (
      <i data-lucide={iconName} className={className} {...props}></i>
    );

    const Users = createLucideComponent("users");
    const Search = createLucideComponent("search");
    const Eye = createLucideComponent("eye");
    const Phone = createLucideComponent("phone");
    const Calendar = createLucideComponent("calendar");
    const ShieldCheck = createLucideComponent("shield-check");
    const UserPlus = createLucideComponent("user-plus");
    const Edit3 = createLucideComponent("edit-3");
    const MapPin = createLucideComponent("map-pin");
    const Store = createLucideComponent("store");
    const Tag = createLucideComponent("tag");
    const FileText = createLucideComponent("file-text");
    const CheckCircle2 = createLucideComponent("check-circle-2");
    const XCircle = createLucideComponent("x-circle");
    const AlertTriangle = createLucideComponent("alert-triangle");
    const Printer = createLucideComponent("printer");
    const QrCode = createLucideComponent("qr-code");
    const Save = createLucideComponent("save");
    const Maximize2 = createLucideComponent("maximize-2");
    const ShoppingBag = createLucideComponent("shopping-bag");
    const Award = createLucideComponent("award");
    const DollarSign = createLucideComponent("dollar-sign");
    const Clock = createLucideComponent("clock");
    const Calculator = createLucideComponent("calculator");
    const Plus = createLucideComponent("plus");
    const Minus = createLucideComponent("minus");
    const Settings = createLucideComponent("settings");
    const CalendarDays = createLucideComponent("calendar-days");
    const CreditCard = createLucideComponent("credit-card");
    const TrendingUp = createLucideComponent("trending-up");
    const Building2 = createLucideComponent("building-2");
    const LayoutGrid = createLucideComponent("layout-grid");
    const AlertOctagon = createLucideComponent("alert-octagon");
    const BarChart3 = createLucideComponent("bar-chart-3");
    const PieChart = createLucideComponent("pie-chart");
    const Target = createLucideComponent("target");
    const ArrowUpRight = createLucideComponent("arrow-up-right");
    const ArrowDownRight = createLucideComponent("arrow-down-right");
    const FileCheck = createLucideComponent("file-check");
    const PlusCircle = createLucideComponent("plus-circle");
    const AlertCircle = createLucideComponent("alert-circle");
    const Filter = createLucideComponent("filter");
    const Handshake = createLucideComponent("handshake");
    const Building = createLucideComponent("building");
    const Send = createLucideComponent("send");
    const ShieldAlert = createLucideComponent("shield-alert");
    const ArrowRight = createLucideComponent("arrow-right");
    const RefreshCw = createLucideComponent("refresh-cw");
    const Lock = createLucideComponent("lock");
    const User = createLucideComponent("user");
    const HardDrive = createLucideComponent("hard-drive");
    const Download = createLucideComponent("download");
    const ChevronDown = createLucideComponent("chevron-down");
    const ChevronUp = createLucideComponent("chevron-up");
    const Layers = createLucideComponent("layers");
    const Activity = createLucideComponent("activity");
    const CheckSquare = createLucideComponent("check-square");
    const FileSpreadsheet = createLucideComponent("file-spreadsheet");
    const Upload = createLucideComponent("upload");
    const UserCog = createLucideComponent("user-cog");
    const Ticket = createLucideComponent("ticket");
    const Wifi = createLucideComponent("wifi");
    const Check = createLucideComponent("check");
    const Zap = createLucideComponent("zap");
    const Car = createLucideComponent("car");
    const Bike = createLucideComponent("bike");
    const Truck = createLucideComponent("truck");
    const Droplet = createLucideComponent("droplet");
    const Bath = createLucideComponent("bath");
    const ChevronRight = createLucideComponent("chevron-right");
    const Unlock = createLucideComponent("unlock");
    const Trash2 = createLucideComponent("trash-2");
    const Square = createLucideComponent("square");
    const Key = createLucideComponent("key");
    const Shield = createLucideComponent("shield");
    const UserX = createLucideComponent("user-x");
    const Monitor = createLucideComponent("monitor");
    const Radio = createLucideComponent("radio");
    const Smartphone = createLucideComponent("smartphone");
'@

$combinedViews = [System.IO.File]::ReadAllText("c:\DIPAS\combined_views.js", $utf8)

$appShell = @'

    // --- TOP 5 PASAR BERPRESTASI (CAPAIAN >= 100%) WIDGET ---
    function TopMarketsAchievedWidget({ isMobileFrame }) {
      const topMarketsData = [
        { rank: 1, name: 'Pasar Petisah', grade: 'GRADE A (PREMIUM)', target: 45000000, realisasi: 48825000, pct: 108.5, badgeColor: 'from-amber-400 to-yellow-600 text-slate-950', trophyLabel: '1st' },
        { rank: 2, name: 'Pasar Pusat Medan', grade: 'GRADE A (PREMIUM)', target: 55000000, realisasi: 58025000, pct: 105.5, badgeColor: 'from-slate-300 to-slate-400 text-slate-950', trophyLabel: '2nd' },
        { rank: 3, name: 'Pasar Sambas', grade: 'GRADE B (STANDAR)', target: 22000000, realisasi: 22880000, pct: 104.0, badgeColor: 'from-amber-700 to-amber-900 text-amber-100', trophyLabel: '3rd' },
        { rank: 4, name: 'Pasar Kemuning', grade: 'GRADE B (STANDAR)', target: 18000000, realisasi: 18450000, pct: 102.5, badgeColor: 'from-emerald-500 to-teal-700 text-white', trophyLabel: '4th' },
        { rank: 5, name: 'Pasar Aksara Medan', grade: 'GRADE B (STANDAR)', target: 25000000, realisasi: 25250000, pct: 101.0, badgeColor: 'from-emerald-600 to-emerald-800 text-white', trophyLabel: '5th' }
      ];

      return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white space-y-3.5 shadow-2xl relative overflow-hidden w-full max-w-full">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight truncate">
                    Top 5 Pasar Berprestasi (Capaian &gt;= 100%)
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[9px] font-extrabold font-mono border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                    TARGET RECOGNITION
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium truncate mt-0.5">
                  Rekapitulasi Total Realisasi (Retribusi, SIPTB, Parkir, Toilet) vs Target Alokasi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                5 dari 53 Pasar Lulus KPI
              </span>
            </div>
          </div>

          {/* Top 5 Markets Table / List */}
          <div className="space-y-2 font-mono text-xs">
            {topMarketsData.map((market) => (
              <div 
                key={market.rank} 
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800/90 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${market.badgeColor} font-black text-xs flex items-center justify-center shadow-md shrink-0`}>
                    {market.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                        {market.name}
                      </h4>
                      <span className="text-[8.5px] font-sans font-bold text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800 shrink-0">
                        {market.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>Target: <strong className="text-slate-200">Rp {market.target.toLocaleString('id-ID')}</strong></span>
                      <span className="text-slate-600">|</span>
                      <span>Realisasi: <strong className="text-emerald-400">Rp {market.realisasi.toLocaleString('id-ID')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <div className="w-24 sm:w-32 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full"
                      style={{ width: `${Math.min(market.pct, 120)}%` }}
                    ></div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{market.trophyLabel} {market.pct}%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
            <span>* Data terverifikasi otomatis oleh Sistem Sentral Kontrol IT DIPAS v2.0</span>
            <span className="text-emerald-400 font-bold">5 Pasar Melampaui 100% Target</span>
          </div>
        </div>
      );
    }

    // --- ENHANCED: MODUL MONITORING SIPTB & BREAKDOWN NOMINAL BULANAN WIDGET ---
    function SiptbComplianceMonitoringWidget({ isMobileFrame }) {
      const feePerTrader = 350000;
      
      const countSudahBayar = 1180;
      const countBelumBayar = 240;
      const countExpired = 130;

      const totalNominalTerbayar = countSudahBayar * feePerTrader; // Rp 413.000.000
      const nominalBelumBayar = countBelumBayar * feePerTrader; // Rp 84.000.000
      const nominalExpired = countExpired * feePerTrader; // Rp 45.500.000
      const totalPotensiBelumTerbayar = nominalBelumBayar + nominalExpired; // Rp 129.500.000

      const pctTerbayar = ((totalNominalTerbayar / (totalNominalTerbayar + totalPotensiBelumTerbayar)) * 100).toFixed(1);

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
          
          {/* CARD 1: KARTU RINGKASAN SIPTB & BREAKDOWN NOMINAL (3-COLOR DONUT) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                    Monitoring Perizinan & Nominal SIPTB
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Status & Nilai Rupiah SIPTB (Agustus 2026)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-[9.5px] font-extrabold font-mono border border-blue-500/30">
                1.550 Kiosk
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* 3-Color Donut SVG */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                  {/* Expired Arc */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f43f5e" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="0" />
                  {/* Belum Bayar Arc */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="20.0" />
                  {/* SIPTB Sudah Bayar Arc */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="57.0" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black font-mono text-emerald-400 leading-none">Rp 413M</span>
                  <span className="text-[8.5px] text-slate-400 font-bold uppercase mt-0.5">SIPTB Masuk</span>
                </div>
              </div>

              {/* 3 SIPTB Status Cards with Nominal Breakdown */}
              <div className="sm:col-span-7 space-y-2 font-mono text-xs">
                {/* Sudah Bayar */}
                <div className="bg-slate-950 p-2 rounded-xl border border-emerald-500/30 flex justify-between items-center">
                  <div>
                    <span className="text-emerald-400 font-bold block text-[10.5px] font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      SIPTB Terbayar
                    </span>
                    <span className="text-[9px] text-emerald-300 font-extrabold">{countSudahBayar} Pedagang (76.1%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white block">Rp 413.000.000</span>
                    <span className="text-[8.5px] text-emerald-400 font-bold font-sans">@Rp 350.000/thn</span>
                  </div>
                </div>

                {/* Belum Bayar */}
                <div className="bg-slate-950 p-2 rounded-xl border border-amber-500/30 flex justify-between items-center">
                  <div>
                    <span className="text-amber-400 font-bold block text-[10.5px] font-sans flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Belum Bayar (Proses)
                    </span>
                    <span className="text-[9px] text-amber-300 font-extrabold">{countBelumBayar} Pedagang (15.5%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-300 block">Rp 84.000.000</span>
                    <span className="text-[8.5px] text-slate-400 font-sans">Tagihan Terbit</span>
                  </div>
                </div>

                {/* Expired / Mati */}
                <div className="bg-slate-950 p-2 rounded-xl border border-rose-500/30 flex justify-between items-center">
                  <div>
                    <span className="text-rose-400 font-bold block text-[10.5px] font-sans flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" />
                      Expired (Kadaluwarsa)
                    </span>
                    <span className="text-[9px] text-rose-300 font-extrabold">{countExpired} Pedagang (8.4%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-300 block">Rp 45.500.000</span>
                    <span className="text-[8.5px] text-rose-400 font-bold font-sans">SP1-SP3 Terbit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Potensi & Penyerapan SIPTB */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] border-t border-slate-800 pt-2.5">
              <div className="bg-slate-950 p-2 rounded-xl border border-emerald-500/30">
                <span className="text-slate-400 block font-sans">Total Pendapatan Terbayar:</span>
                <span className="text-emerald-400 font-black text-xs">Rp 413.000.000</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-rose-500/30">
                <span className="text-slate-400 block font-sans">Potensi Belum Terbayar (GAP):</span>
                <span className="text-rose-400 font-black text-xs">Rp 129.500.000</span>
              </div>
            </div>
          </div>

          {/* CARD 2: GRAFIK TREN NOMINAL SIPTB (TERBAYAR VS POTENSI BELUM BAYAR) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                    Grafik Perbandingan Nominal SIPTB
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Realisasi SIPTB Terbayar vs Potensi Belum Bayar</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-[9.5px] font-extrabold font-mono border border-purple-500/30">
                {pctTerbayar}% Capaian
              </span>
            </div>

            {/* Nominal Progress Bar Comparison */}
            <div className="space-y-3">
              {/* SIPTB Terbayar */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Nilai SIPTB Terbayar (Realisasi)
                  </span>
                  <span className="text-emerald-300 font-extrabold">1.180 Pedagang</span>
                </div>
                <div className="w-full bg-slate-950 rounded-xl h-7 p-1 border border-slate-800 flex items-center">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-lg transition-all flex items-center px-2 text-[11px] font-black text-slate-950" style={{ width: '76.1%' }}>
                    Rp 413.000.000
                  </div>
                </div>
              </div>

              {/* Potensi SIPTB Belum Terbayar (GAP) */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-rose-400 font-bold flex items-center gap-1 font-sans">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Potensi SIPTB Belum Bayar (GAP)
                  </span>
                  <span className="text-rose-300 font-extrabold">370 Pedagang (Belum + Expired)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-xl h-7 p-1 border border-slate-800 flex items-center">
                  <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-lg transition-all flex items-center px-2 text-[11px] font-black text-white" style={{ width: '23.9%' }}>
                    Rp 129.500.000
                  </div>
                </div>
              </div>
            </div>

            {/* Target Breakdown Formula Box */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 font-mono text-[10px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span className="font-sans font-bold text-slate-300">Rumus Kalkulasi Potensi SIPTB:</span>
                <span className="text-indigo-400 font-bold">Grade A (@Rp 350rb/tahun)</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[9.5px]">
                Total Potensi SIPTB Global (1.550 Kiosk x Rp 350.000) = <strong className="text-white">Rp 542.500.000</strong>. GAP yang harus dikejar petugas perizinan = <strong className="text-rose-400">Rp 129.500.000</strong>.
              </p>
            </div>

          </div>

        </div>
      );
    }

    // --- NEW: KARTU STATISTIK PEDAGANG & PENDAPATAN PARKIR/TOILET BULANAN WIDGET ---
    function MerchantComplianceAndFacilitiesWidget({ isMobileFrame }) {
      const dailyTrendData = [
        { day: '1', parkir: 2400000, toilet: 1500000 },
        { day: '3', parkir: 2550000, toilet: 1600000 },
        { day: '5', parkir: 2300000, toilet: 1450000 },
        { day: '7', parkir: 2800000, toilet: 1750000 },
        { day: '9', parkir: 2450000, toilet: 1550000 },
        { day: '11', parkir: 2600000, toilet: 1650000 },
        { day: '13', parkir: 2750000, toilet: 1700000 },
        { day: '15', parkir: 2900000, toilet: 1850000 },
        { day: '17', parkir: 2400000, toilet: 1500000 },
        { day: '19', parkir: 2850000, toilet: 1800000 },
        { day: '20', parkir: 2650000, toilet: 1680000 }
      ];

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
          
          {/* CARD 1: KARTU STATISTIK PEMBAYARAN PEDAGANG (COMPLIANCE DONUT) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                    Statistik Pembayaran Pedagang
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Kepatuhan Retribusi Bulan Ini (1 s.d. Hari Ini)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[9.5px] font-extrabold font-mono border border-emerald-500/30">
                80.0% Lunas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* SVG Donut Chart */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f43f5e" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="47.7" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black font-mono text-white leading-none">1.550</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Total Kiosk</span>
                </div>
              </div>

              {/* Data Rincian Status */}
              <div className="sm:col-span-7 space-y-2.5 font-mono text-xs">
                {/* Pedagang Lunas */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-emerald-500/30 space-y-1">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pedagang Sudah Bayar (Lunas)
                    </span>
                    <span className="text-emerald-300 font-extrabold">1.240 Orang (80%)</span>
                  </div>
                  <div className="text-base font-black text-white">
                    Rp 318.320.000
                  </div>
                </div>

                {/* Pedagang Menunggak */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-rose-500/30 space-y-1">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5 font-sans">
                      <XCircle className="w-3.5 h-3.5" />
                      Belum Bayar / Menunggak
                    </span>
                    <span className="text-rose-300 font-extrabold">310 Orang (20%)</span>
                  </div>
                  <div className="text-base font-black text-rose-300">
                    Rp 79.580.000
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: AKUMULASI SEKTOR KHUSUS (PARKIR & TOILET) BULAN INI */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                    Akumulasi Parkir & Kamar Mandi
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Pendapatan Fasilitas Khusus (1 s.d. Hari Ini)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded-full text-[9.5px] font-extrabold font-mono border border-sky-500/30">
                Agustus 2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Parkir Total */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/30 space-y-1">
                <div className="flex items-center justify-between text-sky-400 text-xs font-bold font-sans">
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5" />
                    Parkir (Motor/Mobil/Bus)
                  </span>
                  <span className="text-[9.5px] bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">24.325 Trx</span>
                </div>
                <div className="text-lg font-black font-mono text-sky-300">
                  Rp 48.650.000
                </div>
                <p className="text-[9px] text-slate-400 font-sans">Akumulasi Karcis Parkir 53 Pasar</p>
              </div>

              {/* Toilet Total */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-amber-400 text-xs font-bold font-sans">
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    Sanitasi Toilet / Mandi
                  </span>
                  <span className="text-[9.5px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">12.372 Trx</span>
                </div>
                <div className="text-lg font-black font-mono text-amber-300">
                  Rp 30.930.000
                </div>
                <p className="text-[9px] text-slate-400 font-sans">Akumulasi Retribusi Toilet Pasar</p>
              </div>
            </div>

            {/* Mini Daily Bar Chart */}
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Tren Harian Parkir & Toilet (Agustus)</span>
                <span className="text-sky-300 font-bold">Total: Rp 79.580.000</span>
              </div>
              <div className="h-10 flex items-end gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto">
                {dailyTrendData.map((d, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end gap-0.5 min-w-[12px] h-full" title={`Tgl ${d.day}: Parkir Rp ${d.parkir.toLocaleString('id-ID')} | Toilet Rp ${d.toilet.toLocaleString('id-ID')}`}>
                    <div className="bg-sky-400 rounded-t-xs" style={{ height: `${(d.parkir / 3000000) * 100}%` }}></div>
                    <div className="bg-amber-400 rounded-b-xs" style={{ height: `${(d.toilet / 3000000) * 100}%` }}></div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      );
    }

    // --- INTERACTIVE FINANCIAL MULTI-LINE & AREA CHART COMPONENT ---
    function FinancialIncomeChart({ marketFilter, isMobileFrame }) {
      const [timeframe, setTimeframe] = useState('Month');
      const [hoverIndex, setHoverIndex] = useState(null);

      const chartDataSets = {
        Hour: [
          { month: '06:00', target: 5000000, realisasi: 4800000 },
          { month: '08:00', target: 12000000, realisasi: 11500000 },
          { month: '10:00', target: 25000000, realisasi: 26200000 },
          { month: '12:00', target: 35000000, realisasi: 34800000 },
          { month: '14:00', target: 42000000, realisasi: 41200000 },
          { month: '16:00', target: 48000000, realisasi: 47900000 }
        ],
        Day: [
          { month: 'Sen', target: 14000000, realisasi: 13800000 },
          { month: 'Sel', target: 14000000, realisasi: 14200000 },
          { month: 'Rab', target: 14000000, realisasi: 13900000 },
          { month: 'Kam', target: 14000000, realisasi: 14500000 },
          { month: 'Jum', target: 15000000, realisasi: 15800000 },
          { month: 'Sab', target: 18000000, realisasi: 19200000 },
          { month: 'Ming', target: 16000000, realisasi: 17100000 }
        ],
        Week: [
          { month: 'Mgg 1', target: 95000000, realisasi: 92400000 },
          { month: 'Mgg 2', target: 95000000, realisasi: 98100000 },
          { month: 'Mgg 3', target: 95000000, realisasi: 94800000 },
          { month: 'Mgg 4', target: 100000000, realisasi: 103200000 }
        ],
        Month: [
          { month: 'Jan', target: 40000000, realisasi: 38500000 },
          { month: 'Feb', target: 40000000, realisasi: 39200000 },
          { month: 'Mar', target: 40000000, realisasi: 41000000 },
          { month: 'Apr', target: 40000000, realisasi: 37800000 },
          { month: 'Mei', target: 40000000, realisasi: 42500000 },
          { month: 'Jun', target: 40000000, realisasi: 40100000 },
          { month: 'Jul', target: 40000000, realisasi: 43200000 },
          { month: 'Agt', target: 45000000, realisasi: 42100000 },
          { month: 'Sep', target: 40000000, realisasi: 38900000 },
          { month: 'Okt', target: 40000000, realisasi: 39500000 },
          { month: 'Nov', target: 40000000, realisasi: 40800000 },
          { month: 'Des', target: 40000000, realisasi: 41200000 }
        ],
        Year: [
          { month: '2022', target: 420000000, realisasi: 395000000 },
          { month: '2023', target: 440000000, realisasi: 428000000 },
          { month: '2024', target: 460000000, realisasi: 452000000 },
          { month: '2025', target: 475000000, realisasi: 469000000 },
          { month: '2026', target: 485000000, realisasi: 397900000 }
        ],
        All: [
          { month: 'Q1-24', target: 120000000, realisasi: 118000000 },
          { month: 'Q2-24', target: 120000000, realisasi: 121500000 },
          { month: 'Q3-24', target: 120000000, realisasi: 119200000 },
          { month: 'Q4-24', target: 120000000, realisasi: 122800000 },
          { month: 'Q1-25', target: 125000000, realisasi: 123000000 },
          { month: 'Q2-25', target: 125000000, realisasi: 126400000 },
          { month: 'Q3-25', target: 125000000, realisasi: 124800000 },
          { month: 'Q4-25', target: 125000000, realisasi: 128100000 },
          { month: 'Q1-26', target: 130000000, realisasi: 128500000 },
          { month: 'Q2-26', target: 130000000, realisasi: 131200000 }
        ]
      };

      const currentData = chartDataSets[timeframe] || chartDataSets.Month;

      // SVG Math Calculations
      const svgWidth = 800;
      const svgHeight = 230;
      const paddingLeft = 50;
      const paddingRight = 25;
      const paddingTop = 25;
      const paddingBottom = 40;

      const chartW = svgWidth - paddingLeft - paddingRight;
      const chartH = svgHeight - paddingTop - paddingBottom;

      const maxVal = Math.max(...currentData.map(d => Math.max(d.target, d.realisasi))) * 1.15;
      const minVal = 0;

      const getX = (index) => {
        if (currentData.length <= 1) return paddingLeft + chartW / 2;
        return paddingLeft + (index / (currentData.length - 1)) * chartW;
      };
      const getY = (val) => paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

      // Smooth Bezier Path Generator with 100% Safe Index Bounds
      const createSmoothPath = (key) => {
        if (!currentData || currentData.length === 0) return '';
        const points = currentData.map((d, i) => ({ x: getX(i), y: getY(d[key]) }));
        if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
        
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = i > 0 ? points[i - 1] : points[i];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = (i + 2 < points.length) ? points[i + 2] : p2;

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return path;
      };

      const realisasiPath = createSmoothPath('realisasi');
      const targetPath = createSmoothPath('target');

      const realisasiAreaPath = realisasiPath
        ? `${realisasiPath} L ${getX(currentData.length - 1)},${paddingTop + chartH} L ${getX(0)},${paddingTop + chartH} Z`
        : '';

      const activePoint = (hoverIndex !== null && hoverIndex < currentData.length) ? currentData[hoverIndex] : null;

      return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 sm:p-5 text-white space-y-3 shadow-2xl relative overflow-hidden w-full max-w-full">
          {/* Header Bar Chart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-xs sm:text-base text-white leading-tight truncate">
                    Grafik Perbandingan Pendapatan
                  </h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[8.5px] font-extrabold font-mono border border-emerald-500/30">
                    REALTIME
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate mt-0.5">
                  Target vs Realisasi {marketFilter === 'ALL' ? 'Semua Pasar' : marketFilter}
                </p>
              </div>
            </div>

            {/* Timeframe Filter Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto justify-between">
              {['Hour', 'Day', 'Week', 'Month', 'Year', 'All'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTimeframe(t); setHoverIndex(null); }}
                  className={`px-2 py-1 rounded-lg text-[9.5px] sm:text-xs font-bold font-mono transition whitespace-nowrap ${
                    timeframe === t 
                      ? 'bg-emerald-500 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Legend Indicators */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs gap-2">
            <div className="flex items-center gap-3 font-mono font-bold flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm"></span>
                <span className="text-emerald-300 text-[10px]">Realisasi</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></span>
                <span className="text-indigo-300 text-[10px]">Target</span>
              </div>
            </div>

            {activePoint && (
              <div className="flex items-center gap-1.5 font-mono text-[9.5px] bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 shrink-0">
                <strong className="text-white">{activePoint.month}:</strong>
                <span className="text-emerald-400">Rp {(activePoint.realisasi / 1000000).toFixed(1)}M</span>
              </div>
            )}
          </div>

          {/* Interactive SVG Area & Curve Canvas Container */}
          <div className="relative w-full overflow-x-auto rounded-xl border border-slate-800/50 bg-slate-950/40 p-1">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto min-w-[500px] overflow-visible"
            >
              <defs>
                <linearGradient id="realisasiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const yVal = paddingTop + chartH - pct * chartH;
                const numVal = Math.round(minVal + pct * (maxVal - minVal));
                const formattedNum = numVal >= 1000000000 ? `${(numVal/1000000000).toFixed(1)}B` : `${(numVal/1000000).toFixed(0)}M`;

                return (
                  <g key={idx}>
                    <line 
                      x1={paddingLeft} 
                      y1={yVal} 
                      x2={svgWidth - paddingRight} 
                      y2={yVal} 
                      stroke="#334155" 
                      strokeDasharray="4 4" 
                      strokeOpacity="0.4"
                    />
                    <text 
                      x={paddingLeft - 6} 
                      y={yVal + 3} 
                      fill="#64748b" 
                      fontSize="9.5" 
                      textAnchor="end" 
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {formattedNum}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Month Labels */}
              {currentData.map((d, idx) => (
                <text
                  key={idx}
                  x={getX(idx)}
                  y={svgHeight - 10}
                  fill={hoverIndex === idx ? '#38bdf8' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={hoverIndex === idx ? '900' : '700'}
                  textAnchor="middle"
                  fontFamily="monospace"
                  className="cursor-pointer transition-all"
                  onClick={() => setHoverIndex(idx)}
                >
                  {d.month}
                </text>
              ))}

              <path d={realisasiAreaPath} fill="url(#realisasiGrad)" />

              <path 
                d={targetPath} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2" 
                strokeDasharray="5 4"
                strokeOpacity="0.85"
              />

              <path 
                d={realisasiPath} 
                fill="none" 
                stroke="#34d399" 
                strokeWidth="3" 
                filter="url(#glow)"
              />

              {currentData.map((d, idx) => {
                const cx = getX(idx);
                const cyReal = getY(d.realisasi);
                const cyTarget = getY(d.target);
                const isHovered = hoverIndex === idx;

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(idx)}
                    onClick={() => setHoverIndex(idx)}
                  >
                    {isHovered && (
                      <line 
                        x1={cx} 
                        y1={paddingTop} 
                        x2={cx} 
                        y2={paddingTop + chartH} 
                        stroke="#38bdf8" 
                        strokeWidth="1.5" 
                        strokeDasharray="3 3"
                      />
                    )}

                    <circle 
                      cx={cx} 
                      cy={cyTarget} 
                      r={isHovered ? "5" : "3"} 
                      fill="#818cf8" 
                      stroke="#1e1b4b" 
                      strokeWidth="1.5"
                    />

                    <circle 
                      cx={cx} 
                      cy={cyReal} 
                      r={isHovered ? "6" : "4"} 
                      fill={isHovered ? "#38bdf8" : "#34d399"} 
                      stroke="#064e3b" 
                      strokeWidth="1.5"
                    />

                    <rect 
                      x={cx - 15} 
                      y={paddingTop} 
                      width="30" 
                      height={chartH} 
                      fill="transparent" 
                    />
                  </g>
                );
              })}
            </svg>

            {activePoint && (
              <div 
                className="absolute z-30 bg-slate-950/95 border border-slate-700/90 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl pointer-events-none text-[11px] space-y-1 transition-all duration-150 animate-in fade-in max-w-[200px]"
                style={{
                  left: `${Math.min(Math.max((hoverIndex / (currentData.length - 1)) * 80 + 5, 5), 65)}%`,
                  top: '10%'
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono">
                  <span className="font-bold text-sky-400">{activePoint.month} {timeframe === 'Month' ? '2026' : ''}</span>
                  <span className="text-[9px] text-slate-400">Finansial</span>
                </div>
                <div className="space-y-0.5 font-mono text-[10px]">
                  <div className="flex justify-between items-center gap-2 text-emerald-400 font-bold">
                    <span className="text-slate-400 font-sans font-normal">Realisasi:</span>
                    <span>Rp {activePoint.realisasi.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-indigo-300">
                    <span className="text-slate-400 font-sans font-normal">Target:</span>
                    <span>Rp {activePoint.target.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 border-t border-slate-800/80 pt-0.5 text-[9.5px]">
                    <span className="text-slate-400 font-sans">Capai KPI:</span>
                    <span className="text-emerald-300 font-bold">
                      {((activePoint.realisasi / activePoint.target) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- MAIN APP SHELL COMPONENT ---
    function App() {
      const [activeMenu, setActiveMenu] = useState(0); 
      const [marketFilter, setMarketFilter] = useState('ALL');
      const [isMobileFrame, setIsMobileFrame] = useState(false);
      const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
      const [isCommandCenterTvMode, setIsCommandCenterTvMode] = useState(false);

      const [usersData, setUsersData] = useState([
        {
          id: 'USR-IT-001',
          nip: '198504122010011001',
          name: 'Bambang Haryono, S.T.',
          email: 'bambang.it@medan.go.id',
          role: 'SUPER_ADMIN_IT',
          division: 'Bagian IT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'USR-USH-002',
          nip: '198809152012022003',
          name: 'Siti Rahmawati, S.E.',
          email: 'siti.usaha@medan.go.id',
          role: 'STAFF_USAHA',
          division: 'Bagian Usaha',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          permissions: [1, 2, 3, 4, 8, 9, 12]
        }
      ]);

      const [currentUser, setCurrentUser] = useState(usersData[0]);

      const [tradersData, setTradersData] = useState([
        { 
          id: '127101001', nik: '1271011508820001', name: 'H. Syamsul Bahri', phone: '0812-6044-9910', market: 'Pasar Pusat Medan', marketGrade: 'GRADE A (PREMIUM)', stall: 'Blok A No. 01', type: 'KIOS', 
          jenisJualanCat: 'BUMBU & REMPAH', jenisJualanDetail: 'Bumbu Giling Basah, Cabai Merah, Bawang Merah/Putih & Rempah Olahan', 
          tanggalPengunjukan: '2024-10-15', 
          siptbStartDate: '2025-10-15', siptbEndDate: '2026-10-15', siptbStatus: 'AKTIF', siptbRenewalFee: 350000,
          statusOperasional: 'AKTIF',
          spCount: 0, spStatus: 'Tanpa SP (Patuh)', 
          skemaTagihan: 'BULANAN', statusTagihan: 'LUNAS (Agt 2026)', statusPedagang: 'RAJIN BAYAR', statusPembayaran: 'LUNAS',
          trxNumber: 'TRX-202608-1001', tanggalBayar: '15 Agustus 2026 - 09:15 WIB', metodeBayar: 'QRIS DIGITAL (Bank Sumut)', periodeTagihan: 'Agustus 2026',
          panjangMeter: 3, lebarMeter: 4, stallSize: '3m x 4m (12 m²)', budgetItems: ['TB', 'KEB', 'LM', 'LA', 'JAMAL'],
          customRates: { TB: 104000, KEB: 50400, LM: 90000, LA: 80000, DTB: 7000, DKEB: 5000, JAMAL: 60000 }
        },
        { 
          id: '127101002', nik: '1271022204780003', name: 'Hj. Ratna Juwita', phone: '0852-7011-2233', market: 'Pasar Pusat Medan', marketGrade: 'GRADE A (PREMIUM)', stall: 'Stand A No. 02', type: 'STAND', 
          jenisJualanCat: 'SAYUR MAYUR', jenisJualanDetail: 'Sayuran Hijau Segar, Tomat, Wortel, Kentang & Bumbu Dapur Segar', 
          tanggalPengunjukan: '2023-08-30', 
          siptbStartDate: '2025-08-30', siptbEndDate: '2026-08-30', siptbStatus: 'AKTIF', siptbRenewalFee: 350000,
          statusOperasional: 'AKTIF',
          spCount: 0, spStatus: 'Tanpa SP (Patuh)', 
          skemaTagihan: 'HARIAN', statusTagihan: 'LUNAS (Hari Ini)', statusPedagang: 'RAJIN BAYAR', statusPembayaran: 'LUNAS',
          trxNumber: 'TRX-20260816-1002', tanggalBayar: '16 Agustus 2026 - 07:30 WIB', metodeBayar: 'TUNAI (Kolektor Pasar)', periodeTagihan: '16 Agustus 2026',
          panjangMeter: 2, lebarMeter: 2, stallSize: '2m x 2m (4 m²)', budgetItems: ['TB', 'KEB', 'JAMAL'],
          customRates: { TB: 2000, KEB: 1500, LM: 2000, LA: 1500, DTB: 1000, DKEB: 1000, JAMAL: 1500 }
        },
        { 
          id: '127102003', nik: '1271031109900002', name: 'Bapak Herman Sitorus', phone: '0813-9988-7766', market: 'Pasar Petisah', marketGrade: 'GRADE A (PREMIUM)', stall: 'Blok B No. 14', type: 'STAND', 
          jenisJualanCat: 'DAGING & SEAFOOD', jenisJualanDetail: 'Daging Sapi Segar Murni, Daging Ayam Potong & Tulang Sup', 
          tanggalPengunjukan: '2022-07-10', 
          siptbStartDate: '2024-07-10', siptbEndDate: '2025-07-10', siptbStatus: 'MATI', siptbRenewalFee: 350000,
          statusOperasional: 'TUTUP',
          spCount: 1, spStatus: '1x SP (SP-1 Terbit)', 
          skemaTagihan: 'HARIAN', statusTagihan: 'MENUNGGAK (2 Hari)', statusPedagang: 'TELAT BAYAR', statusPembayaran: 'BELUM BAYAR',
          trxNumber: '-', tanggalBayar: '-', metodeBayar: '-', periodeTagihan: '15-16 Agustus 2026',
          panjangMeter: 2, lebarMeter: 3, stallSize: '2m x 3m (6 m²)', budgetItems: ['TB', 'KEB', 'JAMAL'],
          customRates: { TB: 2000, KEB: 1500, LM: 2000, LA: 1500, DTB: 1000, DKEB: 1000, JAMAL: 1500 }
        }
      ]);

      // LIVE STREAMING FIELD FEED (AUDIT TRAIL REAL-TIME TICKER)
      const [liveStreamFeed, setLiveStreamFeed] = useState([
        { id: 'FEED-001', time: '00:15', collector: 'Bambang Haryono (KLT-01)', action: 'Setoran Retribusi Pasar Pusat', amount: 396400, status: 'LUNAS - QRIS', type: 'RETRIBUSI' },
        { id: 'FEED-002', time: '00:12', collector: 'Juru Parkir (PRK-03)', action: 'Karcis Parkir Motor Pasar Petisah', amount: 2000, status: 'LUNAS - CASH', type: 'PARKIR' },
        { id: 'FEED-003', time: '00:05', collector: 'Petugas Toilet (TOI-02)', action: 'Retribusi Kamar Mandi Pasar Central', amount: 4000, status: 'LUNAS', type: 'TOILET' }
      ]);

      const [auditLogs, setAuditLogs] = useState([
        {
          id: 'LOG-20260819-001',
          userId: 'USR-IT-001',
          userName: 'Bambang Haryono, S.T.',
          userRole: 'SUPER_ADMIN_IT',
          userDivision: 'Bagian IT',
          timestamp: '19/08/2026 19:40:15 WIB',
          moduleName: 'Manajemen Akses IT',
          actionType: 'PERMISSION_CHANGE',
          marketName: 'Sistem Sentral IT',
          changeSummary: 'Pemetaan Izin Menu untuk Dedi Kurniawan (Bagian Keuangan). Diberikan hak akses Menu #2, #3, #5, #9',
          oldValue: { name: 'Dedi Kurniawan', permissions: [2, 3] },
          newValue: { name: 'Dedi Kurniawan', permissions: [2, 3, 5, 9] }
        }
      ]);

      const recordAuditLog = (user, division, moduleName, actionType, marketName, changeSummary, oldValue = null, newValue = null) => {
        const newLog = {
          id: `LOG-20260819-${Math.floor(100 + Math.random() * 900)}`,
          userId: user?.id || 'USR-IT-001',
          userName: user?.name || 'Bambang Haryono, S.T.',
          userRole: user?.role || 'SUPER_ADMIN_IT',
          userDivision: division || user?.division || 'Bagian IT',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
          moduleName: moduleName,
          actionType: actionType,
          marketName: marketName || 'Sistem Sentral',
          changeSummary: changeSummary,
          oldValue: oldValue,
          newValue: newValue
        };
        setAuditLogs(prev => [newLog, ...prev]);

        // Add item to Live Stream Feed ticker
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const newFeed = {
          id: `FEED-${Math.floor(100 + Math.random() * 900)}`,
          time: timeStr,
          collector: user?.name || 'Petugas Lapangan',
          action: `${moduleName} (${marketName || 'Pasar'})`,
          amount: newValue?.amount || newValue?.totalNominal || 5000,
          status: 'LUNAS - REALTIME',
          type: actionType
        };
        setLiveStreamFeed(prev => [newFeed, ...prev.slice(0, 9)]);
      };

      // Aggregates for Main Kinerja Cards
      const targetPendapatanGlobal = 485000000;
      const realisasiTotal = 397900000;
      const sisaGapTunggakan = targetPendapatanGlobal - realisasiTotal;
      const capterPct = ((realisasiTotal / targetPendapatanGlobal) * 100).toFixed(1);

      const userPerms = currentUser?.permissions || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const isMenuAllowed = activeMenu === 0 || userPerms.includes(activeMenu);

      useEffect(() => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          try { window.lucide.createIcons(); } catch(e) {}
        }
      });

      return (
        <div className={isCommandCenterTvMode ? "min-h-screen bg-slate-950 text-slate-100 p-4 font-sans" : isMobileFrame ? "min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-2 sm:p-6" : "min-h-screen bg-slate-100 text-slate-900 flex flex-col"}>
          <div className={isMobileFrame ? 'mobile-device-frame-modern shadow-2xl' : 'flex flex-col flex-1 w-full'}>
            
            {isMobileFrame && (
              <>
                <div className="mobile-status-bar font-mono">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span>5G</span>
                    <Wifi className="w-3 h-3 inline text-slate-900" />
                  </div>
                </div>
                <div className="mobile-notch-modern">
                  <div className="mobile-notch-camera"></div>
                  <div className="mobile-notch-speaker"></div>
                </div>
              </>
            )}

            <div className={isMobileFrame ? 'mobile-scroll-container px-3' : 'flex flex-col flex-1 w-full'}>
              {/* Header Bar */}
              <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-12 py-2.5 glass-header shadow-sm w-full">
                <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-800 p-0.5 shadow-md flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <h1 className="font-black text-xs sm:text-base text-slate-900 leading-tight truncate">DIPAS Enterprise</h1>
                        <span className="px-1 py-0.2 bg-purple-100 text-purple-800 font-extrabold text-[8px] rounded border border-purple-300 shrink-0">ADMIN</span>
                      </div>
                      <p className="text-[8.5px] sm:text-[11px] text-slate-500 font-extrabold uppercase tracking-wider truncate">Sentral Kontrol IT</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* NEW QUICK SHORTCUT: BUKA MOBILE APK PENGUTIP LAPANGAN */}
                    <button 
                      onClick={() => { setActiveMenu(12); setIsMobileFrame(true); }} 
                      className="px-2.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition border border-cyan-400/40"
                      title="Buka Aplikasi Mobile Collector Pengutip Lapangan (APK POS-5802)"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-cyan-200" />
                      <span className="hidden xs:inline">Mobile APK Pengutip</span>
                    </button>

                    {!isMobileFrame && (
                      <button 
                        onClick={() => setIsCommandCenterTvMode(!isCommandCenterTvMode)} 
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                          isCommandCenterTvMode ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                        }`}
                        title="Toggle Mode Command Center Layar TV Fullscreen"
                      >
                        <Monitor className="w-3.5 h-3.5 text-purple-400" />
                        <span className="hidden sm:inline">{isCommandCenterTvMode ? 'Mode Standar' : 'Command Center'}</span>
                      </button>
                    )}

                    <div className="relative">
                      <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center gap-1 bg-slate-900 text-white px-2 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-4 h-4 rounded-full object-cover border border-slate-700" />
                        <span className="hidden sm:inline text-[11px]">{currentUser.name}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 text-white">
                          <div className="px-2.5 py-1 border-b border-slate-800 text-[9px] text-slate-400 font-mono">Ganti User:</div>
                          {usersData.map(u => (
                            <button
                              key={u.id}
                              onClick={() => { setCurrentUser(u); setIsUserDropdownOpen(false); }}
                              className={`w-full text-left p-1.5 rounded-xl flex items-center justify-between transition ${u.id === currentUser.id ? 'bg-indigo-600 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-[11px] font-bold leading-tight truncate">{u.name}</span>
                                  <span className="text-[8px] text-slate-400 block truncate">{u.division}</span>
                                </div>
                              </div>
                              {u.id === currentUser.id && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button onClick={() => setIsMobileFrame(!isMobileFrame)} className={`px-2 py-1.5 font-extrabold rounded-xl border text-[10px] sm:text-xs shadow-sm transition flex items-center gap-1 ${isMobileFrame ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-slate-50 text-indigo-700 border-slate-200'}`}>
                      <span>{isMobileFrame ? 'Mode HP' : 'Simulasi HP'}</span>
                    </button>
                  </div>
                </div>
              </header>

              <main className={`py-3 sm:py-8 mx-auto w-full space-y-5 ${isMobileFrame ? 'max-w-full px-0 pb-16' : 'w-full max-w-[1400px] px-3 sm:px-6 lg:px-12 pb-28'}`}>
                
                {/* Global Filter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-slate-200/90 px-3 py-2 rounded-2xl text-xs shadow-sm gap-2 w-full max-w-full">
                  <div className="flex items-center gap-1.5 w-full min-w-0">
                    <Filter className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-slate-500 font-bold text-[11px] whitespace-nowrap shrink-0">Filter Pasar:</span>
                    <select value={marketFilter} onChange={(e) => setMarketFilter(e.target.value)} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl text-slate-900 font-extrabold text-[11px] focus:outline-none cursor-pointer w-full max-w-full truncate">
                      <option value="ALL">Semua 53 Pasar Tradisional</option>
                      <option value="Pasar Pusat Medan">Pasar Pusat Medan (Grade A)</option>
                      <option value="Pasar Petisah">Pasar Petisah (Grade A)</option>
                      <option value="Pasar Kemuning">Pasar Kemuning (Grade B)</option>
                      <option value="Pasar Sambas">Pasar Sambas (Grade B)</option>
                    </select>
                  </div>

                  {activeMenu !== 0 && (
                    <button onClick={() => setActiveMenu(0)} className="text-xs text-indigo-600 font-black hover:underline flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      ← Beranda Utama
                    </button>
                  )}
                </div>

                {/* BERANDA UTAMA (ACTIVE MENU = 0) WITH PERFECTED HIERARCHY LAYOUT */}
                {activeMenu === 0 && (
                  <div className="space-y-6 w-full max-w-full">
                    
                    {/* 1. BAGIAN ATAS: KINERJA RINGKASAN & METRIK OPERASIONAL */}
                    <div className="space-y-4 w-full">
                      {/* Kartu Kinerja Utama (Target, Realisasi, Sisa Gap) */}
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="font-extrabold text-[11px] sm:text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1 truncate">
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            1. KINERJA RINGKASAN UTAMA
                          </h3>
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-indigo-600 shrink-0">KPI AGGREGATE: {capterPct}%</span>
                        </div>

                        <div className={`grid gap-2.5 w-full ${isMobileFrame ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                          {/* Target Pendapatan */}
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white space-y-1 shadow-md relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-mono text-slate-400 font-extrabold uppercase tracking-wider block">TARGET PENDAPATAN</span>
                              <Target className="w-3.5 h-3.5 text-indigo-400" />
                            </div>
                            <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                              Rp {targetPendapatanGlobal.toLocaleString('id-ID')}
                            </div>
                            <p className="text-[9px] text-slate-400 font-sans">Target Alokasi 53 Pasar Tradisional Kota Medan</p>
                          </div>

                          {/* Realisasi Total Keluar */}
                          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 p-4 rounded-2xl text-white space-y-1 shadow-md relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-mono text-emerald-300 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block live-pulse"></span>
                                REALISASI TOTAL KELUAR
                              </span>
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 tracking-tight">
                              Rp {realisasiTotal.toLocaleString('id-ID')}
                            </div>
                            <p className="text-[9px] text-emerald-200/80 font-sans">Telah Terverifikasi Kas & QRIS Digital Bank Sumut</p>
                          </div>

                          {/* Sisa Gap / Tunggakan */}
                          <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 border border-rose-500/40 p-4 rounded-2xl text-white space-y-1 shadow-md relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-mono text-rose-300 font-extrabold uppercase tracking-wider block">SISA GAP / TUNGGAKAN</span>
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            </div>
                            <div className="text-xl sm:text-2xl font-black font-mono text-rose-300 tracking-tight">
                              Rp {sisaGapTunggakan.toLocaleString('id-ID')}
                            </div>
                            <p className="text-[9px] text-rose-200/80 font-sans">Sisa Target Belum Terkumpul / Tunggakan SP1-SP3</p>
                          </div>
                        </div>
                      </div>

                      {/* Deretan Kartu Metrik Operasional SIPTB, Pedagang, & Parkir/Toilet */}
                      <SiptbComplianceMonitoringWidget isMobileFrame={isMobileFrame} />
                      <MerchantComplianceAndFacilitiesWidget isMobileFrame={isMobileFrame} />
                    </div>

                    {/* 2. BAGIAN TENGAH: GRAFIK PERBANDINGAN PENDAPATAN (FOKUS VISUAL UTAMA) */}
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="font-extrabold text-[11px] sm:text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          2. VISUALISASI TREN FINANSIAL (FOKUS UTAMA)
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">53 Pasar Aggregate</span>
                      </div>
                      <FinancialIncomeChart marketFilter={marketFilter} isMobileFrame={isMobileFrame} />
                    </div>

                    {/* 3. BAGIAN BAWAH: DATA PRESTASI (TOP 5 PASAR) & NAVIGASI OPERASIONAL */}
                    <div className="space-y-5 w-full">
                      {/* Top 5 Pasar Berprestasi */}
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="font-extrabold text-[11px] sm:text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            3. PASAR BERPRESTASI (RECOGNITION ≥ 100%)
                          </h3>
                          <span className="text-[10px] font-mono text-emerald-600 font-extrabold">Top 5 KPI Sukses</span>
                        </div>
                        <TopMarketsAchievedWidget isMobileFrame={isMobileFrame} />
                      </div>

                      {/* Menu Utama Terintegrasi */}
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="font-extrabold text-[11px] sm:text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            4. MENU UTAMA TERINTEGRASI (KONTROL SISTEM)
                          </h3>
                          <span className="text-[10px] font-mono font-bold text-slate-500">8 Modul</span>
                        </div>

                        <div className={`grid gap-2 w-full ${isMobileFrame ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
                          {[
                            { id: 1, name: '01. Master Pedagang', icon: 'users', color: 'bg-indigo-600 text-white', badge: 'Master', desc: 'Data NIK & SIPTB' },
                            { id: 2, name: '02. Potensi Pasar', icon: 'trending-up', color: 'bg-emerald-600 text-white', badge: 'Potensi', desc: 'Breakdown 53 Pasar' },
                            { id: 3, name: '03. Target vs Realisasi', icon: 'target', color: 'bg-purple-600 text-white', badge: 'KPI', desc: 'Audit Pendapatan' },
                            { id: 4, name: '04. Menu SIPTB', icon: 'file-check', color: 'bg-blue-600 text-white', badge: 'E-Permit', desc: 'Perpanjangan Fee' },
                            { id: 5, name: '05. Database Pembayaran', icon: 'file-text', color: 'bg-teal-600 text-white', badge: 'Bayar', desc: 'Upload Rekap Bank' },
                            { id: 12, name: '06. Retribusi Parkir & Toilet', icon: 'credit-card', color: 'bg-cyan-600 text-white', badge: 'APK Field', desc: 'Kolektor POS-5802' },
                            { id: 7, name: '07. Karcis PKL & Informal', icon: 'shopping-bag', color: 'bg-amber-600 text-white', badge: 'Informal', desc: 'Penegakan Lapak' },
                            { id: 11, name: '08. Log Audit IT', icon: 'hard-drive', color: 'bg-purple-900 text-white', badge: 'Audit', desc: 'System Immutable Log' }
                          ].map((m) => (
                            <button 
                              key={m.id} 
                              onClick={() => { setActiveMenu(m.id); if(m.id === 12) setIsMobileFrame(true); }} 
                              className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between text-left group min-h-[100px]"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <div className={`p-2 rounded-xl ${m.color} shadow-sm group-hover:scale-105 transition-transform`}>
                                  <i data-lucide={m.icon} className="w-4 h-4"></i>
                                </div>
                                <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[8px] font-mono text-slate-700 font-extrabold border border-slate-200">
                                  {m.badge}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-extrabold text-[10.5px] sm:text-xs text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">
                                  {m.name}
                                </h3>
                                <p className="text-[9px] text-slate-500 font-medium mt-0.5 leading-snug truncate">{m.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Streaming Lapangan Ticker */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-white space-y-2.5 shadow-xl w-full">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></div>
                            <h3 className="font-extrabold text-[10.5px] text-white uppercase tracking-wider flex items-center gap-1 font-mono truncate">
                              <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              LIVE STREAMING LAPANGAN (REAL-TIME AUDIT)
                            </h3>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">Real-time</span>
                        </div>

                        <div className="space-y-1.5 font-mono text-[10px]">
                          {liveStreamFeed.map((feed) => (
                            <div key={feed.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800/80 gap-2">
                              <div className="flex items-center gap-1.5 min-w-0 truncate">
                                <span className="text-slate-500 text-[9px] shrink-0">[{feed.time}]</span>
                                <span className="font-bold text-slate-200 truncate">{feed.collector}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-bold text-emerald-400">Rp {feed.amount.toLocaleString('id-ID')}</span>
                                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[8px] rounded font-extrabold border border-emerald-500/30">
                                  {feed.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* SUB-MENUS RENDERING WITH SECURITY GUARDS */}
                {isMenuAllowed && (
                  <>
                    {activeMenu === 1 && <MasterPedagangView marketFilter={marketFilter} setMarketFilter={setMarketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} tradersData={tradersData} setTradersData={setTradersData} />}
                    {activeMenu === 2 && <PotensiPasarView marketFilter={marketFilter} tradersData={tradersData} />}
                    {activeMenu === 3 && <TargetRealisasiView marketFilter={marketFilter} tradersData={tradersData} />}
                    {activeMenu === 4 && <SiptbView marketFilter={marketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} tradersData={tradersData} setTradersData={setTradersData} />}
                    {activeMenu === 5 && <LaporanPembayaranView marketFilter={marketFilter} recordAuditLog={recordAuditLog} currentUser={currentUser} tradersData={tradersData} setTradersData={setTradersData} />}
                    {activeMenu === 6 && <IzinPihakTigaView marketFilter={marketFilter} />}
                    {activeMenu === 7 && <PengunjukanPenegakanView marketFilter={marketFilter} />}
                    {activeMenu === 8 && <PotensiOkupansiView marketFilter={marketFilter} />}
                    {activeMenu === 9 && <AuditTransparansiView />}
                    {activeMenu === 10 && <UserManagementITView usersData={usersData} setUsersData={setUsersData} currentUser={currentUser} recordAuditLog={recordAuditLog} />}
                    {activeMenu === 11 && <LogAktivitasITView auditLogs={auditLogs} currentUser={currentUser} marketFilter={marketFilter} />}
                    {activeMenu === 12 && <InputPembayaranLapanganView marketFilter={marketFilter} tradersData={tradersData} currentUser={currentUser} setTradersData={setTradersData} recordAuditLog={recordAuditLog} />}
                  </>
                )}

              </main>
            </div>

            {isMobileFrame && (
              <div className="mobile-bottom-nav font-mono">
                {[
                  { id: 0, label: 'Beranda', icon: 'layout-grid' },
                  { id: 1, label: 'Pedagang', icon: 'users' },
                  { id: 2, label: 'Potensi', icon: 'trending-up' },
                  { id: 3, label: 'KPI', icon: 'target' },
                  { id: 4, label: 'SIPTB', icon: 'file-check' },
                  { id: 12, label: 'APK Field', icon: 'credit-card' },
                  { id: 11, label: 'Log IT', icon: 'hard-drive' }
                ].map(tab => {
                  const isActive = activeMenu === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMenu(tab.id)}
                      className={`flex flex-col items-center justify-center py-1 px-1 transition ${
                        isActive ? 'text-indigo-400 font-black scale-105' : 'text-slate-400 hover:text-slate-200 font-bold'
                      }`}
                    >
                      <i data-lucide={tab.icon} className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}></i>
                      <span className="text-[8px] mt-0.5 block">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  </script>
</body>
</html>
'@

$finalContent = ($header + $combinedViews + $appShell)
$finalContent = $finalContent -replace 'å†[═\s]*', ($arrow + ' ')
$finalContent = $finalContent -replace 'â†[═\s]*', ($arrow + ' ')
$finalContent = $finalContent -replace '\? Beranda', ($arrow + ' Beranda')

[System.IO.File]::WriteAllText("c:\DIPAS\index.html", $finalContent, $utf8)
Write-Host "Index.html updated with Mobile APK Quick Shortcut! Size:" $finalContent.Length
