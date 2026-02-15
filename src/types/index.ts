export interface Trait {
    file: File;
    weight: number;
}

export interface Layer {
    name: string;
    traits: Trait[];
}

export interface IncompatibleRule {
    traitA: string;
    traitB: string;
}

export interface CollectionConfig {
    name: string;
    description: string;
    size: number;
    usePreReveal: boolean;
    preRevealImage: File | null;
    preRevealAnimation: File | null;
    soulbound: boolean;
}

export type Combination = string[];

export interface Metadata {
    name: string;
    description: string;
    image: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    soulbound?: boolean;
}
