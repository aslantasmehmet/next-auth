interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
}

// Loading Spinner - Single Responsibility: Sadece yükleme gösterimi
export default function LoadingSpinner({ 
  size = "md", 
  message = "Yükleniyor...", 
  fullScreen = false 
}: LoadingSpinnerProps) {
  
  // Size mapping - Open/Closed: Yeni boyutlar eklenebilir
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );

  // Full screen wrapper
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
} 