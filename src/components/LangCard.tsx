import type React from "react";

type Category =
    | "front-end"
    | "back-end"
    | "system"
    | "data-science"
    | "mobile"
    | "functional"
    | "default";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

interface LangCardProps {
    id: number;
    name: string;
    category: Category;
    owned: boolean;
    icon?: string;
    rarity: Rarity;
}

const categoryGradients: Record<Category, string> = {
    "front-end": "from-yellow-400 to-orange-500",
    "back-end": "from-green-400 to-blue-500",
    "system": "from-slate-500 to-gray-700",
    "data-science": "from-cyan-400 to-sky-600",
    "mobile": "from-pink-400 to-rose-600",
    "functional": "from-purple-400 to-fuchsia-600",
    "default": "from-gray-400 to-gray-600",
};

const rarityPills: Record<Rarity, string> = {
    common: "bg-white/20 border-white/30",
    uncommon: "bg-emerald-500/30 border-emerald-300/40",
    rare: "bg-blue-500/30 border-blue-300/40",
    epic: "bg-violet-500/30 border-violet-300/40",
    legendary: "bg-amber-500/30 border-amber-300/40",
};

const LangCard: React.FC<LangCardProps> = ({ id, name, category, owned, icon, rarity = "common" }) => {
    const gradient = categoryGradients[owned ? category : "default"] ?? categoryGradients["default"];
    const bgUrl = `url('/src/assets/backgrounds/${owned ? name.toLocaleLowerCase() : 'locker'}.png')`;
    const langImg = owned && icon ? icon : "locker";

    return (
        // Wrapper com BORDA gradiente da categoria
        <div
            className={`group inline-block rounded-2xl p-[2px] bg-gradient-to-br ${gradient}
              shadow-xl cursor-pointer transform-gpu
              transition-transform duration-300 ease-out
              hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
              active:scale-[0.99]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70`}
            role="button"
            tabIndex={0}
            aria-label={owned ? `${name} card` : "Locked card"}
        >
            {/* Corpo do card */}
            <div
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ width: 240, height: 360 }}
            >
                {/* Fundo específico da LINGUAGEM */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300
                 group-hover:scale-[1.02]"
                    style={{ backgroundImage: bgUrl }}
                />

                {/* Scrim para legibilidade */}
                <div className="absolute inset-0 bg-black/25 transition-colors duration-300
                    group-hover:bg-black/20" />

                {/* Tinta suave da CATEGORIA para harmonizar (sem brigar com o fundo) */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient}
                  opacity-20 mix-blend-soft-light transition-opacity duration-300
                  group-hover:opacity-30`}
                />

                {/* Conteúdo */}
                <div className="relative h-full flex flex-col">
                    {/* Header: número da Dex */}
                    <div className="text-white font-bold text-center p-2 select-none drop-shadow-md">
                        #{id.toString().padStart(3, "0")}
                    </div>

                    {/* Mascote / Locker */}
                    <div className="flex-1 flex items-center justify-center px-2">
                        <div className="w-full h-[200px] overflow-hidden
                        transition-transform duration-300
                        group-hover:scale-[1.06] group-hover:-translate-y-0.5">
                            <img
                                src={`/src/assets/icons/${langImg}.png`}
                                alt={owned ? name : "Bloqueado"}
                                className="w-full h-full object-contain select-none"
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* Footer: nome + badges */}
                    <div className="relative p-3 text-center">
                        <h3 className="text-white font-bold drop-shadow-md">
                            {owned ? name : "???"}
                        </h3>

                        {owned && (
                            <div className="mt-2 flex items-center justify-center gap-2">
                                <span className="text-white text-xs bg-white/30 px-2 py-1 rounded-full inline-block drop-shadow-sm">
                                    {category}
                                </span>
                                <span
                                    className={`text-white text-xs px-2 py-1 rounded-full inline-block border drop-shadow-sm ${rarityPills[rarity]}`}
                                    title="Raridade"
                                >
                                    {rarity}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LangCard;