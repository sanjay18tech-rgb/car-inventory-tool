import React from "react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  processed: "bg-green-100 text-green-800",
  submitting: "bg-blue-100 text-blue-800",
};

export default function Badge({ status }) {
  const text = status.charAt(0).toUpperCase() + status.slice(1);
  const style = statusStyles[status] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {text}
    </span>
  );
}
