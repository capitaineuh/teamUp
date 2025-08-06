import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import HomeIcon from './icons/HomeIcon';
import MessageIcon from './icons/MessageIcon';
import PlusIcon from './icons/PlusIcon';
import ProfileIcon from './icons/ProfileIcon';

import './BottomNavbar.css';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Accueil',
      path: '/',
      icon: HomeIcon
    },
    {
      id: 'organization',
      label: 'Organisation',
      path: '/create-event',
      icon: PlusIcon
    },
    {
      id: 'messages',
      label: 'Messages',
      path: '/messages',
      icon: MessageIcon
    },
    {
      id: 'profile',
      label: 'Profil',
      path: '/profile',
      icon: ProfileIcon
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-navbar">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">
            <item.icon size={20} color="currentColor" />
          </span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavbar;
