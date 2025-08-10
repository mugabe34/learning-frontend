import { useState } from 'react';
import { MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Chat', href: '/chat' },
  { name: 'Profile', href: '/profile' },
  { name: 'Settings', href: '/settings' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-bold text-2xl text-gray-900 tracking-tight">EduPlatform</span>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 font-medium hover:text-[#1E3A8A] transition-colors px-2 py-1 rounded"
            >
              {link.name}
            </a>
          ))}
        </div>
        {/* User Avatar (right) */}
        <div className="hidden md:flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
        </div>
        {/* Hamburger (mobile) */}
        <div className="md:hidden flex items-center">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <XIcon className="h-7 w-7 text-gray-700" />
            ) : (
              <MenuIcon className="h-7 w-7 text-gray-700" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100 px-4 pb-4 pt-2">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 font-medium hover:text-[#1E3A8A] transition-colors px-2 py-2 rounded"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center mt-2">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-700 font-medium">User</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
