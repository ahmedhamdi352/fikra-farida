import { ButtonHTMLAttributes } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-[#FEC400] text-black hover:bg-[#FEC400]/90 disabled:opacity-50',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50'
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <LoadingSpinner size={size} color={variant === 'primary' ? 'black' : 'white'} />}
      {children}
    </button>
  );
};

export default LoadingButton;
