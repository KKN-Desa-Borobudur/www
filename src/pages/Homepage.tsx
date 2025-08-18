import React, { useState, useEffect } from 'react';
import { MapPin, Store, MapPinned, Home, BookOpen, Star, ArrowRight, Menu, X, Heart, Gift, Coffee } from 'lucide-react';
import map_image from '../assets/map_preview.png';

interface story {
    type: string;
    name: string;
    location: string;
    story: string;
    avatar: string;
}

const Homepage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [stories, setStories] = useState<story[]>([]);

    useEffect(() => {
        // Initialize stories data
        fetch("https://script.google.com/macros/s/AKfycby8ph0hN9lZLWj9liRokj7YHzAhmTDA9JpuXAyAap4zcbdMLRVlpmMcbxxlV9BlQNc/exec?start=0&end=6")
            .then(res => res.json())
            .then(data => {
                const mappedStories = Array.isArray(data)
                    ? data.map((item: any) => ({
                        type: item["Siapakah kamu?\nWho are you?"]?.includes("Wisatawan") ? "Tourist" : "Local",
                        name: item["Siapa namamu?\nWhat's your name?"] || "Anonim",
                        location: item["Darimana kamu berasal?\nWhere do you come from?"] || "",
                        story: item["Apa ceritamu?\nWhat's your story?"] || "",
                        avatar: item["Apa jenis kelaminmu?\nWhat's your sex?"]?.includes("Laki-laki") ? "👨" : "👩"
                    }))
                    : [];
                setStories(mappedStories);
            });

        const handleScroll = () => {
            const sections = ['home', 'map', 'umkm', 'stories'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[oklch(0.97_0.01_260)] to-[oklch(0.92_0.05_270)]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#5354A6] rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[#5354A6]">Cerita Borobudur</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            {[
                                { id: 'home', label: 'Beranda' },
                                { id: 'map', label: 'Peta Digital' },
                                { id: 'umkm', label: 'UMKM' },
                                { id: 'stories', label: 'Cerita' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === item.id
                                            ? 'text-[#5354A6] bg-indigo-50'
                                            : 'text-gray-700 hover:text-[#5354A6]'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#5354A6]"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {[
                                { id: 'home', label: 'Beranda' },
                                { id: 'map', label: 'Peta Digital' },
                                { id: 'umkm', label: 'UMKM' },
                                { id: 'stories', label: 'Cerita' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#5354A6] hover:bg-indigo-50"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="pt-16 min-h-screen flex items-center">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-[#5354A6]/10 rounded-full text-[#5354A6] text-sm font-medium mb-8">
                            <Heart className="w-4 h-4 mr-2" />
                            Jelajahi Keajaiban Borobudur
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Temukan <span className="text-[#5354A6]">Cerita</span> di
                            <br />Balik Candi <span className="text-[#5354A6]">Borobudur</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Jelajahi desa Borobudur melalui peta digital interaktif, temukan UMKM lokal yang menawan,
                            dan dengarkan cerita-cerita autentik dari wisatawan dan masyarakat setempat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => scrollToSection('map')}
                                className="px-8 py-4 bg-[#5354A6] text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-[#4a4b95] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <span>Mulai Jelajahi</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => scrollToSection('stories')}
                                className="px-8 py-4 border-2 border-[#5354A6] text-[#5354A6] rounded-xl font-semibold flex items-center space-x-2 hover:bg-[#5354A6] hover:text-white transition-all duration-200"
                            >
                                <BookOpen className="w-5 h-5" />
                                <span>Baca Cerita</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#5354A6] mb-2">50+</div>
                                <div className="text-gray-600">UMKM Terdaftar</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#5354A6] mb-2">200+</div>
                                <div className="text-gray-600">Cerita Terkumpul</div>
                            </div>
                            <div className="text-center col-span-2 md:col-span-1">
                                <div className="text-3xl font-bold text-[#5354A6] mb-2">5K+</div>
                                <div className="text-gray-600">Pengunjung</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Map Section */}
            <section id="map" className="py-20 bg-white">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-[#5354A6]/10 rounded-full text-[#5354A6] text-sm font-medium mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            Peta Digital Interaktif
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Jelajahi Desa Borobudur
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Navigasi mudah menuju tempat-tempat menarik, UMKM lokal, dan lokasi bersejarah
                            di sekitar Candi Borobudur dengan peta digital kami.
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-[#5354A6]/5 to-indigo-100/50 rounded-3xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Fitur Peta Digital</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: MapPinned, title: 'Detail dusun', desc: 'Detail dari setiap dusun' },
                                        { icon: Store, title: 'Lokasi UMKM', desc: 'Temukan toko dan usaha lokal terdekat' },
                                        { icon: Home, title: "Tempat Menginap", desc: 'Homestay nyaman di sekitar Borobudur' },
                                        { icon: Coffee, title: 'Tempat ngopi', desc: 'Coffeeshop untuk bersantai' },
                                        { icon: Gift, title: 'Souvenir', desc: 'Temukan souvenir khas Borobudur' },
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-[#5354A6] rounded-lg flex items-center justify-center">
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <a href="/map" target="_blank" rel="noopener noreferrer">
                                    <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={map_image}
                                                alt="Peta Digital"
                                                className="w-full h-full object-cover object-top rounded-xl"
                                            />
                                        </div>
                                        <div className="mt-4 text-center">
                                            <h4 className="font-semibold text-gray-900">Peta Interaktif</h4>
                                            <p className="text-sm text-gray-600">Klik untuk menjelajahi</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* UMKM Section */}
            <section id="umkm" className="py-20 bg-linear-to-br from-slate-50 to-indigo-50">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-[#5354A6]/10 rounded-full text-[#5354A6] text-sm font-medium mb-4">
                            <Store className="w-4 h-4 mr-2" />
                            UMKM Lokal
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Dukung Ekonomi Lokal
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Temukan dan dukung usaha mikro, kecil, dan menengah di sekitar Borobudur.
                            Dari kerajinan tradisional hingga kuliner khas Jawa Tengah.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                name: 'Kerajinan Batu',
                                category: 'Kerajinan',
                                rating: 4.8,
                                image: '🗿',
                                desc: 'Kerajinan batu khas Borobudur dengan detail yang menawan'
                            },
                            {
                                name: 'Batik Borobudur',
                                category: 'Fashion',
                                rating: 4.9,
                                image: '👘',
                                desc: 'Batik dengan motif Borobudur yang autentik dan berkualitas'
                            },
                            {
                                name: 'Gudeg Jogja',
                                category: 'Kuliner',
                                rating: 4.7,
                                image: '🍛',
                                desc: 'Gudeg autentik dengan cita rasa tradisional Yogyakarta'
                            }
                        ].map((umkm, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                                <div className="p-6">
                                    <div className="text-4xl mb-4 text-center">{umkm.image}</div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs px-2 py-1 bg-[#5354A6]/10 text-[#5354A6] rounded-full font-medium">
                                            {umkm.category}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-medium text-gray-700">{umkm.rating}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{umkm.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{umkm.desc}</p>
                                    <button className="w-full bg-[#5354A6] text-white py-2 rounded-lg font-medium hover:bg-[#4a4b95] transition-colors group-hover:bg-[#4a4b95]">
                                        Kunjungi Toko
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button className="px-8 py-3 border-2 border-[#5354A6] text-[#5354A6] rounded-xl font-semibold hover:bg-[#5354A6] hover:text-white transition-all duration-200">
                            Lihat Semua UMKM
                        </button>
                    </div>
                </div>
            </section>

            {/* Stories Section */}
            <section id="stories" className="py-20 bg-white">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-[#5354A6]/10 rounded-full text-[#5354A6] text-sm font-medium mb-4">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Cerita Komunitas
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Cerita dari Hati
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Dengarkan pengalaman autentik dari wisatawan yang telah berkunjung dan
                            cerita-cerita hangat dari masyarakat lokal Borobudur.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story, index) => (
                            <div key={index} className="bg-linear-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="text-3xl">{story.avatar}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{story.name}</h4>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${story.type === 'Tourist'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {story.type === 'Tourist' ? 'Wisatawan' : 'Lokal'}
                                            </span>
                                            <span className="text-sm text-gray-500">{story.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{story.story}"</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a href="https://forms.gle/1Hs6B7orKNiqW2oq9">
                            <button className="px-8 py-3 bg-[#5354A6] text-white rounded-xl font-semibold hover:bg-[#4a4b95] transition-colors mr-4">
                                Bagikan Cerita Anda
                            </button>
                        </a>
                        <button className="px-8 py-3 border-2 border-[#5354A6] text-[#5354A6] rounded-xl font-semibold hover:bg-[#5354A6] hover:text-white transition-all duration-200">
                            Baca Semua Cerita
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-[#5354A6] rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">Cerita Borobudur</span>
                            </div>
                            <p className="text-gray-400 mb-4 max-w-md">
                                Platform digital untuk menjelajahi keindahan Borobudur, mendukung UMKM lokal,
                                dan berbagi cerita autentik dari komunitas.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Fitur</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Peta Digital</li>
                                <li>Direktori UMKM</li>
                                <li>Cerita Komunitas</li>
                                <li>Panduan Wisata</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Kontak</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Email: info@ceritaborobudur.com</li>
                                <li>Telepon: +62 274 123456</li>
                                <li>Alamat: Desa Borobudur, Magelang</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Cerita Borobudur. Dibuat dengan ❤️ untuk melestarikan budaya lokal.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;