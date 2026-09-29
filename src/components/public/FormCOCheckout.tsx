import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ThumbsUp, 
  Check, 
  Lock, 
  FileCheck2, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Product, PaymentMethod } from '../../types/schema';
import { formatRupiah } from '../../lib/formatters';

export interface FormCOCheckoutProps {
  product: Product;
  isPreview?: boolean;
  onPaymentCreated?: (orderId: string, paymentDetails: any) => void;
  onBack?: () => void;
  // Overrides from builder live preview
  previewBumpChecked?: boolean;
  onTogglePreviewBump?: (checked: boolean) => void;
  customBannerImage?: string;
  customBumpTitle?: string;
  customBumpPrice?: number;
  customBumpTagline?: string;
  customBumpThumbnail?: string;
  customPaymentMethods?: any[];
}

export const FormCOCheckout: React.FC<FormCOCheckoutProps> = ({
  product,
  isPreview = false,
  onPaymentCreated,
  onBack,
  previewBumpChecked,
  onTogglePreviewBump,
  customBannerImage,
  customBumpTitle,
  customBumpPrice,
  customBumpTagline,
  customBumpThumbnail,
  customPaymentMethods
}) => {
  // Form input states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Bump selection state
  const [bumpCheckedInternal, setBumpCheckedInternal] = useState(false);
  const isBumpChecked = isPreview && previewBumpChecked !== undefined ? previewBumpChecked : bumpCheckedInternal;

  const toggleBump = () => {
    if (isPreview && onTogglePreviewBump) {
      onTogglePreviewBump(!isBumpChecked);
    } else {
      setBumpCheckedInternal(!bumpCheckedInternal);
    }
  };

  // Payment method selection state
  const defaultMethodCode = 'VA_BRI';
  const [selectedMethodCode, setSelectedMethodCode] = useState<string>(defaultMethodCode);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Product details & Fallbacks
  const regularPrice = product.regularPrice || 249000;
  const discountPrice = product.discountPrice || 99000;
  
  // Bump details & Fallbacks
  const bumpTitle = customBumpTitle || product.orderBump?.bumpName || 'AHSP 2026 LENGKAP: BINA MARGA, CIPTA KARYA & SDA';
  const bumpPrice = customBumpPrice !== undefined ? customBumpPrice : (product.orderBump?.bumpPrice || 49000);
  const bumpTagline = customBumpTagline || product.orderBump?.bumpTagline || 'Lengkapi referensi perhitungan konstruksi dalam 1 paket. Cocok untuk kebutuhan RAB, analisa harga satuan, dan pekerjaan konstruksi. Cocok untuk Kontraktor, Konsultan, Engineer, QS, Pelaksana, dan praktisi konstruksi yang membutuhkan referensi AHSP dalam pekerjaan sehari-hari.';
  const bumpThumbnail = customBumpThumbnail || product.orderBump?.bumpThumbnail || '/src/assets/images/ahsp_bump_thumb_1790626215648.jpg';

  const bannerImage = customBannerImage || product.checkoutConfig?.bannerImage || product.thumbnail || '/src/assets/images/buku_kas_banner_1790626196511.jpg';

  // Payment methods list (defaults to the 5 methods shown in the screenshot)
  const paymentMethodsList = customPaymentMethods || product.checkoutConfig?.paymentMethods || [
    {
      id: 'pm_bri_va',
      name: 'BRI Virtual Account',
      code: 'VA_BRI',
      adminFeeText: 'Admin fee Rp4.440',
      adminFeeAmount: 4440,
      adminFeeType: 'FIXED',
      gatewayTag: 'Midtrans',
      logoType: 'BRI'
    },
    {
      id: 'pm_bca_va',
      name: 'BCA Virtual Account',
      code: 'VA_BCA',
      adminFeeText: 'Admin fee Rp4.440',
      adminFeeAmount: 4440,
      adminFeeType: 'FIXED',
      gatewayTag: 'Midtrans',
      logoType: 'BCA'
    },
    {
      id: 'pm_qris',
      name: 'QRIS',
      code: 'QRIS',
      adminFeeText: 'Admin fee 0.7%',
      adminFeeAmount: Math.round(discountPrice * 0.007),
      adminFeeType: 'PERCENT',
      gatewayTag: 'Midtrans',
      logoType: 'QRIS'
    },
    {
      id: 'pm_mandiri_bill',
      name: 'Mandiri Bill',
      code: 'VA_MANDIRI',
      adminFeeText: 'Admin fee Rp4.440',
      adminFeeAmount: 4440,
      adminFeeType: 'FIXED',
      gatewayTag: 'Midtrans',
      logoType: 'MANDIRI'
    },
    {
      id: 'pm_bni_va',
      name: 'BNI Virtual Account',
      code: 'VA_BNI',
      adminFeeText: 'Admin fee Rp4.440',
      adminFeeAmount: 4440,
      adminFeeType: 'FIXED',
      gatewayTag: 'Midtrans',
      logoType: 'BNI'
    }
  ];

  const currentPayment = paymentMethodsList.find((p: any) => p.code === selectedMethodCode) || paymentMethodsList[0];
  const adminFee = currentPayment?.adminFeeAmount || 4440;

  // Calculation
  const subtotal = discountPrice + (isBumpChecked ? bumpPrice : 0);
  const grandTotal = subtotal + adminFee;

  // Real checkout submit
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) return;

    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Nama Anda wajib diisi.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Nomor WhatsApp aktif wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Email Anda wajib diisi dengan benar.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          paymentMethod: selectedMethodCode,
          includeOrderBump: isBumpChecked
        })
      });

      const res = await response.json();
      if (res.success && res.order && res.payment) {
        if (onPaymentCreated) {
          onPaymentCreated(res.order.id, res.payment);
        }
      } else {
        setErrorMessage(res.message || 'Gagal memproses pesanan.');
      }
    } catch (err: any) {
      setErrorMessage('Gagal menghubungi server pembayaran.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render SVG Bank Logos
  const renderBankLogo = (type: string) => {
    switch (type) {
      case 'BRI':
        return (
          <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center text-[10px] font-black text-white tracking-tighter">
            BRI
          </div>
        );
      case 'BCA':
        return (
          <div className="w-10 h-6 bg-[#00529C] rounded flex items-center justify-center text-[10px] font-black text-white tracking-tighter">
            BCA
          </div>
        );
      case 'QRIS':
        return (
          <div className="w-10 h-6 bg-slate-900 rounded flex items-center justify-center text-[9px] font-black text-white tracking-tighter">
            QRIS
          </div>
        );
      case 'MANDIRI':
        return (
          <div className="w-10 h-6 bg-[#003d79] rounded flex items-center justify-center text-[8px] font-black text-amber-400 tracking-tighter">
            mandiri
          </div>
        );
      case 'BNI':
        return (
          <div className="w-10 h-6 bg-[#f15a24] rounded flex items-center justify-center text-[10px] font-black text-white tracking-tighter">
            BNI
          </div>
        );
      default:
        return (
          <div className="w-10 h-6 bg-slate-700 rounded flex items-center justify-center text-[9px] font-bold text-white">
            BANK
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white font-sans text-slate-800 shadow-sm sm:rounded-2xl border border-slate-200/80 overflow-hidden">
      {/* 1. TOP TRUST BADGES */}
      <div className="pt-4 pb-3 px-4 flex items-center justify-center gap-6 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
          </div>
          <span className="leading-tight">Garansi Uang<br className="sm:hidden" /> Kembali</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <ThumbsUp className="w-3.5 h-3.5 text-slate-800" />
          </div>
          <span className="leading-tight">Jaminan<br className="sm:hidden" /> Kepuasan</span>
        </div>
      </div>

      {/* 2. PRODUCT BANNER IMAGE */}
      <div className="px-4">
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
          <img
            src={bannerImage}
            alt={product.name}
            className="w-full h-auto object-cover max-h-80"
            onError={(e: any) => {
              e.target.src = '/src/assets/images/buku_kas_banner_1790626196511.jpg';
            }}
          />
        </div>
      </div>

      <form onSubmit={handleProceedToPayment} className="p-4 sm:p-6 space-y-6">
        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3. DATA PENERIMA */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight whitespace-nowrap">
              Data Penerima:
            </h3>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <div className="space-y-2.5">
            <div>
              <input
                type="text"
                placeholder="Nama Anda *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPreview}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="No. WhatsApp Anda *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPreview}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Anda *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPreview}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* 4. ORDER BUMP BOX (Exact Style) */}
        <div className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/50 p-4 space-y-3.5 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-amber-300 shrink-0 bg-slate-900 shadow-xs">
              <img
                src={bumpThumbnail}
                alt={bumpTitle}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = '/src/assets/images/ahsp_bump_thumb_1790626215648.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                {bumpTitle}
              </h4>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 mt-0.5">
                {formatRupiah(bumpPrice)}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-3 sm:line-clamp-4">
                {bumpTagline}
              </p>
            </div>
          </div>

          {/* Bump Checkbox Box */}
          <div
            onClick={toggleBump}
            className={`w-full p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer select-none transition-all ${
              isBumpChecked
                ? 'bg-amber-100 border-amber-400 text-slate-900 font-bold'
                : 'bg-amber-100/60 border-amber-300/80 hover:bg-amber-100 text-slate-800 font-semibold'
            }`}
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                isBumpChecked
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-400'
              }`}
            >
              {isBumpChecked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-xs sm:text-sm tracking-tight">
              Tambahkan Paket AHSP 2026
            </span>
          </div>
        </div>

        {/* 5. METODE PEMBAYARAN */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight whitespace-nowrap">
              Metode Pembayaran:
            </h3>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <div className="space-y-2">
            {paymentMethodsList.map((pm: any) => {
              const isSelected = selectedMethodCode === pm.code;

              return (
                <div
                  key={pm.id}
                  onClick={() => setSelectedMethodCode(pm.code)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio indicator */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-blue-600'
                          : 'border-slate-400'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>

                    {/* Bank Logo */}
                    {renderBankLogo(pm.logoType || 'BRI')}

                    {/* Bank Title and Admin fee */}
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                        {pm.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {pm.adminFeeText}
                      </div>
                    </div>
                  </div>

                  {/* Midtrans Pill Tag */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold font-mono shrink-0">
                    <span className="text-[9px] text-blue-500 font-black">|||</span>
                    <span>{pm.gatewayTag || 'Midtrans'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. NOTICE MESSAGE */}
        <div className="text-center py-1">
          <p className="text-xs font-bold text-slate-800 leading-relaxed">
            *Pastikan Email dengan benar. Produk Akan terkirim secara otomatis melalui Email setelah pembayaran.
          </p>
        </div>

        {/* 7. RINCIAN PESANAN */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Rincian Pesanan
          </h4>

          <div className="space-y-2 text-xs sm:text-sm">
            {/* Main Product */}
            <div className="flex items-start justify-between">
              <span className="text-slate-700">
                (1x) {product.name || 'Laporan Kas Proyek Otomatis'}
              </span>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">
                  {formatRupiah(discountPrice)}
                </span>
                <span className="text-[11px] text-red-500 line-through block">
                  {formatRupiah(regularPrice)}
                </span>
              </div>
            </div>

            {/* Bump Product if checked */}
            {isBumpChecked && (
              <div className="flex items-start justify-between text-amber-900 pt-1 border-t border-slate-100">
                <span className="text-slate-700">
                  (1x) {bumpTitle}
                </span>
                <span className="font-bold text-slate-900">
                  {formatRupiah(bumpPrice)}
                </span>
              </div>
            )}

            {/* Payment Admin Fee */}
            <div className="flex items-start justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-700 block">{currentPayment?.name || 'Virtual Account'}</span>
                <span className="text-[11px] text-slate-400">{currentPayment?.adminFeeText}</span>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(adminFee)}
              </span>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-black">
              <span className="text-sm sm:text-base text-slate-800">
                Total
              </span>
              <span className="text-base sm:text-lg text-[#00a624]">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* 8. BIG GREEN CTA BUTTON */}
        <button
          type="submit"
          disabled={isLoading || isPreview}
          className="w-full py-3.5 bg-[#00a624] hover:bg-[#008f1f] active:bg-[#00781a] disabled:bg-[#00a624]/70 text-white font-extrabold text-base rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Memproses Pesanan...</span>
            </>
          ) : (
            <span>Beli Sekarang</span>
          )}
        </button>

        {/* 9. DIGITAL PRODUCT GUARANTEE BADGE */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-xs sm:text-sm text-emerald-800">
              Produk Digital
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Produk akan dikirimkan ke kamu langsung setelah proses pembelian
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        {/* 10. COPYRIGHT */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400">
            Copyright © 2026
          </p>
        </div>
      </form>
    </div>
  );
};
