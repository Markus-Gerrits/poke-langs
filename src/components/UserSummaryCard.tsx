import type React from "react";

type Props = {
    user: {
        id: number;
        nickname: string;
        level: number;
        xp: number;
        nextLevelXp: number;
        avatarUrl?: string;
    };
    capturedCount: number;
    totalLangs: number;
    onStartJourney: () => void;
};

export const UserSummaryCard: React.FC<Props> = ({
    user,
    capturedCount,
    totalLangs,
    onStartJourney
}) => {
    const pct = Math.max(
        0,
        Math.min(100, Math.round((user.xp / Math.max(1, user.nextLevelXp)) * 100))
    );

    return (
        <section
            className="max-w-6xl mx-auto mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-sm"
        >
            <div className="flex items-center gap-4 sm:gap-6">
                {/* user Avatar */}
                <div className="relative w-16 h-16 sm:w-20 rounded-full p-[3px] bg-gradient-to-br from-violet-500 to-fuchsia-600">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.nickname}
                                className="w-full h-full object-cover select-none"
                                draggable={false}
                            />
                        ) : (
                            <span className="text-xl text-white sm:text-2xl font-bold">
                                {user.nickname?.[0]?.toUpperCase() ?? "?"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Name, Level and XP */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-extrabold truncate">
                            {user.nickname || "Programador(a)"}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold border bg-white/10 border-white/20">
                            Nível {user.level}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold border bg-emerald-500/15 text-emerald-300 border-emerald-400/30">
                            {capturedCount}/{totalLangs} Capturadas
                        </span>
                    </div>
                </div>
            </div>
            
            {/* XP process */}
            <div className="mt-2">
                <div className="text-xs opacity-80 mb-1">
                    XP {user.xp} / {user.nextLevelXp} ({pct}%)
                </div>
                <div
                    className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                >
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-600 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                    >
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            { capturedCount === 0 && onStartJourney ? (
                <div className="hidden sm:block">
                    <button
                        onClick={onStartJourney}
                        className="px-4 py-2 rounded-lg bg-blue-500 text0white shadow hover:bg-blue-600 active:bg-blue-700 transition"
                    >
                        Começar Jornada
                    </button>
                </div>
            ) : null}

            {/* placeholders for future sections */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm opacity-80">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    Conquistas: <span className="opacity-60">em breve</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    Estatísticas de batalha: <span className="opacity-60">em breve</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    Missões/diárias: <span className="opacity-60">em breve</span>
                </div>
            </div>
        </section>
    )
}