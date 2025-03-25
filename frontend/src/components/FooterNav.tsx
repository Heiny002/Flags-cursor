import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaFlag, FaComments, FaCog, FaPlus } from 'react-icons/fa';

const FooterNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="footer-nav">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/profile" 
          className={`footer-nav-item ${isActive('/profile') ? 'active' : ''}`}
        >
          <FaUser className="text-xl" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        
        <Link 
          to="/flags" 
          className={`footer-nav-item ${isActive('/flags') ? 'active' : ''}`}
        >
          <FaFlag className="text-xl" />
          <span className="text-xs mt-1">Flags</span>
        </Link>

        <Link 
          to="/hot-takes" 
          className={`footer-nav-item ${isActive('/hot-takes') ? 'active' : ''}`}
        >
          <FaPlus className="text-xl" />
          <span className="text-xs mt-1">HotTakes</span>
        </Link>
        
        <Link 
          to="/conversations" 
          className={`footer-nav-item ${isActive('/conversations') ? 'active' : ''}`}
        >
          <FaComments className="text-xl" />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link 
          to="/settings" 
          className={`footer-nav-item ${isActive('/settings') ? 'active' : ''}`}
        >
          <FaCog className="text-xl" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default FooterNav; 