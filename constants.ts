import { PlanetName, DayOfWeek, PlanetaryData } from './types';

export const PLANETARY_DATA_MAP: { [key in PlanetName]: PlanetaryData } = {
  [PlanetName.Sun]: {
    name: PlanetName.Sun,
    angelicRuler: 'Michael',
    zodiacSigns: 'Leo',
    intelligence: 'Nakhiel',
    spirit: 'Sorath',
    attributes: ['Health', 'Success', 'Power', 'Wealth', 'Fame', 'Leadership'],
    mythology: 'Associated with Apollo, Helios, and Ra. Represents vitality, consciousness, the self, and creative energy.',
    metal: 'Gold',
    familiarForms: [
        "A King having a Scepter, riding on a Lion",
        "A King crowned",
        "A Queen with a Scepter",
        "A Bird",
        "A Lion",
        "A Cock",
        "A yellow or golden Garment",
        "A Scepter"
    ]
  },
  [PlanetName.Moon]: {
    name: PlanetName.Moon,
    angelicRuler: 'Gabriel',
    zodiacSigns: 'Cancer',
    intelligence: 'Malkiel or Malcha',
    spirit: 'Chasmodai or Hasmodai',
    attributes: ['Emotions', 'Intuition', 'Dreams', 'Home Life', 'Healing', 'Divination'],
    mythology: 'Linked to Artemis, Selene, and Diana. Governs emotions, the subconscious, intuition, and the tides of life.',
    metal: 'Silver',
    familiarForms: [
        "A King like an Archer riding upon a Doe",
        "A little Boy",
        "A Woman-hunter with a bow and arrows",
        "A Cow",
        "A little Doe",
        "A Goose",
        "A Garment green or silver-coloured",
        "An Arrow",
        "A Creature having many feet"
    ]
  },
  [PlanetName.Mars]: {
    name: PlanetName.Mars,
    angelicRuler: 'Camael or Samael',
    zodiacSigns: 'Aries, Scorpio',
    intelligence: 'Graphiel',
    spirit: 'Barzabel',
    attributes: ['Energy', 'Courage', 'Passion', 'Conflict', 'Victory', 'New Projects'],
    mythology: 'Connected to Ares and Mars. The god of war, it embodies aggression, desire, action, and raw energy.',
    metal: 'Iron',
    familiarForms: [
        "A King armed riding upon a Wolf",
        "A Man armed",
        "A Woman holding a buckler on her thigh",
        "A Hee-goat",
        "A Horse",
        "A Stag",
        "A red Garment",
        "Wool",
        "A Cheeslip"
    ]
  },
  [PlanetName.Mercury]: {
    name: PlanetName.Mercury,
    angelicRuler: 'Raphael',
    zodiacSigns: 'Gemini, Virgo',
    intelligence: 'Tiriel',
    spirit: 'Taphthartharath',
    attributes: ['Communication', 'Intellect', 'Travel', 'Business', 'Eloquence'],
    mythology: 'Associated with Hermes and Mercury. The messenger of the gods, ruling communication, intellect, and commerce.',
    metal: 'Quicksilver',
    familiarForms: [
        "A King riding upon a Bear",
        "A fair Youth",
        "A Woman holding a distaffe",
        "A Dog",
        "A Shee-bear",
        "A Magpie",
        "A Garment of sundry changeable colours",
        "A Rod",
        "A little staffe"
    ]
  },
  [PlanetName.Jupiter]: {
    name: PlanetName.Jupiter,
    angelicRuler: 'Sachiel',
    zodiacSigns: 'Sagittarius, Pisces',
    intelligence: 'Iophiel',
    spirit: 'Hismael',
    attributes: ['Expansion', 'Abundance', 'Luck', 'Prosperity', 'High Achievement'],
    mythology: 'Linked to Zeus and Jupiter. The king of the gods, representing expansion, fortune, wisdom, and justice.',
    metal: 'Tin',
    familiarForms: [
        "A King with a Sword drawn, riding on a Stag",
        "A Man wearing a Mitre in long raynment",
        "A Maid with a Laurel-Crown adorned with Flowers",
        "A Bull",
        "A Stag",
        "A Peacock",
        "An azure Garment",
        "A Sword",
        "A Box-tree"
    ]
  },
  [PlanetName.Venus]: {
    name: PlanetName.Venus,
    angelicRuler: 'Anael',
    zodiacSigns: 'Taurus, Libra',
    intelligence: 'Hagiel',
    spirit: 'Kedemel',
    attributes: ['Love', 'Beauty', 'Harmony', 'Friendship', 'Pleasure', 'Art'],
    mythology: 'Connected to Aphrodite and Venus. The goddess of love, beauty, art, pleasure, and social harmony.',
    metal: 'Copper',
    familiarForms: [
        "A King with a Scepter riding upon a Camel",
        "A Maid clothed and dressed beautifully",
        "A Maid naked",
        "A Shee-goat",
        "A Camel",
        "A Dove",
        "A white or green Garment",
        "Flowers",
        "The herb Savine"
    ]
  },
  [PlanetName.Saturn]: {
    name: PlanetName.Saturn,
    angelicRuler: 'Cassiel',
    zodiacSigns: 'Capricorn, Aquarius',
    intelligence: 'Agiel',
    spirit: 'Zazel',
    attributes: ['Discipline', 'Structure', 'Responsibility', 'Limitations', 'Endings'],
    mythology: 'Associated with Cronus and Saturn. The god of time, governing structure, discipline, limitations, and karma.',
    metal: 'Lead',
    familiarForms: [
        "A King having a beard, riding on a Dragon",
        "An Old man with a beard",
        "An Old woman leaning on a staffe",
        "A Hog",
        "A Dragon",
        "An Owl",
        "A black Garment",
        "A Hooke or Sickle",
        "A Juniper-tree"
    ]
  },
};

export const DAY_RULERS: { [key in DayOfWeek]: PlanetName } = {
  [DayOfWeek.Sunday]: PlanetName.Sun,
  [DayOfWeek.Monday]: PlanetName.Moon,
  [DayOfWeek.Tuesday]: PlanetName.Mars,
  [DayOfWeek.Wednesday]: PlanetName.Mercury,
  [DayOfWeek.Thursday]: PlanetName.Jupiter,
  [DayOfWeek.Friday]: PlanetName.Venus,
  [DayOfWeek.Saturday]: PlanetName.Saturn,
};

export const CHALDEAN_ORDER: PlanetName[] = [
  PlanetName.Saturn,
  PlanetName.Jupiter,
  PlanetName.Mars,
  PlanetName.Sun,
  PlanetName.Venus,
  PlanetName.Mercury,
  PlanetName.Moon,
];

export const ACCENT_COLORS: Record<string, Record<string, string>> = {
  gold: {
    '400': '#facc15',
    '500': '#eab308',
    '600': '#ca8a04',
    '700': '#a16207',
  },
  celestial: {
    '400': '#22d3ee',
    '500': '#06b6d4',
    '600': '#0891b2',
    '700': '#0e7490',
  },
  rose: {
    '400': '#fb7185',
    '500': '#f43f5e',
    '600': '#e11d48',
    '700': '#be123c',
  },
  emerald: {
    '400': '#34d399',
    '500': '#10b981',
    '600': '#059669',
    '700': '#047857',
  },
};
