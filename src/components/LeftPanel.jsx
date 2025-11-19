import { ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "./Badge";

export default function LeftPanel({
  currentRow,
  totalRows,
  onNavigate,
  currentIndex,
}) {
  return (
    <div className="pr-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Current Row Data
      </h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600 font-semibold">
          Row {currentIndex + 1} of {totalRows}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(-1)}
            disabled={currentIndex === 0}
            className="p-1.5 h-10 rounded-md bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => onNavigate(1)}
            disabled={currentIndex === totalRows - 1}
            className="p-1.5 h-10 rounded-md bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
      <div className="mb-6">
        <Badge status={currentRow.status} />
      </div>
      <div className="bg-white p-4 rounded-lg flex flex-col h-80">
        <h3 className="text-sm font-semibold text-gray-600  mb-2">Raw Data</h3>
        <pre className="flex-grow text-sm text-gray-800 whitespace-pre-wrap break-all p-3 rounded  overflow-y-auto">
          {currentRow.raw}
        </pre>
      </div>
    </div>
  );
}
