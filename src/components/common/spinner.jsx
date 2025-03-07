import React from 'react';

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };
  
  return (
    <svg
      className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// Loading container with centered spinner and optional message
export const LoadingContainer = ({ message, size = 'lg', color = 'primary', fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex flex-col items-center justify-center py-12';
    
  return (
    <div className={containerClass}>
      <Spinner size={size} color={color} />
      {message && (
        <p className="mt-4 text-gray-600 text-center font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
