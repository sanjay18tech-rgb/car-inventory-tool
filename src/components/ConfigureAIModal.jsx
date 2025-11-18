import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ConfigureAIModal({ isOpen, onClose, prompt, onSave }) {
  const [currentPrompt, setCurrentPrompt] = useState(prompt);

  useEffect(() => {
    setCurrentPrompt(prompt);
  }, [prompt]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(currentPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold leading-6 text-gray-900">
            Configure AI Prompt
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mt-2">
          <label
            htmlFor="systemPrompt"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            System Prompt
          </label>
          <textarea
            id="systemPrompt"
            rows="10"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-inner focus:border-indigo-500 focus:ring-indigo-500"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
          ></textarea>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          This is a demo. Saving the prompt will affect the AI's behavior for
          subsequent requests.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
