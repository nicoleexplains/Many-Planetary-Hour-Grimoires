
import React, { useState, useCallback } from 'react';
import { PlanetaryHour, PlanetaryData, Talisman, PlanetName } from '../types';
import { generateTalismanInfo } from '../services/geminiService';
import { Loader } from './Loader';
import { PLANETARY_DATA_MAP } from '../constants';

const PLANET_SEALS: Record<PlanetName, JSX.Element> = {
    [PlanetName.Saturn]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M25 75 L75 25 M75 75 L25 25 M20 50 L80 50 M50 20 L50 80" /></svg>,
    [PlanetName.Jupiter]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M25 50 L75 50 M25 70 L55 70 M50 30 L50 70 M55 30 L75 50 L55 70" /></svg>,
    [PlanetName.Mars]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M50 20 L50 80 M25 50 L75 50 M25 20 L75 80 M25 80 L75 20" /></svg>,
    [PlanetName.Sun]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="50" cy="50" r="30" /><path d="M50 20 L50 80 M20 50 L80 50 M30 30 L70 70 M30 70 L70 30" /></svg>,
    [PlanetName.Venus]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M50 25 L50 75 M25 50 L75 50 M25 25 L75 75 M25 75 L75 25" /></svg>,
    [PlanetName.Mercury]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M25 25 L75 75 M75 25 L25 75 M25 50 L75 50 M50 25 L50 75" /></svg>,
    [PlanetName.Moon]: <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4"><path d="M50 20 L50 80 M20 50 L80 50 M30 30 L70 70 M70 30 L30 70" /></svg>,
};

const METAL_COLORS: Record<string, string> = {
    'Gold': 'var(--color-accent-500)',
    'Silver': '#c0c0c0',
    'Iron': '#a19d94',
    'Quicksilver': '#e0e0e0',
    'Tin': '#d4d4d8',
    'Copper': '#b87333',
    'Lead': '#78716c',
};

interface TalismanCrafterProps {
    currentHour: PlanetaryHour | null;
    planetaryData: PlanetaryData | null;
}

export const TalismanCrafter: React.FC<TalismanCrafterProps> = ({ currentHour, planetaryData }) => {
    const [intent, setIntent] = useState('');
    const [talisman, setTalisman] = useState<Talisman | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCraftTalisman = useCallback(async () => {
        if (!planetaryData || !intent) {
            setError("Please state your intent before crafting.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setTalisman(null);

        const result = await generateTalismanInfo(planetaryData, intent);

        if (typeof result === 'string') {
            setError(result);
        } else {
            setTalisman({
                planet: planetaryData.name,
                material: planetaryData.metal,
                intent,
                ...result,
            });
        }
        setIsLoading(false);
    }, [planetaryData, intent]);

    const handleRecraft = () => {
        setTalisman(null);
        setError(null);
        // Keep intent for easy re-rolling
    };

    if (!currentHour || !planetaryData) {
        return <div className="p-4 text-center text-gray-600 dark:text-gray-400">The celestial forge is dormant. Please wait for the planetary hour to be calculated.</div>;
    }

    return (
        <div className="p-4">
            {!talisman && !isLoading && (
                 <div>
                    <p className="text-center mb-4 text-gray-700 dark:text-gray-300">The current hour is governed by <strong className="font-semibold text-[var(--color-accent-600)] dark:text-[var(--color-accent-400)]">{planetaryData.name}</strong>. State your intention to craft a talisman under its influence.</p>
                    <div className="flex flex-col gap-4">
                        <label htmlFor="talisman-intent" className="sr-only">Your Intent</label>
                        <textarea
                            id="talisman-intent"
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                            placeholder="e.g., 'To foster a new friendship' or 'For success in my upcoming examination.'"
                            rows={3}
                            className="bg-gray-200/80 dark:bg-gray-700/80 border border-gray-400 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] dark:focus:ring-[var(--color-accent-400)] transition"
                        />
                         <button
                            onClick={handleCraftTalisman}
                            disabled={!intent.trim()}
                            className="w-full bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] text-gray-900 font-bold py-3 px-4 rounded-md hover:bg-[var(--color-accent-600)] dark:hover:bg-[var(--color-accent-500)] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                           Craft Talisman
                        </button>
                    </div>
                </div>
            )}
            
            {isLoading && <Loader />}
            {error && <p className="text-center text-red-500 dark:text-red-400 py-4">{error}</p>}

            {talisman && (
                <div className="space-y-6 text-center">
                     <div className="flex justify-center">
                        <div className="w-48 h-48 p-4 rounded-full border-4" style={{ borderColor: METAL_COLORS[talisman.material] || 'currentColor' }}>
                           <div className="w-full h-full text-gray-800 dark:text-gray-200">
                                {PLANET_SEALS[talisman.planet]}
                           </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-[var(--color-accent-600)] dark:text-[var(--color-accent-400)]">Talisman of {talisman.planet}</h3>
                         <p className="text-sm text-gray-600 dark:text-gray-400">
                            For the Intent: <em className="font-semibold">"{talisman.intent}"</em>
                        </p>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                             <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Material</p>
                             <p className="text-lg font-serif">{talisman.material}</p>
                        </div>
                         <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                             <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">Versicle for Inscription</p>
                            <p className="font-serif text-lg italic">"{talisman.versicle}"</p>
                        </div>
                         <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg text-left">
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Description</p>
                            <p className="text-gray-800 dark:text-gray-300 leading-relaxed font-serif whitespace-pre-wrap">{talisman.description}</p>
                        </div>
                    </div>
                     <button
                        onClick={handleRecraft}
                        className="w-full sm:w-auto bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                        Recraft
                    </button>
                </div>
            )}
        </div>
    );
};