import type React from "react";
import { USER_ID, type Language } from "../api/types";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { createCapture, getLanguages } from "../api/langdex";
import DialogBox from "./DiologBox";

type Props = { onSelect: (languageId: number) => void };

const STARTER_LEVEL = 5;
const STARTER_SLUGS = ["javascript", "python", "java"] as const;

type StarterView = {
    id: number;
    name: string;
    slug: string;
    category: Language["category"];
    rarity: Language["rarity"];
}

const StarterSelection: React.FC<Props> = ({ onSelect }) => {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [starters, setStarters] = useState<StarterView[]>([]);
    const [picked, setPicked] = useState<StarterView | null>(null);

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                setLoading(true);
                const all = await getLanguages({ signal: ac.signal });
                const bySlug = new Map(
                    all.map((l) => [String((l as any).slug ?? l.name.toLowerCase()), l])
                );
                const views: StarterView[] = [];
                STARTER_SLUGS.forEach((slug) => {
                    const l = bySlug.get(slug);
                    if (l) {
                        views.push({
                            id: l.id,
                            name: l.name,
                            slug,
                            category: l.category,
                            rarity: l.rarity,
                        });
                    }
                });
                setStarters(views);
                setError(null);
            } catch (e: any) {
                setError(e?.message ?? "Falha ao carregar starters");
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    const lines = useMemo(
        () => [
            "Olá! Eu sou o Professor B. — bem-vindo(a) ao mundo das Linguagens!",
            "Aqui, programadores treinam linguagens, batalham de forma saudável e resolvem problemas incríveis.",
            "Para iniciar sua jornada, você precisa escolher uma linguagem inicial.",
            "Cada uma brilha em áreas diferentes; escolha a que mais combina com seu estilo.",
        ],
        []
    );

    const professorBust = "/src/assets/npc/professor_b_dialog.png";

    const confirmPick = async () => {
        if (!picked) {
            return;
        }
        const ac = new AbortController();
        try {
            setSaving(true);
            await createCapture(
                { userId: USER_ID, languageId: Number(picked.id), level: STARTER_LEVEL, xp: 1, skillsUnlocked: []},
                { signal: ac.signal }
            );
            onSelect(picked.id);
            navigate("/");
        } catch (e: any) {
            setError(e?.message ?? "Erro ao salvar sua linguagem inicial.");
        } finally {
            setSaving(false);
        }
    };

    const phase: "dialog" | "choose" = step < lines.length ? "dialog" : "choose";
    return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden">
        {/* Bloco central: caixa de diálogo + starters */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(12px,4vh,40px)] w-full max-w-5xl px-4">
        {phase === "dialog" ? (
            <DialogBox
            speaker="Professor B."
            text={lines[step]}
            onNext={() => setStep((s) => Math.min(s + 1, lines.length))}
            /* retrato embutido atrás do balão */
            portraitSrc={professorBust}
            portraitAlt="Professor B."
            portraitSide="right"
            portraitHeightVh={60}     // altura segura (não cria scroll)
            portraitOverlapPx={28}    // quanto invade por trás do balão
            portraitLeftPercent={63}  // empurra mais ao centro; ajuste se quiser
            className="shadow-2xl backdrop-blur-sm bg-slate-900/90"
            />
        ) : (
            <>
            <DialogBox
                speaker="Professor B."
                text="Estas são três ótimas escolhas para começar. Qual delas te chama mais?"
                portraitSrc={professorBust}
                portraitAlt="Professor B."
                portraitSide="right"
                portraitHeightVh={60}
                portraitOverlapPx={28}
                portraitLeftPercent={63}
                className="shadow-2xl backdrop-blur-sm bg-slate-900/90"
            />

            {/* cards de escolha */}
            {loading ? (
                <div className="text-center opacity-80 mt-3">Carregando opções…</div>
            ) : error ? (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 text-sm">
                {error}
                </div>
            ) : (
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {starters.map((s) => (
                    <StarterCard
                    key={s.id}
                    starter={s}
                    selected={picked?.id === s.id}
                    onSelect={() => setPicked(s)}
                    />
                ))}
                </div>
            )}

            {/* confirmar escolha */}
            <div className="mt-4 flex justify-end">
                <button
                disabled={!picked || saving}
                onClick={confirmPick}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white shadow
                            hover:bg-emerald-600 active:bg-emerald-700 transition disabled:opacity-60"
                >
                {saving ? "Salvando…" : picked ? `Escolher ${picked.name}` : "Escolha uma linguagem"}
                </button>
            </div>
            </>
        )}
        </div>
    </div>
    ); 
};

export default StarterSelection;

type StarterCardProps = {
    starter: StarterView;
    selected: boolean;
    onSelect: () => void;
};

function StarterCard({ starter, selected, onSelect }: StarterCardProps) {
    const icon = `/src/assets/icons/${starter.slug}.png`;
    const ring =
        starter.category === "front-end"
            ? "from-yellow-400 to-orange-500"
            : starter.category === "back-end"
            ? "from-green-400 to-blue-500"
            : starter.category === "functional"
            ? "from-purple-400 to-fuchsia-600"
            : "from-slate-500 to-gray-700";

    return (
    <button
      onClick={onSelect}
      className={`text-left rounded-2xl border p-4 bg-white/5 hover:bg-white/10 transition
                  border-white/10 shadow-sm w-full
                  ${selected ? "ring-2 ring-emerald-400" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full p-[3px] bg-gradient-to-br ${ring}`}>
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
              src={icon}
              alt={starter.name}
              className="w-12 h-12 object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-semibold">{starter.name}</div>
          <div className="text-xs opacity-70 capitalize">{starter.category} • {starter.rarity}</div>
        </div>
      </div>
    </button>
    );
}