import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Scene,
  Step,
  SayStep,
  ChoiceStep,
} from "./types";
import DialogBox from "../components/DiologBox";

function resolveIconSrc(icon?: string) {
  if (!icon) return undefined;
  if (icon.includes("/") || /\.(png|svg|jpg|jpeg|webp)$/i.test(icon)) return icon;
  return `/src/assets/icons/${icon}.png`;
}

type Props = {
  scene: Scene;
  api?: Record<
    string,
    (
      args?: any,
      helpers?: { getFlag: (k: string) => any; setFlag: (k: string, v: any) => void }
    ) => any | Promise<any>
  >;
  onEnd?: () => void;
  className?: string;
};

function buildLabelIndex(steps: Step[]) {
  const map = new Map<string, number>();
  steps.forEach((s, i) => {
    if ("label" in s && (s as any).label) map.set((s as any).label, i);
  });
  return map;
}

const CutscenePlayer: React.FC<Props> = ({ scene, api, onEnd, className }) => {
  const labels = useMemo(() => buildLabelIndex(scene.steps), [scene.steps]);
  const [idx, setIdx] = useState(0);
  const [flags, setFlags] = useState<Record<string, any>>(scene.initFlags ?? {});
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const getFlag = (k: string) => flags[k];
  const setFlag = (k: string, v: any) => setFlags((prev) => ({ ...prev, [k]: v }));

  const goTo = (label: string) => {
    const pos = labels.get(label);
    if (pos == null) return;
    setIdx(pos);
  };
  const nextStep = (forcedLabel?: string) => {
    if (forcedLabel) return goTo(forcedLabel);
    setIdx((i) => Math.min(i + 1, scene.steps.length - 1));
  };

  useEffect(() => {
    if (idx >= scene.steps.length) {
      onEnd?.();
      return;
    }
    const s = scene.steps[idx];
    const helpers = { getFlag, setFlag };

    const ac = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ac;

    let mounted = true;

    (async () => {
      switch (s.t) {
        case "goto":
          if (!mounted) return;
          goTo((s as any).target);
          break;

        case "set":
          if (!mounted) return;
          setFlag((s as any).flag, (s as any).value);
          nextStep((s as any).next);
          break;

        case "call": {
          setBusy(true);
          try {
            const fn = api?.[(s as any).fn];
            if (fn) {
              await fn((s as any).args, helpers);
            } else {
              console.warn(`Cutscene: função não encontrada: ${(s as any).fn}`);
            }
          } finally {
            if (mounted) {
              setBusy(false);
              nextStep((s as any).next);
            }
          }
          break;
        }

        case "end":
          onEnd?.();
          break;

        default:
          break;
      }
    })();

    return () => {
      mounted = false;
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, scene.steps]); 

  if (idx >= scene.steps.length) return null;

  const step = scene.steps[idx];

  return (
    <div className={className}>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(12px,4vh,40px)] w-full max-w-5xl px-4">
        {step.t === "say" ? (
          <DialogBox
            speaker={(step as SayStep).speaker}
            text={(step as SayStep).text}
            onNext={() => nextStep((step as SayStep).next)}
            portraitSrc={(step as SayStep).portrait?.src}
            portraitAlt={(step as SayStep).portrait?.alt}
            portraitSide={(step as SayStep).portrait?.side ?? "right"}
            portraitHeightVh={(step as SayStep).portrait?.heightVh ?? 60}
            portraitOverlapPx={(step as SayStep).portrait?.overlapPx ?? 28}
            portraitLeftPercent={(step as SayStep).portrait?.leftPercent ?? 63}
            className="shadow-2xl backdrop-blur-sm bg-slate-900/90"
          />
        ) : step.t === "choice" ? (
          <>
            <DialogBox
              speaker="Professor B."
              text={(step as ChoiceStep).prompt}
              portraitSrc={(step as ChoiceStep).portrait?.src ?? "/src/assets/npc/professor-b-bust.png"}
              portraitAlt={(step as ChoiceStep).portrait?.alt ?? "Professor B."}
              portraitSide={(step as ChoiceStep).portrait?.side ?? "right"}
              portraitHeightVh={(step as ChoiceStep).portrait?.heightVh ?? 60}
              portraitOverlapPx={(step as ChoiceStep).portrait?.overlapPx ?? 28}
              portraitLeftPercent={(step as ChoiceStep).portrait?.leftPercent ?? 63}
              className="shadow-2xl backdrop-blur-sm bg-slate-900/90"
            />
            {(() => {
              const s = step as ChoiceStep;
              const hasIcons = s.options.some((o) => !!(o as any).icon);
              const useCards = s.layout === "cards" || hasIcons;
              if (useCards) {
                const cols = s.columns ?? 3;
                return (
                  <div className={`mt-3 grid gap-4 ${cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                    {s.options.map((opt) => (
                      <ChoiceCard
                        key={opt.label}
                        label={opt.label}
                        subtitle={(opt as any).subtitle}
                        iconSrc={resolveIconSrc((opt as any).icon)}
                        onClick={() => goTo(opt.goto)}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <div className="mt-3 grid gap-3">
                  {s.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => goTo(opt.goto)}
                      className="text-left rounded-2xl border p-4 bg-white/5 hover:bg-white/10 transition
                                 border-white/10 shadow-sm w-full"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </>
        ) : (
          <DialogBox
            speaker="..."
            text={busy ? "Processando..." : "Aguarde..."}
            className="shadow-2xl backdrop-blur-sm bg-slate-900/90"
          />
        )}
      </div>
    </div>
  );
};

export default CutscenePlayer;

function ChoiceCard({
  label,
  subtitle,
  iconSrc,
  onClick,
}: {
  label: string;
  subtitle?: string;
  iconSrc?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full text-left
        rounded-2xl border border-white/10 bg-white/5
        p-4 shadow-sm
        transition
        hover:bg-white/10 hover:shadow-xl hover:border-emerald-400/30
        hover:ring-1 hover:ring-emerald-400/50 hover:ring-offset-1 hover:ring-offset-slate-900
        motion-safe:hover:-translate-y-0.5
        active:translate-y-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      "
      aria-label={label}
    >
      <div className="flex items-center gap-4">
        {iconSrc ? (
          <div
            className="
              w-16 h-16 rounded-full p-[3px]
              bg-gradient-to-br from-yellow-400 to-orange-500
              transition-transform
              group-hover:scale-105
            "
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={iconSrc}
                alt={label}
                className="w-12 h-12 object-contain select-none transition-transform group-hover:scale-105"
                draggable={false}
              />
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/10" />
        )}

        <div className="min-w-0">
          <div className="font-semibold transition-colors">{label}</div>
          {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
        </div>

        <div
          className="
            ml-auto opacity-0 translate-x-[-4px]
            transition-all duration-200 ease-out
            group-hover:opacity-100 group-hover:translate-x-0
            text-emerald-300
          "
          aria-hidden
        >
          ➜
        </div>
      </div>
    </button>
  );
}
