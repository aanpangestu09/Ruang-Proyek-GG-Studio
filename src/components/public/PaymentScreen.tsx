import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Order } from '../../types/schema';
import { formatRupiah } from '../../lib/formatters';
import { api } from '../../lib/api';

interface PaymentScreenProps {
  orderId: string;
  paymentDetails: any;
  onPaymentSuccess: (order: Order) => void;
  onCancel: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  orderId,
  paymentDetails,
  onPaymentSuccess,
  onCancel
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Poll order status every 3 seconds to detect webhook completion
  useEffect(() => {
    let interval: any;
    const fetchStatus = async () => {
      try {
        const fetched = await api.getOrder(orderId);
        if (fetched) {
          setOrder(fetched);
          if (fetched.paymentStatus === 'PAID') {
            clearInterval(interval);
            onPaymentSuccess(fetched);
          }
        }
      } catch (err) {
        console.error('Failed to poll order status', err);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId, onPaymentSuccess]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Simulate payment webhook trigger (Midtrans / Xendit simulator)
  const handleSimulatePaymentWebhook = async () => {
    if (!order) return;
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const res = await api.triggerWebhook({
        orderNumber: order.orderNumber,
        transactionId: `TRX-${Date.now()}`,
        transactionStatus: 'settlement',
        grossAmount: order.totalAmount
      });

      if (res.success) {
        setSimulationResult('✅ Webhook Berhasil Diverifikasi! Order status diubah ke PAID & Produk Digital telah dikirim.');
        // Refresh order
        const updated = await api.getOrder(orderId);
        if (updated && updated.paymentStatus === 'PAID') {
          setTimeout(() => {
            onPaymentSuccess(updated);
          }, 1200);
        }
      } else {
        setSimulationResult(`❌ Gagal: ${res.message}`);
      }
    } catch (err: any) {
      setSimulationResult(`❌ Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const isQris = paymentDetails?.method === 'QRIS';
  const isVA = paymentDetails?.method?.startsWith('VA_');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm text-white">
              RP
            </span>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">RUANG PROYEK PAYMENT GATEWAY</h2>
              <p className="text-xs text-slate-400">Order ID: {order?.orderNumber || orderId}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Pembayaran</span>
          </span>
        </div>

        {/* Total Amount Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">
            Total yang Harus Dibayar Tepat
          </span>
          <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono tracking-tight">
            {formatRupiah(paymentDetails?.amount || order?.totalAmount || 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Pastikan membayar sesuai nominal di atas agar diverifikasi secara otomatis.
          </p>
        </div>

        {/* METHOD 1: QRIS SCREEN */}
        {isQris && (
          <div className="mt-6 text-center">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl border border-slate-200">
              <img
                src={paymentDetails?.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=RuangProyekQRIS'}
                alt="QRIS Ruang Proyek"
                className="w-56 h-56 mx-auto object-contain"
              />
              <div className="mt-2 text-slate-900 text-xs font-extrabold tracking-wide uppercase">
                NMID: ID102002918239019
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-300">
              Pindai QRIS di atas menggunakan aplikasi perbankan atau e-wallet pilihan Anda:
            </p>
            <div className="mt-2 flex flex-wrap justify-center items-center gap-2 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 bg-slate-700/60 rounded">BCA Mobile</span>
              <span className="px-2 py-0.5 bg-slate-700/60 rounded">Livin Mandiri</span>
              <span className="px-2 py-0.5 bg-slate-700/60 rounded">GoPay</span>
              <span className="px-2 py-0.5 bg-slate-700/60 rounded">OVO</span>
              <span className="px-2 py-0.5 bg-slate-700/60 rounded">ShopeePay</span>
              <span className="px-2 py-0.5 bg-slate-700/60 rounded">DANA</span>
            </div>
          </div>
        )}

        {/* METHOD 2: VIRTUAL ACCOUNT SCREEN */}
        {isVA && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Nomor Virtual Account {paymentDetails?.bankName}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wider">
                  {paymentDetails?.vaNumber || '800012398129381'}
                </span>
                <button
                  onClick={() => copyToClipboard(paymentDetails?.vaNumber || '')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin' : 'Salin Nomor'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Instructions Accordion */}
        <div className="mt-6 pt-5 border-t border-slate-700">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Panduan Pembayaran:
          </h4>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
            {paymentDetails?.instructions?.map((inst: string, i: number) => (
              <li key={i}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE WEBHOOK SIMULATOR BUTTON (DEMO / TESTING)    */}
        {/* ======================================================== */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-800 border border-blue-500/30">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Simulasi Pembayaran (Payment Gateway Webhook)
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Klik tombol di bawah untuk menguji respons webhook payment gateway nyata. Sistem backend akan memvalidasi payload, menandai order LUNAS, meng-generate token download, dan mengirimkan notifikasi Email, WhatsApp, serta Telegram otomatis!
              </p>

              <button
                type="button"
                onClick={handleSimulatePaymentWebhook}
                disabled={isSimulating}
                className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses Webhook & Pengiriman File...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>⚡ Simulasikan Pembayaran Sukses (Kirim Webhook)</span>
                  </>
                )}
              </button>

              {simulationResult && (
                <div className="mt-2.5 p-2 bg-slate-900/90 rounded-lg text-[11px] text-emerald-300 font-mono">
                  {simulationResult}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer cancel / back */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onCancel}
            className="hover:text-slate-200 transition-colors"
          >
            ← Batal & Pilih Produk Lain
          </button>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Webhook Otomatis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
