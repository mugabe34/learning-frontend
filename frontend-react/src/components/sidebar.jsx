import React, { useState } from "react";
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  BookOpenIcon,
  ChatAlt2Icon,
  UserCircleIcon,
  CogIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

const navLinks = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Courses",
    to: "/courses",
    icon: BookOpenIcon,
  },
  {
    name: "Chat",
    to: "/chat",
    icon: ChatAlt2Icon,
  },
  {
    name: "Profile",
    to: "/profile",
    icon: UserCircleIcon,
  },
  {
    name: "Settings",
    to: "/settings",
    icon: CogIcon,
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(window.innerWidth >= 768);

  // Responsive: auto-collapse on small screens
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full p-2 shadow focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        type="button"
      >
        {open ? (
          <XIcon className="h-6 w-6 text-[#1E3A8A]" />
        ) : (
          <MenuIcon className="h-6 w-6 text-[#1E3A8A]" />
        )}
      </button>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40 bg-[#1E3A8A] flex flex-col justify-between
          transition-all duration-300
          ${open ? "w-[250px]" : "w-16"}
          ${open ? "shadow-xl" : ""}
        `}
      >
        {/* Top: Logo and nav */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start h-16 px-4 border-b border-blue-900">
            <span
              className={`text-white font-bold text-xl tracking-tight transition-all duration-300 ${
                open ? "opacity-100 ml-2" : "opacity-0 ml-0 w-0 overflow-hidden"
              }`}
              style={{ transitionProperty: "opacity, margin, width" }}
            >
              EduPlatform
            </span>
            <AcademicCapIcon
              className="h-8 w-8 text-emerald-400"
              aria-hidden="true"
            />
          </div>
          {/* Navigation */}
          <nav className="flex-1 mt-4">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3 px-4 py-3 mx-2 rounded-lg
                        transition-colors duration-200
                        ${
                          isActive
                            ? "bg-emerald-500 text-white"
                            : "text-blue-100 hover:bg-blue-800 hover:text-white"
                        }
                        `
                      }
                      end
                    >
                      <Icon className="h-6 w-6 flex-shrink-0" />
                      <span
                        className={`text-base font-medium transition-all duration-200 ${
                          open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                        }`}
                        style={{ transitionProperty: "opacity, width" }}
                      >
                        {link.name}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Bottom: Logout */}
        <div className="mb-4">
          <button
            className={`
              flex items-center gap-3 px-4 py-3 mx-2 rounded-lg w-full
              text-blue-100 hover:bg-blue-800 hover:text-white
              transition-colors duration-200
              focus:outline-none
            `}
            type="button"
            onClick={() => {
              // Placeholder: Add logout logic here
              alert("Logged out!");
            }}
          >
            <LogoutIcon className="h-6 w-6 flex-shrink-0" />
            <span
              className={`text-base font-medium transition-all duration-200 ${
                open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
              style={{ transitionProperty: "opacity, width" }}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

// Heroicons AcademicCapIcon (since not imported above)
function AcademicCapIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0c-4.418 0-8-1.79-8-4V10m8 10c4.418 0 8-1.79 8-4V10"
      />
    </svg>
  );
}
