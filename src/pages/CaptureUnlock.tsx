import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

type LangPayload = {
  id: number;
  name: string;
  slug?: string;
  category?: string;
  rarity?: Rarity | string;
};

type LocationState = {
  language?: LangPayload;
};

type Phase = "locked" | "reveal" | "done";

const rarityTheme: Record<
  Rarity,
  {
    title: string;
    ring: string;
    glowClass: string;
    confettiHue: [number, number];
  }
> = {
  common:     { title: "text-emerald-300",  ring: "ring-emerald-400/40",  glowClass: "glow-common",     confettiHue: [140, 170] },
  uncommon:   { title: "text-cyan-300",     ring: "ring-cyan-400/40",     glowClass: "glow-uncommon",   confettiHue: [185, 200] },
  rare:       { title: "text-sky-300",      ring: "ring-sky-400/40",      glowClass: "glow-rare",       confettiHue: [210, 230] },
  epic:       { title: "text-violet-300",   ring: "ring-violet-400/40",   glowClass: "glow-epic",       confettiHue: [265, 290] },
  legendary:  { title: "text-amber-400",    ring: "ring-amber-400/40",    glowClass: "glow-legendary",  confettiHue: [35, 55]  },
};

function ConfettiBurst({ run, hue }: { run: boolean; hue: [number, number] }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const left = 30 + Math.random() * 40;
      const delay = (i % 7) * 60;
      const size = 6 + Math.random() * 6;
      const rot = Math.floor(Math.random() * 360);
      const h = hue[0] + Math.random() * (hue[1] - hue[0]);
      return { left, delay, size, rot, hue: Math.round(h) };
    });
  }, [hue]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true" style={{ display: run ? "block" : "none" }}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-1/3"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `hsl(${p.hue} 95% 55%)`,
            transform: `rotate(${p.rot}deg)`,
            clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 70%)",
            animation: `confetti 900ms ease-out ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}

const BORDER = "border-2 border-black/60 shadow-[0_8px_20px_rgba(0,0,0,.25)]";

export default function CaptureUnlock() {
  const nav = useNavigate();
  const { state } = useLocation();
  const lang = (state as LocationState)?.language;

  const [phase, setPhase] = useState<Phase>("locked");

  useEffect(() => {
    if (!lang) { nav("/langdex"); return; }
    const t1 = setTimeout(() => setPhase("reveal"), 1100);
    const t2 = setTimeout(() => setPhase("done"),   2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [lang, nav]);

  if (!lang) return null;

  const slug = (lang.slug ?? lang.name.toLowerCase()).trim();
  const bgLocked = `/src/assets/backgrounds/locker.png`;
  const iconLocked = `/src/assets/icons/locker.png`;
  const bgUnlocked = `/src/assets/backgrounds/${slug}.png`;
  const iconUnlocked = `/src/assets/icons/${slug}.png`;

  const rarity = (lang.rarity?.toString().toLowerCase() as Rarity) ?? "common";
  const theme = rarityTheme[rarity] ?? rarityTheme.common;

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-wider ${theme.title}
                        ${phase !== "locked" ? "animate-fade-in-up" : "opacity-0"}`}>
          LINGUAGEM CAPTURADA
        </h1>

        <div className="relative w-[280px] sm:w-[320px] h-[440px] sm:h-[480px]">
          <div
            className={`absolute inset-0 rounded-[22px] bg-slate-500/30 ${BORDER}
                        ${phase === "locked" ? "animate-pop" : "animate-fade-out"}`}
            style={{ backgroundImage: `url('${bgLocked}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={iconLocked} alt="Bloqueado" className="w-[42%] h-auto opacity-90" draggable={false} />
            </div>
            <div className={`absolute inset-0 rounded-[22px] ${theme.glowClass} ${phase === "locked" ? "animate-pulse-glow" : ""}`} />
          </div>

          <div className={`absolute inset-0 rounded-[22px] bg-white ${phase === "reveal" ? "animate-flash" : "opacity-0"}`} />

          <div
            className={`absolute inset-0 rounded-[22px] ${BORDER}
                        ${phase !== "locked" ? "animate-pop-delayed" : "opacity-0"}`}
            style={{ backgroundImage: `url('${bgUnlocked}')`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={iconUnlocked}
                alt={lang.name}
                className="w-[70%] h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,.45)]"
                draggable={false}
              />
            </div>
            <div className={`absolute inset-0 rounded-[22px] ring-2 ${theme.ring}`} />
          </div>

          <ConfettiBurst run={phase === "reveal"} hue={theme.confettiHue} />
        </div>

        <div className={`text-2xl sm:text-3xl font-black text-slate-900 drop-shadow-sm
                         ${phase === "done" ? "animate-fade-in-up" : "opacity-0"}`}>
          {lang.name}
        </div>

        <button
          onClick={() => nav("/langdex")}
          className={`mt-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow
                     hover:bg-emerald-600 active:bg-emerald-700 transition
                     ${phase === "done" ? "animate-fade-in-up" : "opacity-0 pointer-events-none"}`}
        >
          Conferir LangDex
        </button>
      </div>
    </div>
  );
}
