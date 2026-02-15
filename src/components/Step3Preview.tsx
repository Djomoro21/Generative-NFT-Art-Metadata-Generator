"use client";

import React, { useEffect, useState, useRef } from "react";
import { Combination } from "@/types";
import { Layers, RefreshCw } from "lucide-react";

interface Props {
    size: number;
    generateRandomCombo: () => string[];
    drawCombo: (combo: string[], canvas: HTMLCanvasElement, size: number) => Promise<void>;
    collection: Combination[];
    setCollection: (collection: Combination[]) => void;
    onBack: () => void;
    onNext: () => void;
}

const PreviewItem = ({ combo, drawCombo }: { combo: string[], drawCombo: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            drawCombo(combo, canvasRef.current, 120);
        }
    }, [combo, drawCombo]);

    return (
        <div className="card p-2 bg-black/40 border-white/5 group hover:border-indigo-500/50 transition-all">
            <canvas
                ref={canvasRef}
                width={120}
                height={120}
                className="rounded-lg bg-black/20 w-full aspect-square"
            />
            <p className="text-[10px] text-gray-500 mt-2 text-center group-hover:text-indigo-400">NFT #{combo[0].slice(0, 4)}</p>
        </div>
    );
};

export default function Step3Preview({
    size,
    generateRandomCombo,
    drawCombo,
    collection,
    setCollection,
    onBack,
    onNext
}: Props) {
    const [isGenerating, setIsGenerating] = useState(false);

    const buildCollection = () => {
        setIsGenerating(true);
        const newCollection: Combination[] = [];
        for (let i = 0; i < size; i++) {
            newCollection.push(generateRandomCombo());
        }
        setCollection(newCollection);
        setIsGenerating(false);
    };

    useEffect(() => {
        if (collection.length === 0) {
            buildCollection();
        }
    }, []);

    return (
        <div className="animate-in space-y-8">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
                <h2>Step 3: Collection Preview</h2>
                <div className="flex gap-4">
                    <button className="secondary py-2 text-xs" onClick={buildCollection}>
                        <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} /> Regenerate
                    </button>
                    <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        <Layers className="w-3 h-3" /> {size} Tokens
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {collection.map((combo, idx) => (
                    <PreviewItem key={idx} combo={combo} drawCombo={drawCombo} />
                ))}
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-gray-800">
                <button className="secondary px-8" onClick={onBack}>← Back</button>
                <button className="px-12" onClick={onNext} disabled={isGenerating}>Generate & Export →</button>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .grid { display: grid; }
        .gap-4 { gap: 1rem; }
      `}</style>
        </div>
    );
}
