interface LoadingStateProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  size = 'medium', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-[#F1911B] ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};
