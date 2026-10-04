/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-accent-500 border-b-accent-500 border-gray-200`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
