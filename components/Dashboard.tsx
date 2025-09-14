import React, { useState, useCallback } from 'react';
import { PlanetaryHour, PlanetaryData, PlanetName, RitualSuggestion, LunarPhase } from '../types';
import { InfoCard, InfoRow } from './InfoCard';
import { generateInvocation, generateRitualSuggestion } from '../services/geminiService';
import { Loader } from './Loader';
import { TalismanCrafter } from './TalismanCrafter';
import { PLANET_ICONS, LUNAR_PHASES } from './icons';
import { PlanetaryLore } from './PlanetaryLore';
import { OldOnesRituals } from './OldOnesRituals';

const SunIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 3ZM15.707 5.293a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM17.25 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM14.647 15.707a.75.75 0 0 1-1.06 0l-1.06-1.06a.75.75 0 0 1 1.06-1.06l1.06 1.06a.75.75 0 0 1 0 1.06ZM10 17.25a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75ZM6.464 14.646a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 1.06-1.06l1.06 1.06ZM3.5 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM5.354 6.354a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.354 7.414a.75.75 0 0 1 0-1.06ZM10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" /></svg>;
const MoonIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.455 1.055a.75.75 0 0 1 .866.452A8.25 8.25 0 0 0 18.5 9.75a.75.75 0 0 1-1.5 0 6.75 6.75 0 0 1-6.75-6.75.75.75 0 0 1 .452-.866Z" clipRule="evenodd" /></svg>;

interface DashboardProps {
    currentHour: PlanetaryHour | null;
    planetaryData: PlanetaryData | null;
    sunrise: Date | null;
    sunset: Date | null;
    lunarPhase: LunarPhase | null;
}

type ActiveTab = 'lore' | 'invocation' | 'ritual' | 'talisman' | 'oldOnes';

