import React from 'react';
import { Home, Users, FileCheck, ShieldCheck, UserCog, HardDrive } from 'lucide-react';

export default function BottomNav({ activeMenu, setActiveMenu, currentUser }) {
  const userPerms = currentUser?.permissions || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const allBottomItems = [
    { id: 0, label: 'Beranda', icon: Home, reqPerm: null },
    { id: 1, label: 'Pedagang', icon: Users, reqPerm: 1 },
    { id: 4, label: 'SIPTB', icon: FileCheck, reqPerm: 4 },
    { id: 9, label: 'Audit', icon: ShieldCheck, reqPerm: 9 },
    { id: 10, label: 'Akses IT', icon: UserCog, reqPerm: 10 },
    { id: 11, label: 'Log IT', icon: HardDrive, reqPerm: 11 }
  ];

  const visibleBottomItems = allBottomItems.filter(
    item => item.reqPerm === null || userPerms.includes(item.reqPerm)
  );

  return (
    <nav className="glass-panel fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {visibleBottomItems.map((item) => {
          const IconComp = item.icon;
          const isActive = (item.id === 0 && activeMenu === 0) || (item.id !== 0 && activeMenu === item.id);
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-indigo-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-500/20 text-indigo-400' : ''}`}>
                <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9.5px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

