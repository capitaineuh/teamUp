import React from 'react';
import './Screen.css';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
}

const Screen: React.FC<ScreenProps> = ({ children, className }) => {
  return (
    <div className={`screen-container ${className || ''}`}>{children}</div>
  );
};

export default Screen;
