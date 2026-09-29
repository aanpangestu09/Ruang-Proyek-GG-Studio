import React, { useState, useRef } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  Monitor, 
  Smartphone, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Tag, 
  FileText, 
  Save, 
  RefreshCw, 
  Download, 
  Link as LinkIcon, 
  Type, 
  Paperclip, 
  Lock, 
  ShoppingBag, 
  ChevronDown, 
  HelpCircle, 
  ThumbsUp, 
  Package, 
  Shield, 
  MessageCircle, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Product, ProductFile, CheckoutPaymentMethodOption, CheckoutTrackingPixel } from '../../types/schema';
import { formatRupiah, formatBytes } from '../../lib/formatters';
import { useStoreSettings } from '../../context/StoreContext';
import { api } from '../../lib/api';

interface ProductFormulirBuilderProps {
  initialProduct?: Partial<Product> | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
  onClose: () => void;
}

// Brand SVG Icons for Tracking Tab
const FacebookIcon = () => (
  <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center shrink-0 shadow-xs">
    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  </div>
);

const TikTokIcon = () => (
  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 shadow-xs">
    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  </div>
);

const GoogleAdsIcon = () => (
  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs p-0.5">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  </div>
);

const GTMIcon = () => (
  <div className="w-5 h-5 rounded-md bg-[#246FDB] flex items-center justify-center shrink-0 shadow-xs">
    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l-8-4v8l8 4 8-4v-8l-8 4z" />
    </svg>
  </div>
);

const SnackVideoIcon = () => (
  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 shadow-xs border border-amber-400">
    <div className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]" />
  </div>
);

