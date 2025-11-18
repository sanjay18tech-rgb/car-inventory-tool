import { useEffect, useState } from "react";
import { parseCarDataWithAI } from "../services/ai";
import Spinner from "./Spinner";

const initialFormState = {
  make: "",
  model: "",
  year: "",
  color: "",
  status: "",
};

export default function RightPanel({ row, onUpdate, onSubmit, systemPrompt }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (row.status === "processed" || row.status === "submitting") {
      setFormData(row.aiData || initialFormState);
      return;
    }

    if (row.aiData) {
      setFormData(row.aiData);
    } else if (row.status === "pending") {
      const processRow = async () => {
        setIsLoading(true);
        setError(null);
        const result = await parseCarDataWithAI(row.data, systemPrompt);
        setIsLoading(false);

        if (result.error) {
          setError(result.error);
        } else {
          const formattedResult = {
            make: result.make || "",
            model: result.model || "",
            year: result.year || "",
            color: result.color || "",
            status: result.status || "",
          };
          setFormData(formattedResult);
          onUpdate({ aiData: formattedResult });
        }
      };
      processRow();
    }
  }, [row, onUpdate, systemPrompt]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, year: "" }));
        return;
      }

      const numericYear = Number(value);
      if (numericYear < 0 || numericYear < 1900) return;

      setFormData((prev) => ({ ...prev, year: numericYear }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormDisabled = row.status === "processed" || row.status === "submitting";

  const statusOptions = ["New", "Used", "CPO"];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        AI Processed Parameters
      </h2>

      {isLoading && (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <Spinner />
          <span className="ml-2 text-gray-600">AI is processing...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      {!isLoading && !error && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                Make
              </label>
              <input
                placeholder="-"
                type="text"
                name="make"
                id="make"
                value={formData.make}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                id="model"
                value={formData.model}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                placeholder="-"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                id="year"
                value={formData.year}
                onChange={handleChange}
                disabled={isFormDisabled}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                placeholder="-"
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                name="color"
                id="color"
                value={formData.color}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                placeholder="-"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status (AI Suggested)
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="" disabled>Select Status</option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {!statusOptions.includes(formData.status) && formData.status && (
                  <option value={formData.status}>{formData.status}</option>
                )}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full inline-flex justify-center py-2 px-4 h-12 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {row.status === "submitting" ? "Submitting..."
                : row.status === "processed" ? "Processed"
                : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
