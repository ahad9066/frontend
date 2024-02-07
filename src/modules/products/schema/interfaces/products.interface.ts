export interface FeTiProduct {
    id: string;
    name: string;
    subGrades: SubGrades[];
}

export interface SubGrades {
    id: string;
    name: string;
    composition: Composition[];
    sizes: Sizes[];
}

export interface Composition {
    metalID: string;
    metalName: string;
    percentage: string;
}

export interface Sizes {
    id: string;
    name: string;
    stockCount: string;
}