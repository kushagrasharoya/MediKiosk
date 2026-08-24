import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverEffect = true,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-[20px] p-5 transition-all duration-300',
        glass
          ? 'bg-white/80 backdrop-blur-md border border-[#9CD1CE]/30 shadow-card-soft'
          : 'bg-white border border-[#D7EAEE] shadow-sm',
        hoverEffect && 'hover:shadow-teal-glow hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
