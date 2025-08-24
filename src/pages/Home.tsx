import type React from "react";
import { useNavigate } from "react-router-dom";
import { langsMock } from "../mocks/langsMock";
import { userCapturesMock } from "../mocks/userMock";
import LangCard from "../components/LangCard";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const userLangs = langsMock.filter((lang) =>
    userCapturesMock.some((capture) => capture.languageId === lang.id)
  );

  const handleStartJourney = () => {
    navigate("/starter");
  };

  return (
    <div className="p-6">
      <h1 className="text-2x1 font-bold text-center mb-6">🏠 Página Inicial</h1>

      {userLangs.length > 0 ? (
        <div className="flex gap-5 justify-center">
          {userLangs.map((lang) => (
            <LangCard
              key={lang.id}
              id={lang.id}
              name={lang.name}
              type={lang.type}
              owned={true}
              icon={lang.icon}
            />
          ))}
        </div>
      ): (
        <div className="text-center mt-10">
          <button
            onClick={handleStartJourney}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Começar Jornada
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;