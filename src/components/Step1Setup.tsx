"use client";

import React, { useRef } from "react";
import { CollectionConfig, Layer, Trait } from "@/types";
import { Upload, Image as ImageIcon, Film } from "lucide-react";

interface Props {
    config: CollectionConfig;
    updateConfig: (updates: Partial<CollectionConfig>) => void;
    layers: Layer[];
    setLayers: (layers: Layer[]) => void;
    onNext: () => void;
}

export default function Step1Setup({ config, updateConfig, layers, setLayers, onNext }: Props) {
    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const temp: Record<string, Trait[]> = {};

        files.forEach((file) => {
            // webkitRelativePath is "folder/layerName/traitName.png"
            const parts = file.webkitRelativePath.split("/");
            if (parts.length < 3) return; // Not in a subfolder

            const layerName = parts[1];
            if (!temp[layerName]) temp[layerName] = [];
            temp[layerName].push({ file, weight: 1 });
        });

        const newLayers: Layer[] = Object.entries(temp).map(([name, traits]) => ({
            name,
            traits,
        }));

        setLayers(newLayers);
    };

    const handlePreRevealImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        updateConfig({ preRevealImage: file });
    };

    const handlePreRevealAnimation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        updateConfig({ preRevealAnimation: file });
    };

    const isStepValid = config.name.trim() !== "" && layers.length > 0 && (!config.usePreReveal || config.preRevealImage !== null);

    return (
        <div className="animate-in">
            <h2>Step 1: Collection Setup</h2>

            <div className="form-group">
                <label htmlFor="collectionName">Collection Name</label>
                <input
                    type="text"
                    id="collectionName"
                    placeholder="e.g., Cyber Punks 2077"
                    value={config.name}
                    onChange={(e) => updateConfig({ name: e.target.value })}
                />
                <p className="help-text">This will be the primary name of your collection.</p>
            </div>

            <div className="form-group">
                <label htmlFor="collectionDesc">Collection Description</label>
                <textarea
                    id="collectionDesc"
                    placeholder="Describe your unique collection..."
                    value={config.description}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                />
                <p className="help-text">A brief story or description for your NFTs.</p>
            </div>

            <div className="form-group">
                <label htmlFor="collectionSize">Collection Size</label>
                <input
                    type="number"
                    id="collectionSize"
                    min={1}
                    max={10000}
                    value={config.size}
                    onChange={(e) => updateConfig({ size: parseInt(e.target.value) || 0 })}
                />
                <p className="help-text">How many unique NFTs do you want to generate?</p>
            </div>

            <div className="form-group">
                <label>Upload Layers Folder</label>
                <div
                    className={`card cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed ${layers.length > 0 ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700'}`}
                    onClick={() => folderInputRef.current?.click()}
                >
                    <Upload className={`w-12 h-12 mb-4 ${layers.length > 0 ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <span className="text-center">
                        {layers.length > 0
                            ? `✓ ${layers.length} layers loaded (${layers.reduce((acc, l) => acc + l.traits.length, 0)} total assets)`
                            : "Click to select your layers folder"}
                    </span>
                    <input
                        type="file"
                        ref={folderInputRef}
                        className="hidden"
                        /* @ts-ignore */
                        webkitdirectory=""
                        directory=""
                        multiple
                        onChange={handleFolderChange}
                    />
                </div>
                <p className="help-text">Select a folder that contains subfolders (layers) with PNG/SVG traits.</p>
            </div>

            <div className="form-group card">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={config.usePreReveal}
                        onChange={(e) => updateConfig({ usePreReveal: e.target.checked })}
                    />
                    <span className="text-white font-medium">Use pre-reveal (placeholder)</span>
                </label>

                {config.usePreReveal && (
                    <div className="mt-4 space-y-4 animate-in">
                        <div className="form-group mb-0">
                            <label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Pre-reveal Image (Required)</label>
                            <input type="file" accept="image/*" onChange={handlePreRevealImage} />
                            {config.preRevealImage && <p className="text-success text-xs mt-1">✓ {config.preRevealImage.name}</p>}
                        </div>
                        <div className="form-group mb-0">
                            <label className="flex items-center gap-2"><Film className="w-4 h-4" /> Pre-reveal Animation (Optional)</label>
                            <input type="file" accept="video/*,image/gif" onChange={handlePreRevealAnimation} />
                            {config.preRevealAnimation && <p className="text-success text-xs mt-1">✓ {config.preRevealAnimation.name}</p>}
                        </div>
                    </div>
                )}
            </div>

            <div className="form-group card mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={config.soulbound}
                        onChange={(e) => updateConfig({ soulbound: e.target.checked })}
                    />
                    <span className="text-white font-medium">Soulbound Collection</span>
                </label>
                <p className="help-text">Marks tokens as non-transferable in metadata.</p>
            </div>

            <div className="flex justify-end mt-12">
                <button
                    onClick={onNext}
                    disabled={!isStepValid}
                    className="px-12 py-4"
                >
                    Configure Layers →
                </button>
            </div>

            <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .hidden { display: none; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .text-center { text-align: center; }
        .mb-4 { margin-bottom: 1rem; }
        .w-12 { width: 3rem; }
        .h-12 { height: 3rem; }
        .p-8 { padding: 2rem; }
        .border-2 { border-width: 2px; }
        .border-dashed { border-style: dashed; }
        .mt-4 { margin-top: 1rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .font-medium { font-weight: 500; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-12 { margin-top: 3rem; }
        .px-12 { padding-left: 3rem; padding-right: 3rem; }
        .text-xs { font-size: 0.75rem; }
        .text-success { color: var(--success); }
        .text-indigo-400 { color: #818cf8; }
        .border-indigo-500 { border-color: #6366f1; }
        .bg-indigo-500\/10 { background-color: rgba(99, 102, 241, 0.1); }
      `}</style>
        </div>
    );
}
