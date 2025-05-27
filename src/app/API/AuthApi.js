import { CookieHelper } from '../../helper/cookie.helper';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

const isBrowser = typeof window !== 'undefined';

/**
 * Authentication API for admin functionality
 */
const AuthApis = {
  /**
   * Admin login
   * @param {Object} data - Login credentials
   * @param {string} data.email - Admin email
   * @param {string} data.password - Admin password
   * @returns {Promise<Object>} Login result
   */
  adminLogin: async (data) => {
    try {
      // Validate required fields
      if (!data.email || !data.password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      // Make the API request
      const response = await axiosClient.post('/user/login', {
        email: data.email,
        password: data.password,
      });

      // API response will already be in the correct format
      const { id, name, email, role, token } = response;

      // Only allow ADMIN role to login
      if (role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.');
        return {
          success: false,
          message: 'Access denied. Admin privileges required.',
        };
      }

      if (token && isBrowser) {
        // Store auth data
        CookieHelper.set({ key: 'token', value: token });
        CookieHelper.set({ key: 'role', value: role });
        CookieHelper.set({
          key: 'user',
          value: JSON.stringify({
            id,
            name,
            email,
            role
          }),
        });

        // Show success message
        toast.success('Admin login successful!');

        // Return success response
        return {
          success: true,
          message: 'Login successful',
          data: { id, name, email, role }
        };
      }

      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Error will already be formatted by axios interceptor
      toast.error(error.message);
      
      return {
        success: false,
        message: error.message,
      };
    }
  },

  /**
   * Logout admin user
   */
  logout: () => {
    if (!isBrowser) return;

    // Clear auth data
    CookieHelper.remove({ key: 'token' });
    CookieHelper.remove({ key: 'role' });
    CookieHelper.remove({ key: 'user' });

    // Show success message
    toast.success('Successfully logged out!');

    // Redirect to main page
    window.location.href = '/';
  },
};

export default AuthApis;
