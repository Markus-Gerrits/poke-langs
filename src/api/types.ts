export type Rarity = "common"|"uncommon"|"rare"|"epic"|"legendary";

export interface Skill {
    id: string;
    name: string;
    power: number;
    accuracy: number;
    element: string;
    unlockLevel: number;
}

export interface Language {
    id: number;
    dexNumber: number;
    slug: string;
    name: string;
    category: "front-end"|"back-end"|"system"|"data-science"|"mobile"|"functional";
    subTypes: string[],
    description: string;
    evolvesFrom: number | null;
    evolvesTo: number | null;
    evolutionLevel: number | null;
    rarity: Rarity;
    baseStats: { attack: number; defense: number; speed: number };
    skillsPool: Skill[];
}

export interface Capture {
    id: number;
    userId: number;
    languageId: number;
    level: number;
    xp: number;
    skillsUnlocked: string[];
}