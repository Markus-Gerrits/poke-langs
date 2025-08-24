import type React from "react";

interface LangCardProps {
    id: number;
    name:string;
    owned: boolean;
    icon?: string;
}

const LangCard: React.FC<LangCardProps> = ({ id, name, owned, icon }) => {
    return (
        <div
            className={`rounded-2x1 shadow-md p-4 flex flex-col items-center justify-center justify-center w-32 h-40 transition ${ owned ? "bg-white hover:shadow-lg" : "bg-gray-200 opacity-60"}`}
        >
            <span className="text-sm font-semibold text-gray-500">
                #{id.toString().padStart(3, "0")}
            </span>
            { owned ? (
                <>
                    <div className="w-16 h-16 flex items-center justify-center">
                        {icon ? (
                            <img src={icon} alt={name} className="w-full h-full object-contain"/>
                        ) : (
                            <div className="w-14 h-14 bg-blue-400 rounded-full"></div>
                        )}
                    </div>
                    <span className="mt-2 text-base font-bold text-gray-800">{name}</span>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 flex items-center justify-center">
                        <span className="text-3x1 text-gray-500">?</span>
                    </div>
                    <span className="mt-2 text-base font-bold text-gray-500">???</span>
                </>
            )}
        </div>
    );
};

export default LangCard;