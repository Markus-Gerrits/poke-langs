import { useNavigate } from "react-router-dom";
import CutscenePlayer from "../cutscene/CutscenePlayer";
import { getLanguages, createCapture } from "../api/langdex";
import { introScene } from "../cutscene/intro";
const USER_ID = 1;
const STARTER_LEVEL = 5;

export default function StarterSelection() {
  const navigate = useNavigate();

  const api = {
    grantStarter: async (
      _args?: any,
      helpers?: { getFlag: (k: string) => any; setFlag?: (k: string, v: any) => void }
    ) => {
      const slug = helpers?.getFlag("starterSlug") as string | undefined;
      if (!slug) return;

      const langs = await getLanguages();
      const lang = langs.find((l: any) => (l.slug ?? l.name?.toLowerCase?.()) === slug);
      if (!lang) return;

      await createCapture({ userId: USER_ID, languageId: lang.id, level: STARTER_LEVEL });

      helpers?.setFlag?.("starterGranted", true);

      navigate("/unlock", {
        replace: true,
        state: {
          language: {
            id: lang.id,
            name: lang.name,
            slug: lang.slug ?? lang.name.toLowerCase(),
            category: lang.category,
            rarity: lang.rarity,
          },
        },
      });
    },
  } satisfies Record<
    string,
    (
      args?: any,
      helpers?: { getFlag: (k: string) => any; setFlag?: (k: string, v: any) => void }
    ) => Promise<void>
  >;

  return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden">
      <CutscenePlayer
        scene={introScene}
        api={api}
        onEnd={() => navigate("/")}
        className="h-full"
      />
    </div>
  );
}
