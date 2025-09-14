import { useMemo } from 'react';
import SunCalc from 'suncalc';
import { LunarPhase } from '../types';
import { LUNAR_PHASES } from '../components/icons';

export const useLunarPhase = (date: Date): LunarPhase => {
  const lunarPhase = useMemo(() => {
    const illumination = SunCalc.getMoonIllumination(date);
    const phaseValue = illumination.phase;

    // Determine the index for the 8 phases
    // 0: New Moon, 0.25: First Quarter, 0.5: Full Moon, 0.75: Last Quarter
    let index = Math.round(phaseValue * 8);
    if (index >= 8) {
      index = 0; // Wrap around for New Moon
    }
    
    // Adjust index for more accurate phase names based on standard divisions
    if (phaseValue < 0.0625 || phaseValue >= 0.9375) return LUNAR_PHASES[0]; // New Moon
    if (phaseValue < 0.1875) return LUNAR_PHASES[1]; // Waxing Crescent
    if (phaseValue < 0.3125) return LUNAR_PHASES[2]; // First Quarter
    if (phaseValue < 0.4375) return LUNAR_PHASES[3]; // Waxing Gibbous
    if (phaseValue < 0.5625) return LUNAR_PHASES[4]; // Full Moon
    if (phaseValue < 0.6875) return LUNAR_PHASES[5]; // Waning Gibbous
    if (phaseValue < 0.8125) return LUNAR_PHASES[6]; // Last Quarter
    return LUNAR_PHASES[7]; // Waning Crescent

  }, [date]);

  return lunarPhase;
};
