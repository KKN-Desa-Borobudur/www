import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, Phone, ChevronDown, Grid, List, Heart, Share2, Sparkles, X } from 'lucide-react';

interface UMKM {
  id: number;
  name: string;
  category: string;
//   rating: number;
//   reviews: number;
  description: string;
//   address: string;
  phone: string;
  openHours: string;
  priceRange: string;
  image: string;
  linkGmapps: string;
//   tags: string[];
//   distance: string;
//   verified: boolean;
//   featured: boolean;
}

const UMKMpage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
//   const [selectedPriceRange, setSelectedPriceRange] = useState('Semua');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [umkms, setUmkms] = useState<UMKM[]>([]);

  const primaryColor = 'rgb(83 84 166)'; // #5354A6

  // Mock data for UMKMs

  const categories = ['Semua', 'Makanan', 'Toko', 'Jasa', 'Kerajinan', 'kopishop', 'homestay'];

  useEffect(() => {
    const fetchUMKMs = async () => {
      const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSKLU3xe4Y1H4-X4RikxOgr0YS0Nhho2ROPZbkToFMMxNqpBHTiWkKTIPbCPGKUM7-YRIDAuJjWOa_D/pub?output=csv");
      const csv = await res.text();

      const rows = csv.split("\n").map(line => line.split(","));
      const headers = rows.shift();
      const umkms = rows.map(r => {
        let obj: Record<string, string> = {};
        if (headers) {
          headers.forEach((h, i) => obj[h] = r[i]);
        }
        return obj;
      });

      console.log(umkms);
      setUmkms(umkms.map((umkm, index) => ({
        id: index + 1,
        name: umkm['nama'] || 'UMKM Tanpa Nama',
        category: umkm['kategori'] || 'Lainnya',
        description: umkm['deskripsi'] || 'Deskripsi tidak tersedia',
        phone: umkm['telepon'] || 'Tidak tersedia',
        openHours: umkm['Waktu buka'] || 'Tidak tersedia',
        priceRange: umkm['Range Harga'] || 'Tidak tersedia',
        image: umkm['kategori'] === 'Makanan' ? '🍔' : umkm['kategori'] === 'Toko' ? '🛍️' : umkm['kategori'] === 'Jasa' ? '💼' : umkm['kategori'] === 'Kerajinan' ? '🎨' : umkm['kategori'] === 'kopishop' ? '☕' : umkm['kategori'] === 'homestay' ? '🏡' : '🏪',
        linkGmapps: umkm['link_gmapps'] || '#',
      
    })));
    };
    fetchUMKMs();
  }, []);

  const filteredUMKMs = useMemo(() => {
    let filtered = umkms.filter(umkm => {
      const matchesSearch = umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           umkm.description.toLowerCase().includes(searchTerm.toLowerCase()) 
                        //    umkm.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Semua' || umkm.category === selectedCategory;
      
    //   const matchesPriceRange = selectedPriceRange === 'Semua' || (() => {
    //     const price = parseInt(umkm.priceRange.split(' - ')[1].replace(/[^\d]/g, ''));
    //     switch (selectedPriceRange) {
    //       case 'Dibawah 50rb': return price < 50000;
    //       case '50rb - 200rb': return price >= 50000 && price <= 200000;
    //       case '200rb - 500rb': return price >= 200000 && price <= 500000;
    //       case 'Diatas 500rb': return price > 500000;
    //       default: return true;
    //     }
    //   })();
      
      return matchesSearch && matchesCategory /* && matchesPriceRange */;
    });

    // // Sort
    // filtered.sort((a, b) => {
    //   switch (sortBy) {
    //     case 'rating':
    //       return b.rating - a.rating;
    //     case 'reviews':
    //       return b.reviews - a.reviews;
    //     case 'distance':
    //       return parseFloat(a.distance) - parseFloat(b.distance);
    //     case 'name':
    //       return a.name.localeCompare(b.name);
    //     default:
    //       return 0;
    //   }
    // });

    // Featured items first
    return filtered/*.sort((a, b) => b.featured ? 1 : a.featured ? -1 : 0)*/;
  }, [umkms, searchTerm, selectedCategory, /*selectedPriceRange*/, sortBy]);

  const handleAIChat = () => {
    // Redirect to external AI chat with preconfigured context
    
    // Open in new tab with context
    window.open('http://ceritaborobudur.my.id/chat/', '_blank');
    setShowAIPrompt(false);
  };

  return (
    <div className="w-full min-h-screen" style={{ background: 'linear-gradient(135deg, rgb(248 250 252) 0%, rgb(238 242 255) 100%)' }}>
      {/* Header */}
      <div className="w-full bg-white shadow-sm">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UMKM Borobudur</h1>
              <p className="mt-1 text-gray-600">Temukan {filteredUMKMs.length} UMKM lokal di sekitar Borobudur</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:text-white'}`}
                style={viewMode === 'grid' ? { backgroundColor: primaryColor } : {}}
                onMouseEnter={(e) => {
                  if (viewMode !== 'grid') {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'grid') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(75 85 99)';
                  }
                }}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:text-white'}`}
                style={viewMode === 'list' ? { backgroundColor: primaryColor } : {}}
                onMouseEnter={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(75 85 99)';
                  }
                }}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari UMKM, produk, atau layanan..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': primaryColor } as any}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className={`flex flex-wrap gap-3 ${showFilters ? 'flex' : 'hidden'} lg:flex`}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select> */}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': primaryColor } as any}
                >
                  <option value="rating">Rating Tertinggi</option>
                  <option value="reviews">Paling Banyak Review</option>
                  <option value="distance">Terdekat</option>
                  <option value="name">Nama A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredUMKMs.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">Tidak ada UMKM ditemukan</h3>
            <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredUMKMs.map((umkm) => (
              <div
                key={umkm.id}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl
                }`}
              >

                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="text-4xl">{umkm.image}</div>
                      <div className="flex items-center gap-2">
                        <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100" style={{ color: primaryColor }}>
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}>
                        {umkm.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        {/* <span className="text-sm font-medium text-gray-700">{umkm.rating}</span> */}
                        {/* <span className="text-xs text-gray-500">({umkm.reviews})</span> */}
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                      {umkm.name}
                    </h3>

                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">{umkm.description}</p>

                    <div className="mb-4 space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {/* <span>{umkm.distance} • {umkm.address}</span> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{umkm.openHours}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-2 text-sm font-medium" style={{ color: primaryColor }}>
                        {umkm.priceRange}
                      </div>
                      {/* <div className="flex flex-wrap gap-1">
                        {umkm.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div> */}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors" style={{ backgroundColor: primaryColor }}>
                        Lihat Detail
                      </button>
                      <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex gap-6 p-6">
                    <div className="text-6xl">{umkm.image}</div>
                    
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                            {umkm.name}
                            {/* {umkm.verified && (
                              <span className="ml-2 text-green-500">✓</span>
                            )} */}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}>
                              {umkm.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-yellow-400" />
                              {/* <span className="text-sm font-medium text-gray-700">{umkm.rating}</span> */}
                              {/* <span className="text-xs text-gray-500">({umkm.reviews} reviews)</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100" style={{ color: primaryColor }}>
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-4 text-gray-600">{umkm.description}</p>

                      <div className="mb-4 grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {/* <span>{umkm.distance} • {umkm.address}</span> */}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{umkm.openHours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{umkm.phone}</span>
                        </div>
                        <div className="font-medium" style={{ color: primaryColor }}>
                          {umkm.priceRange}
                        </div>
                      </div>

                      {/* <div className="mb-4 flex flex-wrap gap-2">
                        {umkm.tags.map((tag, idx) => (
                          <span key={idx} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div> */}

                      <div className="flex gap-3">
                        {/* <a href={() => console.log(umkm.linkGmapps)}> */}
                            <button onClick={() => console.log(umkm.linkGmapps)} className="rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors" style={{ backgroundColor: primaryColor }}>
                          Lihat Detail
                            </button>
                        {/* </a> */}
                        <button className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Hubungi
                        </button>
                        <button className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Arah
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredUMKMs.length > 0 && (
          <div className="mt-12 text-center">
            <button className="rounded-xl border-2 px-8 py-3 font-semibold transition-all duration-200 hover:text-white" style={{ borderColor: primaryColor, color: primaryColor }}>
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>

      {/* AI Chat Assistant - Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showAIPrompt && (
          <div className="absolute bottom-16 right-0 mb-2 w-80 rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 transform transition-all duration-300 scale-100">
            <button
              onClick={() => setShowAIPrompt(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${primaryColor}1a` }}>
                <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-600">Temukan UMKM yang sempurna</p>
              </div>
            </div>
            
            <p className="mb-4 text-sm text-gray-700">
              Bingung memilih UMKM? Biarkan AI assistant kami membantu menemukan 
              bisnis lokal yang sesuai dengan kebutuhan, budget, dan preferensi Anda!
            </p>
            
            <div className="mb-4 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-green-500"></div>
                <span>Rekomendasi personal berdasarkan preferensi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-green-500"></div>
                <span>Informasi lengkap lokasi dan kontak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-green-500"></div>
                <span>Tips wisata dan berbelanja lokal</span>
              </div>
            </div>
            
            <button
              onClick={handleAIChat}
              className="w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Mulai Chat dengan AI
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowAIPrompt(!showAIPrompt)}
          className={`group flex h-14 items-center gap-3 rounded-full px-6 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 ${
            showAIPrompt ? 'w-14 px-0' : 'w-auto'
          }`}
          style={{ backgroundColor: primaryColor }}
        >
          {showAIPrompt ? (
            <X className="h-6 w-6 mx-auto" />
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold whitespace-nowrap">AI Assistant</span>
              <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UMKMpage;