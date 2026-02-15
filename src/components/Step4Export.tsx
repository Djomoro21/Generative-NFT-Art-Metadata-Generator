"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { CollectionConfig, Combination, Layer, Metadata } from "@/types";
import { pinFileToIPFS, createIPFSFormData } from "@/utils/ipfs";
import { Download, Rocket, Shield, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
    config: CollectionConfig;
    collection: Combination[];
    layers: Layer[];
    drawCombo: (combo: string[], canvas: HTMLCanvasElement, size: number) => Promise<void>;
    onBack: () => void;
}

export default function Step4Export({ config, collection, layers, drawCombo, onBack }: Props) {
    const [pinataJwt, setPinataJwt] = useState("");
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [ipfsResult, setIpfsResult] = useState<{ imagesCID: string; metadataCID: string } | null>(null);

    const generateZip = async () => {
        setIsExporting(true);
        setProgress(0);
        setStatus("Initializing ZIP generation...");

        try {
            const zip = new JSZip();
            const imagesFolder = zip.folder("images");
            const metadataFolder = zip.folder("metadata");

            const canvas = document.createElement("canvas");
            canvas.width = 1000;
            canvas.height = 1000;

            // Generate Images
            for (let i = 0; i < collection.length; i++) {
                setStatus(`Rendering image ${i + 1}/${collection.length}`);
                await drawCombo(collection[i], canvas, 1000);

                const blob = await new Promise<Blob>((res) =>
                    canvas.toBlob((b) => res(b!), "image/png")
                );

                imagesFolder?.file(`${i}.png`, blob);
                setProgress(((i + 1) / collection.length) * 45);
            }

            // Generate Metadata
            for (let i = 0; i < collection.length; i++) {
                setStatus(`Generating metadata ${i + 1}/${collection.length}`);

                const attributes = collection[i].map((trait, idx) => ({
                    trait_type: layers[idx].name,
                    value: trait.replace(/\.[^/.]+$/, ""),
                }));

                const meta: Metadata = {
                    name: `${config.name} #${i}`,
                    description: config.description,
                    image: `${i}.png`,
                    attributes,
                };

                if (config.soulbound) {
                    meta.soulbound = true;
                    meta.attributes.push({ trait_type: "Soulbound", value: "Yes" });
                }

                metadataFolder?.file(`${i}.json`, JSON.stringify(meta, null, 2));
                setProgress(45 + ((i + 1) / collection.length) * 45);
            }

            setStatus("Compressing ZIP file...");
            const content = await zip.generateAsync({ type: "blob" });

            const url = URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${config.name.replace(/\s+/g, "-").toLowerCase()}-collection.zip`;
            link.click();
            URL.revokeObjectURL(url);

            setProgress(100);
            setStatus("ZIP generated and download started! 🎉");
        } catch (err: any) {
            setStatus(`Error: ${err.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    const uploadToIPFS = async () => {
        if (!pinataJwt) {
            alert("Please enter your Pinata JWT Token");
            return;
        }

        setIsExporting(true);
        setProgress(0);
        setStatus("Preparing files for IPFS upload...");

        try {
            const canvas = document.createElement("canvas");
            canvas.width = 1000;
            canvas.height = 1000;

            const imageFiles: File[] = [];

            // Render all images
            for (let i = 0; i < collection.length; i++) {
                setStatus(`Preparing image ${i + 1}/${collection.length}`);
                await drawCombo(collection[i], canvas, 1000);
                const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
                imageFiles.push(new File([blob], `${i}.png`, { type: "image/png" }));
                setProgress(((i + 1) / collection.length) * 30);
            }

            // Upload Images
            setStatus("Uploading images to IPFS...");
            const imgFormData = createIPFSFormData(imageFiles, "images", `${config.name} - Images`);
            const imgResult = await pinFileToIPFS(imgFormData, pinataJwt);
            const imagesCID = imgResult.IpfsHash;
            setProgress(40);

            // Prepare Metadata
            const metaFiles: File[] = [];
            for (let i = 0; i < collection.length; i++) {
                const attributes = collection[i].map((trait, idx) => ({
                    trait_type: layers[idx].name,
                    value: trait.replace(/\.[^/.]+$/, ""),
                }));

                const meta: Metadata = {
                    name: `${config.name} #${i}`,
                    description: config.description,
                    image: `ipfs://${imagesCID}/${i}.png`,
                    attributes,
                };

                if (config.soulbound) {
                    meta.soulbound = true;
                    meta.attributes.push({ trait_type: "Soulbound", value: "Yes" });
                }

                const blob = new Blob([JSON.stringify(meta, null, 2)], { type: "application/json" });
                metaFiles.push(new File([blob], `${i}.json`, { type: "application/json" }));
            }

            // Upload Metadata
            setStatus("Uploading metadata to IPFS...");
            const metaFormData = createIPFSFormData(metaFiles, "metadata", `${config.name} - Metadata`);
            const metaResult = await pinFileToIPFS(metaFormData, pinataJwt);
            const metadataCID = metaResult.IpfsHash;

            setIpfsResult({ imagesCID, metadataCID });
            setProgress(100);
            setStatus("Collection uploaded to IPFS successfully! 🚀");
        } catch (err: any) {
            setStatus(`Error: ${err.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="animate-in space-y-8">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
                <h2>Step 4: Generate & Export</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="card border-indigo-500/20 bg-indigo-500/5">
                        <h3 className="flex items-center gap-2 text-indigo-400 text-sm font-bold mb-4">
                            <Shield className="w-4 h-4" /> PINATA CONFIGURATION
                        </h3>
                        <div className="form-group">
                            <label>Pinata JWT Token</label>
                            <input
                                type="password"
                                placeholder="Paste your JWT here..."
                                value={pinataJwt}
                                onChange={(e) => setPinataJwt(e.target.value)}
                            />
                            <p className="help-text">
                                Required for IPFS upload. Get it from <a href="https://pinata.cloud" target="_blank" className="text-indigo-400 hover:underline">pinata.cloud</a>.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={generateZip}
                            disabled={isExporting}
                            className="w-full py-4 flex items-center justify-center gap-3"
                        >
                            {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
                            Generate & Download ZIP
                        </button>
                        <button
                            onClick={uploadToIPFS}
                            disabled={isExporting || !pinataJwt}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-3"
                        >
                            {isExporting ? <Loader2 className="animate-spin" /> : <Rocket />}
                            Upload to IPFS (Pinata)
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 min-h-[300px] flex flex-col">
                        <h3 className="text-xs font-bold mb-4 uppercase text-gray-400 tracking-widest">Process Status</h3>

                        <div className="flex-1 font-mono text-xs space-y-2 overflow-y-auto max-h-[200px] custom-scrollbar mb-4">
                            <p className="text-indigo-400">$ initialising_engine...</p>
                            {status && <p className="text-gray-300 animate-pulse text-indigo-400">{`> ${status}`}</p>}
                            {progress === 100 && (
                                <div className="text-success flex items-center gap-2 mt-4">
                                    <CheckCircle2 className="w-4 h-4" /> OPERATION COMPLETE
                                </div>
                            )}
                        </div>

                        <div className="w-full bg-gray-900 rounded-full h-2 mb-2">
                            <div
                                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-right text-[10px] text-gray-500 font-bold">{Math.round(progress)}%</p>
                    </div>

                    {ipfsResult && (
                        <div className="card border-emerald-500/20 bg-emerald-500/5 animate-in">
                            <h3 className="text-emerald-500 text-sm font-bold mb-4">✅ DEPLOYMENT SUCCESSFUL</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-emerald-500/60 mb-1 block">Images CID</label>
                                    <code className="text-xs break-all bg-black/40 p-2 rounded block border border-white/5">{ipfsResult.imagesCID}</code>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-emerald-500/60 mb-1 block">Metadata CID (Base URI)</label>
                                    <code className="text-xs break-all bg-black/40 p-2 rounded block border border-white/5">ipfs://{ipfsResult.metadataCID}/</code>
                                </div>
                                <a
                                    href={`https://gateway.pinata.cloud/ipfs/${ipfsResult.metadataCID}/0.json`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-xs text-emerald-400 hover:underline"
                                >
                                    <ExternalLink className="w-3 h-3" /> View sample on IPFS Gateway
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-start mt-12 pt-8 border-t border-gray-800">
                <button className="secondary px-8" onClick={onBack} disabled={isExporting}>← Back to Preview</button>
            </div>

            <style jsx>{`
        .bg-purple-600 { background: #9333ea; }
        .bg-purple-700 { background: #7e22ce; }
        .text-emerald-500 { color: #10b981; }
        .text-emerald-400 { color: #34d399; }
        .bg-emerald-500\/5 { background-color: rgba(16, 185, 129, 0.05); }
        .border-emerald-500\/20 { border-color: rgba(16, 185, 129, 0.2); }
      `}</style>
        </div>
    );
}
