import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Courses', href: '/courses' },
  { name: 'Chat', href: '/chat' },
  { name: 'Profile', href: '/profile' },
];

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold text-2xl tracking-tight">Learnify</Link>
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
          {user && links.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className="hover:text-accent font-medium transition"
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <button 
              onClick={onLogout} 
              className="ml-4 bg-error px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="ml-4 bg-accent px-4 py-2 rounded text-primary font-semibold hover:bg-emerald-600 transition"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="ml-2 bg-white text-primary px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
        
        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen(!open)}>
            {open ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
          </button>
        </div>
      </div>
      
      {open && (
        <div className="md:hidden bg-primary px-4 pb-4 flex flex-col gap-3">
          {user && links.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className="hover:text-accent font-medium transition"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <button 
              onClick={() => {
                onLogout();
                setOpen(false);
              }} 
              className="mt-2 bg-error px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="mt-2 bg-accent px-4 py-2 rounded text-primary font-semibold hover:bg-emerald-600 transition"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="mt-2 bg-white text-primary px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
                onClick={() => setOpen(false)}
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
} 