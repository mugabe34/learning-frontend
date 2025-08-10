import React, { useEffect, useRef } from "react";
import { XIcon } from "@heroicons/react/outline";

export default function Modal({
  title,
  children,
  onClose,
  onConfirm,
  show,
}) {
  const overlayRef = useRef(null);

  // Trap focus inside modal when open
  useEffect(() => {
    if (!show) return;
    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = overlayRef.current;
    const focusableEls = modal
      ? modal.querySelectorAll(focusableSelectors)
      : [];
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    function handleTab(e) {
      if (e.key !== "Tab") return;
      if (focusableEls.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEsc);

    // Focus first element
    if (firstEl) firstEl.focus();

    return () => {
      document.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [show, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onMouseDown={e => {
        // Close if click on overlay, not modal box
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-lg w-full max-w-[90%] sm:max-w-[500px]
          transform transition-all duration-200
          scale-95 opacity-0
          ${show ? "scale-100 opacity-100" : ""}
          animate-modal-in
        `}
        style={{
          animation: show
            ? "modal-in 0.2s cubic-bezier(0.4,0,0.2,1) forwards"
            : "modal-out 0.15s cubic-bezier(0.4,0,0.2,1) forwards",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-gray-200 transition"
            tabIndex={0}
            type="button"
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-medium px-5 py-2 rounded-lg hover:bg-gray-300 transition"
            type="button"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-emerald-600 transition"
              type="button"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
        @keyframes modal-in {
          0% { opacity: 0; transform: scale(0.95);}
          100% { opacity: 1; transform: scale(1);}
        }
        @keyframes modal-out {
          0% { opacity: 1; transform: scale(1);}
          100% { opacity: 0; transform: scale(0.95);}
        }
        `}
      </style>
    </div>
  );
}
