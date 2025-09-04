import type React from "react";

type Props = {
  speaker?: string;
  text: string;
  onNext?: () => void;
  nextLabel?: string;
  className?: string;

  portraitSrc?: string;
  portraitAlt?: string;
  portraitSide?: "left" | "right";
  portraitHeightVh?: number;
  portraitOverlapPx?: number;
  portraitLeftPercent?: number;
  portraitStyle?: React.CSSProperties;
  portraitClassName?: string;
  showGroundFade?: boolean;
};

const DialogBox: React.FC<Props> = ({
  speaker,
  text,
  onNext,
  nextLabel = "Avançar",
  className = "",

  portraitSrc,
  portraitAlt = "",
  portraitSide = "right",
  portraitHeightVh = 56,
  portraitOverlapPx = 24,
  portraitLeftPercent,
  portraitStyle,
  portraitClassName,
  showGroundFade = false,
}) => {
  const defaultLeft =
    portraitLeftPercent ??
    (portraitSide === "right" ? 62 : 38);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {portraitSrc && (
        <img
          src={portraitSrc}
          alt={portraitAlt}
          draggable={false}
          className={[
            "pointer-events-none select-none",
            "absolute z-0",
            "translate-x-[-50%]",
            "object-contain",
            portraitClassName ?? "",
          ].join(" ")}
          style={{
            bottom: `calc(100% - ${portraitOverlapPx}px)`,
            left: `${defaultLeft}%`,
            height: `min(${portraitHeightVh}vh, 720px)`,
            width: "auto",
            maxWidth: "none",
            ...portraitStyle,
          }}
        />
      )}

      {portraitSrc && showGroundFade && (
        <div
          className="absolute inset-x-0 z-10 pointer-events-none"
          style={{
            bottom: `calc(100% - ${Math.max(0, portraitOverlapPx - 2)}px)`,
            height: "3.5rem",
            background:
              "linear-gradient(to top, rgba(15,23,42,0.20), rgba(15,23,42,0.06), rgba(15,23,42,0))",
          }}
        />
      )}

      <div
        className={[
          "relative z-20",
          "rounded-3xl bg-slate-900/95 text-white border border-white/10",
          "p-5 sm:p-6 shadow-xl",
          "backdrop-blur-sm",
          className ?? "",
        ].join(" ")}
      >
        {speaker && (
          <div className="absolute -top-3 right-4 bg-yellow-500 text-slate-900 text-sm font-extrabold rounded-lg px-3 py-1 shadow">
            {speaker}
          </div>
        )}

        <p className="text-base sm:text-lg leading-relaxed pr-24">{text}</p>

        {onNext && (
          <button
            onClick={onNext}
            className="absolute bottom-3 right-4 text-yellow-300 text-sm hover:text-yellow-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-2 py-1"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default DialogBox;
