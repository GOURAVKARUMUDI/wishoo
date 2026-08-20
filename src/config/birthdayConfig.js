/**
 * WISHOO — CENTRALIZED BIRTHDAY DATE & LOCK CONFIGURATION
 * --------------------------------------------------------
 * Dynamically loaded from environment variables (VITE_BIRTHDAY_*)
 * with sensible fallback defaults.
 */

// Day of birth (e.g. '22')
export const BIRTHDAY_DAY = (import.meta.env.VITE_BIRTHDAY_DAY || '22').padStart(2, '0');

// Month of birth: '01' to '12' (e.g. '08' for August)
export const BIRTHDAY_MONTH = (import.meta.env.VITE_BIRTHDAY_MONTH || '08').padStart(2, '0');

// Year of birth (e.g. '2007')
export const BIRTHDAY_YEAR = String(import.meta.env.VITE_BIRTHDAY_YEAR || '2007');

// Passcode steps for DatePasscodeLock
export const PASSCODE_STEPS = [
  {
    key: 'day',
    label: 'Birth Date',
    hint: 'The day she was born',
    placeholder: 'DD',
    value: BIRTHDAY_DAY,
  },
  {
    key: 'month',
    label: 'Birth Month',
    hint: 'The month she was born',
    placeholder: 'MM',
    value: BIRTHDAY_MONTH,
  },
  {
    key: 'year',
    label: 'Birth Year',
    hint: 'The year she was born',
    placeholder: 'YYYY',
    value: BIRTHDAY_YEAR,
  },
];

/**
 * Calculates the target countdown date.
 * If VITE_BIRTHDAY_TARGET_DATE is provided (e.g. '2026-08-22T00:00:00'), uses it.
 * Otherwise uses VITE_BIRTHDAY_TARGET_YEAR (or current year) + month + day at 00:00:00.
 */
export function getBirthdayTargetDate() {
  if (import.meta.env.VITE_BIRTHDAY_TARGET_DATE) {
    return new Date(import.meta.env.VITE_BIRTHDAY_TARGET_DATE);
  }

  const targetYear = parseInt(
    import.meta.env.VITE_BIRTHDAY_TARGET_YEAR || new Date().getFullYear(),
    10
  );
  const monthIdx = parseInt(BIRTHDAY_MONTH, 10) - 1; // 0-indexed in JS Date
  const day = parseInt(BIRTHDAY_DAY, 10);

  return new Date(targetYear, monthIdx, day, 0, 0, 0);
}

/**
 * Returns formatted date string (e.g. "22 • 08 • 2026")
 */
export function getFormattedBirthdayDate() {
  const target = getBirthdayTargetDate();
  const day = String(target.getDate()).padStart(2, '0');
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const year = target.getFullYear();
  return `${day} • ${month} • ${year}`;
}

/**
 * Checks whether the target countdown time has been reached.
 */
export function isBirthdayReached() {
  const now = new Date();
  const target = getBirthdayTargetDate();
  return now >= target;
}
