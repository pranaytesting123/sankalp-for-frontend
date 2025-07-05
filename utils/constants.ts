import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as { expoPublicApiUrl?: string };

export const API_BASE_URL = extra.expoPublicApiUrl ?? '';
console.log('♥♥♥API_BASE_URL in utils/constants.ts is♥♥♥ :', API_BASE_URL);


// Add other constants here as needed
export const APP_NAME = 'Sankalp Educational Platform';
export const APP_VERSION = '1.0.0';

