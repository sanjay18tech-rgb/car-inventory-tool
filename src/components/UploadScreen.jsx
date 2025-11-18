import React, { useRef } from "react";
import { FileDown } from "lucide-react";

export default function UploadScreen({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      onFileUpload(file);
    } else {
      alert("Please select a valid .csv file.");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
      <div className="min-h-[79vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
          <FileDown className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload your CSV file
        </h2>
        <p className="text-gray-600 mb-8">
          Upload your file to begin processing car listings with our AI
          assistant.
        </p>
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Select CSV file
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />
      </div>
    </div>
  );
}
