import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  ChatAlt2Icon, 
  BookOpenIcon,
  CogIcon
} from '@heroicons/react/outline';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Courses', href: '/courses', icon: BookOpenIcon },
  { name: 'Chat', href: '/chat', icon: ChatAlt2Icon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-primary text-white w-56 min-h-screen py-8 px-4 hidden md:flex flex-col gap-4 sticky top-0">
      <div className="font-bold text-xl mb-8">Learnify</div>
      {links.map(link => (
        <Link
          key={link.name}
          to={link.href}
          className={`flex items-center gap-3 px-3 py-2 rounded transition font-medium ${
            location.pathname === link.href 
              ? 'bg-accent text-primary' 
              : 'hover:bg-blue-800'
          }`}
        >
          <link.icon className="h-6 w-6" />
          {link.name}
        </Link>
      ))}
    </aside>
  );
} 