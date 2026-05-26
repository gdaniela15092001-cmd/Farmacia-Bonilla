/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'medicamentos' | 'cuidado_personal' | 'bienestar' | 'infantil' | 'botiquin';
  categoryLabel: string;
  price: number;
  image: string;
  description: string;
  requiresPrescription: boolean;
  activeIngredient?: string; // Principio Activo
  dosage: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  is24Hours: boolean;
  isOnDuty: boolean; // Farmacia de turno
  coords: { lat: number; lng: number };
}

export interface WellnessTip {
  id: string;
  title: string;
  category: string;
  content: string;
  recommendedProducts: string[]; // Product IDs
}

export interface FAQ {
  question: string;
  answer: string;
}
