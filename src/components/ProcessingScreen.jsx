import { useState, useEffect, useCallback } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ConfigureAIModal from "./ConfigureAIModal";
import { Cog } from "lucide-react";

const DEFAULT_PROMPT = `You are an AI assistant. Given the raw text from a CSV row, your task is to parse the following fields:
1.  **make**: The car manufacturer (e.g., "Honda", "Toyota").
2.  **model**: The car model (e.g., "Civic", "Camry").
3.  **year**: The 4-digit model year as a number.
4.  **color**: The primary color of the car.
5.  **status**: The condition of the car (e.g., "New", "Used", "CPO").

Respond ONLY with the extracted JSON.`;

export default function ProcessingScreen({ initialRows }) {
  const [rows, setRows] = useState(initialRows);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);

  const navigate = (direction) => {
    setCurrentRowIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex >= 0 && newIndex < rows.length) {
        return newIndex;
      }
      return prev;
    });
  };

  const handleRowUpdate = (index, updates) => {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], ...updates };
      return newRows;
    });
  };

  const handleSubmit = (index, formData) => {
    handleRowUpdate(index, { status: "submitting", aiData: formData });
    setTimeout(() => {
      console.log("Submitted data for row", index, ":", formData);
      handleRowUpdate(index, { status: "processed" });

      const nextUnprocessedIndex = rows.findIndex(
        (row, i) => i > index && row.status === "pending"
      );
      if (nextUnprocessedIndex !== -1) {
        setCurrentRowIndex(nextUnprocessedIndex);
      }
    }, 1000);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        navigate(1);
      } else if (e.key === "ArrowLeft") {
        navigate(-1);
      }
    },
    [navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const currentRow = rows[currentRowIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg  grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-8 right-8 flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Cog size={16} className="mr-2" />
          Configure AI
        </button>
        <div className="bg-gray-100 p-6 rounded-md" >
          <LeftPanel
            currentRow={currentRow}
            totalRows={rows.length}
            onNavigate={navigate}
            currentIndex={currentRowIndex}
          />
        </div>
        <div className="p-6">
          <RightPanel
            key={currentRow.id}
            row={currentRow}
            onUpdate={(updates) => handleRowUpdate(currentRowIndex, updates)}
            onSubmit={(formData) => handleSubmit(currentRowIndex, formData)}
            systemPrompt={systemPrompt}
          />
        </div>
      </div>
      <ConfigureAIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prompt={systemPrompt}
        onSave={setSystemPrompt}
      />
    </div>
  );
}
