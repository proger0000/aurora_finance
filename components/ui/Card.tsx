
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/60 dark:bg-aura-gray-900/50 backdrop-blur-lg rounded-xl border border-aura-gray-200/50 dark:border-aura-gray-800/50 shadow-lg dark:shadow-black/20 p-4 sm:p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
