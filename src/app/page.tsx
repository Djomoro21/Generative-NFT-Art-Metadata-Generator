"use client";

import React, { useState } from "react";
import { useNFTGenerator } from "@/hooks/useNFTGenerator";
import Step1Setup from "@/components/Step1Setup";
import Step2Layers from "@/components/Step2Layers";
import Step3Preview from "@/components/Step3Preview";
import Step4Export from "@/components/Step4Export";
import { Sparkles, Palette, Zap, Box } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState(1);
  const {
    layers,
    setLayers,
    incompatibleRules,
    addIncompatibleRule,
    removeIncompatibleRule,
    collection,
    setCollection,
    config,
    updateConfig,
    generateRandomCombo,
    drawCombo,
    generatePreview
  } = useNFTGenerator();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const getStepTitle = (s: number) => {
    switch (s) {
      case 1: return "Collection Setup";
      case 2: return "Configure Layers";
      case 3: return "Review Collection";
      case 4: return "Export & Upload";
      default: return "";
    }
  };

  return (
    <main className="container">
      <div className="flex flex-col items-center mb-12 animate-in">
        <h1><Palette className="w-10 h-10 text-indigo-400" /> NFT Art Generator</h1>
        <p className="subtitle text-center">Modern Generative Art Engine</p>

        <div className="flex items-center gap-4 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step === s ? 'bg-indigo-500 scale-110 shadow-lg shadow-indigo-500/50' :
                  step > s ? 'bg-indigo-900 border border-indigo-400/50 text-indigo-400' :
                    'bg-gray-800 text-gray-500 border border-white/5'
                  }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 4 && <div className={`w-8 h-[2px] mx-2 ${step > s ? 'bg-indigo-500' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel min-h-[500px] relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          {step === 1 && (
            <Step1Setup
              config={config}
              updateConfig={updateConfig}
              layers={layers}
              setLayers={setLayers}
              onNext={nextStep}
            />
          )}

          {step === 2 && (
            <Step2Layers
              layers={layers}
              setLayers={setLayers}
              incompatibleRules={incompatibleRules}
              onAddRule={addIncompatibleRule}
              onRemoveRule={removeIncompatibleRule}
              generatePreview={generatePreview}
              onBack={prevStep}
              onNext={nextStep}
            />
          )}

          {step === 3 && (
            <Step3Preview
              size={config.size}
              generateRandomCombo={generateRandomCombo}
              drawCombo={drawCombo}
              collection={collection}
              setCollection={setCollection}
              onBack={prevStep}
              onNext={nextStep}
            />
          )}

          {step === 4 && (
            <Step4Export
              config={config}
              collection={collection}
              layers={layers}
              drawCombo={drawCombo}
              onBack={prevStep}
            />
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-center gap-6 opacity-60">
        <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Built for Creators</span>
        <span className="flex items-center gap-2"><Box className="w-3 h-3" /> Fully Decentralized</span>
        <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Instant Processing</span>
      </footer>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .mb-12 { margin-bottom: 3rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-12 { margin-top: 3rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .w-10 { width: 2.5rem; }
        .h-10 { height: 2.5rem; }
        .rounded-full { border-radius: 9999px; }
        .bg-indigo-500 { background-color: #6366f1; }
        .bg-indigo-900 { background-color: #1e1b4b; }
        .bg-gray-800 { background-color: #1f2937; }
        .text-indigo-400 { color: #818cf8; }
        .border-indigo-400\/50 { border-color: rgba(129, 140, 248, 0.5); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .shadow-indigo-500\/50 { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        .scale-110 { transform: scale(1.1); }
        .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
        .w-8 { width: 2rem; }
        .h-\[2px\] { height: 2px; }
      `}</style>
    </main>
  );
}
