import React from 'react';
import { 
  ShieldCheck, 
  Store, 
  LayoutDashboard, 
  Search, 
  Sparkles,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenLookup?: () => void;
  cartCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenLookup }) => {
  const { storeProfile } = useStoreSettings();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Dynamically uses the active store logo & name */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate('storefront')}>
            <img
              src={storeProfile.logoUrl}
              alt={storeProfile.businessName}
              className="w-10 h-10 rounded-xl object-cover bg-white p-0.5 border border-slate-200 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/default_store_logo.webp';
              }}
            />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight uppercase">
                {storeProfile.businessName}
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-none">
                Digital Commerce Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onNavigate('storefront')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'storefront' || currentView.startsWith('product-')
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              Katalog Produk
            </button>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentView.startsWith('admin-')
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Portal
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {onOpenLookup && (
              <button
                onClick={onOpenLookup}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Lacak pesanan dan unduh file Anda kembali"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Cek Pesanan</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('admin-simulator')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
              title="Uji coba webhook payment gateway & auto-delivery"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Webhook Sandbox
            </button>

            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Dashboard Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
