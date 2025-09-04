import { useNavigate } from "react-router-dom";
import { USER_ID, type Language } from "../api/types";
import { useEffect, useMemo, useState } from "react";
import { createCapture, getLanguages } from "../api/langdex";


const SPAWN_WEIFHTS: Record<Language["rarity"], number> = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 1
}

const CATCH_RATE: Record<Language["rarity"], number> = {
    common: 0.8,
    uncommon: 0.6,
    rare: 0.4,
    epic: 0.25,
    legendary: 0.1
}

type Phase = "idle" | "searching" | "encounter" | "attempting" | "result";

const Capture: React.FC = () => {
    const navigate = useNavigate();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [phase, setPhase] = useState<Phase>("idle");
    const [encounter, setEncounter] = useState<Language | null>(null);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const langs = await getLanguages({ signal: ac.signal });
                setLanguages(langs);
            } catch (e: any) {
                setError(e?.message ?? "Erro ao carregar linguagens");
            }
        })();
        return () => ac.abort();
    }, []);

    const hasData = languages.length > 0;

    const pickWeighted = (list: Language[]) => {
        const weights = list.map((lang) => SPAWN_WEIFHTS[lang.rarity] ?? 1);
        const total = weights.reduce((s, w) => s + w, 0);
        let random = Math.random() * total;
        for (let i = 0; i < list.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return list[i];
            }
        }
        return list[list.length - 1];
    }

    const startSearch = () => {
        setMessage("");
        setEncounter(null);
        setPhase("searching");

        setTimeout(() => {
            const chose = pickWeighted(languages);
            setEncounter(chose);
            setPhase("encounter");
        }, 600);
    }

    const tryCatch = async () => {
        if (!encounter) {
            return;
        }

        setPhase("attempting");
        await new Promise((r) => setTimeout(r, 700));
        const base = CATCH_RATE[encounter.rarity] ?? 0.3;
        const roll = Math.random();
        const success = roll < base;

        if (success) {
            try {
                await createCapture({
                    userId: USER_ID,
                    languageId: Number(encounter.id),
                    level: 1,
                    xp: 1,
                    skillsUnlocked: []
                });
                setMessage(`Você capturou ${encounter.name}`);
            } catch (e: any) {
                setMessage(`Capturou ${encounter.name}, mas houve um erro ao salvar. Tente de novov.`);
            }
        } else {
            setMessage(`${encounter.name} escapou! Tente novamente.`);
        }
        setPhase("result");
    };

    const resetEncounter = () => {
        setEncounter(null);
        setMessage("");
        setPhase("idle");
    };

    const bgUrl = `url('/src/assets/backgrounds/encounter-forest.png')`;

    const iconUrl = useMemo(() => {
        if (!encounter) {
            return "";
        }
        const slug = (encounter as any).slug ?? encounter.name.toLowerCase();
        return `/src/assets/icons/${slug}.png`;
    }, [encounter]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">🎯 Capturar Linguagens</h1>

            {!hasData && !error && (
                <div className="text-center opacity-80">Carregando linguagens...</div>
            )}
            {error && (
                <div className="max-w-xl mx-auto p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200 text-sm mb-4">
                    {error}
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-gray-900 shadow-lg text-white">
                    <div className="p-4 sm:p-6">
                        {!encounter ? (
                            <div className="text-center py-10">
                                <p className="mb-4 opacity-80">
                                    Busque por uma linguagem selvagem e tente capturá-la!
                                </p>
                                <button
                                    disabled={!hasData || phase === "searching"}
                                    onClick={startSearch}
                                    className="px-6 py-3 rounded-xl bg-emerald-500 text-white shadow hover:bg-emerald-600 active:bg-emerald-700 transition disabled:opacity-60 cursor-pointer"
                                >
                                    {phase === "searching" ? "Procurando..." : "Buscar encontro"}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
                                <div
                                    className="relative h-[320px] rounded-2xl overflow-hidden shadow"
                                    style={{
                                        backgroundImage: bgUrl,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/20" />
                                    <img
                                        src={iconUrl}
                                        alt={encounter.name}
                                        className={`absolute inset-0 m-auto max-h-[85%] object-contain
                                            drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)]
                                            transition-transform duration-300
                                            ${phase === "attempting" ? "scale-105" : "scale-100"}`}
                                        draggable={false}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-extrabold">{encounter.name}</h2>
                                        <span className="px-2.5 py-1 rounded-full border text-xs font-semibold bg-white/10 border-white/20">
                                            {encounter.category}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full border text-xs font-semibold bg-white/10 border-white/20">
                                            {encounter.rarity}
                                        </span>
                                    </div>

                                    <p className="text-sm opacity-80 mb-4">
                                        Chance de captura base:{" "}
                                        <strong>{Math.round((CATCH_RATE[encounter.rarity] ?? 0.3) * 100)}%</strong>
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        {phase !== "result" ? (
                                            <>
                                                <button
                                                    onClick={tryCatch}
                                                    disabled={phase === "attempting"}
                                                    className="px-5 py-2.5 rounded-xl bg-blue-500 text-white shadow
                                                    hover:bg-blue-600 active:bg-blue-700 transition disabled:opacity-60 cursor-pointer">
                                                        {phase === "attempting" ? "Capturando..." : "Tentar Capturar"}
                                                </button>
                                                <button
                                                    onClick={startSearch}
                                                    disabled={phase === "attempting"}
                                                    className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5
                                                        hover:bg-white/10 transition disabled:opacity-60 cursor-pointer"
                                                >
                                                    Procurar outro
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={startSearch}
                                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white shadow
                                                        hover:bg-emerald-600 active:bg-emerald-700 transition cursor-pointer"
                                                >
                                                    Buscar novo encontro
                                                </button>
                                                <button
                                                    onClick={() => navigate("/")}
                                                    className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5
                                                        hover:bg-white/10 transition cursor-pointer"
                                                >
                                                    Voltar para Home
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {message && (
                                        <div
                                            className={`mt-4 p-3 rounded-xl text-sm border ${
                                                message.includes("capturou")
                                                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                                                : "bg-emerald-500/10 border-amber-400/30 text-amber-200"
                                            }`}
                                        >
                                            {message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-xs opacity-60 mt-3 text-center">
                        MVP de captura - raridade influencia encontro e chance de captura
                </div>
            </div>
        </div>
    )
}

export default Capture;