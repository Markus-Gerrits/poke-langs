import type React from "react";
import LangCard from "../components/LangCard";
import type { Language } from "../api/types";
import { useEffect, useMemo, useState } from "react";
import { getLanguages, getUserCaptures } from "../api/langdex";

type LangView = Language & {
    owned: boolean;
    icon?: string;
}

const LangDex: React.FC = () => {
    const [langs, setLangs] = useState<LangView[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [languages, captures] = await Promise.all([
                    getLanguages(),
                    getUserCaptures(1),
                ]);

                const ownedSet = new Set(captures.map(capture => String(capture.languageId)));
                const withOwned: LangView[] = languages.map(lang => ({
                    ...lang,
                    owned: ownedSet.has(String(lang.id)),
                    icon: lang.slug,
                }));

                setLangs(withOwned);
            } catch (e: any) {
                setErr(e.message ?? "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const ordered = useMemo(
        () => langs.sort((a, b) => a.dexNumber - b.dexNumber),
        [langs]
    );

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    if (err) {
        return <div className="p-6 text-red-400">Erro: {err}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">📘 LangDex</h1>
            <div className="flex flex-wrap gap-5 justify-center">
                {ordered.map((lang: LangView) => (
                    <LangCard
                        key={lang.id}
                        id={lang.dexNumber}
                        name={lang.name}
                        category={lang.owned ? lang.category : "default"}
                        owned={lang.owned}
                        icon={lang.slug}
                        rarity={lang.rarity}
                    />       
                ))}
            </div>
        </div>
    )
}

export default LangDex;