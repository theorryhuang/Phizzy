/**
 * Central app configuration.
 *
 * Values that used to be hard-coded across screens live here so they can be
 * changed in one place (or overridden with EXPO_PUBLIC_* environment variables).
 */

const env = process.env;

/** Firebase Storage folder paths. */
export const StoragePaths = {
  videos: env.EXPO_PUBLIC_STORAGE_VIDEOS_PATH || 'videos',
  avatars: env.EXPO_PUBLIC_STORAGE_AVATARS_PATH || 'avatars',
} as const;

/** Firestore collection names. */
export const Collections = {
  programs: env.EXPO_PUBLIC_PROGRAMS_COLLECTION || 'programs',
} as const;

/** AsyncStorage keys. */
export const StorageKeys = {
  userId: 'userId',
  selectedAvatar: 'selectedAvatar',
  theme: 'theme',
} as const;

/** User ID used when nobody is signed in (development / demo). */
export const DEFAULT_USER_ID = env.EXPO_PUBLIC_DEFAULT_USER_ID || 'default-user';

/**
 * When true, screens fall back to a generated demo program if the user has no
 * program document in Firestore. Set EXPO_PUBLIC_USE_DEMO_PROGRAM=false to disable.
 */
export const USE_DEMO_PROGRAM = env.EXPO_PUBLIC_USE_DEMO_PROGRAM !== 'false';

/** Default theme color (overridden by the saved `theme` value in AsyncStorage). */
export const DEFAULT_THEME_COLOR = '#4A2DBB';

/** Length of the parent verification code. */
export const PARENT_CODE_LENGTH = 4;

/** Story-mode titles shown on the Journey Map, indexed by week number - 1. */
export const WEEK_TITLES = ['Learn Powers', 'Meet Your Battle', 'Power Up', 'Save the City'];

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
