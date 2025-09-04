import type { Scene } from "../cutscene/types";

const bust = "/src/assets/npc/professor_b_dialog.png";

export const introScene: Scene = {
  steps: [
    {
      t: "say",
      speaker: "Professor B.",
      text: "Olá! Eu sou o Professor B. — bem-vindo(a) ao mundo das Linguagens!",
      portrait: { src: bust, side: "right", heightVh: 60, overlapPx: 28, leftPercent: 63 },
      label: "intro-1",
      next: "intro-2",
    },
    {
      t: "say",
      speaker: "Professor B.",
      text: "Aqui, programadores treinam linguagens, batalham e colaboram para criar soluções incríveis.",
      portrait: { src: bust, side: "right", heightVh: 60, overlapPx: 28, leftPercent: 63 },
      label: "intro-2",
      next: "intro-3",
    },
    {
      t: "say",
      speaker: "Professor B.",
      text: "Para iniciar sua jornada, escolha sua linguagem inicial.",
      portrait: { src: bust, side: "right", heightVh: 60, overlapPx: 28, leftPercent: 63 },
      label: "intro-3",
      next: "starter-choice",
    },

    {
      t: "choice",
      label: "starter-choice",
      prompt: "Estas são três ótimas escolhas para começar. Qual delas te chama mais?",
      portrait: { src: bust, side: "right", heightVh: 60, overlapPx: 28, leftPercent: 63 },
      layout: "cards",
      columns: 3,
      options: [
        { label: "JavaScript", subtitle: "Front-End • Common", icon: "javascript", goto: "pick-js" },
        { label: "Python",     subtitle: "Back-End • Common",  icon: "python",     goto: "pick-py" },
        { label: "Java",       subtitle: "Back-End • Common",  icon: "java",       goto: "pick-java" },
      ],
    },

    { t: "set", label: "pick-js",   flag: "starterSlug", value: "javascript", next: "grant-starter" },
    { t: "set", label: "pick-py",   flag: "starterSlug", value: "python",     next: "grant-starter" },
    { t: "set", label: "pick-java", flag: "starterSlug", value: "java",       next: "grant-starter" },

    { t: "call", label: "grant-starter", fn: "grantStarter", next: "done-line" },

    {
      t: "say",
      label: "done-line",
      speaker: "Professor B.",
      text: "Excelente escolha! Sua jornada começa agora. Vou te acompanhar nos primeiros passos.",
      portrait: { src: bust, side: "right", heightVh: 60, overlapPx: 28, leftPercent: 63 },
      next: "end",
    },

    { t: "end" },
  ],
};
