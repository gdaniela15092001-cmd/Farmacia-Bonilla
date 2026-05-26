/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Droplet, Sparkles, HeartPulse, Scale, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface WellnessToolsProps {
  products: Product[];
  onAddProductById: (id: string) => void;
}

export function WellnessTools({ products, onAddProductById }: WellnessToolsProps) {
  const [activeTab, setActiveTab] = useState<'imc' | 'water'>('imc');

  // IMC State
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [imcResult, setImcResult] = useState<{
    score: number;
    category: string;
    description: string;
    color: string;
  } | null>(null);

  // Water State
  const [dailyWeight, setDailyWeight] = useState<string>('70');
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [waterResult, setWaterResult] = useState<{
    liters: number;
    glasses: number;
    suggestion: string;
  } | null>(null);

  // Calculate IMC
  const calculateIMC = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // to meters

    if (!w || !h) return;

    const score = w / (h * h);
    let category = '';
    let description = '';
    let color = '';

    if (score < 18.5) {
      category = 'Bajo peso';
      description = 'Su peso está por debajo de lo recomendado. Le sugerimos consultar con un nutricionista y considerar complementar su alimentación con nuestro Multivitamínico Bonilla Vital-Plus.';
      color = 'text-sky-600 bg-sky-50 border-sky-200';
    } else if (score >= 18.5 && score < 24.9) {
      category = 'Peso Saludable';
      description = '¡Excelente! Se encuentra en un rango de peso saludable. Siga manteniendo una dieta balanceada y use Colágeno o multivitaminas para potenciar su longevidad activa.';
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (score >= 25 && score < 29.9) {
      category = 'Sobrepeso';
      description = 'Su peso está ligeramente por encima del promedio recomendado. Incremente el ejercicio aeróbico regular, controle las porciones e incorpore Omega 3 a su dieta diaria.';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else {
      category = 'Obesidad';
      description = 'Se encuentra en rango de obesidad. Le sugerimos acudir a una consulta especializada para estructurar un plan integral de salud. El omega 3 es excelente apoyo cardiovascular.';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    setImcResult({
      score: parseFloat(score.toFixed(1)),
      category,
      description,
      color
    });
  };

  // Calculate Water Intake
  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(dailyWeight);
    if (!w) return;

    // Base: 35ml per kg of bodyweight
    let ml = w * 35;

    // Add extra based on activity level
    if (activityLevel === 'moderate') {
      ml += 500;
    } else if (activityLevel === 'high') {
      ml += 1000;
    }

    const liters = parseFloat((ml / 1000).toFixed(2));
    const glasses = Math.round(ml / 250); // 250ml glass
    let suggestion = 'Mantente bien hidratado usando electrolitos en polvo si entrenas intenso.';

    setWaterResult({
      liters,
      glasses,
      suggestion
    });
  };

  return (
    <div id="wellness-tools-panel" className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-none">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-zinc-50 text-zinc-800 rounded-lg border border-zinc-250/50">
          <HeartPulse className="w-4.5 h-4.5" />
        </div>
        <div>
          <h3 className="font-display font-medium text-sm text-zinc-900 leading-tight">Herramientas de Salud Preventiva</h3>
          <p className="text-[10px] text-zinc-400 mt-1 font-mono">CALCULADORAS CLÍNICAS DE DIAGNÓSTICO</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-zinc-150/70 rounded-lg mb-6">
        <button
          id="btn-tab-imc"
          onClick={() => setActiveTab('imc')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'imc'
              ? 'bg-white text-zinc-900 border border-zinc-250 shadow-xs'
              : 'text-zinc-550 hover:text-zinc-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          Índice de Masa Corporal (IMC)
        </button>
        <button
          id="btn-tab-water"
          onClick={() => setActiveTab('water')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'water'
              ? 'bg-white text-zinc-900 border border-zinc-250 shadow-xs'
              : 'text-zinc-550 hover:text-zinc-800'
          }`}
        >
          <Droplet className="w-4 h-4" />
          Consumo Diario de Agua
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'imc' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Form */}
          <form onSubmit={calculateIMC} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-650 block mb-1.5">Peso Corporal (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="250"
                  className="w-full pl-3 pr-12 py-2 rounded-lg border border-zinc-200 text-zinc-800 font-medium focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-hidden text-sm bg-zinc-50/10"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] text-zinc-400 font-mono uppercase">kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-650 block mb-1.5">Estatura o Altura (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                  className="w-full pl-3 pr-12 py-2 rounded-lg border border-zinc-200 text-zinc-800 font-medium focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-hidden text-sm bg-zinc-50/10"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] text-zinc-400 font-mono uppercase">cm</span>
              </div>
            </div>

            <button
              id="btn-calc-imc"
              type="submit"
              className="mt-2 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-none transition-colors flex items-center justify-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              Calcular IMC
            </button>
          </form>

          {/* Result Block */}
          <div className="h-full flex flex-col justify-center">
            {imcResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl border ${imcResult.color} flex flex-col h-full`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider block opacity-70">Tu Índice de Masa Corporal</span>
                <div className="flex items-baseline gap-2 mt-1 mb-2">
                  <span className="font-display font-black text-3xl">{imcResult.score}</span>
                  <span className="text-xs font-bold font-mono">kg/m²</span>
                  <span className="font-semibold text-[10px] py-0.5 px-2 bg-white/80 rounded-full border border-current ml-auto">
                    {imcResult.category}
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90 mb-4">{imcResult.description}</p>

                {/* Specific recommended card */}
                <div className="mt-auto bg-white border border-zinc-200 p-3 rounded-lg flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-150">
                    <Sparkles className="w-4.5 h-4.5 text-zinc-650" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8.5px] uppercase font-bold text-zinc-400 font-mono block">Suplemento Recomendado</span>
                    <h5 className="font-medium text-zinc-850 text-[10.5px] truncate">
                      {imcResult.score < 25 ? 'Multivitamínico Bonilla Vital-Plus' : 'Omega 3 Premium 1000mg'}
                    </h5>
                  </div>
                  <button
                    id="btn-imc-add-rec"
                    onClick={() => onAddProductById(imcResult.score < 25 ? 'b1' : 'b2')}
                    className="p-1 px-2.5 bg-zinc-900 text-white font-medium text-[9.5px] rounded hover:bg-zinc-800 cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-200 bg-zinc-50/10 rounded-lg">
                <Scale className="w-8 h-8 text-zinc-350 mb-2" />
                <p className="text-xs text-zinc-500 font-medium">Introduce tus datos a la izquierda para procesar tu diagnóstico preventivo de peso.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Form */}
          <form onSubmit={calculateWater} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-655 block mb-1.5">Tu peso actual (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={dailyWeight}
                  onChange={(e) => setDailyWeight(e.target.value)}
                  min="30"
                  max="250"
                  className="w-full pl-3 pr-12 py-2 rounded-lg border border-zinc-200 text-zinc-800 font-medium focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-hidden text-sm bg-zinc-50/10"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] text-zinc-400 font-mono uppercase">kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-655 block mb-1.5">Nivel de Actividad Diaria</label>
              <select
                value={activityLevel}
                onChange={(e: any) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-zinc-700 font-medium focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-hidden text-sm cursor-pointer bg-zinc-50/10"
              >
                <option value="low">Sedentario / Poco ejercicio</option>
                <option value="moderate">Moderado (30-60 min activa)</option>
                <option value="high">Intenso (Entrenamiento pesado)</option>
              </select>
            </div>

            <button
              id="btn-calc-water"
              type="submit"
              className="mt-2 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-none transition-colors flex items-center justify-center gap-1.5"
            >
              <Droplet className="w-4 h-4" />
              Calcular Consumo Recomendado
            </button>
          </form>

          {/* Result Block */}
          <div className="h-full flex flex-col justify-center">
            {waterResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-sky-100 bg-sky-50/45 text-sky-850 flex flex-col h-full"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider block opacity-70">Ingesta Óptima Diaria</span>
                <div className="flex items-baseline gap-2 mt-1 mb-2">
                  <span className="font-display font-black text-3xl">{waterResult.liters}</span>
                  <span className="text-xs font-bold uppercase font-mono">Litros</span>
                  <span className="font-medium text-[9.5px] py-0.5 px-2 bg-white/90 border border-sky-200 rounded-full ml-auto flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                    ≈ {waterResult.glasses} Vasos
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90 mb-4">
                  La hidratación estimula la elasticidad de los tejidos y previene la fatiga muscular durante el día.
                </p>

                {/* Suggestion for product */}
                <div className="mt-auto bg-white border border-zinc-200 p-3 rounded-lg flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-150">
                    <Droplet className="w-4.5 h-4.5 text-zinc-650" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8.5px] uppercase font-bold text-zinc-400 font-mono block">Cuidado Corporal</span>
                    <h5 className="font-medium text-zinc-855 text-[10.5px] truncate">Colágeno Hidrolizado Premium</h5>
                  </div>
                  <button
                    id="btn-water-add-rec"
                    onClick={() => onAddProductById('b3')}
                    className="p-1 px-2.5 bg-zinc-900 text-white font-medium text-[9.5px] rounded hover:bg-zinc-800 cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-200 bg-zinc-50/10 rounded-lg">
                <Droplet className="w-8 h-8 text-zinc-350 mb-2" />
                <p className="text-xs text-zinc-500 font-medium">Introduce tus datos de peso a la izquierda para estimar tus requerimientos de hidratación.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
