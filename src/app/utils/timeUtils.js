// Time format utility functions

/**
 * Converts 12-hour format time to 24-hour format
 * @param {string} time12h - Time in 12-hour format (e.g., "2:30 PM")
 * @returns {string} Time in 24-hour format (e.g., "14:30")
 */
export const convertTo24Hour = (time12h) => {
  if (!time12h) return '00:00';
  
  // If already in 24-hour format, return as is
  if (!time12h.includes(' ')) {
    return time12h;
  }

  const [timeStr, modifier] = time12h.split(' ');
  let [hours, minutes] = timeStr.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Converts 24-hour format time to 12-hour format
 * @param {string} time24h - Time in 24-hour format (e.g., "14:30")
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
 */
export const convertTo12Hour = (time24h) => {
  if (!time24h) return '12:00 AM';

  // If already includes AM/PM, return as is
  if (time24h.includes(' ')) {
    return time24h;
  }

  const [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Validates if a time string is in 24-hour format
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid 24-hour format
 */
export const isValid24HourTime = (time) => {
  if (!time) return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Ensures a time string is in 24-hour format
 * @param {string} time - Time string to normalize
 * @returns {string} Time in 24-hour format
 */
export const ensureTimeFormat = (time) => {
  if (!time) return '00:00';
  return isValid24HourTime(time) ? time : convertTo24Hour(time);
}; 