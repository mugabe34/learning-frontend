import React, { useEffect, useState } from "react";

// Heroicons X Icon (outline)
function XIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

const typeStyles = {
  success: "bg-emerald-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start animation in
    setVisible(true);

    // Auto-hide after duration
    let timer;
    if (duration !== null && duration !== undefined) {
      timer = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  // When animation out ends, call onClose
  const handleTransitionEnd = () => {
    if (!visible && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        transition-all duration-300 ease-in-out
        ${visible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"}
      `}
      style={{ minWidth: "260px", maxWidth: "90vw" }}
      onTransitionEnd={handleTransitionEnd}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`
          flex items-center justify-between gap-4
          px-5 py-3 rounded-lg shadow-lg
          ${typeStyles[type] || typeStyles.info}
        `}
      >
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 p-1 rounded-full hover:bg-white/20 focus:outline-none transition"
          aria-label="Close"
          tabIndex={0}
          type="button"
        >
          <XIcon />
        </button>
      </div>
      {/* Animations */}
      <style>
        {`
          .translate-x-20 {
            transform: translateX(5rem);
          }
          .translate-x-0 {
            transform: translateX(0);
          }
        `}
      </style>
    </div>
  );
}

export default Toast;

// Example usage
export function ToastExample() {
  const [show, setShow] = useState(false);

  // For demo: show toast on button click
  const handleShowToast = () => {
    setShow(true);
  };

  return (
    <div className="p-8">
      <button
        onClick={handleShowToast}
        className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600 transition"
      >
        Show Toast
      </button>
      {show && (
        <Toast
          message="This is a success toast!"
          type="success"
          duration={3000}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
