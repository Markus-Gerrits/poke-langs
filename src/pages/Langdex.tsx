import type React from "react";
import { langsMock } from "../mocks/langsMock";
import LangCard from "../components/LangCard";

const LangDex: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2x1 font-bold text-center mb-6">📘 LandDex</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 place-items-center">
                {langsMock.map((lang) => (
                    <LangCard
                        key={lang.id}
                        id={lang.id}
                        name={lang.name}
                        owned={lang.owned}
                        icon={lang.icon}
                    />       
                ))}
            </div>
        </div>
    )
}

export default LangDex;