export enum PlanetName {
  Sun = 'Sun',
  Moon = 'Moon',
  Mars = 'Mars',
  Mercury = 'Mercury',
  Jupiter = 'Jupiter',
  Venus = 'Venus',
  Saturn = 'Saturn',
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface PlanetaryData {
  name: PlanetName;
  angelicRuler: string;
  zodiacSigns: string;
  intelligence: string;
  spirit: string;
  attributes: string[];
  mythology: string;
  metal: string;
  familiarForms: string[];
}

export interface PlanetaryHour {
  hour: number;
  type: 'Day' | 'Night';
  start: Date;
  end: Date;
  ruler: PlanetName;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface RitualSuggestion {
  title: string;
  objective: string;
  materials: string[];
  steps: string[];
  finalThought: string;
}

export interface LunarPhase {
  name: string;
  icon: JSX.Element;
}

export interface Talisman {
  planet: PlanetName;
  material: string;
  intent: string;
  versicle: string;
  description: string;
}
