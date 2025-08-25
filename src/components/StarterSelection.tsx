import type React from "react";
import { langsMock } from "../mocks/langsMock";
import LangCard from "./LangCard";
import { useState } from "react";

interface StaterSelectionProps {
    onSelect: (languageId: number) => void;
}

const StarterSelection: React.FC<StaterSelectionProps> = ({ onSelect }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = (id: number) => {
        setSelectedId(id);
        onSelect(id);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl text-center font-bold mb-4">Escolha sua linguagem inicial</h2>
            <div className="flex gap-5 justify-center">
                {langsMock
                    .filter((lang) => lang.id <= 3)
                    .map((lang) => (
                        <div
                            key={lang.id} 
                            className={`cursor-pointer transition transform ${
                                selectedId === lang.id ? "scale-105 border-4 border-blue-500 rounded-2x1" : ""
                            }`}
                            onClick={() => handleSelect(lang.id)}
                        >
                            <LangCard 
                                id={lang.id}
                                name={lang.name}
                                category={lang.category}
                                owned={true}
                                icon={lang.icon}
                                rarity={lang.rarity}
                            />
                        </div>        
                ))}
            </div>
        </div>
    );
};

export default StarterSelection;