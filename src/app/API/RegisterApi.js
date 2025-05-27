import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

const RegisterApis = {
  /**
   * Create a new subscription
   * @param {Object} data - Subscription data
   * @param {string} data.firstName - User's first name
   * @param {string} data.lastName - User's last name
   * @param {string} data.email - User's email
   * @param {string} data.companyName - Company name
   * @param {string} data.jobTitle - Job title
   * @returns {Promise<Object>} Created subscription data
   */
  createSubscription: async (data) => {
    try {
      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email || !data.companyName || !data.jobTitle) {
        throw new Error('All fields are required');
      }

      const response = await axiosClient.post('/subscription', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        companyName: data.companyName,
        jobTitle: data.jobTitle
      });

      toast.success('Subscription created successfully');
      return {
        success: true,
        message: 'Subscription created successfully',
        data: response
      };
    } catch (error) {
      console.error('Create subscription error:', error);
      toast.error(error.message || 'Failed to create subscription');
      return {
        success: false,
        message: error.message || 'Failed to create subscription'
      };
    }
  },

  /**
   * Get all subscriptions
   * @returns {Promise<Object>} List of subscriptions
   */
  getAllSubscriptions: async () => {
    try {
      const response = await axiosClient.get('/subscription');
      
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      console.error('Get subscriptions error:', error);
      toast.error(error.message || 'Failed to fetch subscriptions');
      return {
        success: false,
        message: error.message || 'Failed to fetch subscriptions',
        data: []
      };
    }
  },

  /**
   * Delete users
   * @param {string} id - User ID to delete
   * @returns {Promise<Object>} Delete operation result
   */
  deleteUser: async (id) => {
    try {
      if (!id) {
        throw new Error('User ID is required');
      }

      const response = await axiosClient.delete(`/subscription/users/${id}`);

      toast.success('User deleted successfully');
      return {
        success: true,
        message: 'User deleted successfully',
        data: response
      };
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error.message || 'Failed to delete user');
      return {
        success: false,
        message: error.message || 'Failed to deletee user'
      };
    }
  }
};

export default RegisterApis;
