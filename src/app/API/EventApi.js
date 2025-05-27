import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

const EventApis = {
  /**
   * Create a new event
   * @param {Object} data - Event data
   * @returns {Promise<Object>} Created event data
   */
  createEvent: async (data) => {
    try {
      // Basic validation
      if (!data.name || !data.email || !data.phone || !data.description) {
        throw new Error('All required fields must be filled');
      }

      const response = await axiosClient.post('/event-request', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        timezone: "America/Cayman",
        status: "PENDING"
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create event');
      }

      toast.success('Event submitted successfully');
      return {
        success: true,
        message: 'Event submitted successfully',
        data: response
      };
    } catch (error) {
      console.error('Create event error:', error);
      toast.error(error.message || 'Failed to submit event');
      return {
        success: false,
        message: error.message || 'Failed to submit event'
      };
    }
  },

  /**
   * Get all events with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated events data
   */
  getAllEvents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10)
      });

      const response = await axiosClient.get(`/event?${queryParams.toString()}`);
      
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
      toast.error(error.message || 'Failed to fetch events');
      return {
        success: false,
        message: error.message || 'Failed to fetch events',
        data: []
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
