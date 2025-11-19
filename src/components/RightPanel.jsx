import { useEffect, useState, useCallback } from "react";
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

  const currentYear = new Date().getFullYear();

  const processRow = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
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
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong. Please retry after some time.");
    }
  }, [row.data, systemPrompt, onUpdate]);

  useEffect(() => {
    if (row.status === "processed" || row.status === "submitting") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(row.aiData || initialFormState);
      setError(null);
      return;
    }

    if (row.aiData) {
      setFormData(row.aiData);
      setError(null);
    } else if (row.status === "pending" && !row.aiData) {
      processRow();
    }
  }, [row, processRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, year: "" }));
        return;
      }

      const numericYear = Number(value);
      if (numericYear < 1900 || numericYear > currentYear) return;

      setFormData((prev) => ({ ...prev, year: numericYear }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormDisabled = row.status === "processed" || row.status === "submitting";
  const statusOptions = ["New", "Used", "CPO"];

  const handleRetry = () => {
    setError(null);
    processRow();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">AI Processed Parameters</h2>

      {isLoading && (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <Spinner />
          <span className="ml-2 text-gray-600">AI is processing...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something Went Wrong</h3>
          <p className="text-gray-600 mb-4 max-w-md">
          The AI service is currently overloaded. Please try again in a few moments.
          </p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span className="ml-2">Retrying...</span>
              </>
            ) : (
              "Retry"
            )}
          </button>
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
                placeholder="-"
                min="1900"
                max={currentYear}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
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
              {row.status === "submitting"
                ? "Submitting..."
                : row.status === "processed"
                ? "Processed"
                : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
