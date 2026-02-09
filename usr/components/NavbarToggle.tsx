import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarToggleProps {
  targetId: string;
}

export const NavbarToggle: React.FC<NavbarToggleProps> = ({ targetId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const target = document.getElementById(targetId);
    if (target) {
      if (target.classList.contains('show')) {
        target.classList.remove('show');
        setIsOpen(false);
      } else {
        target.classList.add('show');
        setIsOpen(true);
      }
    }
  };

  return (
    <button
      className="navbar-toggler border-0 p-2"
      type="button"
      onClick={handleToggle}
      aria-controls={targetId}
      aria-expanded={isOpen}
      aria-label="Toggle navigation"
    >
      {isOpen ? (
        <X size={24} className="text-dark" />
      ) : (
        <Menu size={24} className="text-dark" />
      )}
    </button>
  );
};