export const ProductFormulirBuilder: React.FC<ProductFormulirBuilderProps> = ({
  initialProduct,
  onSave,
  onClose
}) => {
  const { storeProfile } = useStoreSettings();

  // Stepper state: 1 = Tambah Produk, 2 = Halaman Checkout, 3 = Desain Halaman Sukses
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Preview device state: 'desktop' | 'mobile'
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Interactive preview state for bump
  const [previewBumpChecked, setPreviewBumpChecked] = useState(false);

  // Uploading state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // File input refs
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const bumpImageInputRef = useRef<HTMLInputElement>(null);
  const digitalFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // STEP 1 STATE: INFORMASI PRODUK
  // ----------------------------------------------------
  const [name, setName] = useState<string>(initialProduct?.name || '');
  const [slug, setSlug] = useState<string>(initialProduct?.slug || '');
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialProduct?.slug));
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || 'cat_architecture');
  const [categoryName, setCategoryName] = useState(initialProduct?.categoryName || 'Arsitektur & Konstruksi');

  // Foto / Thumbnail Utama Produk
  const [bannerImage, setBannerImage] = useState<string>(
    initialProduct?.thumbnail ||
    initialProduct?.checkoutConfig?.bannerImage ||
    '/assets/images/buku_kas_banner_1790626196511.jpg'
  );

  // Produk Digital delivery mode: 'FILE' | 'LINK' | 'TEXT'
  const [deliveryMode, setDeliveryMode] = useState<'FILE' | 'LINK' | 'TEXT'>(
    initialProduct?.deliveryMode || 'FILE'
  );

  const [uploadedFileName, setUploadedFileName] = useState<string>(
    initialProduct?.files?.[0]?.fileName || 'Master_File_Produk.zip'
  );
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(
    initialProduct?.files?.[0]?.fileSizeBytes || 24500000
  );

  const [productLinkUrl, setProductLinkUrl] = useState<string>(
    initialProduct?.productLinkUrl || 'https://drive.google.com/drive/folders/project-vault-access'
  );
  const [productTextContent, setProductTextContent] = useState<string>(
    initialProduct?.productTextContent || 'Kode Lisensi & Instruksi Akses Master Proyek'
  );

  const [buyerDescription, setBuyerDescription] = useState<string>(
    initialProduct?.description ||
    'Paket produk digital lengkap dan siap pakai. Dilengkapi panduan instalasi, template premium, dan garansi update seumur hidup.'
  );

  // Batasan Akses Produk Digital
  const [enableAccessLimit, setEnableAccessLimit] = useState<boolean>(
    initialProduct?.enableAccessLimit ?? false
  );
  const [downloadLimit, setDownloadLimit] = useState<number>(initialProduct?.downloadLimit || 10);
  const [accessDurationDays, setAccessDurationDays] = useState<number>(initialProduct?.accessDurationDays || 0);

  // Harga Produk
  const [regularPrice, setRegularPrice] = useState<number>(initialProduct?.regularPrice || 499000);
  const [discountPrice, setDiscountPrice] = useState<number>(initialProduct?.discountPrice || 199000);
  const [hppPrice, setHppPrice] = useState<number>(initialProduct?.hppPrice || 35000);

  // Manajemen Stok
  const [sku, setSku] = useState<string>(
    initialProduct?.sku || 'RP-PROD-' + Math.floor(100 + Math.random() * 900)
  );

  // Bump Produk
  const [bumpActive, setBumpActive] = useState<boolean>(initialProduct?.orderBump?.isActive ?? true);
  const [bumpName, setBumpName] = useState<string>(
    initialProduct?.orderBump?.bumpName || 'AHSP 2026 LENGKAP: BINA MARGA, CIPTA KARYA & SDA'
  );
  const [bumpPrice, setBumpPrice] = useState<number>(initialProduct?.orderBump?.bumpPrice || 49000);
  const [bumpTagline, setBumpTagline] = useState<string>(
    initialProduct?.orderBump?.bumpTagline ||
    'Lengkapi referensi perhitungan konstruksi dalam 1 paket. Cocok untuk kebutuhan RAB dan analisa harga satuan.'
  );
  const [bumpThumbnail, setBumpThumbnail] = useState<string>(
    initialProduct?.orderBump?.bumpThumbnail || '/assets/images/ahsp_bump_thumb_1790626215648.jpg'
  );

  // Keamanan
  const [whatsappValidator, setWhatsappValidator] = useState<boolean>(
    initialProduct?.whatsappValidator ?? false
  );
  const [enableCaptcha, setEnableCaptcha] = useState<boolean>(
    initialProduct?.enableCaptcha ?? false
  );

  // Features list
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features || ['Akses Download Instan', 'Lisensi Komersial Lengkap', 'Gratis Update Versi Terbaru']
  );

  // ----------------------------------------------------
  // STEP 2 STATE: Halaman Checkout & Pelacakan (Tracking)
  // ----------------------------------------------------
  const [trustBadge1, setTrustBadge1] = useState(initialProduct?.checkoutConfig?.trustBadge1 || 'Garansi Uang Kembali');
  const [trustBadge2, setTrustBadge2] = useState(initialProduct?.checkoutConfig?.trustBadge2 || 'Jaminan Kepuasan');
  const [recipientTitle, setRecipientTitle] = useState(initialProduct?.checkoutConfig?.recipientTitle || 'Data Penerima:');
  const [noticeText, setNoticeText] = useState(
    initialProduct?.checkoutConfig?.noticeText ||
    '*Pastikan Email & WhatsApp benar. File akan otomatis dikirimkan langsung setelah pembayaran lunas.'
  );
  const [ctaText, setCtaText] = useState(initialProduct?.checkoutConfig?.ctaText || 'Beli Sekarang');

  // Tracking options
  const [conversionRule, setConversionRule] = useState<'EVERY' | 'ONCE'>('EVERY');
  const [activePixelTab, setActivePixelTab] = useState<'facebook' | 'tiktok' | 'google_ads' | 'gtm' | 'snack'>('facebook');

  const [facebookPixels, setFacebookPixels] = useState<CheckoutTrackingPixel[]>(
    initialProduct?.checkoutConfig?.tracking?.facebookPixels && initialProduct.checkoutConfig.tracking.facebookPixels.length > 0
      ? initialProduct.checkoutConfig.tracking.facebookPixels
      : [
          {
            id: '109283746152839',
            name: 'PIXEL UTAMA',
            events: ['Purchase'],
            serverSide: true,
            accessToken: '',
            triggerCondition: 'When order status is Processing',
            eventValue: 'Total Price',
            testEventCode: '',
            allProducts: true
          }
        ]
  );

  const [tiktokPixels, setTiktokPixels] = useState<CheckoutTrackingPixel[]>(
    initialProduct?.checkoutConfig?.tracking?.tiktokPixels || []
  );

  const [googleAdsPixels, setGoogleAdsPixels] = useState<CheckoutTrackingPixel[]>(
    initialProduct?.checkoutConfig?.tracking?.googleAds || []
  );

  const [gtmPixels, setGtmPixels] = useState<CheckoutTrackingPixel[]>(
    initialProduct?.checkoutConfig?.tracking?.googleTagManager || []
  );

  const [snackPixels, setSnackPixels] = useState<CheckoutTrackingPixel[]>(
    initialProduct?.checkoutConfig?.tracking?.snackVideo || []
  );

  // Modal State: "Tambah Pixel ID"
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
  const [modalPixelId, setModalPixelId] = useState('');
  const [modalPixelName, setModalPixelName] = useState('');
  const [modalServerSide, setModalServerSide] = useState(true);
  const [modalAccessToken, setModalAccessToken] = useState('');
  const [modalEventName, setModalEventName] = useState('Purchase');
  const [modalTriggerCondition, setModalTriggerCondition] = useState('When order status is Processing');
  const [modalEventValue, setModalEventValue] = useState('Total Price');
  const [modalTestEventCode, setModalTestEventCode] = useState('');
  const [modalAllProducts, setModalAllProducts] = useState(true);

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<CheckoutPaymentMethodOption[]>(
    initialProduct?.checkoutConfig?.paymentMethods || [
      {
        id: 'pm_qris',
        name: 'QRIS (Semua E-Wallet & Mobile Banking)',
        code: 'QRIS',
        adminFeeText: 'Bebas Biaya Admin',
        adminFeeAmount: 0,
        adminFeeType: 'FIXED',
        gatewayTag: 'Midtrans',
        logoType: 'QRIS',
        isActive: true
      },
      {
        id: 'pm_bca_va',
        name: 'BCA Virtual Account',
        code: 'VA_BCA',
        adminFeeText: 'Admin fee Rp4.440',
        adminFeeAmount: 4440,
        adminFeeType: 'FIXED',
        gatewayTag: 'Midtrans',
        logoType: 'BCA',
        isActive: true
      },
      {
        id: 'pm_bri_va',
        name: 'BRI Virtual Account',
        code: 'VA_BRI',
        adminFeeText: 'Admin fee Rp4.440',
        adminFeeAmount: 4440,
        adminFeeType: 'FIXED',
        gatewayTag: 'Midtrans',
        logoType: 'BRI',
        isActive: true
      },
      {
        id: 'pm_mandiri_va',
        name: 'Mandiri Virtual Account',
        code: 'VA_MANDIRI',
        adminFeeText: 'Admin fee Rp4.440',
        adminFeeAmount: 4440,
        adminFeeType: 'FIXED',
        gatewayTag: 'Midtrans',
        logoType: 'MANDIRI',
        isActive: true
      }
    ]
  );

  // ----------------------------------------------------
  // STEP 3 STATE: Desain Halaman Sukses
  // ----------------------------------------------------
  const [successHeadline, setSuccessHeadline] = useState(
    initialProduct?.checkoutConfig?.successPage?.headline || 'Terima Kasih, Pesanan Anda Berhasil Diproses!'
  );
  const [successMessage, setSuccessMessage] = useState(
    initialProduct?.checkoutConfig?.successPage?.message ||
    'Link unduhan produk digital dan lisensi telah dikirimkan ke email Anda. Anda juga dapat mengunduh langsung melalui tombol di bawah ini.'
  );
  const [whatsappSupport, setWhatsappSupport] = useState(
    initialProduct?.checkoutConfig?.successPage?.whatsappSupport || storeProfile.supportWhatsapp || '6281234567890'
  );

  // Handle Name Change with auto-slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugCustomized) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (file: File, target: 'main' | 'bump') => {
    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await api.uploadImage(base64);
        const finalUrl = res.url || base64;
        if (target === 'main') {
          setBannerImage(finalUrl);
        } else if (target === 'bump') {
          setBumpThumbnail(finalUrl);
        }
      } catch (err) {
        console.error('Image upload failed, fallback to data url', err);
        if (target === 'main') setBannerImage(base64);
        if (target === 'bump') setBumpThumbnail(base64);
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Digital File Upload Handler
  const handleDigitalFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    setUploadedFileSize(file.size);
  };

  // Pixel Helpers
  const handleOpenAddPixelModal = () => {
    setModalPixelId('');
    setModalPixelName('');
    setModalServerSide(true);
    setModalAccessToken('');
    setModalEventName('Purchase');
    setModalTriggerCondition('When order status is Processing');
    setModalEventValue('Total Price');
    setModalTestEventCode('');
    setModalAllProducts(true);
    setIsPixelModalOpen(true);
  };

  const handleSaveModalPixel = () => {
    if (!modalPixelId.trim()) {
      alert('Mohon masukkan Pixel Id');
      return;
    }

    const newPixel: CheckoutTrackingPixel = {
      id: modalPixelId.trim(),
      name: modalPixelName.trim() || `Pixel ${modalPixelId.trim()}`,
      events: [modalEventName],
      serverSide: modalServerSide,
      accessToken: modalAccessToken.trim(),
      triggerCondition: modalTriggerCondition,
      eventValue: modalEventValue,
      testEventCode: modalTestEventCode.trim(),
      allProducts: modalAllProducts
    };

    if (activePixelTab === 'facebook') setFacebookPixels([...facebookPixels, newPixel]);
    else if (activePixelTab === 'tiktok') setTiktokPixels([...tiktokPixels, newPixel]);
    else if (activePixelTab === 'google_ads') setGoogleAdsPixels([...googleAdsPixels, newPixel]);
    else if (activePixelTab === 'gtm') setGtmPixels([...gtmPixels, newPixel]);
    else if (activePixelTab === 'snack') setSnackPixels([...snackPixels, newPixel]);

    setIsPixelModalOpen(false);
  };

  const handleDeletePixel = (platform: string, id: string) => {
    if (platform === 'facebook') setFacebookPixels(facebookPixels.filter(p => p.id !== id));
    if (platform === 'tiktok') setTiktokPixels(tiktokPixels.filter(p => p.id !== id));
    if (platform === 'google_ads') setGoogleAdsPixels(googleAdsPixels.filter(p => p.id !== id));
    if (platform === 'gtm') setGtmPixels(gtmPixels.filter(p => p.id !== id));
    if (platform === 'snack') setSnackPixels(snackPixels.filter(p => p.id !== id));
  };

  const getCurrentTabPixels = () => {
    if (activePixelTab === 'facebook') return facebookPixels;
    if (activePixelTab === 'tiktok') return tiktokPixels;
    if (activePixelTab === 'google_ads') return googleAdsPixels;
    if (activePixelTab === 'gtm') return gtmPixels;
    if (activePixelTab === 'snack') return snackPixels;
    return [];
  };

  // Construct Live Product Object
  const livePreviewProduct: Product = {
    id: initialProduct?.id || 'preview_prod',
    name: name || 'Nama Produk Digital',
    slug: slug || 'produk-digital',
    shortDescription: buyerDescription.slice(0, 100),
    description: buyerDescription,
    thumbnail: bannerImage,
    gallery: [bannerImage],
    categoryId,
    categoryName,
    regularPrice: Number(regularPrice) || 0,
    discountPrice: Number(discountPrice) || 0,
    hppPrice: Number(hppPrice) || 0,
    productType: 'BUNDLE',
    status: 'ACTIVE',
    sku: sku || 'PROD001',
    deliveryMode,
    productLinkUrl,
    productTextContent,
    enableAccessLimit,
    whatsappValidator,
    enableCaptcha,
    features,
    files: [
      {
        id: 'file_1',
        productId: initialProduct?.id || 'preview_prod',
        fileName: uploadedFileName,
        fileSizeBytes: uploadedFileSize,
        mimeType: 'application/octet-stream',
        storagePath: `vault/files/${uploadedFileName}`,
        fileType: 'ZIP',
        version: '1.0'
      }
    ],
    accessDurationDays: enableAccessLimit ? accessDurationDays : 0,
    downloadLimit: enableAccessLimit ? downloadLimit : 10,
    orderBump: {
      id: 'bump_1',
      productId: initialProduct?.id || 'preview_prod',
      bumpName: bumpName,
      bumpTagline: bumpTagline,
      bumpPrice: Number(bumpPrice) || 0,
      bumpThumbnail: bumpThumbnail,
      isActive: bumpActive
    },
    checkoutConfig: {
      bannerImage,
      trustBadge1,
      trustBadge2,
      recipientTitle,
      noticeText,
      ctaText,
      paymentMethods: paymentMethods.filter((p) => p.isActive),
      tracking: {
        conversionRule,
        facebookPixels,
        tiktokPixels,
        googleAds: googleAdsPixels,
        googleTagManager: gtmPixels,
        snackVideo: snackPixels
      },
      successPage: {
        headline: successHeadline,
        message: successMessage,
        whatsappSupport
      }
    },
    createdAt: initialProduct?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleSaveAll = async () => {
    if (!name.trim()) {
      alert('Silakan masukkan Nama Produk terlebih dahulu.');
      setCurrentStep(1);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...livePreviewProduct,
        id: initialProduct?.id && initialProduct.id !== 'preview_prod' ? initialProduct.id : undefined,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        regularPrice: Number(regularPrice) || 0,
        discountPrice: Number(discountPrice) || 0,
        hppPrice: Number(hppPrice) || 0
      });
    } catch (err: any) {
      console.error('Failed to save product', err);
      alert('Gagal menyimpan produk: ' + (err.message || 'Terjadi kesalahan sistem'));
    } finally {
      setIsSaving(false);
    }
  };

  // Preview Total Calculation
  const previewTotal = (Number(discountPrice) || 0) + (bumpActive && previewBumpChecked ? (Number(bumpPrice) || 0) : 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* 1. TOP BAR WITH STORE BRAND & 3-STEP NAVIGATION          */}
      {/* ======================================================== */}
      <header className="h-16 bg-[#00875a] text-white flex items-center justify-between px-6 shrink-0 shadow-md">
        {/* Dynamic Store Brand */}
        <div className="flex items-center gap-3">
          <img
            src={storeProfile.logoUrl}
            alt={storeProfile.businessName}
            className="w-9 h-9 rounded-xl object-cover bg-white p-0.5 border border-white/20 shadow-xs"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/default_store_logo.webp';
            }}
          />
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight uppercase text-white block leading-tight">
              {storeProfile.businessName}
            </span>
            <span className="text-[10px] text-emerald-200 font-semibold block uppercase tracking-wider">
              {initialProduct?.id ? 'Edit Produk Digital' : 'Tambah Produk Baru'}
            </span>
          </div>
        </div>

        {/* 3-Step Wizard Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-bold">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-white/20 text-white font-extrabold'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 1
                  ? 'bg-white text-[#00875a]'
                  : 'bg-emerald-800/80 text-white border border-emerald-400/40'
              }`}
            >
              1
            </div>
            <span>Informasi Produk</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-white/20 text-white font-extrabold'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 2
                  ? 'bg-white text-[#00875a]'
                  : 'bg-emerald-800/80 text-white border border-emerald-400/40'
              }`}
            >
              2
            </div>
            <span>Halaman Checkout</span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-white/20 text-white font-extrabold'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 3
                  ? 'bg-white text-[#00875a]'
                  : 'bg-emerald-800/80 text-white border border-emerald-400/40'
              }`}
            >
              3
            </div>
            <span>Desain Sukses</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 bg-white hover:bg-emerald-50 text-[#00875a] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Produk'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SPLIT SCREEN: LEFT FORM BUILDER | RIGHT LIVE PREVIEW  */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* LEFT COLUMN: BUILDER SETTINGS */}
        <div className="w-full lg:w-[560px] xl:w-[620px] overflow-y-auto p-4 sm:p-6 border-r border-slate-200 bg-white">
          {/* ======================================================== */}
          {/* STEP 1: TAMBAH PRODUK                                    */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* CARD 0: INFORMASI UTAMA & FOTO PRODUK */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#00875a] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Informasi Utama & Foto Produk
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Nama produk, link URL, kategori, dan foto utama yang tampil di checkout
                    </p>
                  </div>
                </div>

                {/* Nama Produk */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Template Desain & RAB Proyek Arsitektur Pro"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#00875a] outline-none transition-all"
                  />
                </div>

                {/* Slug / Link URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Link URL / Slug Produk <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:border-[#00875a]">
                    <span className="px-3 text-xs font-semibold text-slate-400 bg-slate-100 border-r border-slate-200 py-2.5 select-none">
                      /p/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setIsSlugCustomized(true);
                        setSlug(e.target.value);
                      }}
                      placeholder="nama-produk-digital"
                      className="w-full px-3 py-2.5 text-xs font-mono text-slate-900 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Produk
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      setCategoryId('cat_' + e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_'));
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#00875a] outline-none"
                  >
                    <option value="Arsitektur & Konstruksi">Arsitektur & Konstruksi</option>
                    <option value="Template Excel & RAB">Template Excel & RAB</option>
                    <option value="Dokumen Legal & Kontrak">Dokumen Legal & Kontrak</option>
                    <option value="Bisnis & Finansial">Bisnis & Finansial</option>
                    <option value="E-Book & Panduan Digital">E-Book & Panduan Digital</option>
                    <option value="Software & Script">Software & Script</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Foto / Thumbnail Utama Produk */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Foto / Banner Utama Produk
                  </label>
                  
                  {/* File Upload Area */}
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={mainImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0], 'main');
                        }
                      }}
                    />

                    <div className="flex items-start gap-4">
                      {/* Image Preview Box */}
                      <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden relative group shrink-0">
                        {bannerImage ? (
                          <img
                            src={bannerImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/buku_kas_banner_1790626196511.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px]">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span>No Image</span>
                          </div>
                        )}
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Action buttons & URL input */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => mainImageInputRef.current?.click()}
                            className="px-3 py-1.5 bg-[#00875a] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih Gambar dari Komputer</span>
                          </button>

                          {bannerImage && (
                            <button
                              type="button"
                              onClick={() => setBannerImage('')}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-all cursor-pointer"
                            >
                              Hapus
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={bannerImage}
                          onChange={(e) => setBannerImage(e.target.value)}
                          placeholder="Atau tempel URL gambar di sini (https://...)"
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:bg-white focus:border-[#00875a] outline-none"
                        />
                        <p className="text-[10px] text-slate-400">
                          Format: JPG, PNG, WebP (Rasio 16:9 disarankan untuk banner checkout).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 1: PENGIRIMAN PRODUK DIGITAL */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Pengiriman Produk Digital
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pilih format pengiriman file digital kepada pembeli setelah pembayaran lunas
                    </p>
                  </div>
                </div>

                {/* 3 Delivery Mode Cards (File Produk, Produk Link, Produk Teks) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: File Produk */}
                  <div
                    onClick={() => setDeliveryMode('FILE')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryMode === 'FILE'
                        ? 'border-2 border-[#00875a] bg-emerald-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-[#00875a] mb-2 bg-slate-50">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      File Produk
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Download file langsung (ZIP/PDF/XLS)
                    </p>
                  </div>

                  {/* Option 2: Produk Link */}
                  <div
                    onClick={() => setDeliveryMode('LINK')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryMode === 'LINK'
                        ? 'border-2 border-[#00875a] bg-emerald-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 mb-2 bg-slate-50">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      Produk Link
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Tautan akses Google Drive / Cloud
                    </p>
                  </div>

                  {/* Option 3: Produk Teks */}
                  <div
                    onClick={() => setDeliveryMode('TEXT')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      deliveryMode === 'TEXT'
                        ? 'border-2 border-[#00875a] bg-emerald-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 mb-2 bg-slate-50">
                      <Type className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      Produk Teks
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Kode lisensi atau instruksi teks
                    </p>
                  </div>
                </div>

                {/* Upload or Input Area based on selection */}
                {deliveryMode === 'FILE' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={digitalFileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleDigitalFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    <div
                      onClick={() => digitalFileInputRef.current?.click()}
                      className="block p-6 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 text-center cursor-pointer transition-all"
                    >
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <Paperclip className="w-6 h-6 text-[#00875a]" />
                        <span className="text-xs font-bold text-slate-800">
                          Unggah File Produk Digital
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Klik untuk memilih file (ZIP, RAR, PDF, XLSX, DOCX, MP4)
                        </p>
                        {uploadedFileName && (
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-[#00875a] text-xs font-bold border border-emerald-200 shadow-xs">
                            <Download className="w-3.5 h-3.5" />
                            <span>{uploadedFileName}</span>
                            <span className="text-[10px] text-slate-400">({formatBytes(uploadedFileSize)})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {deliveryMode === 'LINK' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Link / URL Akses Digital
                    </label>
                    <input
                      type="url"
                      value={productLinkUrl}
                      onChange={(e) => setProductLinkUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#00875a] outline-none"
                    />
                  </div>
                )}

                {deliveryMode === 'TEXT' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Teks Lisensi / Instruksi Digital
                    </label>
                    <textarea
                      rows={3}
                      value={productTextContent}
                      onChange={(e) => setProductTextContent(e.target.value)}
                      placeholder="Masukkan kode lisensi atau teks rahasia..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#00875a] outline-none"
                    />
                  </div>
                )}

                {/* Deskripsi Produk Textarea */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Deskripsi Produk (Tampil di Halaman Checkout)
                  </label>
                  <textarea
                    rows={4}
                    value={buyerDescription}
                    onChange={(e) => setBuyerDescription(e.target.value)}
                    placeholder="Tulis deskripsi produk dan manfaatnya..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-[#00875a] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* CARD 2: HARGA PRODUK */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00875a] flex items-center justify-center shadow-xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Harga Produk
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tentukan harga normal coret dan harga promo checkout
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Harga Normal (Coret) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Harga Normal (Coret)
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:border-[#00875a]">
                      <span className="px-3 text-xs font-bold text-slate-500 border-r border-slate-200 bg-slate-100 py-2.5">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Harga Diskon / Jual */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Harga Jual / Promo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:border-[#00875a]">
                      <span className="px-3 text-xs font-bold text-[#00875a] border-r border-slate-200 bg-emerald-50 py-2.5">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* HPP */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    HPP (Harga Pokok Penjualan)
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50 max-w-xs">
                    <span className="px-3 text-xs font-bold text-slate-500 border-r border-slate-200 bg-slate-100 py-2">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={hppPrice}
                      onChange={(e) => setHppPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Digunakan untuk kalkulasi otomatis Net Profit di Dashboard.
                  </p>
                </div>
              </div>

              {/* CARD 3: MANAJEMEN STOK & SKU */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Manajemen Stok & SKU
                    </h3>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Contoh: RP-PROD-001"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* CARD 4: BUMP PRODUK (ORDER BUMP) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        Bump Produk (Order Bump)
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tawaran item tambahan di halaman checkout untuk menaikkan AOV
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                    <input
                      type="checkbox"
                      checked={bumpActive}
                      onChange={(e) => setBumpActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00875a]"></div>
                  </label>
                </div>

                {bumpActive && (
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Judul Penawaran Bump
                      </label>
                      <input
                        type="text"
                        value={bumpName}
                        onChange={(e) => setBumpName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Harga Tambahan Bump (Rp)
                      </label>
                      <input
                        type="number"
                        value={bumpPrice}
                        onChange={(e) => setBumpPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tagline / Keterangan Penawaran
                      </label>
                      <textarea
                        rows={2}
                        value={bumpTagline}
                        onChange={(e) => setBumpTagline(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    {/* Foto Thumbnail Bump */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Foto Thumbnail Bump
                      </label>
                      <input
                        type="file"
                        ref={bumpImageInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(e.target.files[0], 'bump');
                          }
                        }}
                      />

                      <div className="flex items-center gap-3">
                        <img
                          src={bumpThumbnail}
                          alt="Bump Thumb"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/ahsp_bump_thumb_1790626215648.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => bumpImageInputRef.current?.click()}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all"
                        >
                          Ganti Foto Bump
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 5: KEAMANAN & VALIDASI */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      Keamanan & Validasi Checkout
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">WhatsApp Validator</span>
                      <p className="text-[11px] text-slate-500">
                        Memvalidasi format nomor WhatsApp pembeli secara otomatis
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappValidator}
                      onChange={(e) => setWhatsappValidator(e.target.checked)}
                      className="w-4 h-4 text-[#00875a] rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Proteksi Anti-Bot Captcha</span>
                      <p className="text-[11px] text-slate-500">
                        Mencegah spam form checkout secara otomatis
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableCaptcha}
                      onChange={(e) => setEnableCaptcha(e.target.checked)}
                      className="w-4 h-4 text-[#00875a] rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 Navigation Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-[#00875a] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjut ke Halaman Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: HALAMAN CHECKOUT & TRACKING                      */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Gambar Banner Header Checkout */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Gambar Banner Halaman Checkout (Header Mockup)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={bannerImage}
                    alt="Banner"
                    className="w-20 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="URL Gambar Banner..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Teks Tombol Beli */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Teks Tombol Pembelian (CTA)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Beli Sekarang"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              {/* Metode Pembayaran Aktif */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  Pilihan Metode Pembayaran di Checkout
                </h3>

                <div className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      onClick={() => {
                        setPaymentMethods(
                          paymentMethods.map((p) => (p.id === pm.id ? { ...p, isActive: !p.isActive } : p))
                        );
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        pm.isActive ? 'bg-emerald-50/30 border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={pm.isActive}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#00875a] rounded"
                        />
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">{pm.name}</span>
                          <span className="text-[11px] text-slate-500">{pm.adminFeeText}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                        {pm.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pixel & Tracking per produk */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    Tracking & Pixel Produk
                  </h3>
                  <button
                    onClick={handleOpenAddPixelModal}
                    className="px-3 py-1.5 bg-[#00875a] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pixel ID</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 border-b border-slate-200 text-xs font-bold text-slate-600 pb-1">
                  <button
                    onClick={() => setActivePixelTab('facebook')}
                    className={`pb-2 border-b-2 flex items-center gap-1.5 ${
                      activePixelTab === 'facebook' ? 'border-[#00875a] text-[#00875a]' : 'border-transparent text-slate-500'
                    }`}
                  >
                    <FacebookIcon />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => setActivePixelTab('tiktok')}
                    className={`pb-2 border-b-2 flex items-center gap-1.5 ${
                      activePixelTab === 'tiktok' ? 'border-[#00875a] text-[#00875a]' : 'border-transparent text-slate-500'
                    }`}
                  >
                    <TikTokIcon />
                    <span>TikTok</span>
                  </button>
                  <button
                    onClick={() => setActivePixelTab('google_ads')}
                    className={`pb-2 border-b-2 flex items-center gap-1.5 ${
                      activePixelTab === 'google_ads' ? 'border-[#00875a] text-[#00875a]' : 'border-transparent text-slate-500'
                    }`}
                  >
                    <GoogleAdsIcon />
                    <span>Google Ads</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {getCurrentTabPixels().length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Belum ada Pixel ID untuk platform ini.
                    </div>
                  ) : (
                    getCurrentTabPixels().map((pix) => (
                      <div key={pix.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{pix.name}</span>
                          <span className="font-mono text-[11px] text-slate-500">ID: {pix.id}</span>
                        </div>
                        <button
                          onClick={() => handleDeletePixel(activePixelTab, pix.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Step 2 Navigation */}
              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  ← Kembali ke Produk
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-[#00875a] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Lanjut ke Desain Sukses</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: DESAIN HALAMAN SUKSES                            */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">
                  Langkah 3: Desain Halaman Sukses
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur pesan konfirmasi pembayaran, link WhatsApp support, dan instruksi pengiriman.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Ucapan Sukses
                </label>
                <input
                  type="text"
                  value={successHeadline}
                  onChange={(e) => setSuccessHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pesan Konfirmasi
                </label>
                <textarea
                  rows={3}
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp Bantuan Pembeli
                </label>
                <input
                  type="text"
                  value={whatsappSupport}
                  onChange={(e) => setWhatsappSupport(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  ← Kembali ke Checkout
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#00875a] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? 'Menyimpan...' : 'Terbitkan & Simpan Produk'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: COMPLETE DYNAMIC LIVE PREVIEW              */}
        {/* ======================================================== */}
        <div className="hidden lg:flex flex-col flex-1 overflow-y-auto bg-slate-100/70 p-6 items-center">
          {/* Device toggle bar */}
          <div className="mb-4 bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                previewDevice === 'desktop'
                  ? 'bg-white text-[#00875a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Preview</span>
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                previewDevice === 'mobile'
                  ? 'bg-white text-[#00875a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Preview</span>
            </button>
          </div>

          {/* Canvas container */}
          <div
            className={`transition-all duration-300 ${
              previewDevice === 'mobile'
                ? 'w-[390px] border-8 border-slate-900 rounded-[36px] shadow-2xl overflow-hidden bg-white'
                : 'w-full max-w-xl'
            }`}
          >
            {/* Form Checkout Preview */}
            <div className="w-full bg-white font-sans text-slate-800 shadow-sm sm:rounded-2xl border border-slate-200 overflow-hidden">
              {/* Header Banner Image */}
              {bannerImage && (
                <div className="w-full h-44 sm:h-52 bg-slate-200 overflow-hidden relative">
                  <img
                    src={bannerImage}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/buku_kas_banner_1790626196511.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-3 pb-2.5 px-4 flex items-center justify-center gap-6 text-xs font-bold text-slate-700 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00875a]" />
                  <span>{trustBadge1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-[#00875a]" />
                  <span>{trustBadge2}</span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-4 sm:p-6 space-y-5">
                {/* Product Title & Price Header */}
                <div className="space-y-1.5">
                  <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {name || 'Nama Produk Digital'}
                  </h2>

                  <div className="flex items-baseline gap-2.5 pt-1">
                    <span className="text-2xl font-black text-[#00875a]">
                      {formatRupiah(discountPrice || 0)}
                    </span>
                    {regularPrice > discountPrice && (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          {formatRupiah(regularPrice)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black">
                          HEMAT {Math.round(((regularPrice - discountPrice) / regularPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 pt-1 leading-relaxed line-clamp-3">
                    {buyerDescription}
                  </p>
                </div>

                {/* Data Penerima Form Mockup */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-xs text-slate-900 whitespace-nowrap">
                      {recipientTitle}
                    </h4>
                    <div className="flex-1 border-t border-slate-200" />
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      disabled
                      placeholder="Nama Lengkap Anda *"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400"
                    />
                    <input
                      type="tel"
                      disabled
                      placeholder="Nomor WhatsApp Anda *"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400"
                    />
                    <input
                      type="email"
                      disabled
                      placeholder="Alamat Email Anda *"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* ORDER BUMP CARD (Live Interactive) */}
                {bumpActive && (
                  <div
                    onClick={() => setPreviewBumpChecked(!previewBumpChecked)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      previewBumpChecked
                        ? 'border-[#00875a] bg-emerald-50/30'
                        : 'border-dashed border-amber-300 bg-amber-50/20 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={previewBumpChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#00875a] rounded mt-0.5 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                            PENAWARAN SPESIAL
                          </span>
                          <span className="text-xs font-black text-slate-900 block truncate">
                            {bumpName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                          {bumpTagline}
                        </p>
                        <div className="text-xs font-black text-[#00875a] mt-1.5">
                          + {formatRupiah(bumpPrice)}
                        </div>
                      </div>
                      {bumpThumbnail && (
                        <img
                          src={bumpThumbnail}
                          alt="Bump"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/ahsp_bump_thumb_1790626215648.jpg';
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Total Ringkasan Pembayaran */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Total Pembayaran:</span>
                  <span className="text-base font-black text-[#00875a]">
                    {formatRupiah(previewTotal)}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  className="w-full py-3.5 bg-[#00875a] hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>{ctaText} • {formatRupiah(previewTotal)}</span>
                </button>

                {/* Notice text */}
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  {noticeText}
                </p>

                {/* Dynamic Store Brand Copyright Footer */}
                <div className="text-center pt-3 border-t border-slate-100 space-y-1 text-slate-400 text-[11px]">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-slate-500">
                    <span>Powered by</span>
                    <img
                      src={storeProfile.logoUrl}
                      alt={storeProfile.businessName}
                      className="w-4 h-4 rounded-xs object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="uppercase text-slate-700 font-extrabold">
                      {storeProfile.businessName}
                    </span>
                  </div>
                  <div>Copyright © {new Date().getFullYear()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Pixel ID */}
      {isPixelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Tambah Pixel ID</h3>
              <button onClick={() => setIsPixelModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pixel ID *</label>
                <input
                  type="text"
                  value={modalPixelId}
                  onChange={(e) => setModalPixelId(e.target.value)}
                  placeholder="Contoh: 109283746152839"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Pixel</label>
                <input
                  type="text"
                  value={modalPixelName}
                  onChange={(e) => setModalPixelName(e.target.value)}
                  placeholder="Contoh: Pixel Iklan FB 01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">Kirim Server-Side (CAPI)</span>
                <input
                  type="checkbox"
                  checked={modalServerSide}
                  onChange={(e) => setModalServerSide(e.target.checked)}
                  className="w-4 h-4 text-[#00875a] rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsPixelModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveModalPixel}
                className="px-4 py-1.5 bg-[#00875a] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Simpan Pixel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
