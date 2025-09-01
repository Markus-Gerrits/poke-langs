import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLanguages, getUserCaptures, getUser } from "../api/langdex";
import { UserSummaryCard } from "../components/UserSummaryCard";
import type { Language, User } from "../api/types";

const USER_ID = 1;

type Category =
  | "front-end"
  | "back-end"
  | "system"
  | "data-science"
  | "mobile"
  | "functional"
  | "default";

const ringGradients: Record<Category, string> = {
  "front-end": "from-yellow-400 to-orange-500",
  "back-end": "from-green-400 to-blue-500",
  system: "from-slate-500 to-gray-700",
  "data-science": "from-cyan-400 to-sky-600",
  mobile: "from-pink-400 to-rose-600",
  functional: "from-purple-400 to-fuchsia-600",
  default: "from-gray-400 to-gray-600",
};

type Capture = {
  id: number;
  userId: number;
  languageId: number;
  level: number;
};

type ChipView = {
  id: string;
  languageId: number;
  name: string;
  level: number;
  category: Category;
  slug?: string;
  dexNumber: number;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const [langs, caps, usr] = await Promise.all([
          getLanguages(),
          getUserCaptures(USER_ID),
          getUser(USER_ID, { signal: ac.signal }),
        ]);
        setLanguages(langs);
        setCaptures(caps as unknown as Capture[]);
        setUser(usr);
        setErr(null);
      } catch (e: any) {
        if (!user) {
          setUser({
            id: USER_ID,
            nickname: "Programador(a)",
            level: 1,
            xp: 0,
            nextLevelXp: 100,
          });
        }
        setErr(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const langById = useMemo(() => {
    const m = new Map<number, Language>();
    languages.forEach((l) => m.set(Number(l.id), l));
    return m;
  }, [languages]);

  const uniqueCapturedCount = useMemo(() => {
    const s = new Set<number>();
    captures.forEach((c) => s.add(c.languageId));
    return s.size;
  }, [captures]);

  const top10: ChipView[] = useMemo(() => {
    if (!captures.length || !languages.length) return [];
    const sorted = [...captures].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
    return sorted.slice(0, 10).map((cap, idx) => {
      const l = langById.get(Number(cap.languageId));
      if (!l) {
        return {
          id: `missing-${cap.id}-${idx}`,
          languageId: cap.languageId,
          name: `#${cap.languageId}`,
          level: cap.level ?? 1,
          category: "default",
          slug: undefined,
          dexNumber: cap.languageId,
        } as ChipView;
      }
      return {
        id: `${cap.id}-${idx}`,
        languageId: l.id,
        name: l.name,
        level: cap.level ?? 1,
        category: (l.category ?? "default") as Category,
        slug: (l as any).slug,
        dexNumber: (l as any).dexNumber ?? l.id,
      };
    });
  }, [captures, languages, langById]);

  const totalLangs = languages.length;

  const handleStartJourney = () => navigate("/starter");
  const handleSeeAll = () => navigate("/bag"); // “mochila” (ajuste a rota quando implementar)

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🏠 Página Inicial</h1>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 animate-pulse h-28 rounded-3xl bg-white/5" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="w-14 h-14 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 w-28 bg-white/10 rounded mb-1" />
                  <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🏠 Página Inicial</h1>
        <div className="max-w-3xl mx-auto p-4 rounded-lg bg-red-500/10 border border-red-400/30 text-red-200">
          Não foi possível carregar o usuário.
        </div>
      </div>
    );
  }

  const hasAny = captures.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🏠 Página Inicial</h1>

      {/* User Sumamary */}
      <UserSummaryCard
        user={user}
        uniqueCapturedCount={uniqueCapturedCount}
        totalLangs={totalLangs}
        onStartJourney={!hasAny ? handleStartJourney : undefined}
      />

      {/* Top 10 List language */}
      <section className="max-w-6xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Minhas Linguagens</h2>
          {hasAny && (
            <button
              onClick={handleSeeAll}
              className="text-sm px-3 py-1.5 rounded-lg border border-white/15
                         bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              Ver todos
            </button>
          )}
        </header>

        {hasAny ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {top10.map((item) => (
              <CapturedLangChip
                key={item.id}
                name={item.name}
                level={item.level}
                category={item.category}
                slug={item.slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="mb-4 opacity-80">Você ainda não capturou nenhuma linguagem.</p>
            <button
              onClick={handleStartJourney}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow
                         hover:bg-blue-600 active:bg-blue-700 transition"
            >
              Começar Jornada
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

type ChipProps = {
  name: string;
  level: number;
  category: Category;
  slug?: string;
};

function CapturedLangChip({ name, level, category, slug }: ChipProps) {
  const ring = ringGradients[category] || ringGradients.default;
  const iconUrl = `/src/assets/icons/${slug || name.toLowerCase()}.png`;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5
                 p-3 shadow-sm hover:shadow-md transition hover:bg-white/10 cursor-pointer"
    >
      {/* Avatar gradient */}
      <div className={`relative w-14 h-14 rounded-full p-[3px] bg-gradient-to-br ${ring}`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={iconUrl}
            alt={name}
            className="w-11 h-11 object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Name + Level */}
      <div className="min-w-0">
        <div className="font-semibold truncate">{name}</div>
        <div className="text-xs opacity-70">Lv. {level}</div>
      </div>
    </div>
  );
}
