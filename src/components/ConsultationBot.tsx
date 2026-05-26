/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Stethoscope, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

interface ConsultationBotProps {
  products: Product[];
  onAddProductById: (id: string) => void;
}

export function ConsultationBot({ products, onAddProductById }: ConsultationBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: '¡Hola! Bienvenido al Consultor Digital de Farmacia Bonilla. 🩺 Me especializo en orientarte sobre síntomas cotidianos, dosis e información general de medicamentos. ¿En qué te puedo asesorar hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const predefinedButtons = [
    { label: '🤧 Gripe o Resfriado', query: 'Tengo síntomas de resfriado, congestión y cuerpo cortado. ¿Qué me sugieren?' },
    { label: '🤕 Dolor de Cabeza / Fiebre', query: 'Siento dolor de cabeza fuerte y fiebre leve. ¿Qué dosis de paracetamol es indicada?' },
    { label: '🧴 Rutina Skincare básica', query: '¿Cómo armar una rutina básica para piel sensible?' },
    { label: '🎒 Botiquín familiar', query: '¿Qué elementos básicos debe tener mi botiquín de emergencias?' }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate clinical response delay
    setTimeout(() => {
      let responseText = '';
      let recommendedProductIds: string[] = [];
      const normalized = textToSend.toLowerCase();

      if (normalized.includes('gripe') || normalized.includes('resfriado') || normalized.includes('congesti') || normalized.includes('🤧')) {
        responseText = 'Para síntomas de gripe común, es fundamental el reposo y la hidratación constante. Puedes utilizar Loratadina 10mg para disminuir los estornudos y el escurrimiento nasal, y Paracetamol Bonilla 500mg para controlar el dolor corporal y la fiebre menor. *Nota: Si presentas dificultad para respirar, consulta de inmediato a urgencias.*';
        recommendedProductIds = ['m1', 'm4'];
      } else if (normalized.includes('dolor') || normalized.includes('cabeza') || normalized.includes('fiebre') || normalized.includes('paracetamol') || normalized.includes('🤕')) {
        responseText = 'El Paracetamol Bonilla 500mg es el analgésico de elección inicial para dolor de cabeza y fiebre, con un excelente perfil de seguridad. La dosis estándar para adultos es de 500mg a 1g cada 8 horas (máximo 4g diarios). Si tienes inflamación muscular o articular, el Ibuprofeno de 400mg también es una alternativa muy eficaz acompañando alimentos.';
        recommendedProductIds = ['m1', 'm3'];
      } else if (normalized.includes('skincare') || normalized.includes('piel') || normalized.includes('crema') || normalized.includes('🧴')) {
        responseText = 'Una rutina dermocosmética saludable consta de 3 pilares: \n1. Limpieza suave (Effaclar Gel Limpiador para remover impurezas sin resecar).\n2. Hidratación profunda (Crema Cerave con ceramidas para restaurar la barrera cutánea).\n3. Fotoprotección obligatoria (Bloqueador SPF 50+ toque seco diariamente).';
        recommendedProductIds = ['c2', 'c3', 'c1'];
      } else if (normalized.includes('botiquín') || normalized.includes('emergencia') || normalized.includes('primero') || normalized.includes('🎒')) {
        responseText = 'Un botiquín excelente debe estar preparado para cortaduras, raspones y desinfecciones rápidas. Te sugerimos contar siempre con Alcohol Etílico al 70%, Gasas Estériles individuales y Curitas Elásticas Band-Aid. ¡Tener esto a la mano salva cualquier imprevisto!';
        recommendedProductIds = ['bt1', 'bt2', 'bt3'];
      } else {
        responseText = 'Entiendo tu consulta. Como recomendación general de bienestar, te sugerimos mantener una suplementación vitaminosa óptima como nuestro Multivitamínico Vital-Plus y grasas saludables Omega 3, las cuales promueven tus funciones cognitivas y cardiovasculares. ¿Deseas más detalles sobre algún síntoma específico?';
        recommendedProductIds = ['b1', 'b2'];
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputText);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'bot',
        text: '¡Chat reiniciado! ¿En qué otra consulta de salud o medicamento puedo orientarte hoy?',
        timestamp: 'Ahora'
      }
    ]);
  };

  return (
    <div id="health-advisor-box" className="bg-white text-zinc-800 border border-zinc-200/85 rounded-xl p-5 shadow-xs flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-150 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold border border-zinc-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-medium text-xs text-zinc-900 flex items-center gap-1.5 leading-none">
              Asesor Digital de Salud
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h4>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">EN LÍNEA | CERTIFICADO</p>
          </div>
        </div>

        <button
          id="btn-clear-chat"
          onClick={clearChat}
          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
          title="Reiniciar chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4 flex flex-col justify-start scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs shrink-0 ${
              msg.sender === 'user' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 border border-zinc-250/50'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
            </div>

            <div className="flex flex-col">
              <div className={`p-3 rounded-xl text-xs space-y-1.5 whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-zinc-900 text-white rounded-tr-none'
                  : 'bg-zinc-50 text-zinc-800 border border-zinc-200/70 rounded-tl-none font-sans'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>

                {/* Recommended Products nested */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-200/60 flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-zinc-450" />
                      Artículos sugeridos:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.recommendedProductIds.map(prodId => {
                        const matchedProduct = products.find(p => p.id === prodId);
                        if (!matchedProduct) return null;
                        return (
                          <div key={prodId} className="bg-white border border-zinc-200 p-2 rounded-lg flex items-center justify-between gap-2 shadow-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={matchedProduct.image}
                                alt={matchedProduct.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-md object-cover bg-zinc-100 shrink-0 border border-zinc-100"
                              />
                              <div className="min-w-0">
                                <h6 className="text-[10px] font-medium text-zinc-800 truncate">{matchedProduct.name}</h6>
                                <span className="text-[9.5px] font-mono font-medium text-emerald-700">${matchedProduct.price.toFixed(2)}</span>
                              </div>
                            </div>
                            <button
                              id={`btn-chat-add-${prodId}`}
                              onClick={() => onAddProductById(prodId)}
                              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-[9px] rounded-md transition-colors cursor-pointer"
                            >
                              + Añadir
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[8.5px] text-zinc-400 mt-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 self-start max-w-[85%]">
            <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-500 border border-zinc-200/60 flex items-center justify-center text-xs shrink-0">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-xl rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-450 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-zinc-450 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-zinc-450 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion tags */}
      {messages.length === 1 && !isTyping && (
        <div className="mb-3">
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-1.5">Consultas Sugeridas</span>
          <div className="flex flex-wrap gap-1.5">
            {predefinedButtons.map((btn, idx) => (
              <button
                id={`btn-predefined-${idx}`}
                key={idx}
                onClick={() => handleSendMessage(btn.query)}
                className="text-[10px] bg-zinc-50 hover:bg-zinc-100 text-zinc-600 py-1.5 px-2.5 rounded-lg border border-zinc-200 border-dashed cursor-pointer transition-colors font-medium"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Warning Statement */}
      <div className="flex items-start gap-1 p-2 bg-zinc-50 rounded-lg border border-zinc-150 mb-3 shrink-0">
        <AlertCircle className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-[9.5px] text-zinc-500 leading-snug">Orientación de primer contacto de demostración. No sustituye la consulta médica formal para diagnósticos.</p>
      </div>

      {/* Input Form */}
      <div className="flex gap-1.5 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe tu consulta..."
          className="flex-1 bg-zinc-50 text-zinc-800 placeholder-zinc-400 border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 focus:outline-hidden"
        />
        <button
          id="btn-send-message"
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim()}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
