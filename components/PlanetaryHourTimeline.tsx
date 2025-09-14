import React from 'react';
import { PlanetaryHour } from '../types';
import { PLANET_ICONS } from './icons';

interface PlanetaryHourTimelineProps {
    hours: PlanetaryHour[];
    currentHour: PlanetaryHour | null;
}

export const PlanetaryHourTimeline: React.FC<PlanetaryHourTimelineProps> = ({ hours, currentHour }) => {
    if (hours.length === 0) {
        return null;
    }

    const dayHours = hours.filter(h => h.type === 'Day');
    const nightHours = hours.filter(h => h.type === 'Night');

    const renderHourBlock = (hour: PlanetaryHour) => {
        const isCurrent = currentHour?.start.getTime() === hour.start.getTime();
        return (
            <div
                key={`${hour.type}-${hour.hour}`}
                title={`${hour.ruler} - ${hour.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${hour.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                className={`flex-1 flex flex-row items-center justify-center p-2 text-xs rounded-md transition-all duration-300 gap-1
                    ${isCurrent ? 'bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] text-gray-900 shadow-lg scale-105' : 'bg-gray-300/50 dark:bg-gray-700/50 hover:bg-gray-400/50 dark:hover:bg-gray-600/50'}`}
            >
                <div className="h-4 w-4">{PLANET_ICONS[hour.ruler]}</div>
                <span className="font-semibold">{hour.hour}</span>
            </div>
        );
    };

    return (
        <div className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-[var(--color-accent-400)]/20 rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-serif font-semibold text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)] mb-2">Day Hours</h3>
            <div className="flex gap-1 mb-4">
                {dayHours.map(renderHourBlock)}
            </div>
            <h3 className="text-lg font-serif font-semibold text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)] mb-2">Night Hours</h3>
            <div className="flex gap-1">
                {nightHours.map(renderHourBlock)}
            </div>
        </div>
    );
};
