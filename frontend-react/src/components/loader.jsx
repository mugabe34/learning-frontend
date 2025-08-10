import React from "react";

function LoaderPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 z-50">
      <div className="flex flex-col items-center">
        <div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          aria-label="Loading spinner"
        ></div>
        <p className="mt-6 text-gray-700 font-medium text-lg text-center">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

export default LoaderPage;
