import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] text-white hover:from-[#176a67] hover:to-[#359a9d] shadow-md shadow-[#3EAEB1]/20 focus:ring-[#3EAEB1]',
    secondary: 'bg-[#9FD8E1]/30 text-[#1D837F] hover:bg-[#9FD8E1]/50 border border-[#9CD1CE]/50 focus:ring-[#3EAEB1]',
    outline: 'border border-[#3EAEB1] text-[#1D837F] hover:bg-[#3EAEB1]/10 focus:ring-[#3EAEB1]',
    ghost: 'text-[#102A43] hover:bg-[#D7EAEE]/50 focus:ring-[#3EAEB1]',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
};
