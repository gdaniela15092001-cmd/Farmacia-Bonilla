/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  Phone,
  X,
  Plus,
  Minus,
  Check,
  HelpCircle,
  FileText,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';

import { Product, CartItem, Branch, WellnessTip } from './types';
import { productsData, branchesData, wellnessTipsData, faqsData } from './data';
import { ProductCard } from './components/ProductCard';
import { PrescriptionUpload } from './components/PrescriptionUpload';
import { WellnessTools } from './components/WellnessTools';
import { ConsultationBot } from './components/ConsultationBot';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'wellness' | 'branches' | 'faq'>('catalog');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Prescription state
  const [isPrescriptionApproved, setIsPrescriptionApproved] = useState<boolean>(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState<any | null>(null);

  // Selected Detail Product state (Modal)
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Successful Checkout State (Digital Ticket Modal)
  const [checkoutReceipt, setCheckoutReceipt] = useState<any | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    submitted: false
  });

  // Calculate if the current cart requires a prescription
  const cartRequiresPrescription = useMemo(() => {
    return cart.some(item => item.product.requiresPrescription);
  }, [cart]);

  // Is checkout allowed based on prescription requirement
  const isCheckoutAllowed = useMemo(() => {
    if (!cartRequiresPrescription) return true;
    return isPrescriptionApproved;
  }, [cartRequiresPrescription, isPrescriptionApproved]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.activeIngredient && product.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;

      const matchesFavorite = !showFavoritesOnly || favorites.includes(product.id);

      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Limit to stock
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open sidebar on first addition to give instant feedback
    setIsCartOpen(true);
  };

  const handleAddProductById = (id: string) => {
    const matched = productsData.find(p => p.id === id);
    if (matched) {
      handleAddToCart(matched);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Favorite toggle
  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Cart Pricing Calculations
  const cartValues = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    // Shipping is $35, but free over $300 or for local pickup
    const shipping = shippingMethod === 'pickup' || subtotal >= 300 || subtotal === 0 ? 0 : 35;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [cart, shippingMethod]);

  // Prescription approval handler
  const handlePrescriptionVerification = (approved: boolean, details: any | null) => {
    setIsPrescriptionApproved(approved);
    setPrescriptionDetails(details);
  };

  // Simulating the actual checkout operation
  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCheckoutAllowed) return;

    // Create a highly detailed receipt configuration
    const receiptId = `TB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReceipt = {
      id: receiptId,
      date: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cart],
      pricing: { ...cartValues },
      shippingMethod,
      requiresPrescription: cartRequiresPrescription,
      prescriptionDoctor: prescriptionDetails?.doctor || null,
      licenseNumber: prescriptionDetails?.licenseNumber || null
    };

    setCheckoutReceipt(newReceipt);
    // Clear cart upon successful simulation
    setCart([]);
  };

  // Contact Form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactForm(prev => ({ ...prev, submitted: true }));
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        submitted: false
      });
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800 flex flex-col selection:bg-zinc-150 selection:text-zinc-950">
      
      {/* GOBIERNO/REGULATORY NOTICE */}
      <div className="bg-zinc-950 text-zinc-100 text-[10px] font-sans py-2 px-4 text-center tracking-wider uppercase font-semibold border-b border-zinc-900 leading-none shrink-0">
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-zinc-400" />
          Establecimiento Autorizado | Coepris Oficio N° 924-B26 | <strong>Farmacia de Turno Hoy: Sucursal Centro Matriz</strong>
        </span>
      </div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 z-40 px-4 py-3 transition-all">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <a href="#" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white font-medium text-xs border border-zinc-150">
              ➕
            </div>
            <div className="leading-tight">
              <h1 className="font-display font-medium text-sm md:text-base text-zinc-900 tracking-tight flex items-baseline">
                Farmacia <span className="font-semibold text-zinc-900 ml-1">Bonilla</span>
              </h1>
              <p className="text-[9px] text-zinc-400 tracking-widest font-mono uppercase">Su Salud en Buenas Manos</p>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-4">
            <button
              id="lnk-catalog"
              onClick={() => { setActiveTab('catalog'); setShowFavoritesOnly(false); }}
              className={`py-1 text-[11.5px] font-medium cursor-pointer transition-colors border-b-2 ${
                activeTab === 'catalog' && !showFavoritesOnly
                  ? 'border-zinc-900 text-zinc-950 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Catálogo de Productos
            </button>
            <button
              id="lnk-wellness"
              onClick={() => setActiveTab('wellness')}
              className={`py-1 text-[11.5px] font-medium cursor-pointer transition-colors border-b-2 ${
                activeTab === 'wellness'
                  ? 'border-zinc-900 text-zinc-950 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Centro de Bienestar
            </button>
            <button
              id="lnk-branches"
              onClick={() => setActiveTab('branches')}
              className={`py-1 text-[11.5px] font-medium cursor-pointer transition-colors border-b-2 ${
                activeTab === 'branches'
                  ? 'border-zinc-900 text-zinc-950 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Sucursales y Turnos
            </button>
            <button
              id="lnk-faq"
              onClick={() => setActiveTab('faq')}
              className={`py-1 text-[11.5px] font-medium cursor-pointer transition-colors border-b-2 ${
                activeTab === 'faq'
                  ? 'border-zinc-900 text-zinc-950 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Preguntas Frecuentes
            </button>
          </nav>

          {/* Action tools */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Favorites Toggler */}
            <button
              id="btn-favorites-toggle"
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setActiveTab('catalog');
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center relative ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-zinc-200 text-zinc-450 hover:text-zinc-900'
              }`}
              title="Ver favoritos"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white font-sans font-bold text-[8.5px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="btn-cart-open"
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold text-xs hidden sm:inline">Carrito</span>
              <span className="bg-zinc-800 text-white font-mono font-bold text-[8.5px] min-w-4.5 h-4 px-1 rounded-sm flex items-center justify-center leading-none">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION TAB-BAR */}
      <div className="md:hidden sticky top-[4.1rem] bg-white text-zinc-550 z-30 border-b border-zinc-200 px-3 py-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <button
            id="m-nav-catalog"
            onClick={() => { setActiveTab('catalog'); setShowFavoritesOnly(false); }}
            className={`flex-1 py-1 px-2.5 text-center rounded-md ${activeTab === 'catalog' && !showFavoritesOnly ? 'bg-zinc-100 text-zinc-900 font-bold' : ''}`}
          >
            Catálogo
          </button>
          <button
            id="m-nav-wellness"
            onClick={() => setActiveTab('wellness')}
            className={`flex-1 py-1 px-2.5 text-center rounded-md ${activeTab === 'wellness' ? 'bg-zinc-100 text-zinc-900 font-bold' : ''}`}
          >
            Bienestar
          </button>
          <button
            id="m-nav-branches"
            onClick={() => setActiveTab('branches')}
            className={`flex-1 py-1 px-2.5 text-center rounded-md ${activeTab === 'branches' ? 'bg-zinc-100 text-zinc-900 font-bold' : ''}`}
          >
            Sucursales
          </button>
          <button
            id="m-nav-faq"
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-1 px-2.5 text-center rounded-md ${activeTab === 'faq' ? 'bg-zinc-100 text-zinc-900 font-bold' : ''}`}
          >
            FAQs
          </button>
        </div>
      </div>

      {/* BODY CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {activeTab === 'catalog' ? (
          <div className="space-y-6">
            
            {/* HERO BANNER SECTION */}
            <div id="welcome-hero-banner" className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-none">
              <div className="relative max-w-2xl flex flex-col justify-center">
                <span className="bg-zinc-100 text-zinc-650 text-[8.5px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border border-zinc-200/60 self-start mb-4">
                  75 Años de Excelencia Familiar
                </span>
                <h2 className="font-display font-medium text-lg md:text-2xl text-zinc-900 tracking-tight leading-tight mb-2.5">
                  Tus medicamentos de confianza a solo un clic.
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-sans">
                  Carga tu receta médica en línea para una validación e identificación farmacéutica. Descuentos en tratamientos crónicos de hipertensión, diabetes y tercera edad.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    id="btn-hero-cta"
                    onClick={() => setActiveTab('wellness')}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-medium py-2 px-4 rounded-lg transition-all cursor-pointer"
                  >
                    Calcular Índice de Salud (IMC)
                  </button>
                  <a
                    href="#prescription-uploader-box"
                    className="bg-white hover:bg-zinc-50 text-zinc-705 text-[11px] font-semibold py-2 px-4 rounded-lg transition-all border border-zinc-200"
                  >
                    Validar Receta Ahora
                  </a>
                </div>
              </div>
            </div>

            {/* SEARCH AND FILTERING HEADER */}
            <div className="bg-white border border-zinc-200/80 rounded-xl p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between shadow-none">
              
              {/* Categories Taps */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'medicamentos', label: 'Medicamentos' },
                  { id: 'cuidado_personal', label: 'Cuidado Personal' },
                  { id: 'bienestar', label: 'Bienestar' },
                  { id: 'infantil', label: 'Bebés' },
                  { id: 'botiquin', label: 'Botiquín' }
                ].map(cat => (
                  <button
                    id={`btn-cat-filter-${cat.id}`}
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-900 text-white shadow-none'
                        : 'bg-zinc-100 hover:bg-zinc-150 text-zinc-650'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Text Search input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar medicamentos..."
                  className="w-full pl-9 pr-4 py-2 text-xs text-zinc-850 placeholder-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950"
                />
                {searchQuery && (
                  <button
                    id="btn-clear-search"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 p-0.5 hover:bg-zinc-200 rounded-full text-zinc-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* GRID OF PRODUCTS AND ADVISOR ACCENT */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Product cards stack (Left) */}
              <div className="lg:col-span-3 space-y-6">
                
                {showFavoritesOnly && (
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      Tus Medicamentos Guardados
                    </h3>
                    <button
                      id="btn-remove-fav-filter"
                      onClick={() => setShowFavoritesOnly(false)}
                      className="text-xs text-emerald-600 font-semibold underline"
                    >
                      Volver al catálogo completo
                    </button>
                  </div>
                )}

                {filteredProducts.length === 0 ? (
                  <div className="bg-white border rounded-2xl p-12 text-center text-slate-500 max-w-md mx-auto">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-semibold text-slate-700 text-sm mb-1">Sin resultados encontrados</p>
                    <p className="text-xs text-slate-400">Intenta buscando palabras clave genéricas como "Paracetamol" o "Gensa" o cambia tu filtro de categoría.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {filteredProducts.map(prod => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        onViewDetails={(p) => setSelectedProductDetails(p)}
                        isFavorite={favorites.includes(prod.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}

                {/* RX UPLOADER INTEGRATED INTO THE CATALOG AT THE BOTTOM */}
                {!showFavoritesOnly && (
                  <div className="mt-8 border-t border-zinc-200 pt-8">
                    <div className="max-w-xl mx-auto">
                      <h3 className="font-display font-medium text-zinc-805 text-sm text-center mb-1">¿Llevas medicamentos con receta?</h3>
                      <p className="text-[10.5px] text-zinc-400 text-center mb-5 font-mono uppercase tracking-wider">APROBACIÓN EXPRÉS VÍA FIRMA ELECTRÓNICA Y OCR</p>
                      <PrescriptionUpload
                        onPrescriptionApproved={handlePrescriptionVerification}
                        initiallyRequiresPrescription={cartRequiresPrescription}
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Bot consultation / sidebar tools (Right) */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h4 className="font-display font-semibold text-zinc-400 text-[10px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    Orientación Clínica
                  </h4>
                  <ConsultationBot
                    products={productsData}
                    onAddProductById={handleAddProductById}
                  />
                </div>

                {/* Hours & turn detail sidebar card */}
                <div className="bg-zinc-50 border border-zinc-200 p-4.5 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-zinc-850 font-semibold text-xs font-display">
                    <Clock className="w-4 h-4 text-zinc-650" />
                    Horario General y Nocturno
                  </div>
                  <p className="text-xs text-zinc-550 leading-relaxed font-sans">
                    Ofrecemos servicio de recojo rápido sin bajarte del coche en estacionamiento <strong className="font-bold">Bonilla-Click</strong>.
                  </p>
                  <button
                    id="btn-goto-branches"
                    onClick={() => setActiveTab('branches')}
                    className="w-full mt-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold cursor-pointer text-center"
                  >
                    Ver turnos clínicos hoy
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : activeTab === 'wellness' ? (
          <div className="space-y-6">
            
            {/* Wellness tools section containingIMC and hydration calculators */}
            <WellnessTools
              products={productsData}
              onAddProductById={handleAddProductById}
            />

            {/* Wellness tips block list */}
            <div>
              <h4 className="font-display font-medium text-zinc-800 text-xs uppercase tracking-wider mb-4 font-mono">Consejos Clínicos Preventivos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wellnessTipsData.map(tip => (
                  <div key={tip.id} className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col h-full">
                    <span className="text-[9px] text-zinc-500 bg-zinc-100 border border-zinc-250/65 px-2 py-0.5 rounded mb-3 self-start font-bold uppercase tracking-wider font-mono">
                      {tip.category}
                    </span>
                    <h5 className="font-display font-semibold text-zinc-900 text-sm mb-2 hover:text-zinc-640 transition-colors">
                      {tip.title}
                    </h5>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">
                      {tip.content}
                    </p>
                    
                    {/* Products recommended by tips */}
                    <div className="pt-3 border-t border-zinc-100">
                      <span className="text-[8.5px] uppercase tracking-widest text-zinc-400 font-bold block mb-2 font-mono">Artículos Recomendados:</span>
                      <div className="flex flex-col gap-1.5">
                        {tip.recommendedProducts.map(prodId => {
                          const matched = productsData.find(p => p.id === prodId);
                          if (!matched) return null;
                          return (
                            <div key={prodId} className="flex items-center justify-between text-xs py-1 border-b border-zinc-50 last:border-none">
                              <span className="font-medium text-zinc-700 truncate mr-2">{matched.name}</span>
                              <button
                                id={`btn-tip-add-${prodId}`}
                                onClick={() => handleAddToCart(matched)}
                                className="text-zinc-950 hover:text-zinc-600 font-bold text-xs cursor-pointer"
                              >
                                + Añadir
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : activeTab === 'branches' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Branch overview list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-display font-semibold text-zinc-900 text-base mb-1">Directorio de Sucursales</h3>
                <p className="text-xs text-zinc-400 mb-4 font-mono uppercase tracking-wider">TURNOS MUNICIPALES Y COPRIS ACTIVOS</p>
                
                {branchesData.map(branch => (
                  <div
                    key={branch.id}
                    className={`p-5 rounded-lg border transition-all ${
                      branch.isOnDuty
                        ? 'bg-zinc-100/50 border-zinc-900 shadow-none'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h4 className="font-display font-medium text-sm text-zinc-900">{branch.name}</h4>
                      {branch.isOnDuty && (
                        <span className="bg-zinc-900 text-white border border-zinc-950 text-[8.5px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          DE TURNO HOY
                        </span>
                      )}
                      {branch.is24Hours && !branch.isOnDuty && (
                        <span className="bg-zinc-100 text-zinc-650 text-[8.5px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          24 Horas
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-xs text-zinc-600 mt-2">
                      <p className="flex items-start gap-1.5 leading-tight">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                        <span>{branch.address}</span>
                      </p>
                      <p className="flex items-start gap-1.5 leading-tight">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                        <span>{branch.hours}</span>
                      </p>
                      <p className="flex items-start gap-1.5 leading-tight">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                        <span className="font-mono">{branch.phone}</span>
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/525512345678?text=Hola,%20quisiera%20consultar%20por%20un%20medicamento%20en%20la%20${encodeURIComponent(branch.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block text-center w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded shadow-none transition-colors"
                    >
                      Preguntar por WhatsApp
                    </a>
                  </div>
                ))}
              </div>

              {/* Simulated Interactive Branch Map & Contact Form */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visual Branch Map pointer */}
                <div className="p-6 bg-zinc-950 text-white rounded-lg border border-zinc-900 relative overflow-hidden h-[260px] flex flex-col justify-end">
                  
                  {/* Grid Lines mockup to resemble a clinical map radar */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-5">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border border-zinc-200" />
                    ))}
                  </div>

                  {/* Marker representation Sucursal Centro */}
                  <div className="absolute top-[40%] left-[30%] text-center">
                    <span className="text-xs bg-white text-zinc-950 font-bold px-2 py-0.5 rounded border border-zinc-300 shadow flex items-center gap-1">
                      📌 Matriz Centro (De Turno)
                    </span>
                    <span className="block h-2 w-2 rounded-full bg-zinc-200 mx-auto mt-1 animate-ping" />
                  </div>

                  {/* Marker representation Lindavista */}
                  <div className="absolute top-[20%] left-[70%] text-center">
                    <span className="text-[10px] bg-zinc-900 text-zinc-200 font-semibold px-1.5 py-0.5 rounded block">
                      📌 Sucursal Lindavista
                    </span>
                  </div>

                  {/* Marker representation Coyoacán */}
                  <div className="absolute top-[75%] left-[55%] text-center">
                    <span className="text-[10px] bg-zinc-900 text-zinc-200 font-semibold px-1.5 py-0.5 rounded block">
                      📌 Sucursal Coyoacán
                    </span>
                  </div>

                  <div className="relative z-10 bg-zinc-900/95 p-4 rounded border border-zinc-800 max-w-sm self-start">
                    <h4 className="font-display font-medium text-xs text-zinc-100 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      Ubicación Satelital Integrada
                    </h4>
                    <p className="text-[10.5px] text-zinc-400">Nuestros servicios de despacho a domicilio cubren un radio clínico de 5 kilómetros desde cualquiera de las sucursales listadas.</p>
                  </div>
                </div>

                {/* Secure consultation / custom order form */}
                <div className="bg-white border border-zinc-200 p-6 rounded-lg">
                  <h3 className="font-display font-medium text-zinc-950 text-sm mb-1.5">¿No encuentras tu medicamento?</h3>
                  <p className="text-xs text-zinc-400 mb-4 font-semibold mr-1">
                    Envíanos tu consulta sobre patentes específicas, medicamentos importados o solicita cotización de preparado magistral.
                  </p>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-medium text-zinc-650 block mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded border border-zinc-200 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-zinc-655 block mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded border border-zinc-200 focus:outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-zinc-655 block mb-1">Teléfono o Celular</label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded border border-zinc-200 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-zinc-655 block mb-1">Tu Mensaje (Especificar dosis, lote o marca)</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={3}
                        className="w-full text-xs px-3 py-2 rounded border border-zinc-200 focus:outline-hidden"
                        required
                      />
                    </div>

                    {contactForm.submitted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs rounded flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0" />
                        <span>¡Mensaje enviado con éxito! Los farmacéuticos de Farmacia Bonilla te contactarán en menos de 15 minutos en tu número de teléfono.</span>
                      </motion.div>
                    ) : (
                      <button
                        id="btn-submit-contact"
                        type="submit"
                        className="py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-semibold cursor-pointer shadow-none transition-colors"
                      >
                        Enviar Consulta Farmacéutica
                      </button>
                    )}
                  </form>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-medium text-slate-800 text-base">Preguntas Frecuentes (FAQs)</h3>
                <p className="text-xs text-slate-400 font-semibold">Todo lo que necesitas saber para comprar tus medicamentos en línea de forma segura.</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {faqsData.map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs">
                  <h4 className="font-display font-semibold text-slate-800 text-sm mb-2 hover:text-emerald-700 transition-colors">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-zinc-950 text-zinc-400 font-sans text-xs border-t border-zinc-800 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h5 className="font-display font-bold text-sm text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              ➕ Farmacia Bonilla
            </h5>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              Comprometidos con el bienestar integral de la familia por más de tres generaciones. Calidad farmacéutica certificada al servicio de tu comunidad.
            </p>
          </div>

          <div className="space-y-2.5">
            <h6 className="font-display font-semibold text-[11px] text-white uppercase tracking-widest font-mono">Secciones</h6>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => { setActiveTab('catalog'); setShowFavoritesOnly(false); }} className="hover:text-white text-left transition-colors cursor-pointer">Catálogo de Medicamentos</button></li>
              <li><button onClick={() => setActiveTab('wellness')} className="hover:text-white text-left transition-colors cursor-pointer">Centro de Bienestar Preventivo</button></li>
              <li><button onClick={() => setActiveTab('branches')} className="hover:text-white text-left transition-colors cursor-pointer">Sucursales y Turnos Médicos</button></li>
              <li><button onClick={() => setActiveTab('faq')} className="hover:text-white text-left transition-colors cursor-pointer">Faqs Oficiales</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h6 className="font-display font-semibold text-[11px] text-white uppercase tracking-widest font-mono">Políticas Reguladoras</h6>
            <ul className="space-y-1.5 text-[11px] text-zinc-550">
              <li>Aviso de Privacidad Integral</li>
              <li>Políticas de Retorno de Medicamentos</li>
              <li>Regulación para Medicamentos de Control</li>
              <li>Cédula Sanitaria: San-2026-N0928</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h6 className="font-display font-semibold text-[11px] text-white uppercase tracking-widest font-mono">Atención de Emergencia</h6>
            <p className="text-zinc-100 font-mono text-sm leading-none font-semibold">+52 (55) 4123-4567</p>
            <p className="text-[10.5px] text-zinc-500">
              Contáctanos de forma directa para urgencias de guardia. Entregas a domicilio de guardia operan toda la noche.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-zinc-900 text-center text-[10.5px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Farmacia Bonilla S.A de C.V. Todos los derechos reservados.</p>
          <p className="text-[10px] text-zinc-600 font-mono uppercase">DISCIPLINA DE DISEÑO MINIMALISTA</p>
        </div>
      </footer>

      {/* --- SIDEBAR SHOPPING CART SIDEBAR PANEL --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop overlay closely bound click action */}
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-zinc-950/40 z-50 cursor-pointer"
            />
            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col border-l border-zinc-200"
            >
              {/* Sidebar Header */}
              <div className="p-4.5 border-b border-zinc-150 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5 text-zinc-900">
                  <ShoppingBag className="w-4 h-4 text-zinc-900" />
                  <h3 className="font-display font-semibold text-sm">Resumen de tu Compra</h3>
                  <span className="text-xs text-zinc-400 font-mono">({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                </div>
                <button
                  id="btn-cart-close"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 px-2.5 hover:bg-zinc-100 rounded text-zinc-550 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar list items */}
              <div className="flex-1 overflow-y-auto p-4.5 space-y-4">
                
                {cartRequiresPrescription && (
                  <div className={`p-3 rounded border ${isPrescriptionApproved ? 'bg-zinc-50 border-zinc-250 text-zinc-800' : 'bg-red-50/50 border-red-200 text-red-900'} text-xs space-y-1.5`}>
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertCircle className={`w-4 h-4 ${isPrescriptionApproved ? 'text-zinc-800' : 'text-red-500'} shrink-0`} />
                      <span>{isPrescriptionApproved ? '✓ Receta Médica Validada' : '⚠️ Requiere Receta Médica'}</span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-zinc-550">
                      {isPrescriptionApproved
                        ? `Validada exitosamente: Dra. Sofía Bonilla Ortiz (Aprobado).`
                        : `Llevas un antibiótico o fármaco que requiere receta obligatoria. Carga tu receta en el catálogo para poder finalizar tu checkout.`}
                    </p>
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                    <ShoppingBag className="w-10 h-10 text-zinc-200 mb-2" />
                    <p className="font-semibold text-zinc-700 text-xs mb-1">Tu carrito de compras está vacío</p>
                    <p className="text-[11px] text-zinc-400">Añade medicamentos, suplementos o productos de cuidado personal de tu preferencia.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-4 p-3 bg-zinc-50/50 rounded border border-zinc-150 transition-all hover:bg-zinc-50">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded object-cover bg-white border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-semibold text-zinc-800 text-[11.5px] line-clamp-1">{item.product.name}</h4>
                          <p className="text-[9.5px] text-zinc-400 mb-1.5 font-mono uppercase">{item.product.brand}</p>
                          
                          {/* Quantity selector / adjusters */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-zinc-200 rounded bg-white shrink-0 overflow-hidden text-xs font-mono">
                              <button
                                id={`btn-qty-dec-${item.product.id}`}
                                onClick={() => handleUpdateQuantity(item.product.id, -1)}
                                className="p-1 px-2.5 hover:bg-zinc-50 text-zinc-500 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 bg-zinc-50 font-bold text-zinc-800 text-[11.5px]">{item.quantity}</span>
                              <button
                                id={`btn-qty-inc-${item.product.id}`}
                                onClick={() => handleUpdateQuantity(item.product.id, 1)}
                                className="p-1 px-2.5 hover:bg-zinc-50 text-zinc-500 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              id={`btn-cart-rem-${item.product.id}`}
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="text-[10px] text-zinc-400 hover:text-zinc-900 font-semibold ml-auto transition-colors cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-display font-bold text-xs text-zinc-900 block">${(item.product.price * item.quantity).toFixed(2)}</span>
                          <span className="text-[9px] text-zinc-400 font-mono">${item.product.price.toFixed(2)} c/u</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar bottom pricing & proceed controls */}
              {cart.length > 0 && (
                <div className="p-4.5 border-t border-zinc-200 bg-zinc-50 shrink-0">
                  
                  {/* Shipping option choice buttons */}
                  <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1 rounded mb-4 text-xs font-semibold border border-zinc-200/50">
                    <button
                      id="opt-delivery"
                      onClick={() => setShippingMethod('delivery')}
                      className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                        shippingMethod === 'delivery' ? 'bg-zinc-900 text-white shadow-none' : 'text-zinc-500'
                      }`}
                    >
                      🛵 Entrega Exprés
                    </button>
                    <button
                      id="opt-pickup"
                      onClick={() => setShippingMethod('pickup')}
                      className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                        shippingMethod === 'pickup' ? 'bg-zinc-900 text-white shadow-none' : 'text-zinc-500'
                      }`}
                    >
                      🏪 Retirar en Tienda
                    </button>
                  </div>

                  {/* Receipt Pricing Rows */}
                  <div className="space-y-1.5 text-xs text-zinc-650 mb-4 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal de Artículos</span>
                      <span className="font-mono text-zinc-90 w-full text-right text-zinc-900 font-semibold">${cartValues.subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      {shippingMethod === 'delivery' ? (
                        <>
                          <span>Envío (Exprés a domicilio)</span>
                          <span className="font-mono text-zinc-900 font-semibold">
                            {cartValues.shipping === 0 ? <strong className="text-zinc-900 uppercase font-bold text-[10px]">¡GRATIS!</strong> : `$${cartValues.shipping.toFixed(2)}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>Retiro (Sucursal Centro Matriz)</span>
                          <span className="font-mono text-zinc-900 font-bold uppercase">¡GRATIS!</span>
                        </>
                      )}
                    </div>

                    {shippingMethod === 'delivery' && cartValues.subtotal < 300 && (
                      <p className="text-[10px] text-zinc-500 font-medium font-mono uppercase">
                        💼 AGREGA ${(300 - cartValues.subtotal).toFixed(2)} PESOS MÁS PARA ENVÍO GRATUITO
                      </p>
                    )}

                    <div className="border-t border-zinc-200 my-2 pt-2 flex justify-between text-sm font-bold text-zinc-900 font-display">
                      <span>Total Estimado</span>
                      <span className="font-mono text-zinc-950">${cartValues.total.toFixed(2)} MXN</span>
                    </div>
                  </div>

                  <form onSubmit={handleProcessCheckout}>
                    <button
                      id="btn-trigger-checkout"
                      type="submit"
                      disabled={!isCheckoutAllowed}
                      className={`w-full py-2.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCheckoutAllowed
                          ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      Completar y Generar Ticket Clínico
                    </button>
                  </form>

                  {!isCheckoutAllowed && (
                    <p className="text-[10px] text-center text-red-600 mt-2 font-semibold">
                      Por favor sube tu receta en la sección de validación primero para autorizar la compra de antibióticos.
                    </p>
                  )}
                </div>
              )}

            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MODAL 1: PRODUCT DETAIL DISPLAY --- */}
      <AnimatePresence>
        {selectedProductDetails && (
          <>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductDetails(null)}
              className="fixed inset-0 bg-zinc-950/40 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="fixed inset-x-4 top-[10%] md:top-[15%] max-w-2xl mx-auto bg-white rounded-lg z-50 p-6 shadow-xl overflow-hidden border border-zinc-200 flex flex-col md:flex-row gap-6 max-h-[80vh] overflow-y-auto font-sans"
            >
              {/* Left Column Image */}
              <div className="w-full md:w-1/2 aspect-square bg-zinc-50 rounded overflow-hidden relative border border-zinc-150">
                <img
                  src={selectedProductDetails.image}
                  alt={selectedProductDetails.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {selectedProductDetails.requiresPrescription && (
                  <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[8.5px] font-bold uppercase tracking-wider px-2 py-1 rounded font-mono">
                    Requiere Receta
                  </span>
                )}
              </div>

              {/* Right Column details */}
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex-1">
                  <span className="text-[9.5px] font-mono tracking-wider font-semibold uppercase text-zinc-400">{selectedProductDetails.brand}</span>
                  <h3 className="font-display font-semibold text-zinc-900 text-base mb-2 leading-snug">{selectedProductDetails.name}</h3>
                  
                  {selectedProductDetails.activeIngredient && (
                    <div className="bg-zinc-100 border border-zinc-200 text-zinc-800 text-[10px] px-2 py-0.5 rounded inline-block font-mono mb-3.5 uppercase">
                      Fórmula Activa: {selectedProductDetails.activeIngredient}
                    </div>
                  )}

                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">{selectedProductDetails.description}</p>

                  <div className="bg-zinc-50 rounded p-3 border border-zinc-200 text-xs space-y-2 mb-4 font-medium text-zinc-650">
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-mono block">Dosificación indicativa</span>
                      <span className="text-zinc-800 text-[11px] font-medium">{selectedProductDetails.dosage}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase font-mono block">Estado de Stock</span>
                      <span className={selectedProductDetails.stock > 0 ? 'text-zinc-900 font-bold font-mono text-[11px]' : 'text-red-650 font-semibold'}>
                        {selectedProductDetails.stock > 0 ? `UNIDADES DISPONIBLES: ${selectedProductDetails.stock}` : 'Temporalmente Agotado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-zinc-950 font-display text-sm font-bold font-mono">${selectedProductDetails.price.toFixed(2)} MXN</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="btn-modal-add-cart"
                      onClick={() => {
                        handleAddToCart(selectedProductDetails);
                        setSelectedProductDetails(null);
                      }}
                      disabled={selectedProductDetails.stock === 0}
                      className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Añadir al Carrito
                    </button>
                    <button
                      id="btn-modal-close"
                      onClick={() => setSelectedProductDetails(null)}
                      className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-xs font-semibold cursor-pointer transition-colors border border-zinc-250/20"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: DIGITAL RECEIPT TICKET (CHECKOUT SIMULATED SUCCESS) --- */}
      <AnimatePresence>
        {checkoutReceipt && (
          <>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutReceipt(null)}
              className="fixed inset-0 bg-zinc-950/40 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="fixed inset-x-4 top-[5%] md:top-[10%] max-w-md mx-auto bg-white rounded-lg z-50 p-6 shadow-xl border border-zinc-200 overflow-y-auto max-h-[90vh] flex flex-col justify-start font-sans"
            >
              
              {/* Receipt Visual Header */}
              <div className="text-center pb-5 border-b-2 border-dashed border-zinc-200 space-y-1.5 shrink-0">
                <span className="mx-auto w-10 h-10 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-sm font-bold border border-zinc-300">
                  ✓
                </span>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">AUTORIZADO CLÍNICAMENTE</p>
                <h4 className="font-display font-semibold text-base text-zinc-900">Farmacia Bonilla S.A.</h4>
                <p className="text-[10px] text-zinc-400 font-mono">RFC: BON-751214-KM9 | CÉDULA FEDERAL</p>
              </div>

              {/* Receipt properties */}
              <div className="py-4 space-y-3 flex-1 text-xs text-zinc-600 font-medium border-b-2 border-dashed border-zinc-200">
                
                <div className="flex justify-between">
                  <span className="text-zinc-450 font-mono uppercase text-[9px]">Ticket Clínico N°</span>
                  <span className="font-mono text-zinc-900 font-semibold">{checkoutReceipt.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-zinc-450 font-mono uppercase text-[9px]">Fecha de Expedición</span>
                  <span className="text-zinc-800 font-mono text-[11px]">{checkoutReceipt.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-450 font-mono uppercase text-[9px]">Método de Despacho</span>
                  <span className="text-zinc-900 uppercase font-bold text-[10.5px]">
                    {checkoutReceipt.shippingMethod === 'delivery' ? '🛵 Delivery Exprés' : '🏪 Retiro en Centro'}
                  </span>
                </div>

                {checkoutReceipt.requiresPrescription && (
                  <div className="bg-zinc-50 p-2.5 rounded border border-zinc-250/70 text-[10.5px] text-zinc-850 flex flex-col">
                    <span className="font-bold flex items-center gap-1 mb-0.5 text-zinc-900 uppercase font-mono text-[9px] tracking-wider">
                      Firma de Médico Validada
                    </span>
                    <span>Emisor: {checkoutReceipt.prescriptionDoctor}</span>
                    <span className="font-mono text-[9px] text-zinc-500 mt-0.5">CÉDULA PROFESIONAL: {checkoutReceipt.licenseNumber}</span>
                  </div>
                )}

                {/* Items grid */}
                <div className="pt-2">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-mono">Detalle de Medicamentos</span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {checkoutReceipt.items.map((cartItem: any) => (
                      <div key={cartItem.product.id} className="flex justify-between text-[11px] font-mono">
                        <span className="text-zinc-700 truncate max-w-[240px] font-sans">{cartItem.product.name} (x{cartItem.quantity})</span>
                        <span className="text-zinc-90 w-full text-right font-semibold">${(cartItem.product.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals table */}
                <div className="pt-3 border-t border-zinc-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[9.5px] text-zinc-400 uppercase font-mono">Subtotal</span>
                    <span className="font-mono text-zinc-90 w-full text-right text-zinc-800 font-semibold">${checkoutReceipt.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[9.5px] text-zinc-400 uppercase font-mono">Logística</span>
                    <span className="font-mono text-zinc-900 font-semibold">
                      {checkoutReceipt.pricing.shipping === 0 ? '$0.00' : `$${checkoutReceipt.pricing.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-900 mt-1 pt-1.5 border-t border-zinc-200">
                    <span className="uppercase font-mono tracking-wider">Total Final</span>
                    <span className="font-mono text-zinc-950 text-sm">${checkoutReceipt.pricing.total.toFixed(2)} MXN</span>
                  </div>
                </div>

              </div>

              {/* QR Code Simulation & Download CTA button */}
              <div className="pt-4 text-center shrink-0">
                <div className="mx-auto w-20 h-20 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-center mb-3">
                  {/* Visual QR Code Grid simulation */}
                  <div className="grid grid-cols-4 gap-1 p-2 w-full h-full opacity-40">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <div key={idx} className={`rounded-xs ${idx % 3 === 0 || idx % 5 === 0 ? 'bg-zinc-950' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 mb-4 max-w-xs mx-auto">Escanea este código QR en cualquiera de nuestras sucursales o muéstralo al repartidor para recibir tu paquete de medicamentos.</p>
                <div className="flex gap-2">
                  <button
                    id="btn-receipt-complete"
                    onClick={() => {
                      setCheckoutReceipt(null);
                      // Clear cart since transaction is fully completed
                      setCart([]);
                    }}
                    className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium cursor-pointer transition-colors"
                  >
                    Finalizar y Cerrar
                  </button>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
