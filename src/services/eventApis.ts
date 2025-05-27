interface EventData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const EventApis = {
  createEvent: async (eventData: EventData): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      return {
        success: response.ok,
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      console.error('Error in createEvent:', error);
      return {
        success: false,
        message: 'Failed to create event',
      };
    }
  },
}; 