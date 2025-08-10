import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

// --- InputField.jsx ---
function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete,
  ...props
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 outline-none shadow-sm bg-white
          ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-400"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500"
          }
          focus:border-blue-500
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

// --- AnimatedIllustration.jsx ---
function AnimatedIllustration() {
  // Simple floating SVG illustration with animation
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div
        className="w-72 h-72 flex items-center justify-center"
        style={{ minHeight: "18rem" }}
      >
        <svg
          className="w-64 h-64 animate-float"
          viewBox="0 0 256 256"
          fill="none"
        >
          <ellipse
            cx="128"
            cy="200"
            rx="80"
            ry="20"
            fill="#1E3A8A"
            opacity="0.15"
          />
          <rect
            x="56"
            y="60"
            width="144"
            height="96"
            rx="16"
            fill="#1E3A8A"
            opacity="0.9"
          />
          <rect
            x="72"
            y="80"
            width="112"
            height="56"
            rx="8"
            fill="#10B981"
            opacity="0.85"
          />
          <rect
            x="90"
            y="100"
            width="76"
            height="16"
            rx="4"
            fill="#fff"
            opacity="0.9"
          />
          <circle
            cx="128"
            cy="88"
            r="8"
            fill="#fff"
            opacity="0.8"
          />
        </svg>
      </div>
      <div className="mt-8 text-white text-2xl font-bold text-center drop-shadow-lg animate-fade-in-slow">
        Empower Your Learning Journey
      </div>
    </div>
  );
}

// --- Toast.jsx ---
function Toast({ type = "success", message, show, onClose }) {
  // type: "success" | "error"
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3
        ${
          type === "success"
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        }
        animate-toast-in
      `}
      role="alert"
    >
      {type === "success" ? (
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-white"
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
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
}

// --- Login.jsx ---
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Fade-in animation on mount
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 50);
  }, []);

  // Validation
  function validate(values) {
    const errs = {};
    if (!values.email) {
      errs.email = "Email or username is required";
    } else if (
      values.email.includes("@") &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errs.email = "Invalid email address";
    }
    if (!values.password) {
      errs.password = "Password is required";
    }
    return errs;
  }

  useEffect(() => {
    setErrors(validate(form));
    // eslint-disable-next-line
  }, [form]);

  // Handlers
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Use the AuthContext to login
        login(data.user, data.token);
        
        setToast({
          show: true,
          type: "success",
          message: `Welcome back, ${data.user.name}!`,
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: error.message || "Invalid email or password",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleToastClose() {
    setToast((t) => ({ ...t, show: false }));
  }

  // Responsive: hide illustration on mobile
  return (
    <div
      className={`min-h-screen flex bg-gray-100 transition-opacity duration-700 ${
        pageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Left Side: Illustration */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-500 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Decorative gradient blobs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 opacity-20 rounded-full blur-3xl animate-blob1"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl animate-blob2"></div>
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <AnimatedIllustration />
        </div>
      </div>
      {/* Right Side: Login Card */}
      <div className="flex w-full md:w-1/2 min-h-screen items-center justify-center">
        <form
          className={`bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto
            transform transition-all duration-700
            ${
              pageLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }
            animate-fade-in
          `}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-500 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>
          <InputField
            label="Email or Username"
            name="email"
            type="text"
            autoComplete="username"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
          />
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition"
              />
              Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-blue-700 text-sm hover:underline transition underline-offset-2"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={
              submitting ||
              Object.keys(errors).length > 0 ||
              !form.email ||
              !form.password
            }
            className={`w-full py-2.5 mt-2 rounded-lg font-semibold text-white bg-emerald-500 shadow-md transition
              duration-150 ease-in-out
              hover:bg-emerald-600 hover:scale-[1.03] hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-emerald-400
              active:scale-95
              ${
                submitting ||
                Object.keys(errors).length > 0 ||
                !form.email ||
                !form.password
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              }
              animate-pulse-on-click
            `}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-blue-700 hover:underline underline-offset-2 transition"
              >
                Register
              </a>
            </span>
          </div>
        </form>
      </div>
      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={handleToastClose}
      />
      {/* Animations */}
      <style>{`
        /* Fade in for page and card */
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-slow {
          animation: fadeInUp 1.2s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px);}
          to { opacity: 1; transform: translateY(0);}
        }
        /* Slide in for card */
        .translate-x-12 {
          transform: translateX(3rem);
        }
        /* Floating animation for illustration */
        .animate-float {
          animation: floatY 3.5s ease-in-out infinite alternate;
        }
        @keyframes floatY {
          0% { transform: translateY(0) scale(1);}
          50% { transform: translateY(-16px) scale(1.04);}
          100% { transform: translateY(0) scale(1);}
        }
        /* Decorative blobs */
        .animate-blob1 {
          animation: blobMove1 8s ease-in-out infinite alternate;
        }
        .animate-blob2 {
          animation: blobMove2 7s ease-in-out infinite alternate;
        }
        @keyframes blobMove1 {
          0% { transform: scale(1) translateY(0);}
          100% { transform: scale(1.1) translateY(20px);}
        }
        @keyframes blobMove2 {
          0% { transform: scale(1) translateY(0);}
          100% { transform: scale(1.08) translateY(-18px);}
        }
        /* Toast animation */
        .animate-toast-in {
          animation: toastIn 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-16px);}
          to { opacity: 1; transform: translateY(0);}
        }
        /* Button pulse on click */
        .animate-pulse-on-click:active {
          animation: pulseClick 0.18s;
        }
        @keyframes pulseClick {
          0% { transform: scale(1);}
          50% { transform: scale(0.96);}
          100% { transform: scale(1);}
        }
      `}</style>
    </div>
  );
}

// --- Spinner for button ---
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
