import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function Card({ children, className = '', onClick, onDoubleClick }: CardProps) {
  return (
    <div 
      className={`toss-card ${(onClick || onDoubleClick) ? 'active-bounce clickable' : ''} ${className}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
}
