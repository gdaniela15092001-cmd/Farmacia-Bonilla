/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Eye, ClipboardList, AlertCircle, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isFavorite,
  onToggleFavorite
}) => {
  const { name, brand, price, image, requiresPrescription, activeIngredient, stock } = product;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-none hover:border-zinc-400 transition-all duration-300 flex flex-col h-full"
    >
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {requiresPrescription && (
          <span className="inline-flex items-center gap-1 bg-zinc-50 text-zinc-700 text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md border border-zinc-200/60">
            <AlertCircle className="w-2.5 h-2.5 text-zinc-500" />
            Receta obligatoria
          </span>
        )}
        {stock < 10 && stock > 0 && (
          <span className="bg-red-50 text-red-600 text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md border border-red-100">
            Últimas {stock} unids
          </span>
        )}
        {stock === 0 && (
          <span className="bg-zinc-100 text-zinc-400 text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md">
            Agotado
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        id={`btn-fav-${product.id}`}
        onClick={() => onToggleFavorite(product.id)}
        className="absolute top-2.5 right-2.5 z-10 p-2 bg-white/90 backdrop-blur-xs rounded-full border border-zinc-200/60 text-zinc-400 hover:text-rose-500 active:scale-95 transition-all cursor-pointer"
        aria-label="Agregar a favoritos"
      >
        <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Image container */}
      <div className="aspect-square bg-zinc-50/50 overflow-hidden relative group/img shrink-0">
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
        />
        {/* Hover overlay controls */}
        <div className="absolute inset-0 bg-zinc-900/5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <button
            id={`btn-view-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="p-2 bg-white text-zinc-800 rounded-full hover:bg-zinc-100 shadow-sm transition-all scale-95 group-hover/img:scale-100 cursor-pointer border border-zinc-200"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info details */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 mb-0.5">{brand}</p>
        <h3 className="font-display font-medium text-zinc-900 text-xs tracking-tight hover:text-zinc-700 transition-colors line-clamp-2 h-9 mb-2 leading-tight">
          {name}
        </h3>

        {activeIngredient && (
          <div className="flex items-center gap-1 mb-3 text-[10.5px] bg-zinc-50 text-zinc-600 px-2 py-0.5 rounded-md self-start border border-zinc-100">
            <ClipboardList className="w-3 h-3 text-zinc-400" />
            <span className="font-normal font-mono">Fórmula: {activeIngredient}</span>
          </div>
        )}

        {/* Pricing & CTA */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 uppercase tracking-widest leading-none mb-1">Precio</span>
            <span className="font-display font-semibold text-base text-zinc-905">${price.toFixed(2)} <span className="text-[10px] font-normal text-zinc-400 uppercase">MXN</span></span>
          </div>

          <button
            id={`btn-cart-${product.id}`}
            onClick={() => onAddToCart(product)}
            disabled={stock === 0}
            className={`flex items-center gap-1 font-sans font-medium text-xs py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
              stock === 0
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-none'
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
            Añadir
          </button>
        </div>
      </div>
    </motion.div>
  );
}
