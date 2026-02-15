"use client";

import { useState, useCallback } from "react";
import { Layer, Trait, IncompatibleRule, CollectionConfig, Combination } from "@/types";

export function useNFTGenerator() {
    const [layers, setLayers] = useState<Layer[]>([]);
    const [incompatibleRules, setIncompatibleRules] = useState<IncompatibleRule[]>([]);
    const [collection, setCollection] = useState<Combination[]>([]);
    const [config, setConfig] = useState<CollectionConfig>({
        name: "",
        description: "",
        size: 10,
        usePreReveal: false,
        preRevealImage: null,
        preRevealAnimation: null,
        soulbound: false,
    });

    const updateConfig = useCallback((updates: Partial<CollectionConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    }, []);

    const addIncompatibleRule = useCallback((rule: IncompatibleRule) => {
        setIncompatibleRules((prev) => [...prev, rule]);
    }, []);

    const removeIncompatibleRule = useCallback((index: number) => {
        setIncompatibleRules((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const pickWeighted = useCallback((traits: Trait[]) => {
        const total = traits.reduce((a, b) => a + Number(b.weight), 0);
        let r = Math.random() * total;

        for (const t of traits) {
            r -= t.weight;
            if (r <= 0) return t;
        }

        return traits[0];
    }, []);

    const isValidCombo = useCallback((combo: string[], rules: IncompatibleRule[]) => {
        return !rules.some(
            (rule) => combo.includes(rule.traitA) && combo.includes(rule.traitB)
        );
    }, []);

    const generateRandomCombo = useCallback((): string[] => {
        let attempts = 0;
        const maxAttempts = 1000;

        while (attempts < maxAttempts) {
            const selected = layers.map((layer) => pickWeighted(layer.traits).file.name);
            if (isValidCombo(selected, incompatibleRules)) return selected;
            attempts++;
        }

        return layers.map((layer) => layer.traits[0].file.name);
    }, [layers, incompatibleRules, pickWeighted, isValidCombo]);

    const drawCombo = useCallback(async (
        combo: string[],
        canvas: HTMLCanvasElement,
        size: number = 300
    ) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, size, size);

        // Layers are ordered from bottom to top in the UI, 
        // so we render them in that order.
        for (const layer of layers) {
            const traitName = combo[layers.indexOf(layer)];
            const trait = layer.traits.find(t => t.file.name === traitName);

            if (trait) {
                const img = await createImageBitmap(trait.file);
                ctx.drawImage(img, 0, 0, size, size);
            }
        }
    }, [layers]);

    const generatePreview = useCallback(async (canvas: HTMLCanvasElement) => {
        if (layers.length === 0) return;
        const combo = generateRandomCombo();
        await drawCombo(combo, canvas);
    }, [layers, generateRandomCombo, drawCombo]);

    return {
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
    };
}
