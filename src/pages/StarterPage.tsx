import type React from "react";
import { useState } from "react";
import StarterSelection from "../components/StarterSelection";

const StarterPage: React.FC = () => {
    const [starterId, setStarterId] = useState<number | null>(null);

    const handleSelect = (id: number) => {
        setStarterId(id);
    }

    return (
        <div className="p-6">
            {!starterId ? (
                <StarterSelection onSelect={handleSelect} />
            ) : (
                <div className="text-center mt-10">
                    <h2 className="text-xl font-bold">
                        Você escolheu: #{starterId.toString().padStart(3, "0")}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default StarterPage;