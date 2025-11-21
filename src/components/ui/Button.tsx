import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'luxury' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'luxury',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full';

  const variantStyles = {
    luxury: 'bg-gradient-to-r from-ocean to-midnight dark:from-gold dark:to-yellow-600 text-white shadow-lg hover:shadow-2xl hover:scale-105',
    outline: 'border-2 border-ocean dark:border-gold text-ocean dark:text-gold hover:bg-ocean/10 dark:hover:bg-gold/10',
    ghost: 'text-ocean dark:text-gold hover:bg-ocean/5 dark:hover:bg-gold/5',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
