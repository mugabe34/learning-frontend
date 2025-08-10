import React from "react";

function Spinner({ size = 48, showText = true }) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <div
        className="border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        style={{
          width: size,
          height: size,
        }}
        aria-label="Loading spinner"
      ></div>
      {showText && (
        <p className="mt-4 text-gray-700 font-medium text-lg">Loading...</p>
      )}
    </div>
  );
}

export default Spinner;
