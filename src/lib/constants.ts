export const CARBON_MULTIPLIERS = {
  transport: {
    car: 0.18,      // kg CO2e per km
    bus: 0.08,      // kg CO2e per km
    train: 0.04,     // kg CO2e per km
    flight: 0.24     // kg CO2e per km
  },
  food: {
    meat: 7.2,       // kg CO2e per day
    balanced: 4.8,   // kg CO2e per day
    vegetarian: 2.9, // kg CO2e per day
    vegan: 1.5       // kg CO2e per day
  },
  energy: {
    electricity: 0.38, // kg CO2e per kWh
    gas: 0.22          // kg CO2e per kWh
  },
  waste: {
    landfill: 1.2,  // kg CO2e per kg
    recycled: 0.1   // kg CO2e per kg
  }
} as const;

export const DEFAULT_TARGETS = {
  total: 400, // standard weekly target (kg CO2e)
  transport: 120,
  food: 100,
  energy: 130,
  waste: 50
} as const;

export const INITIAL_USER_SETTINGS = {
  theme: "system" as const,
  language: "en" as const,
  onboardingCompleted: false
};
