import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePlanetaryHours } from './hooks/usePlanetaryHours';
import { useLunarPhase } from './hooks/useLunarPhase';
import { Location } from './types';
import { PLANETARY_DATA_MAP, ACCENT_COLORS } from './constants';
import { Dashboard } from './components/Dashboard';
import { PlanetaryHourTimeline } from './components/PlanetaryHourTimeline';

const GRIMOIRE_SETTINGS_KEY = 'grimoireSettings';

interface AppSettings {
    location: Location;
    theme: 'light' | 'dark';
    accent: string;
}

const getDefaultSettings = (): AppSettings => {
    const savedSettings = localStorage.getItem(GRIMOIRE_SETTINGS_KEY);
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            // Basic validation
            if (parsed.location && typeof parsed.location.latitude === 'number') {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse settings from localStorage", e);
        }
    }
    return {
        location: { latitude: 51.5074, longitude: -0.1278 },
        theme: 'dark',
        accent: 'gold',
    };
};


const App: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>(getDefaultSettings);
    const { location, theme, accent } = settings;

    const [latInput, setLatInput] = useState(location.latitude.toString());
    const [lonInput, setLonInput] = useState(location.longitude.toString());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [locationStatus, setLocationStatus] = useState<string>('');
    const [locationName, setLocationName] = useState<string>('Loading location...');
    
    // Effect to persist settings to localStorage
    useEffect(() => {
        try {
            const serializedSettings = JSON.stringify(settings);
            localStorage.setItem(GRIMOIRE_SETTINGS_KEY, serializedSettings);
        } catch (e) {
            console.error("Failed to save settings to localStorage", e);
        }
    }, [settings]);

    const fetchLocationName = useCallback(async (latitude: number, longitude: number) => {
        setLocationName('Fetching location name...');
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
                throw new Error('Failed to fetch location name');
            }
            const data = await response.json();
            const { city, town, village, country } = data.address;
            const name = city || town || village || 'Unknown Location';
            setLocationName(`${name}, ${country}`);
            setLocationStatus('');
        } catch (error) {
            console.error(error);
            setLocationName('Could not determine location name');
            setLocationStatus('Could not determine location name from coordinates.');
        }
    }, []);
    
    // Effect to apply theme and accent and fetch location name
    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        const colors = ACCENT_COLORS[accent];
        if (colors) {
            for (const [key, value] of Object.entries(colors)) {
                root.style.setProperty(`--color-accent-${key}`, value);
            }
        }

        fetchLocationName(location.latitude, location.longitude);

    }, [theme, accent, location, fetchLocationName]);
    
    const setSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const toggleTheme = () => {
        setSetting('theme', theme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // Update every second for the clock
        return () => clearInterval(timer);
    }, []);

    const { sunrise, sunset, planetaryHours, currentHour } = usePlanetaryHours(currentDate, location);
    const lunarPhase = useLunarPhase(currentDate);
    
    const planetaryData = useMemo(() => {
        if (currentHour) {
            return PLANETARY_DATA_MAP[currentHour.ruler];
        }
        return null;
    }, [currentHour]);

    const handleLocationUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const lat = parseFloat(latInput);
        const lon = parseFloat(lonInput);
        if (!isNaN(lat) && !isNaN(lon)) {
            setSetting('location', { latitude: lat, longitude: lon });
        } else {
            setLocationStatus("Please enter valid numerical values for latitude and longitude.");
        }
    };
    
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus("Geolocation is not supported by your browser.");
            return;
        }

        setLocationStatus("Attempting to retrieve your location...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatInput(latitude.toString());
                setLonInput(longitude.toString());
                setSetting('location', { latitude, longitude });
            },
            () => {
                setLocationStatus("Unable to retrieve your location. Please enter it manually.");
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
            <div className="min-h-screen bg-white/70 dark:bg-black/70 backdrop-blur-sm">
                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                   <header className="flex justify-between items-center flex-wrap gap-4">
                        <h1 className="text-3xl font-serif text-gray-800 dark:text-gray-200">Planetary Hour Grimoire</h1>
                        <div className="flex items-center gap-4 flex-wrap">
                             <div className="flex items-center gap-2">
                               {Object.keys(ACCENT_COLORS).map(colorKey => (
                                    <button
                                        key={colorKey}
                                        onClick={() => setSetting('accent', colorKey)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 focus:outline-none ${accent === colorKey ? 'ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800 ring-[var(--color-accent-500)]' : 'hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500'}`}
                                        style={{ backgroundColor: ACCENT_COLORS[colorKey]['500'] }}
                                        aria-label={`Set accent color to ${colorKey}`}
                                        aria-pressed={accent === colorKey}
                                        title={`Set accent to ${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}`}
                                    >
                                        {accent === colorKey && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white drop-shadow-sm">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                               ))}
                            </div>
                            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[var(--color-accent-400)]"><path d="M10 3a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 3ZM15.707 5.293a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM17.25 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM14.647 15.707a.75.75 0 0 1-1.06 0l-1.06-1.06a.75.75 0 0 1 1.06-1.06l1.06 1.06a.75.75 0 0 1 0 1.06ZM10 17.25a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75-.75ZM6.464 14.646a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 1.06-1.06l1.06 1.06ZM3.5 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM5.354 6.354a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.354 7.414a.75.75 0 0 1 0-1.06ZM10 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[var(--color-accent-600)]">
                                        <path fillRule="evenodd" d="M7.455 1.055a.75.75 0 0 1 .866.452A8.25 8.25 0 0 0 18.5 9.75a.75.75 0 0 1-1.5 0 6.75 6.75 0 0 1-6.75-6.75.75.75 0 0 1 .452-.866Z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <div className="text-right">
                                <p className="text-xl text-gray-800 dark:text-gray-200 font-semibold">{currentDate.toLocaleTimeString()}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                   </header>

                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-[var(--color-accent-400)]/20 rounded-lg p-4 shadow-lg">
                        <form onSubmit={handleLocationUpdate} className="flex flex-col sm:flex-row items-center gap-4">
                            <h3 className="text-lg font-serif text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)] whitespace-nowrap">Celestial Coordinates</h3>
                            <div className="flex-grow w-full">
                                <label htmlFor="latitude" className="sr-only">Latitude</label>
                                <input
                                    id="latitude"
                                    type="text"
                                    value={latInput}
                                    onChange={(e) => setLatInput(e.target.value)}
                                    placeholder="Latitude"
                                    aria-label="Latitude"
                                    className="bg-gray-200/80 dark:bg-gray-700/80 border border-gray-400 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] dark:focus:ring-[var(--color-accent-400)] transition"
                                />
                            </div>
                            <div className="flex-grow w-full">
                                <label htmlFor="longitude" className="sr-only">Longitude</label>
                                <input
                                    id="longitude"
                                    type="text"
                                    value={lonInput}
                                    onChange={(e) => setLonInput(e.target.value)}
                                    placeholder="Longitude"
                                    aria-label="Longitude"
                                    className="bg-gray-200/80 dark:bg-gray-700/80 border border-gray-400 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] dark:focus:ring-[var(--color-accent-400)] transition"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                                <button
                                    type="submit"
                                    className="bg-[var(--color-accent-500)] dark:bg-[var(--color-accent-400)] text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-[var(--color-accent-600)] dark:hover:bg-[var(--color-accent-500)] transition-colors w-full"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    className="p-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                    title="Use My Location"
                                    aria-label="Use My Location"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.307-.066l.003-.001a18.237 18.237 0 0 0 5.223-3.238l.001-.001a18.12 18.12 0 0 0 3.239-5.224l.001-.003c.086-.2.065-.307.065-.307s-.02-.11-.066-.307l-.001-.003a18.12 18.12 0 0 0-3.239-5.224l-.001-.001a18.238 18.238 0 0 0-5.223-3.238l-.003-.001C10.11 1.02 10 1 10 1s-.11.02-.307.066l-.003.001a18.237 18.237 0 0 0-5.223 3.238l-.001-.001A18.12 18.12 0 0 0 1.226 9.52l-.001.003C1.139 9.72 1.16 9.89 1.16 9.89s.02.11.066.307l.001.003a18.12 18.12 0 0 0 3.239 5.224l.001.001a18.238 18.238 0 0 0 5.223 3.238ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                         <div className="text-center mt-3">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{locationName}</p>
                            {locationStatus && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{locationStatus}</p>}
                        </div>
                    </div>

                    <Dashboard currentHour={currentHour} planetaryData={planetaryData} sunrise={sunrise} sunset={sunset} lunarPhase={lunarPhase} />

                    <PlanetaryHourTimeline hours={planetaryHours} currentHour={currentHour} />

                </main>
            </div>
        </div>
    );
};

export default App;
