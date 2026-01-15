import React from "react";

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="border rounded-lg p-4 shadow-sm">{children}</div>;
};
