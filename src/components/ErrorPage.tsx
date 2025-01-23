import React from 'react';

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message = "An unexpected error occurred.", onRetry }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorPage; 