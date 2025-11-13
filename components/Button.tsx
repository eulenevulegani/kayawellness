import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 hover:opacity-90 shadow-lg shadow-cyan-500/30 hover:scale-105',
    secondary: 'bg-white text-black hover:bg-white/90 shadow-lg hover:scale-105',
    ghost: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30'
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
