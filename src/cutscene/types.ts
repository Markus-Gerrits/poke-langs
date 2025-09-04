export type PortraitSpec = {
  src: string;
  alt?: string;
  side?: "left" | "right";
  heightVh?: number;
  overlapPx?: number;
  leftPercent?: number;
};

export type SayStep = {
  t: "say";
  speaker?: string;
  text: string;
  portrait?: PortraitSpec;
  label?: string;
  next?: string;
};

export type ChoiceOption = {
  label: string;
  goto: string;
  value?: any;
  icon?: string;
  subtitle?: string;
};

export type ChoiceStep = {
  t: "choice";
  prompt: string;
  options: ChoiceOption[];
  label?: string;

  portrait?: PortraitSpec;

  layout?: "cards" | "list";
  columns?: number;
};

export type SetStep = { t: "set"; flag: string; value: unknown; next?: string; label?: string };
export type CallStep = { t: "call"; fn: string; args?: any; next?: string; label?: string };
export type GotoStep = { t: "goto"; target: string };
export type EndStep  = { t: "end" };

export type Step = SayStep | ChoiceStep | SetStep | CallStep | GotoStep | EndStep;

export type Scene = {
  steps: Step[];
  initFlags?: Record<string, unknown>;
};
