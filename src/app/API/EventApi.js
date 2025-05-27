import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

const EventApis = {
  /**
   * Create a new event
   * @param {Object} data - Event data
   * @param {string} data.name - Event name
   * @param {string} data.startDate - Start date (YYYY-MM-DD)
   * @param {string} data.endDate - End date (YYYY-MM-DD)
   * @param {string} data.startTime - Start time (HH:mm)
   * @param {string} data.endTime - End time (HH:mm)
   * @param {string} data.description - Event description
   * @param {string} data.timezone - Event timezone
   * @returns {Promise<Object>} Created event data
   */
  createEvent: async (data) => {
    try {
      // Basic validation
      if (!data.name || !data.startDate || !data.endDate || !data.startTime || !data.endTime || !data.description) {
        throw new Error('All fields are required');
      }

      // Simple format validation
      if (!data.startDate.match(/^\d{4}-\d{2}-\d{2}$/) || !data.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Invalid date format');
      }

      if (!data.startTime.match(/^\d{2}:\d{2}$/) || !data.endTime.match(/^\d{2}:\d{2}$/)) {
        throw new Error('Invalid time format');
      }

      const response = await axiosClient.post('/event', data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create event');
      }

      return {
        success: true,
        message: 'Event created successfully',
        data: response
      };
    } catch (error) {
      console.error('Create event error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create event'
      };
    }
  },

  /**
   * Get all events with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @returns {Promise<Object>} Paginated events data
   */

  
  getAllEvents: async (params = {}) => {
    try {
      // Set default pagination values
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 100000)
      });

      console.log('Making request with params:', queryParams.toString());
      const response = await axiosClient.get(`/event?${queryParams.toString()}`);
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
      console.error('Get events error:', error);
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
   * Update an event
   * @param {string} id - Event ID
   * @param {Object} data - Updated event data
   * @returns {Promise<Object>} Updated event data
   */
  updateEvent: async (id, data) => {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }

      const response = await axiosClient.patch(`/event/${id}`, data);

      toast.success('Event updated successfully');
      return {
        success: true,
        message: 'Event updated successfully',
        data: response
      };
    } catch (error) {
      console.error('Update event error:', error);
      toast.error(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Delete operation result
   */
  deleteEvent: async (id) => {
    try {
      if (!id) {
        throw new Error('Event ID is required');
      }

      const response = await axiosClient.delete(`/event/${id}`);

      toast.success('Event deleted successfully');
      return {
        success: true,
        message: 'Event deleted successfully',
        data: response
      };
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
};

export default EventApis;
