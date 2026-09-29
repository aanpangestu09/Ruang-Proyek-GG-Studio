import React, { useState } from 'react';
import { 
  FolderDown, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Layers, 
  FileSpreadsheet, 
  FileCode, 
  FileArchive,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Product } from '../../types/schema';
import { formatRupiah } from '../../lib/formatters';

interface StorefrontProps {
  products: Product[];
  onSelectProduct: (slug: string) => void;
  onDirectCheckout: (slug: string) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  onSelectProduct,
  onDirectCheckout
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'ALL', label: 'Semua Produk' },
    { id: 'cat_architecture', label: 'Arsitektur & Konstruksi' },
    { id: 'cat_finance', label: 'Bisnis & Finansial' },
    { id: 'cat_design', label: 'Desain & UI/UX' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Platform Penjualan Aset & Produk Digital Mandiri #1</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Aset Digital Profesional Siap Pakai Untuk Mempercepat Proyek Anda
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Template AutoCAD, 3D SketchUp, Master RAB Excel SNI, Design System, dan file kerja profesional. Sekali bayar, akses selamanya, langsung download detik ini juga.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pengiriman Otomatis via Email & WA
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pembayaran QRIS & Virtual Account
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lisensi Komersial Seumur Hidup
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari template atau aset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const discountPercent = Math.round(
              ((product.regularPrice - product.discountPrice) / product.regularPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                      HEMAT {discountPercent}%
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <FolderDown className="w-3.5 h-3.5 text-blue-400" />
                    <span>{product.files?.length || 1} File Digital</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product.slug)}
                      className="font-bold text-lg text-slate-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Included Files preview pills */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.files?.slice(0, 3).map((f) => (
                        <span
                          key={f.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          <FileArchive className="w-3 h-3 text-slate-400" />
                          {f.fileName.length > 20 ? f.fileName.slice(0, 18) + '...' : f.fileName}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through block">
                          {formatRupiah(product.regularPrice)}
                        </span>
                        <span className="text-xl font-black text-slate-900 block leading-tight">
                          {formatRupiah(product.discountPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProduct(product.slug)}
                          className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => onDirectCheckout(product.slug)}
                          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1"
                        >
                          <span>Beli</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
