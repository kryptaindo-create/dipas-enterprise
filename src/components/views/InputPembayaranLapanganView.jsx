import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, CheckCircle2, User, Building2, Store, Calendar, 
  Clock, DollarSign, Calculator, Send, ShieldCheck, RefreshCw, Activity, 
  FileText, ArrowRight, Zap, CheckSquare, LayoutGrid, TrendingUp, QrCode, Printer, Wifi, Check, Award, FileCheck, Ticket, ShoppingBag, Users, Plus, Minus, Car, Truck, Bike, Droplet, Bath
} from 'lucide-react';

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

export default function InputPembayaranLapanganView({ currentUser }) {
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
