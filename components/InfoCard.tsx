import React from 'react';

interface InfoCardProps {
    title: React.ReactNode;
    icon?: JSX.Element;
    children: React.ReactNode;
    className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, className = '' }) => {
    return (
        <div className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-[var(--color-accent-400)]/20 rounded-lg p-6 shadow-lg ${className}`}>
            <div className="flex items-center mb-4">
                {icon && <div className="text-[var(--color-accent-600)] dark:text-[var(--color-accent-400)] mr-3">{icon}</div>}
                <h3 className="text-xl font-serif font-semibold text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)]">{title}</h3>
            </div>
            <div className="text-gray-800 dark:text-gray-300 space-y-2">
                {children}
            </div>
        </div>
    );
};

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between items-start">
            <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">{label}:</span>
            <span className="text-right text-gray-900 dark:text-gray-200 text-base">{value}</span>
        </div>
    );
};