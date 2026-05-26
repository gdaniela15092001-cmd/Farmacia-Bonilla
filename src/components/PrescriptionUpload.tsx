/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface PrescriptionUploadProps {
  onPrescriptionApproved: (approved: boolean, details: any | null) => void;
  initiallyRequiresPrescription: boolean;
}

export function PrescriptionUpload({
  onPrescriptionApproved,
  initiallyRequiresPrescription
}: PrescriptionUploadProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalyzing(true);
    setParsedData(null);
    onPrescriptionApproved(false, null);

    // Simulate sophisticated OCR scanning + verification after a short delay
    setTimeout(() => {
      const simulatedPrescription = {
        doctor: "Dra. Sofía Bonilla Ortiz",
        specialty: "Pediatría y Alergología Médica",
        licenseNumber: "CÉD. PROF. 847291-C",
        date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
        patient: "Paciente Digital Simulado",
        prescribedItems: [
          "Amoxicilina 500mg - 1 caja",
          "Ibuprofeno 400mg - 1 caja"
        ],
        matchConfidence: "98.4%",
        isValid: true
      };
      setAnalyzing(false);
      setParsedData(simulatedPrescription);
      onPrescriptionApproved(true, simulatedPrescription);
    }, 2800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUploader = () => {
    setFile(null);
    setParsedData(null);
    onPrescriptionApproved(false, null);
  };

  return (
    <div id="prescription-uploader-box" className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-zinc-50 text-zinc-800 rounded-lg border border-zinc-250/50">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-medium text-xs text-zinc-900 leading-none">Validación de Receta Digital</h4>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">AUTORIZACIÓN MÉDICA INTEGRAL</p>
          </div>
        </div>

        {initiallyRequiresPrescription && (
          <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 text-zinc-700 text-[8.5px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
            <AlertCircle className="w-3 h-3 text-zinc-500" />
            REQUERIDO
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!file && !analyzing && (
          <motion.div
            key="drag-drop"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-350 min-h-[160px] ${
              dragActive
                ? 'border-zinc-900 bg-zinc-50/80'
                : 'border-zinc-200 bg-zinc-50/20 hover:border-zinc-450 hover:bg-zinc-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleChange}
            />
            <div className="p-2.5 bg-white border border-zinc-200 rounded-full shadow-none mb-2.5 text-zinc-400">
              <Upload className="w-5 h-5 text-zinc-550" />
            </div>
            <p className="font-sans font-medium text-zinc-700 text-[11.5px] mb-1">
              Arrastra tu receta médica o <span className="text-zinc-950 font-semibold underline">búscala en tu equipo</span>
            </p>
            <p className="text-[10px] text-zinc-450 leading-relaxed max-w-xs">
              Formatos aceptados: JPG, PNG, PDF de hasta 8MB. Verificación de firma electrónica automatizada.
            </p>
          </motion.div>
        )}

        {analyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="border border-zinc-200 bg-zinc-50/10 rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="text-zinc-700 mb-3"
            >
              <RefreshCw className="w-7 h-7" />
            </motion.div>
            <h5 className="font-display font-medium text-zinc-850 text-xs mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
              Sincronizando con Red Médica Bonilla...
            </h5>
            <p className="text-[10px] text-zinc-400 font-mono text-center max-w-xs leading-relaxed">
              Analizando marcas de seguridad, vigencia y cédula profesional del emisor.
            </p>
          </motion.div>
        )}

        {parsedData && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-zinc-200 bg-zinc-50/20 rounded-lg p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-zinc-900 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none mb-1">CARGA EXITOSA</p>
                <h5 className="font-display font-medium text-zinc-800 text-[11px] font-mono truncate max-w-[200px]">{file?.name}</h5>
              </div>
              <button
                id="btn-rx-refresh"
                onClick={resetUploader}
                className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 rounded-md transition-colors cursor-pointer"
                title="Cambiar receta"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulated parsed report */}
            <div className="bg-white border border-zinc-200 rounded-lg p-3 text-[11px] flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-150">
                <div>
                  <span className="text-[8.5px] text-zinc-400 uppercase font-mono block">Médico Tratante</span>
                  <span className="font-medium text-zinc-850 text-[10.5px]">{parsedData.doctor}</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-zinc-400 uppercase font-mono block">Cédula Profesional</span>
                  <span className="text-zinc-650 font-mono text-[9.5px]">{parsedData.licenseNumber}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[8.5px] text-zinc-400 uppercase font-mono block">Especialidad</span>
                  <span className="text-zinc-600 text-[10px]">{parsedData.specialty}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[8.5px] text-zinc-400 uppercase font-mono block">Fecha de Emisión</span>
                  <span className="text-zinc-600 text-[10px]">{parsedData.date}</span>
                </div>
              </div>

              <div>
                <span className="text-[8.5px] text-zinc-400 uppercase font-mono block mb-1">Medicamentos Encontrados</span>
                <ul className="list-inside list-disc pl-1 flex flex-col gap-0.5 text-[10px] text-zinc-600">
                  {parsedData.prescribedItems.map((item: string, idx: number) => (
                    <li key={idx} className="font-medium">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-1 pt-2 border-t border-zinc-150 flex items-center justify-between text-[9px]">
                <span className="text-zinc-400">Firmado digitalmente: <strong className="text-zinc-800 font-mono">CONFIRMADO</strong></span>
                <span className="text-zinc-600 font-medium bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded-sm">Confianza {parsedData.matchConfidence}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
