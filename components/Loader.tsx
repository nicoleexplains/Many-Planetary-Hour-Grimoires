import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-2 h-2 rounded-full bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] animate-pulse"></div>
      <span className="ml-3 text-gray-700 dark:text-gray-300">Consulting the ether...</span>
    </div>
  );
};
