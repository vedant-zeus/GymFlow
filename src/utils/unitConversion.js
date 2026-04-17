/**
 * Unit conversion utilities for GymFlow
 * Reads unit preferences from localStorage keys: gf_weightUnit, gf_heightUnit
 */

// ── Weight conversions ─────────────────────────────────────────────────────
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;

/**
 * Get the user's preferred weight unit ('kg' or 'lbs').
 */
export const getWeightUnit = () => localStorage.getItem('gf_weightUnit') || 'kg';

/**
 * Get the user's preferred height unit ('cm' or 'ft').
 */
export const getHeightUnit = () => localStorage.getItem('gf_heightUnit') || 'cm';

/**
 * Convert a weight value (stored in kg) to the user's preferred unit.
 * @param {number} kg - The weight value in kilograms.
 * @param {number} decimals - Decimal places (default 1).
 * @returns {number} Converted weight.
 */
export const convertWeight = (kg, decimals = 1) => {
  const unit = getWeightUnit();
  if (unit === 'lbs') {
    return parseFloat((kg * KG_TO_LBS).toFixed(decimals));
  }
  return parseFloat(Number(kg).toFixed(decimals));
};

/**
 * Convert a weight value from the user's preferred unit back to kg (for storage).
 * @param {number} value - The weight value in the user's preferred unit.
 * @returns {number} Weight in kilograms.
 */
export const toKg = (value) => {
  const unit = getWeightUnit();
  if (unit === 'lbs') {
    return parseFloat((value * LBS_TO_KG).toFixed(2));
  }
  return parseFloat(Number(value).toFixed(2));
};

/**
 * Returns the display label for the current weight unit.
 * @param {boolean} uppercase - Whether to return uppercase label.
 * @returns {string} 'KG' or 'LBS' (or lowercase).
 */
export const weightLabel = (uppercase = true) => {
  const unit = getWeightUnit();
  return uppercase ? unit.toUpperCase() : unit;
};

// ── Height conversions ──────────────────────────────────────────────────────

/**
 * Convert a height value (stored in cm) to the user's preferred unit.
 * @param {number} cm - The height value in centimeters.
 * @returns {string|number} Converted height. Returns "X'Y\"" for ft, number for cm.
 */
export const convertHeight = (cm) => {
  const unit = getHeightUnit();
  if (unit === 'ft') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  return Math.round(cm);
};

/**
 * Convert a height from user's preferred unit back to cm (for storage).
 * @param {number} feet - Feet portion.
 * @param {number} inches - Inches portion.
 * @returns {number} Height in centimeters.
 */
export const toCm = (feet, inches = 0) => {
  return Math.round((feet * 12 + inches) * 2.54);
};

/**
 * Returns the display label for the current height unit.
 * @param {boolean} uppercase - Whether to return uppercase label.
 * @returns {string} 'CM' or 'FT' (or lowercase).
 */
export const heightLabel = (uppercase = true) => {
  const unit = getHeightUnit();
  return uppercase ? unit.toUpperCase() : unit;
};
