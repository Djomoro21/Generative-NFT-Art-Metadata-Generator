"use client";

import React, { useState, useEffect, useRef } from "react";
import { Layer, IncompatibleRule, Trait } from "@/types";
import { GripVertical, AlertTriangle, Plus, X, Dice5 } from "lucide-react";

interface Props {
    layers: Layer[];
    setLayers: (layers: Layer[]) => void;
    incompatibleRules: IncompatibleRule[];
    onAddRule: (rule: IncompatibleRule) => void;
    onRemoveRule: (index: number) => void;
    generatePreview: (canvas: HTMLCanvasElement) => Promise<void>;
    onBack: () => void;
    onNext: () => void;
}

export default function Step2Layers({
    layers,
    setLayers,
    incompatibleRules,
    onAddRule,
    onRemoveRule,
    generatePreview,
    onBack,
    onNext
}: Props) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [traitA, setTraitA] = useState("");
    const [traitB, setTraitB] = useState("");
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (previewCanvasRef.current) {
            generatePreview(previewCanvasRef.current);
        }
    }, [generatePreview, layers]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const newLayers = [...layers];
        const temp = newLayers[draggedIndex];
        newLayers.splice(draggedIndex, 1);
        newLayers.splice(index, 0, temp);
        setLayers(newLayers);
        setDraggedIndex(null);
    };

    const handleWeightChange = (layerIndex: number, traitIndex: number, weight: number) => {
        const newLayers = [...layers];
        newLayers[layerIndex].traits[traitIndex].weight = weight;
        setLayers(newLayers);
    };

    const allTraits = layers.flatMap(l => l.traits.map(t => t.file.name));

    const addRule = () => {
        if (traitA && traitB && traitA !== traitB) {
            onAddRule({ traitA, traitB });
            setTraitA("");
            setTraitB("");
        }
    };

    return (
        <div className="animate-in space-y-8">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
                <h2>Step 2: Layer & Rarity Configuration</h2>
                <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {layers.length} Layers
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="help-text mb-4">Drag layers to change the stack order. Top layer in the list renders on TOP of others.</p>
                    {layers.map((layer, lIdx) => (
                        <div
                            key={layer.name}
                            draggable
                            onDragStart={() => handleDragStart(lIdx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(lIdx)}
                            className={`card flex flex-col p-4 transition-all ${draggedIndex === lIdx ? 'opacity-50 scale-95' : 'hover:border-indigo-500/50'}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <GripVertical className="text-gray-600 cursor-grab active:cursor-grabbing" />
                                <span className="font-bold text-indigo-400 uppercase tracking-wider text-sm">{layer.name}</span>
                            </div>

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {layer.traits.map((trait, tIdx) => (
                                    <div key={trait.file.name} className="flex items-center justify-between text-xs bg-black/30 p-2 rounded-lg border border-white/5">
                                        <span className="truncate flex-1 text-gray-400">{trait.file.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Weight:</span>
                                            <input
                                                type="number"
                                                value={trait.weight}
                                                onChange={(e) => handleWeightChange(lIdx, tIdx, parseInt(e.target.value) || 0)}
                                                className="w-12 h-6 p-1 text-[10px] text-center"
                                                min={0}
                                                max={100}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="glass-panel text-center p-6 flex flex-col items-center">
                        <h3 className="text-sm font-bold mb-4 uppercase text-gray-400 tracking-widest">Live Preview</h3>
                        <canvas
                            ref={previewCanvasRef}
                            width={300}
                            height={300}
                            className="rounded-2xl border-4 border-black/40 shadow-2xl bg-black/20"
                        />
                        <button
                            onClick={() => previewCanvasRef.current && generatePreview(previewCanvasRef.current)}
                            className="mt-6 secondary"
                        >
                            <Dice5 className="w-5 h-5" /> Generate Random
                        </button>
                    </div>

                    <div className="card border-amber-500/20 bg-amber-500/5">
                        <h3 className="flex items-center gap-2 text-amber-500 text-sm font-bold mb-4">
                            <AlertTriangle className="w-4 h-4" /> INCOMPATIBLE TRAITS
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <select
                                value={traitA}
                                onChange={(e) => setTraitA(e.target.value)}
                                className="text-xs py-2 bg-black/50 border-gray-700"
                            >
                                <option value="">Select Trait A</option>
                                {allTraits.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select
                                value={traitB}
                                onChange={(e) => setTraitB(e.target.value)}
                                className="text-xs py-2 bg-black/50 border-gray-700"
                            >
                                <option value="">Select Trait B</option>
                                {allTraits.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button onClick={addRule} className="p-2"><Plus className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-2">
                            {incompatibleRules.map((rule, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px] bg-red-500/10 text-red-400 px-3 py-2 rounded-lg border border-red-500/20">
                                    <span className="truncate">{rule.traitA} ↔ {rule.traitB}</span>
                                    <button onClick={() => onRemoveRule(idx)} className="bg-transparent border-none text-red-500 p-0 hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-gray-800">
                <button className="secondary px-8" onClick={onBack}>← Back</button>
                <button className="px-12" onClick={onNext}>Generate Collection →</button>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-8 > * + * { margin-top: 2rem; }
        .md\\:grid-cols-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}
