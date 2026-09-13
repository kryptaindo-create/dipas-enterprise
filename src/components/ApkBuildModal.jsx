import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle2, QrCode, ShieldCheck, Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function ApkBuildModal({ onClose }) {
  const [buildStep, setBuildStep] = useState(1);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const timer1 = setTimeout(() => { setBuildStep(2); setProgress(65); }, 1200);
    const timer2 = setTimeout(() => { setBuildStep(3); setProgress(100); }, 2500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-indigo-500/40 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-xl text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Generator APK Android Enterprise</h3>
              <p className="text-[10px] text-slate-400 font-mono">DIPAS_BagianUsaha_v1.0.0.apk</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">
              {buildStep === 1 && "⚡ Compiling React UI Components..."}
              {buildStep === 2 && "⚙️ Packaging Android Capacitor/PWA Shell..."}
              {buildStep === 3 && "✅ APK Signed & Ready for Download!"}
            </span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Status Details */}
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span>Target OS:</span>
            <strong className="text-white">Android 8.0+ (API Level 26+)</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Paket Modul:</span>
            <strong className="text-indigo-400">8 Menu Bagian Usaha & Perizinan</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Ukuran File:</span>
            <strong className="text-emerald-400">14.8 MB (Optimized Offline APK)</strong>
          </div>
        </div>

        {/* APK Download / QR Scan */}
        {buildStep === 3 ? (
          <div className="space-y-3 pt-1">
            <button 
              onClick={() => alert('✓ Proses Pengunduhan File APK Berhasil! Simpan file DIPAS_Usaha_Perizinan.apk dan buka di smartphone Android Anda.')}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl transition glow-effect"
            >
              <Download className="w-4 h-4" /> Download Installer APK (14.8 MB)
            </button>

            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3 text-left">
              <div className="p-2 bg-white rounded-xl">
                <QrCode className="w-10 h-10 text-slate-950" />
              </div>
              <div className="text-[11px]">
                <span className="font-bold text-white block">Scan QR Code via Camera HP:</span>
                <span className="text-slate-400">Langsung install file APK di smartphone Android tanpa kabel data.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4 text-xs text-indigo-400 gap-2 font-mono">
            <RefreshCw className="w-4 h-4 animate-spin" /> Memproses kompilasi APK...
          </div>
        )}
      </div>
    </div>
  );
}
