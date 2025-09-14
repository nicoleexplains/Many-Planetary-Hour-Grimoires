import { useState, useEffect } from 'react';
import SunCalc from 'suncalc';
import { PlanetaryHour, Location, DayOfWeek } from '../types';
import { DAY_RULERS, CHALDEAN_ORDER } from '../constants';

export const usePlanetaryHours = (date: Date, location: Location) => {
    const [sunrise, setSunrise] = useState<Date | null>(null);
    const [sunset, setSunset] = useState<Date | null>(null);
    const [planetaryHours, setPlanetaryHours] = useState<PlanetaryHour[]>([]);
    const [currentHour, setCurrentHour] = useState<PlanetaryHour | null>(null);

    useEffect(() => {
        const calculateHours = () => {
            const now = date; // 'date' is the current time from App state

            // Get times for today based on the current time
            const todayTimes = SunCalc.getTimes(now, location.latitude, location.longitude);
            const todaySunrise = todayTimes.sunrise;
            
            let calculationDate: Date;
            let daySunrise: Date;
            let daySunset: Date;
            let nextDaySunrise: Date;

            if (now < todaySunrise) {
                // If it's before today's sunrise, we are in the night hours of the *previous* planetary day.
                // The calculations should be based on yesterday's sunrise.
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                calculationDate = yesterday;

                const yesterdayTimes = SunCalc.getTimes(yesterday, location.latitude, location.longitude);
                daySunrise = yesterdayTimes.sunrise;
                daySunset = yesterdayTimes.sunset;
                // The end of yesterday's planetary day is today's sunrise
                nextDaySunrise = todaySunrise;
            } else {
                // If it's after today's sunrise, we are in the current planetary day.
                calculationDate = now;
                daySunrise = todaySunrise;
                daySunset = todayTimes.sunset;

                const tomorrow = new Date(now);
                tomorrow.setDate(now.getDate() + 1);
                nextDaySunrise = SunCalc.getTimes(tomorrow, location.latitude, location.longitude).sunrise;
            }
            
            setSunrise(daySunrise);
            setSunset(daySunset);

            if (!daySunrise || !daySunset || !nextDaySunrise) {
                setPlanetaryHours([]);
                setCurrentHour(null);
                return;
            }

            const dayDuration = (daySunset.getTime() - daySunrise.getTime()) / 12;
            const nightDuration = (nextDaySunrise.getTime() - daySunset.getTime()) / 12;

            // The day's ruler is based on the day of the week of the sunrise that started this cycle.
            const dayOfWeek = calculationDate.getDay() as DayOfWeek;
            const dayRuler = DAY_RULERS[dayOfWeek];
            const rulerIndex = CHALDEAN_ORDER.indexOf(dayRuler);

            const hours: PlanetaryHour[] = [];

            // Day Hours
            for (let i = 0; i < 12; i++) {
                const start = new Date(daySunrise.getTime() + i * dayDuration);
                const end = new Date(daySunrise.getTime() + (i + 1) * dayDuration);
                const ruler = CHALDEAN_ORDER[(rulerIndex + i) % CHALDEAN_ORDER.length];
                hours.push({ hour: i + 1, type: 'Day', start, end, ruler });
            }

            // Night Hours
            for (let i = 0; i < 12; i++) {
                const start = new Date(daySunset.getTime() + i * nightDuration);
                const end = new Date(daySunset.getTime() + (i + 1) * nightDuration);
                const ruler = CHALDEAN_ORDER[(rulerIndex + 12 + i) % CHALDEAN_ORDER.length];
                hours.push({ hour: i + 1, type: 'Night', start, end, ruler });
            }
            
            setPlanetaryHours(hours);

            const current = hours.find(h => now >= h.start && now < h.end);
            setCurrentHour(current || null);
        };

        calculateHours();
        
        const interval = setInterval(calculateHours, 60000); // Recalculate every minute
        return () => clearInterval(interval);

    }, [date, location]);

    return { sunrise, sunset, planetaryHours, currentHour };
};