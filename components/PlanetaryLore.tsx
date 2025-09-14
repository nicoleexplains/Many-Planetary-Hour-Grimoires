import React, { useState, useMemo, useEffect } from 'react';
import { PLANETARY_DATA_MAP } from '../constants';
import { PlanetaryData } from '../types';
import { InfoCard, InfoRow } from './InfoCard';
import { PLANET_ICONS } from './icons';

const LORE_SEARCH_HISTORY_KEY = 'loreSearchHistory';
const MAX_HISTORY_ITEMS = 5;

// Helper component to highlight search matches within a string.
const HighlightMatches: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <strong key={i} className="bg-[var(--color-accent-500)]/50 dark:bg-[var(--color-accent-400)]/50 rounded px-1 not-italic font-bold">
                        {part}
                    </strong>
                ) : (
                    part
                )
            )}
        </>
    );
};

const PlanetDetailCard: React.FC<{ planet: PlanetaryData; searchTerm: string }> = ({ planet, searchTerm }) => {
    return (
        <InfoCard 
            title={<HighlightMatches text={planet.name} highlight={searchTerm} />} 
            icon={PLANET_ICONS[planet.name]} 
            className="transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-xl"
        >
            <InfoRow label="Archangel" value={planet.angelicRuler} />
            <InfoRow label="Intelligence" value={planet.intelligence} />
            <InfoRow label="Spirit" value={planet.spirit} />
            <InfoRow label="Zodiac Signs" value={<HighlightMatches text={planet.zodiacSigns} highlight={searchTerm} />} />
            
            <div className="pt-2 mt-2 border-t border-[var(--color-accent-600)]/20 dark:border-[var(--color-accent-400)]/20">
                <h4 className="text-gray-600 dark:text-gray-400 font-semibold text-sm mb-2">Attributes:</h4>
                <div className="flex flex-wrap gap-2">
                    {planet.attributes.map(attr => (
                        <span key={attr} className="bg-[var(--color-accent-500)]/20 dark:bg-[var(--color-accent-400)]/20 border border-[var(--color-accent-500)]/50 dark:border-[var(--color-accent-400)]/50 text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)] text-xs font-semibold px-2.5 py-1 rounded-full">
                           <HighlightMatches text={attr} highlight={searchTerm} />
                        </span>
                    ))}
                </div>
            </div>

            {planet.familiarForms && (
                <div className="pt-2 mt-2 border-t border-[var(--color-accent-600)]/20 dark:border-[var(--color-accent-400)]/20">
                    <h4 className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold text-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                            <path d="M7.41 1.943a.75.75 0 0 1 1.18 0l1.25 1.563a.75.75 0 0 0 .59.344h1.62a.75.75 0 0 1 .53 1.28l-1.04 1.04a.75.75 0 0 0-.21.66l.37 1.84a.75.75 0 0 1-1.08.84l-1.6-1.2a.75.75 0 0 0-.7 0l-1.6 1.2a.75.75 0 0 1-1.08-.84l.37-1.84a.75.75 0 0 0-.21-.66l-1.04-1.04a.75.75 0 0 1 .53-1.28h1.62a.75.75 0 0 0 .59-.344l1.25-1.563Z" />
                            <path d="M2.25 10.5a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0v-.25ZM3.5 12a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0V12Zm1.25.75a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0v-.25Zm1.25.75a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0v-.25Zm1.25-.75a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0v-.25Zm1.25-.75a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0v-.25Zm1.25.75a.75.75 0 0 0-1.5 0v.25a.75.75 0 0 0 1.5 0v-.25Zm1.25 1.5a.75.75 0 0 0-1.5 0V15a.75.75 0 0 0 1.5 0v-.25Z" />
                        </svg>
                        Familiar Forms (from Agrippa):
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 pl-2 text-sm space-y-1">
                        {planet.familiarForms.map(form => <li key={form}>{form}</li>)}
                    </ul>
                </div>
            )}

            <div className="pt-2 mt-2 border-t border-[var(--color-accent-600)]/20 dark:border-[var(--color-accent-400)]/20">
                <h4 className="text-gray-600 dark:text-gray-400 font-semibold text-sm mb-1">Mythology:</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{planet.mythology}</p>
            </div>
        </InfoCard>
    );
};


export const PlanetaryLore: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(LORE_SEARCH_HISTORY_KEY);
            if (savedHistory) {
                setSearchHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to load search history from localStorage", e);
        }
    }, []);

    const updateSearchHistory = (term: string) => {
        const cleanedTerm = term.trim().toLowerCase();
        if (!cleanedTerm) return;

        const newHistory = [
            cleanedTerm,
            ...searchHistory.filter(item => item.toLowerCase() !== cleanedTerm)
        ].slice(0, MAX_HISTORY_ITEMS);
        
        setSearchHistory(newHistory);
        localStorage.setItem(LORE_SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearchHistory(searchTerm);
    };

    const handleHistoryClick = (term: string) => {
        setSearchTerm(term);
        updateSearchHistory(term);
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem(LORE_SEARCH_HISTORY_KEY);
    };

    const filteredPlanets = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase().trim();
        if (!lowercasedFilter) {
            return Object.values(PLANETARY_DATA_MAP);
        }
        return Object.values(PLANETARY_DATA_MAP).filter(planet => {
            const nameMatch = planet.name.toLowerCase().includes(lowercasedFilter);
            const zodiacMatch = planet.zodiacSigns.toLowerCase().includes(lowercasedFilter);
            const attributeMatch = planet.attributes.some(attr => attr.toLowerCase().includes(lowercasedFilter));
            return nameMatch || zodiacMatch || attributeMatch;
        });
    }, [searchTerm]);

    return (
        <div className="pt-2">
            <blockquote className="mb-6 p-4 border-l-4 border-[var(--color-accent-600)] dark:border-[var(--color-accent-400)] bg-white/50 dark:bg-gray-800/50 rounded-r-lg shadow">
                <p className="font-serif italic text-gray-700 dark:text-gray-300">
                    "According to the tenets of 'The Magus,' the celestial spheres are governed by astral spirits and intelligences, each with a nature corresponding to its ruling planet. These beings are the conduits of planetary influence, their power waxing and waning with the celestial tides. During a planet's ruling hour, its associated spirits hold dominion, making it the most opportune time to engage in works of Talismanic Magic, for their energies are most potent and accessible to the prepared artisan. Understanding this celestial hierarchy is the key to unlocking the virtues of the heavens."
                </p>
            </blockquote>

            <form onSubmit={handleSearchSubmit} className="mb-4">
                 <label htmlFor="lore-search" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Search the Compendium
                </label>
                <div className="relative">
                     <input
                        id="lore-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, attribute, zodiac..."
                        aria-label="Search Planets"
                        className="bg-gray-200/80 dark:bg-gray-700/80 border border-gray-400 dark:border-gray-600 rounded-md pl-3 pr-10 py-2 text-gray-900 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] dark:focus:ring-[var(--color-accent-400)] transition"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0 -11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </form>

            {searchHistory.length > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                         <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Recent Searches</h4>
                         <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-[var(--color-accent-600)] dark:hover:text-[var(--color-accent-500)] transition-colors">
                             Clear
                         </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {searchHistory.map(term => (
                            <button
                                key={term}
                                onClick={() => handleHistoryClick(term)}
                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {filteredPlanets.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPlanets.map(planet => (
                        <PlanetDetailCard key={planet.name} planet={planet} searchTerm={searchTerm} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">No matching planets found for "{searchTerm}".</p>
            )}
        </div>
    );
};
