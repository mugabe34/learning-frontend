import React, { useState, useEffect } from "react";
import { useAuth } from "../App";

// --- InputField.jsx ---
function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  ariaLabel,
  children,
  ...props
}) {
  return (
    <div className="mb-5 w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-label={ariaLabel || label}
          className={`block w-full rounded-md border ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-400"
          } shadow-sm px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-150 ${
            children ? "pr-10" : ""
          }`}
          {...props}
        />
        {children && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {children}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// --- PasswordStrengthBar.jsx ---
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-red-400", value: 1 };
  if (score === 3 || score === 4)
    return { label: "Medium", color: "bg-yellow-400", value: 2 };
  if (score === 5) return { label: "Strong", color: "bg-emerald-500", value: 3 };
  return { label: "Weak", color: "bg-red-400", value: 1 };
}

function PasswordStrengthBar({ password }) {
  const { label, color, value } = getPasswordStrength(password);
  const barColors = [
    "bg-gray-200",
    value >= 1 ? color : "bg-gray-200",
    value >= 2 ? color : "bg-gray-200",
    value >= 3 ? color : "bg-gray-200",
  ];
  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="flex w-24 h-2 rounded overflow-hidden">
        <div className={`flex-1 transition-all duration-300 ${barColors[1]}`}></div>
        <div className={`flex-1 transition-all duration-300 ${barColors[2]}`}></div>
        <div className={`flex-1 transition-all duration-300 ${barColors[3]}`}></div>
      </div>
      <span
        className={`text-xs font-medium ${
          label === "Weak"
            ? "text-red-500"
            : label === "Medium"
            ? "text-yellow-500"
            : "text-emerald-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// --- RoleSelect.jsx ---
function RoleSelect({ value, onChange, error }) {
  return (
    <div className="mb-5 w-full">
      <label
        htmlFor="role"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Role
      </label>
      <select
        id="role"
        name="role"
        value={value}
        onChange={onChange}
        aria-label="Role"
        className={`block w-full rounded-md border ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        } shadow-sm px-3 py-2 focus:outline-none focus:ring-2 transition-all duration-150 bg-white`}
      >
        <option value="">Select role</option>
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// --- Toast Notification ---
function Toast({ show, type, message, onClose }) {
  if (!show) return null;
  return (
    <div
      className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-4 py-3 rounded shadow-lg flex items-center gap-2
        ${
          type === "success"
            ? "bg-emerald-500 text-white"
            : "bg-red-500 text-white"
        }
        animate-fade-in
      `}
      role="alert"
      aria-live="assertive"
    >
      {type === "success" ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span>{message}</span>
      <button
        className="ml-2 text-white/80 hover:text-white focus:outline-none"
        onClick={onClose}
        aria-label="Close notification"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// --- Password Tooltip ---
function PasswordTooltip({ show }) {
  return (
    <div
      className={`absolute left-0 top-full mt-1 z-20 w-64 bg-white border border-gray-200 rounded shadow-lg p-3 text-xs text-gray-700 transition-all duration-200
        ${show ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
      role="tooltip"
    >
      <div className="font-semibold mb-1">Password requirements:</div>
      <ul className="list-disc pl-4 space-y-1">
        <li>At least 8 characters</li>
        <li>One uppercase letter</li>
        <li>One lowercase letter</li>
        <li>One number</li>
        <li>One special symbol</li>
      </ul>
    </div>
  );
}

// --- Placeholder API Service (authService.js) ---
async function registerUser(data) {
  const response = await fetch('http://localhost:4000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role.toUpperCase()
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Registration failed');
  }

  return result;
}

// --- Main Register Page ---
export default function Register() {
  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Password tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  // Animation
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  // Validation logic
  function validateField(name, value) {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        // Simple email regex
        if (
          !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
        )
          return "Enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8)
          return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain an uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must contain a lowercase letter";
        if (!/\d/.test(value))
          return "Password must contain a number";
        if (!/[^A-Za-z0-9]/.test(value))
          return "Password must contain a special symbol";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== form.password)
          return "Passwords do not match";
        return "";
      case "role":
        if (!value) return "Please select a role";
        return "";
      default:
        return "";
    }
  }

  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  }

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (touched[key]) {
        const err = validateField(key, form[key]);
        if (err) newErrors[key] = err;
      }
    });
    setErrors(newErrors);
    // eslint-disable-next-line
  }, [form, touched]);

  // Handlers
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handlePasswordFocus() {
    setShowTooltip(true);
  }
  function handlePasswordBlur(e) {
    setShowTooltip(false);
    handleBlur(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true,
    });
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await registerUser(form);
      setToast({
        show: true,
        type: "success",
        message: "Account created successfully! Redirecting to login...",
      });
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      setToast({
        show: true,
        type: "error",
        message: err.message || "Registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function closeToast() {
    setToast((prev) => ({ ...prev, show: false }));
  }

  // Button enabled only if all fields valid and not submitting
  const allValid =
    Object.values(form).every((v) => v) &&
    Object.keys(validateAll()).length === 0;

  // Password strength
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 px-2">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />
      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10 mx-auto
          transition-all duration-700
          ${
            animate
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }
        `}
        style={{ boxShadow: "0 8px 32px 0 rgba(16,185,129,0.10)" }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Create your account
        </h2>
        <p className="text-gray-500 text-sm mb-7 text-center">
          Sign up to get started
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fullName}
            placeholder="Your full name"
            ariaLabel="Full Name"
            autoComplete="name"
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            placeholder="you@email.com"
            ariaLabel="Email"
            autoComplete="email"
          />
          <div className="relative">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              error={errors.password}
              placeholder="Create a password"
              ariaLabel="Password"
              autoComplete="new-password"
              children={
                <button
                  type="button"
                  tabIndex={-1}
                  className="focus:outline-none"
                  aria-label="Show password requirements"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                >
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l2 2"
                    />
                  </svg>
                </button>
              }
            />
            <PasswordTooltip show={showTooltip} />
          </div>
          <PasswordStrengthBar password={form.password} />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            placeholder="Re-enter your password"
            ariaLabel="Confirm Password"
            autoComplete="new-password"
          />
          <RoleSelect
            value={form.role}
            onChange={handleChange}
            error={errors.role}
          />
          <button
            type="submit"
            className={`w-full py-2.5 mt-2 rounded-md font-semibold text-white text-base transition-all duration-150
              bg-emerald-500 hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:outline-none
              flex items-center justify-center
              ${
                !allValid || submitting
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }
            `}
            disabled={!allValid || submitting}
            aria-label="Register"
          >
            {submitting ? (
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
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-emerald-600 hover:underline transition"
          >
            Already have an account? Login
          </a>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
