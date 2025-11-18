import { useState } from "react";
import UploadScreen from "./components/UploadScreen";
import ProcessingScreen from "./components/ProcessingScreen";
import Papa from "papaparse";

export default function App() {
  const [rows, setRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        const parsedRows = results.data
          .filter((row) => row.some((cell) => cell.trim() !== ""))
          .map((row, index) => ({
            id: index,
            raw: JSON.stringify(
              {
                row: index + 1,
                details: { Raw: row.join(", ") },
              },
              null,
              2
            ),
            data: row.join(", "),
            status: "pending",
            aiData: null,
          }));
        setRows(parsedRows);
        setIsProcessing(true);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to parse CSV file.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <main className="min-h-screen flex items-center justify-center">
        {!isProcessing ? (
          <UploadScreen onFileUpload={handleFileUpload} />
        ) : (
          <ProcessingScreen initialRows={rows} />
        )}
      </main>
    </div>
  );
}
