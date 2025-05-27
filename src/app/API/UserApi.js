import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

const UserApis = {
  /**
   * Get all subscribers with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @returns {Promise<Object>} Paginated subscribers data
   */
  getAllSubscribers: async (params = {}) => {
    try {
      // Set default pagination values
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10)
      });

      console.log('Making request with params:', queryParams.toString());
      const response = await axiosClient.get(`/subscription?${queryParams.toString()}`);
      console.log('Raw API Response:', response);
      
      return {
        success: true,
        data: response.data || [],
        total: response.meta?.total || 0,
        currentPage: response.meta?.page || 1,
        totalPages: response.meta?.totalPages || 1,
        limit: response.meta?.limit || 10
      };
    } catch (error) {
      console.error('Get subscribers error:', error);
      toast.error(error.message);
      return {
        success: false,
        message: error.message,
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10
      };
    }
  },

  /**
   * Delete multiple subscribers
   * @param {Array<string>} ids - Array of subscriber IDs to delete
   * @returns {Promise<Object>} Delete operation result
   */
  deleteSubscribers: async (ids) => {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('Please select subscribers to delete');
      }

      const response = await axiosClient.delete('/subscription', {
        data: { ids }
      });

      toast.success('Subscribers deleted successfully');
      return {
        success: true,
        message: 'Subscribers deleted successfully',
        data: response
      };
    } catch (error) {
      console.error('Delete subscribers error:', error);
      toast.error(error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  /**
   * Delete a single subscriber
   * @param {string} id - Subscriber ID to delete
   * @returns {Promise<Object>} Delete operation result
   */
  deleteSubscriber: async (id) => {
    try {
      if (!id) {
        throw new Error('Subscriber ID is required');
      }

      const response = await axiosClient.delete(`/subscription/${id}`);

      toast.success('Subscriber deleted successfully');
      return {
        success: true,
        message: 'Subscriber deleted successfully',
        data: response
      };
    } catch (error) {
      console.error('Delete subscriber error:', error);
      toast.error(error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }
};

export default UserApis;
