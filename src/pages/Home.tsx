import type React from "react";
import { useNavigate } from "react-router-dom";
import type { Language, User } from "../api/types";
import { useEffect, useMemo, useState } from "react";
import { getLanguages, getUser, getUserCaptures } from "../api/langdex";
import { UserSummaryCard } from "../components/UserSummaryCard";

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
  xp: number;
}

type CapturedView = {
  id: number;
  name: string;
  category: Category;
  level: number;
  slug: string;
  dexNumber: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
          getUser(USER_ID, { signal: ac.signal })
        ]);
        setLanguages(langs);
        setCaptures(caps as unknown as Capture[]);
        setUser(usr)
      } catch (e: any) {
        if (!user) {
          setUser({ id: USER_ID, nickname: "Programador(a)", level: 1, xp: 0, nextLevelXp: 100});
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const captured: CapturedView[] = useMemo(() => {
    if (!languages.length || !captures.length) {
      return [];
    }

    const capByLang = new Map<number, Capture>();

    captures.forEach((c) => {
      const prev = capByLang.get(c.languageId);
      if (!prev || (prev.level ?? 0) < (c.level ?? 0)) {
        capByLang.set(c.languageId, c);
      }
    });

    return languages
      .filter((lang: Language) => capByLang.has(Number(lang.id)))
      .map((lang: Language) => {
        const cap = capByLang.get(Number(lang.id))!;
        return {
          id: lang.id,
          name: lang.name,
          category: (lang.category ?? "default") as Category,
          level: cap.level ?? 1,
          slug: lang.slug,
          dexNumber: lang.dexNumber
        }
      })
      .sort((a, b) => a.level + b.level);
  }, [languages, captures]);

  const total = languages.length;
  const have = captured.length;
  
  const handleStartJourney = () => {
    navigate("/starter");
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🏠 Página Inicial</h1>
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-5 w-40 bg-white/10 rounded mb-4" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
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


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🏠 Página Inicial</h1>

      <UserSummaryCard
        user={user}
        capturedCount={have}
        totalLangs={total}
        onStartJourney={handleStartJourney}
      />
      <section className="max-w-6xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Minhas linguagens {total ? <span className="opacity-70">{have}/{total}</span> : null}
          </h2>
          {/* Filters/Actions */}
        </header>

        {captured.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {captured.map((l) => (
              <CapturedLangChip
                key={l.id}
                name={l.name}
                level={l.level}
                category={l.category}
                slug={l.slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-14">
            <p className="mb-4 opacity-80">
              Você ainda não capturou nenhuma linguagem.
            </p>
            <button
              onClick={handleStartJourney}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 active:bg-blue-700 transition"
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
  slug: string;
}

function CapturedLangChip({ name, level, category, slug}: ChipProps) {
  const ring = ringGradients[category] || ringGradients.default;
  const iconUrl = `/src/assets/icons/${slug}.png`;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 p-3 shadow-sm hover:shadow-md transition hover:bg-white/10"
    >
      {/* Avatar whit gradient ring */}
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