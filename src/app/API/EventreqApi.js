import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

const EventRequestApis = {
  /**
   * Create a new event request
   * @param {Object} data - Event request data
   * @param {string} data.name - Event name
   * @param {string} data.email - Contact email
   * @param {string} data.phone - Contact phone
   * @param {string} data.description - Event description
   * @param {string} data.startDate - Event start date (YYYY-MM-DD)
   * @param {string} data.endDate - Event end date (YYYY-MM-DD)
   * @param {string} data.startTime - Event start time (HH:MM AM/PM)
   * @param {string} data.endTime - Event end time (HH:MM AM/PM)
   * @returns {Promise<Object>} Created event request data
   */
  createEventRequest: async (data) => {
    try {
      // Basic validation
      if (!data.name || !data.email || !data.phone || !data.description || !data.startDate || !data.endDate || !data.startTime || !data.endTime) {
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
        endTime: data.endTime
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create event request');
      }

      toast.success('Event request created successfully');
      return {
        success: true,
        message: 'Event request created successfully',
        data: response
      };
    } catch (error) {
      console.error('Create event request error:', error);
      toast.error(error.message || 'Failed to create event request');
      return {
        success: false,
        message: error.message || 'Failed to create event request'
      };
    }
  },

  /**
   * Get all event requests with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.eventId - Filter by event ID (optional)
   * @param {string} params.userId - Filter by user ID (optional)
   * @param {string} params.status - Filter by status (optional)
   * @returns {Promise<Object>} Paginated event requests data
   */
  getAllEventRequests: async (params = {}) => {
    try {
      // Set default pagination values
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10)
      });

      // Add optional filters if provided
      if (params.eventId) queryParams.append('eventId', params.eventId);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.status) queryParams.append('status', params.status);

      const response = await axiosClient.get(`/event-request?${queryParams.toString()}`);
      
      return {
        success: true,
        data: response.data || [],
        total: response.meta?.total || 0,
        currentPage: response.meta?.page || 1,
        totalPages: response.meta?.totalPages || 1,
        limit: response.meta?.limit || 10
      };
    } catch (error) {
      console.error('Get event requests error:', error);
      toast.error(error.message || 'Failed to fetch event requests');
      return {
        success: false,
        message: error.message || 'Failed to fetch event requests',
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10
      };
    }
  },

  /**
   * Update an event request
   * @param {string} id - Event request ID
   * @param {Object} data - Updated event request data
   * @returns {Promise<Object>} Updated event request data
   */
  updateEventRequest: async (id, data) => {
    try {
      if (!id) {
        throw new Error('Event request ID is required');
      }

      const response = await axiosClient.patch(`/event-request/${id}`, data);

      toast.success('Event request updated successfully');
      return {
        success: true,
        message: 'Event request updated successfully',
        data: response
      };
    } catch (error) {
      console.error('Update event request error:', error);
      toast.error(error.message || 'Failed to update event request');
      return {
        success: false,
        message: error.message || 'Failed to update event request'
      };
    }
  },

  /**
   * Delete an event request
   * @param {string} id - Event request ID
   * @returns {Promise<Object>} Delete operation result
   */
  deleteEventRequest: async (id) => {
    try {
      if (!id) {
        throw new Error('Event request ID is required');
      }

      const response = await axiosClient.delete(`/event-request/${id}`);

      toast.success('Event request deleted successfully');
      return {
        success: true,
        message: 'Event request deleted successfully',
        data: response
      };
    } catch (error) {
      console.error('Delete event request error:', error);
      toast.error(error.message || 'Failed to delete event request');
      return {
        success: false,
        message: error.message || 'Failed to delete event request'
      };
    }
  },

  /**
   * Approve or reject an event request
   * @param {string} id - Event request ID
   * @param {string} status - New status (approved or rejected)
   * @param {string} message - Optional message/reason for approval/rejection
   * @returns {Promise<Object>} Updated event request data
   */
  updateEventRequestStatus: async (id, status, message = '') => {
    try {
      if (!id) {
        throw new Error('Event request ID is required');
      }

      if (!status || !['approved', 'rejected'].includes(status)) {
        throw new Error('Invalid status. Must be "approved" or "rejected"');
      }

      const response = await axiosClient.patch(`/event-request/${id}/status`, {
        status,
        message
      });

      toast.success(`Event request ${status} successfully`);
      return {
        success: true,
        message: `Event request ${status} successfully`,
        data: response
      };
    } catch (error) {
      console.error('Update event request status error:', error);
      toast.error(error.message || `Failed to ${status} event request`);
      return {
        success: false,
        message: error.message || `Failed to ${status} event request`
      };
    }
  },

  /**
   * Approve an event request
   * @param {string} id - Event request ID
   * @returns {Promise<Object>} Updated event request data
   */
  approveEventRequest: async (id) => {
    try {
      if (!id) {
        throw new Error('Event request ID is required');
      }

      const response = await axiosClient.post(`/event-request/${id}/approve`);

      toast.success('Event request approved successfully');
      return {
        success: true,
        message: 'Event request approved successfully',
        data: response
      };
    } catch (error) {
      console.error('Approve event request error:', error);
      toast.error(error.message || 'Failed to approve event request');
      return {
        success: false,
        message: error.message || 'Failed to approve event request'
      };
    }
  },

  /**
   * Reject an event request
   * @param {string} id - Event request ID
   * @returns {Promise<Object>} Updated event request data
   */
  rejectEventRequest: async (id) => {
    try {
      if (!id) {
        throw new Error('Event request ID is required');
      }

      const response = await axiosClient.post(`/event-request/${id}/reject`);

      toast.success('Event request rejected successfully');
      return {
        success: true,
        message: 'Event request rejected successfully',
        data: response
      };
    } catch (error) {
      console.error('Reject event request error:', error);
      toast.error(error.message || 'Failed to reject event request');
      return {
        success: false,
        message: error.message || 'Failed to reject event request'
      };
    }
  }
};

export default EventRequestApis;
