import type React from "react";
import { useNavigate } from "react-router-dom";
import CutscenePlayer from "../cutscene/CutscenePlayer";
import { getLanguages, createCapture } from "../api/langdex";
import { USER_ID } from "../api/types";
import { introScene } from "../cutscene/intro";

const STARTER_LEVEL = 5;

const StarterPage: React.FC = () => {
  const navigate = useNavigate();

  const api: Record<
    string,
    (
      args?: any,
      helpers?: { getFlag: (k: string) => any; setFlag: (k: string, v: any) => void }
    ) => Promise<void>
  > = {
    grantStarter: async (_args, helpers) => {
      const slug = helpers?.getFlag("starterSlug") as string | undefined;
      if (!slug) return;

      const langs = await getLanguages();
      const lang = langs.find(
        (l: any) => (l.slug ?? l.name?.toLowerCase?.()) === slug
      );
      if (!lang) return;

      await createCapture({
        userId: USER_ID,
        languageId: lang.id,
        level: STARTER_LEVEL,
      });

      helpers?.setFlag("starterGranted", true);

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
  };

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
};

export default StarterPage;
