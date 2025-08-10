import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import Courses from "./pages/Courses";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import Upload from "./pages/upload";

// --- AuthContext with Real Authentication ---
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// --- Protected Route Wrapper ---
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children ? children : <Outlet />;
}

// --- Layouts ---
function AuthenticatedLayout() {
  // Navbar and Sidebar only for authenticated pages
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 transition-all duration-500">
          {/* Page transitions */}
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

// --- Page Transition Animation ---
function PageTransition({ children }) {
  // Simple fade-in animation
  return (
    <div className="animate-fadein">
      {children}
      <style>{`
        .animate-fadein {
          animation: fadeIn 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}

// --- Navbar Component ---
function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/courses", label: "Courses" },
    { to: "/chat", label: "Chat" },
    { to: "/profile", label: "Profile" },
  ];

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="sticky top-0 z-30 bg-[#1E3A8A] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 text-white font-bold text-lg tracking-wide">
            Learning Platform
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.to}
                to={link.to}
                label={link.label}
                active={isActive(link.to)}
              />
            ))}
            {/* Profile Avatar */}
            <div className="relative ml-4">
              <button
                className="focus:outline-none"
                onClick={() => setProfileOpen((v) => !v)}
              >
                <div className="h-9 w-9 rounded-full border-2 border-emerald-400 shadow bg-emerald-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>
              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-2 ring-1 ring-black ring-opacity-5 animate-dropdown"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-gray-500 capitalize">{user?.role?.toLowerCase()}</div>
                  </div>
                  <DropdownItem to="/profile" label="Profile" />
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                    onClick={logout}
                  >
                    Logout
                  </button>
                  <style>{`
                    .animate-dropdown {
                      animation: dropdownIn 0.18s cubic-bezier(.4,0,.2,1);
                    }
                    @keyframes dropdownIn {
                      from { opacity: 0; transform: translateY(-8px);}
                      to { opacity: 1; transform: translateY(0);}
                    }
                  `}</style>
                </div>
              )}
            </div>
          </div>
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#1E3A8A] px-4 pt-2 pb-4 animate-slidein">
          {navLinks.map((link) => (
            <NavLinkItem
              key={link.to}
              to={link.to}
              label={link.label}
              active={isActive(link.to)}
              onClick={() => setMenuOpen(false)}
              mobile
            />
          ))}
          <div className="mt-2 border-t border-blue-800 pt-2">
            <button
              className="w-full text-left px-2 py-2 text-sm text-red-200 hover:bg-blue-900 rounded transition"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          </div>
          <style>{`
            .animate-slidein {
              animation: slideInMenu 0.22s cubic-bezier(.4,0,.2,1);
            }
            @keyframes slideInMenu {
              from { opacity: 0; transform: translateY(-16px);}
              to { opacity: 1; transform: translateY(0);}
            }
          `}</style>
        </div>
      )}
    </nav>
  );
}

function NavLinkItem({ to, label, active, onClick, mobile }) {
  return (
    <a
      href={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-150
        ${mobile ? "text-white" : "text-white"}
        ${active
          ? "underline underline-offset-8 decoration-4 decoration-emerald-400"
          : "hover:underline hover:underline-offset-8 hover:decoration-emerald-400"}
        hover:bg-blue-800
      `}
      style={active ? { background: "#1E40AF" } : {}}
    >
      {label}
    </a>
  );
}

function DropdownItem({ to, label }) {
  return (
    <a
      href={to}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
    >
      {label}
    </a>
  );
}

// --- Sidebar Component ---
function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Role-based sidebar links
  const getSidebarLinks = () => {
    const baseLinks = [
      { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
      { to: "/courses", label: "Courses", icon: CoursesIcon },
      { to: "/chat", label: "Chat", icon: ChatIcon },
    ];

    // Add teacher-specific links
    if (user?.role === 'TEACHER') {
      baseLinks.push(
        { to: "/upload", label: "Upload Documents", icon: UploadIcon }
      );
    }

    return baseLinks;
  };

  const sidebarLinks = getSidebarLinks();

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <aside
      className={`
        hidden md:flex flex-col bg-white border-r border-gray-200
        transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}
        relative z-20
        animate-sidebar
      `}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <button
        className="absolute -right-3 top-4 bg-emerald-500 text-white rounded-full shadow p-1 transition hover:bg-emerald-600"
        onClick={() => setCollapsed((v) => !v)}
        aria-label="Toggle sidebar"
      >
        <svg
          className={`h-5 w-5 transform transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <nav className="flex-1 mt-8 space-y-1">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            label={link.label}
            Icon={link.icon}
            active={isActive(link.to)}
            collapsed={collapsed}
          />
        ))}
        <button
          className={`flex items-center w-full px-4 py-2 mt-4 text-red-600 hover:bg-gray-100 transition
            ${collapsed ? "justify-center" : ""}
          `}
          onClick={logout}
        >
          <LogoutIcon className="h-5 w-5 mr-0.5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </button>
      </nav>
      <style>{`
        .animate-sidebar {
          animation: sidebarSlideIn 0.28s cubic-bezier(.4,0,.2,1);
        }
        @keyframes sidebarSlideIn {
          from { opacity: 0; transform: translateX(-32px);}
          to { opacity: 1; transform: translateX(0);}
        }
      `}</style>
    </aside>
  );
}

function SidebarLink({ to, label, Icon, active, collapsed }) {
  return (
    <a
      href={to}
      className={`
        flex items-center px-4 py-2 rounded transition-all duration-150
        ${active
          ? "bg-emerald-50 text-emerald-700 font-semibold"
          : "text-gray-700 hover:bg-gray-100"}
        ${collapsed ? "justify-center" : ""}
      `}
      style={active ? { borderLeft: "4px solid #10B981" } : {}}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span className="ml-3">{label}</span>}
    </a>
  );
}

// --- Sidebar Icons ---
function DashboardIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}
function CoursesIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x={3} y={5} width={18} height={14} rx={2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
    </svg>
  );
}
function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4-4.03 7-9 7-1.53 0-2.98-.22-4.24-.62L3 21l1.13-3.38C3.42 16.13 3 14.61 3 13c0-4 4.03-7 9-7s9 3 9 7z" />
    </svg>
  );
}
function UploadIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}
function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
    </svg>
  );
}

// --- Placeholder Pages ---
function LoginPage() {
  return <Login />;
}

function RegisterPage() {
  return <Register />;
}

function DashboardPage() {
  return <Dashboard />;
}

function ProfilePage() {
  return <Profile />;
}

function ChatPage() {
  return <Chat />;
}

function CoursesPage() {
  return <Courses />;
}

function UploadPage() {
  return <Upload />;
}

// --- App Component with Routing ---
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Route>
          </Route>

          {/* Default: redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