export const Dashboard: React.FC<DashboardProps> = ({ currentHour, planetaryData, sunrise, sunset, lunarPhase }) => {
    const [invocation, setInvocation] = useState<string>('');
    const [isInvocationLoading, setIsInvocationLoading] = useState<boolean>(false);
    const [ritual, setRitual] = useState<RitualSuggestion | string | null>(null);
    const [isRitualLoading, setIsRitualLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('lore');
    const [ritualFocus, setRitualFocus] = useState<string>('');

    const handleGenerateInvocation = useCallback(async () => {
        if (!planetaryData) return;
        setIsInvocationLoading(true);
        setInvocation('');
        const result = await generateInvocation(planetaryData);
        setInvocation(result);
        setIsInvocationLoading(false);
    }, [planetaryData]);

     const handleGenerateRitual = useCallback(async () => {
        if (!planetaryData) return;
        setIsRitualLoading(true);
        setRitual(null);
        const result = await generateRitualSuggestion(planetaryData, ritualFocus);
        setRitual(result);
        setIsRitualLoading(false);
    }, [planetaryData, ritualFocus]);


    if (!currentHour || !planetaryData) {
        return (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <p className="font-serif text-xl">Calculating celestial alignments...</p>
            </div>
        );
    }

    const { ruler, start, end, type, hour } = currentHour;
    const { angelicRuler, zodiacSigns, intelligence, spirit, attributes } = planetaryData;

    const renderTabButton = (tabName: ActiveTab, label: string) => (
        <button
            onClick={() => setActiveTab(tabName)}
            aria-selected={activeTab === tabName}
            role="tab"
            className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${activeTab === tabName ? 'text-[var(--color-accent-600)] dark:text-[var(--color-accent-400)] border-b-2 border-[var(--color-accent-600)] dark:border-[var(--color-accent-400)]' : 'text-gray-600 dark:text-gray-400 hover:text-[var(--color-accent-700)] dark:hover:text-[var(--color-accent-500)]'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <header className="text-center p-6 bg-white/30 dark:bg-gray-900/30 rounded-lg border border-gray-300/50 dark:border-[var(--color-accent-400)]/20">
                <h1 className="text-5xl font-serif text-[var(--color-accent-600)] dark:text-[var(--color-accent-400)] tracking-wider">{ruler}</h1>
                <p className="text-gray-700 dark:text-gray-300 text-lg mt-2">
                    Governs the {hour}{hour === 1 ? 'st' : hour === 2 ? 'nd' : hour === 3 ? 'rd' : 'th'} {type} Hour
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Planetary Ruler" icon={PLANET_ICONS[ruler]}>
                    <InfoRow label="Archangel" value={angelicRuler} />
                    <InfoRow label="Zodiac Signs" value={zodiacSigns} />
                </InfoCard>

                <InfoCard title="Celestial Beings" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>}>
                    <InfoRow label="Intelligence" value={intelligence} />
                    <InfoRow label="Spirit" value={spirit} />
                </InfoCard>
                
                 <InfoCard title="Day's Luminaries" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 5Zm-2.322 1.348a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06ZM14.65 6.354a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM10 12.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" /><path d="M3.75 14.25a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" /></svg>}>
                   <InfoRow label="Sunrise" value={
                       <span className="flex items-center justify-end gap-2">
                           {SunIcon} {sunrise?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? 'N/A'}
                       </span>
                   } />
                    <InfoRow label="Sunset" value={
                        <span className="flex items-center justify-end gap-2">
                           {MoonIcon} {sunset?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? 'N/A'}
                       </span>
                    } />
                </InfoCard>

                <InfoCard title="Magical Attributes" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.435 4.065a.75.75 0 0 1 1.13 0l2.5 3.25a.75.75 0 0 1-.565 1.185H6.5a.75.75 0 0 1-.565-1.185l2.5-3.25Z" /><path d="M6.5 11.5a.75.75 0 0 0-.565 1.185l2.5 3.25a.75.75 0 0 0 1.13 0l2.5-3.25a.75.75 0 0 0-.565-1.185H6.5Z" /></svg>} className="lg:col-span-2">
                    <p className="text-gray-700 dark:text-gray-300 italic">{attributes.join(', ')}</p>
                </InfoCard>

                {lunarPhase && (
                    <InfoCard title="Lunar Phase" icon={lunarPhase.icon}>
                         <p className="text-center text-lg font-semibold text-gray-800 dark:text-gray-300">{lunarPhase.name}</p>
                    </InfoCard>
                )}


                <div className="lg:col-span-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-[var(--color-accent-400)]/20 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-serif font-semibold text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)] mb-4">Celestial Guidance</h3>
                    <div className="flex border-b border-[var(--color-accent-600)]/30 dark:border-[var(--color-accent-400)]/20 mb-4 overflow-x-auto">
                        {renderTabButton('lore', 'Compendium')}
                        {renderTabButton('invocation', 'Invocation')}
                        {renderTabButton('ritual', 'Ritual')}
                        {renderTabButton('talisman', 'Talisman')}
                        {renderTabButton('oldOnes', "Old Ones' Rituals")}
                    </div>
                    
                    <div role="tabpanel">
                        {activeTab === 'lore' && <PlanetaryLore />}

                        {activeTab === 'invocation' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">Generate a poetic invocation for the hour.</p>
                                    <button
                                        onClick={handleGenerateInvocation}
                                        disabled={isInvocationLoading}
                                        className="bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-[var(--color-accent-600)] dark:hover:bg-[var(--color-accent-500)] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isInvocationLoading ? 'Generating...' : 'Generate'}
                                    </button>
                                </div>
                                {isInvocationLoading && <Loader />}
                                {invocation && (
                                    <div className="text-gray-800 dark:text-gray-300 font-serif text-lg whitespace-pre-wrap border-l-2 border-[var(--color-accent-600)]/50 dark:border-[var(--color-accent-400)]/50 pl-4">
                                        {invocation}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'ritual' && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="ritual-focus" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Optional: Add a specific focus
                                    </label>
                                    <input
                                        id="ritual-focus"
                                        type="text"
                                        value={ritualFocus}
                                        onChange={(e) => setRitualFocus(e.target.value)}
                                        placeholder="e.g., Prosperity, Protection, Creativity..."
                                        aria-label="Ritual Focus"
                                        className="bg-gray-200/80 dark:bg-gray-700/80 border border-gray-400 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] dark:focus:ring-[var(--color-accent-400)] transition"
                                    />
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">Generate a simple, modern ritual for the hour.</p>
                                    <button
                                        onClick={handleGenerateRitual}
                                        disabled={isRitualLoading}
                                        className="bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-[var(--color-accent-600)] dark:hover:bg-[var(--color-accent-500)] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isRitualLoading ? 'Generating...' : 'Suggest Ritual'}
                                    </button>
                                </div>
                                {isRitualLoading && <Loader />}
                                {ritual && (
                                    typeof ritual === 'string' ? (
                                        <div className="text-red-500 dark:text-red-400 font-serif text-lg whitespace-pre-wrap border-l-2 border-red-500/50 dark:border-red-400/50 pl-4">
                                            {ritual}
                                        </div>
                                    ) : (
                                        <div className="text-gray-800 dark:text-gray-300 space-y-4">
                                            <h4 className="text-2xl font-serif text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)]">{ritual.title}</h4>
                                            <p className="italic">"{ritual.objective}"</p>
                                            <div>
                                                <h5 className="font-semibold text-gray-800 dark:text-gray-200">Materials:</h5>
                                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 pl-2">
                                                    {ritual.materials.map((item, index) => <li key={index}>{item}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-800 dark:text-gray-200">Steps:</h5>
                                                <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 pl-2 space-y-1">
                                                    {ritual.steps.map((step, index) => <li key={index}>{step}</li>)}
                                                </ol>
                                            </div>
                                            <p className="pt-2 border-t border-[var(--color-accent-600)]/20 dark:border-[var(--color-accent-400)]/20 italic text-sm text-gray-600 dark:text-gray-400">
                                                {ritual.finalThought}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {activeTab === 'talisman' && (
                            <div className="pt-4">
                                <TalismanCrafter currentHour={currentHour} planetaryData={planetaryData} />
                            </div>
                        )}

                        {activeTab === 'oldOnes' && <OldOnesRituals />}
                    </div>

                </div>
            </div>
        </div>
    );
};
