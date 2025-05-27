import Cookies from 'js-cookie';

/**
 * Helper class for managing cookies
 */
export class CookieHelper {
  /**
   * Set a cookie
   * @param {Object} params - Cookie parameters
   * @param {string} params.key - Cookie key
   * @param {string} params.value - Cookie value
   * @param {number} [params.expires=7] - Days until cookie expires
   */
  static set({ key, value, expires = 7 }) {
    Cookies.set(key, value, {
      expires: expires,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
    });
  }

  /**
   * Get a cookie value
   * @param {Object} params - Cookie parameters
   * @param {string} params.key - Cookie key
   * @returns {string|null} Cookie value or null if not found
   */
  static get({ key }) {
    return Cookies.get(key) || null;
  }

  /**
   * Remove a cookie
   * @param {Object} params - Cookie parameters
   * @param {string} params.key - Cookie key
   */
  static remove({ key }) {
    Cookies.remove(key, {
      path: '/',
    });
  }
} 