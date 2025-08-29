import { useEffect, useState } from "react";
import type { Language, Rarity, Skill } from "../api/types"
import { createPortal } from "react-dom";

type Props = {
    lang: Language & { icon?: string };
    onClose: () => void;
}

const rarityPills: Record<Rarity, string> = {
  common: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  uncommon: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
  rare: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  epic: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  legendary: "bg-amber-500/15 text-amber-300 border-amber-400/30", 
}

const categoryPills: Record<Language["category"] | "default", string> = {
  "front-end": "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border-white/20",
  "back-end": "bg-gradient-to-r from-green-400/20 to-blue-500/20 text-white border-white/20",
  "system": "bg-gradient-to-r from-slate-500/20 to-gray-700/20 text-white border-white/20",
  "data-science": "bg-gradient-to-r from-cyan-400/20 to-sky-600/20 text-white border-white/20",
  "mobile": "bg-gradient-to-r from-pink-400/20 to-rose-600/20 text-white border-white/20",
  "functional": "bg-gradient-to-r from-purple-400/20 to-fuchsia-600/20 text-white border-white/20",
  "default": "bg-white/10 text-white border-white/20",
};

export default function LangDetailModal({ lang, onClose }: Props) {
    const modalRoot = document.getElementById("modal-root") || document.body;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const t = setTimeout(() => setOpen(true), 0);

        const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestClose();
        window.addEventListener("keydown", onKey);

        return () => {
            clearTimeout(t);
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    });

    function requestClose() {
        setOpen(false);
        setTimeout(() => onClose(), 220);
    }

    const bgUrl = `url('/src/assets/backgrounds/${lang.slug ?? lang.name.toLowerCase()}.png')`;
    const iconUrl = `/src/assets/icons/${lang.slug ?? lang.name.toLowerCase()}.png`;

    const skills = [...(lang.skillsPool || [])].sort(
        (a: Skill, b: Skill) => (a.unlockLevel ?? 0) - (b.unlockLevel ??0)
    );


    if (!modalRoot) {
        return createPortal(<> {/* backdrop + dialog */} </>, document.body);
    }

    return createPortal(
        <>
            {/* Backdrop */}
            <div className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm
              transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={requestClose} />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl
                                bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100
                                transform-gpu transition-all duration-200
                                ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top bar close */}
                    <div className="flex justify-end p-3">
                        <button
                            onClick={requestClose}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full
                                bg-red-600 text-white hover:bg-red-500 active:bg-red-700
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            autoFocus
                        >
                            X
                        </button>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                            {/* Column Img */}
                            <div
                                className="relative rounded-2xl overflow-hidden h-[360px] md:h-[420px] shadow-lg"
                                style={{ backgroundImage: bgUrl, backgroundSize: "cover", backgroundPosition: "center" }}
                            >
                                <div className="absolute inset-0 bg-black/20" />
                                <img
                                    src={iconUrl}
                                    alt={lang.name}
                                    className="absolute inset-0 m-auto max-h-[85%] object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)]"
                                    draggable={false}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col">
                                <div className="flex flex-wrap items-conter gap-3 mb-2">
                                    <h2 className="text-3xl font-extrabold tracking-tight">{lang.name}</h2>
                                    <span className={`px-2.5 py-1 rounded-full border font-semibold ${categoryPills[lang.category]}`}>
                                        {lang.category}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full border font-semibold ${rarityPills[lang.rarity]}`}>
                                        {lang.rarity}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full border font-semibold bg-white/10 dark:bg-white/10 border-white/20">
                                        #{String(lang.dexNumber).padStart(3, "0")}
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed opacity-90 mb-4">
                                    <strong className="font-semibold">Descrição:</strong> {lang.description}
                                </p>

                                {/* Subtypes */}
                                {lang.subTypes?.length ? (
                                    <div className="mb-4">
                                        <div className="text-sm font-semibold mb-1">Sub Tipos:</div>
                                        <div className="flex flex-wrap gap-2">
                                            {lang.subTypes.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-2 py-0.5 rounded-full text-xs font-medium border bg-white/10 dark:bg-white/10 border-white/20"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                
                                {/* Skills */}
                                <div>
                                    <div className="text-sm font-semibold mb-2">Habilidades</div>
                                    <ul className="space-y-2">
                                        {skills.map((skill) => (
                                            <li
                                                key={skill.id}
                                                className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-50/60 dark:bg-white/5 px-3 py-2"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-semibold">{skill.name}</div>
                                                    {typeof skill.unlockLevel === "number" && (
                                                        <div className="text-[11px] opacity-70">Desbloqueia no nível {skill.unlockLevel}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30">
                                                        Power: {skill.power}
                                                    </span>
                                                    <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                                                        Accuracy: {skill.accuracy}
                                                    </span>
                                                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-500/15 text-slate-300 border border-slate-400/30">
                                                        Element: {skill.element}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Base stats */}
                                <div className="mt-4 flex gap-2">
                                    <span className="text-[11px] px-2 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-400/30">
                                        ATK: {lang.baseStats.attack}
                                    </span>
                                    <span className="text-[11px] px-2 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-400/30">
                                        DEF: {lang.baseStats.defense}
                                    </span>
                                    <span className="text-[11px] px-2 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-400/30">
                                        SPD: {lang.baseStats.speed}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        modalRoot
    );
}