import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  FolderDown,
  Copy,
  Key
} from 'lucide-react';
import { Order, Product } from '../../types/schema';
import { formatRupiah } from '../../lib/formatters';

interface ThankYouPageProps {
  order: Order;
  recommendedProducts?: Product[];
  onGoToDownload: (token: string) => void;
  onSelectProduct: (slug: string) => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  order,
  recommendedProducts = [],
  onGoToDownload,
  onSelectProduct
}) => {
  useEffect(() => {
    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails in headless env
    }
  }, []);

  const mainItem = order.items.find(i => i.itemType === 'MAIN') || order.items[0];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            ✓ Pembayaran Berhasil Dikonfirmasi
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            Terima Kasih, {order.customerName}!
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Pembayaran Anda untuk pesanan <strong className="text-slate-900 font-mono">{order.orderNumber}</strong> telah sukses diverifikasi secara otomatis.
          </p>

          {/* Order Summary Snapshot */}
          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Produk:</span>
              <span className="font-bold text-slate-900 text-right">{mainItem?.productName}</span>
            </div>
            {order.orderBumpAdded && (
              <div className="flex justify-between text-xs sm:text-sm text-blue-700">
                <span>Bonus Order Bump:</span>
                <span className="font-semibold">Termasuk di dalam paket</span>
              </div>
            )}
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Metode Pembayaran:</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm pt-2 border-t border-slate-200">
              <span className="text-slate-500">Total Dibayar:</span>
              <span className="text-base font-black text-blue-600">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>

          {/* License Key if software */}
          {order.licenseKey && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> License Key Produk Anda:
                </span>
                <span className="text-base font-mono font-black text-slate-900 mt-1 block">
                  {order.licenseKey}
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(order.licenseKey || '')}
                className="px-3 py-1.5 bg-amber-200 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-300"
              >
                Salin Key
              </button>
            </div>
          )}

          {/* PRIMARY DOWNLOAD / ACCESS CTA */}
          <div className="mt-8">
            <button
              onClick={() => onGoToDownload(order.downloadToken || '')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-6 h-6" />
              <span>DOWNLOAD & AKSES PRODUK SEKARANG</span>
            </button>
          </div>

          {/* Delivery notice note */}
          <div className="mt-6 p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Tautan download cadangan telah otomatis dikirimkan ke <strong>{order.customerEmail}</strong> dan WhatsApp <strong>{order.customerPhone}</strong>.
            </span>
          </div>

          {/* Contact Support */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Hubungi Dukungan WhatsApp (0812-3456-7890)</span>
            </a>
          </div>
        </div>

        {/* CROSS-SELL RECOMMENDATIONS */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                REKOMENDASI SPESIAL UNTUK ANDA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Produk Lain yang Mungkin Anda Butuhkan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase">
                        {p.categoryName}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {p.name}
                      </h4>
                      <p className="mt-1 text-xs font-black text-slate-900">
                        {formatRupiah(p.discountPrice)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(p.slug)}
                    className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <span>Lihat Detail Produk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
