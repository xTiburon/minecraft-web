/**
 * PlanetMC — config/settings.js
 * Global site settings.
 */

const SETTINGS = {
  /** Server IPs */
  server: {
    java:        'planetmc.net',
    bedrock:     'planetmc.net',
    bedrockPort: '19132',
  },

  /**
   * Server status.
   * Set to 'online' or 'maintenance'.
   * The page will show the appropriate pill automatically.
   */
  serverStatus: 'online', // 'online' | 'maintenance'

  /** Default language — 'es' | 'en' | 'pt' */
  defaultLang: 'es',

  /** Intro screen duration in milliseconds */
  introDuration: 2650,

  /** Star canvas — number of stars */
  starCount: 260,

  /** Dust canvas — number of particles */
  dustCount: 55,
};