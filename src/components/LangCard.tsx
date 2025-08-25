import type React from "react";

interface LangCardProps {
    id: number;
    name:string;
    type: string;
    owned: boolean;
    icon?: string;
}

const typeColors: Record<string, string> = {
    "front-end": "from-yellow-400 to-orange-500",
    "back-end": "from-green-400 to-blue-500",
    "functional": "from-purple-400 to-pink-500",
    "default": "from-gray-400 to-gray-600",
};

const LangCard: React.FC<LangCardProps> = ({ id, name, type, owned, icon }) => {
    const gradient = typeColors[type] || typeColors["default"];
    const bgUrl = `url('/src/assets/backgrounds/${owned ? name.toLocaleLowerCase() : 'locker'}.png')`;
    
    return (
        <div
            className={`w-60 h-90 border-none rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition hover:-translate-y-2 hover:shadow-2x1 bg-radial ${gradient}`}
            style={{ borderImage: `linear-gradient(to bottom right, var(--tw-gradient-stops)) 1`}}
        >
            <div
                className={`h-90 bg-cover bg-no-repeat bg-center`}
                style={{backgroundImage: bgUrl}}
            >
                {/* ID */}
                <div className="text-white font-bold text-center p-2">
                    #{id.toString().padStart(3, "0")}
                </div>

                {/* Image */}
                <div className={`flex justify-center items-center mt-2 px-2`}>
                    { owned ? (
                        <div className="w-full h-50 overflow-hidden">
                            <img src={icon} alt={name} className="w-full h-full object-contain"/>
                        </div>
                    ) : (
                        <div className="w-full h-50 overflow-hidden">
                            <img src="/src/assets/icons/locker.png" alt={name} className="w-full h-full object-contain"/>
                        </div>
                    )}
                </div>

                {/* Info footer */}
                <div className={`mt-1 p-3 text-center rounded-b-2x1`}>
                    <h3 className="text-white font-bold">{owned ? name : "???"}</h3>
                    {owned && (
                        <span className="text-white text-sm bg-white/30 px-2 py-1 rounded-full mt-2 inline-block">
                            {type}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LangCard;