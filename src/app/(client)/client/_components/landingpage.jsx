'use client'
import React, { useState, useRef, useEffect } from 'react';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import bgimg from '../../../../../public/client/background.png';
import { IoChevronDown } from 'react-icons/io5';
import DatePickerModal from './DatePickerModal';
import CalendarGrid from './CalendarGrid';
import leftarrow from '../../../../../public/client/left.svg';
import rightarrow from '../../../../../public/client/right.svg';
import EventApis from '../../../API/EventApi';
import { toast } from 'react-hot-toast';
import EventDetailsModal from './EventDetailsModal';
// Base timezone for Cayman Islands where events are created
const BASE_TIMEZONE = 'America/Cayman';

export default function Landingpage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const buttonRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [userTimezone, setUserTimezone] = useState('');

  // Get user's timezone on component mount
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    console.log('User timezone:', timezone);
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching events...');
      const response = await EventApis.getAllEvents({
        page: currentPage,
        limit: 500000
      });

      if (response.success && Array.isArray(response.data)) {
        const formattedEvents = response.data.map(event => {
          try {
            if (!event.startDate || !event.endDate) {
              console.error('Missing date for event:', event);
              return null;
            }

            // Parse dates safely without timezone offset
            const startDate = event.startDate.split('T')[0];
            const endDate = event.endDate.split('T')[0];
            const startTime = event.startTime || '00:00';
            const endTime = event.endTime || '23:59';

            // Create dates without timezone offset
            const startDateTime = new Date(`${startDate}T${startTime}:00`);
            const endDateTime = new Date(`${endDate}T${endTime}:00`);

            // Store original values
            return {
              id: event.id,
              title: event.name || 'Untitled Event',
              start: startDateTime,
              end: endDateTime,
              description: event.description || '',
              // Store original values for consistent display
              originalStartDate: startDate,
              originalEndDate: endDate,
              originalStartTime: startTime,
              originalEndTime: endTime
            };
          } catch (error) {
            console.error('Error processing event:', event, error);
            return null;
          }
        }).filter(event => event !== null);

        setEvents(formattedEvents);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error('Invalid API response format:', response);
        toast.error('Failed to load events. Invalid response format.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again...');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when component mounts or when page changes
  useEffect(() => {
    fetchEvents();
  }, [currentPage, userTimezone]); // Re-fetch when timezone changes

  // Format time with timezone consideration
  const formatEventTime = (event) => {
    try {
      // Use the original time strings for display
      const time24h = event.originalStartTime || event.startTime;
      const [hours, minutes] = time24h.split(':');
      const hour = parseInt(hours, 10);
      
      // Convert to 12-hour format
      if (hour === 0) {
        return `12:${minutes} AM`;
      } else if (hour < 12) {
        return `${hour}:${minutes} AM`;
      } else if (hour === 12) {
        return `12:${minutes} PM`;
      } else {
        return `${hour - 12}:${minutes} PM`;
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  // Helper function to format date
  const formatEventDate = (date) => {
    try {
      // Use the original date string to create a date at noon to avoid timezone issues
      const dateStr = typeof date === 'string' ? date : date.originalStartDate;
      return format(new Date(`${dateStr}T12:00:00`), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Helper function to render description with clickable links
  const renderDescriptionWithLinks = (description) => {
    return description.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
      if (part.match(/^https?:\/\/[^\s]+$/)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#006198] hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Helper function to format date with timezone
  const formatDateWithTimezone = (date, formatStr) => {
    try {
      const zonedDate = formatInTimeZone(date, userTimezone || BASE_TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
      return format(zonedDate, formatStr);
    } catch (error) {
      console.error('Error formatting date:', error);
      return format(date, formatStr);
    }
  };

  // Helper function to check if a date has events
  const getEventsForDate = (date) => {
    if (!Array.isArray(events)) return [];
    
    return events.filter(event => {
      if (!event || !event.start) return false;
      
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Add handler for day click
  const handleDayClick = (date, dayEvents) => {
    setSelectedDate(date);
    setSelectedEvents(dayEvents);
    setShowEventModal(true);
  };

  // Custom toolbar component
  const CustomToolbar = () => {
    const goToPrevious = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    };

    const goToNext = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    };

    return (
      <div className="w-full px-6 sm:px-3 md:px-6 py-3 md:py-4 bg-[#f2f7fa] rounded-lg flex flex-row justify-between items-center mb-4 md:mb-10 gap-3 md:gap-4 overflow-hidden">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <div className="self-stretch rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-[#cfd4dc] flex justify-start items-start overflow-hidden">
              <button
                onClick={goToPrevious}
                className="self-stretch min-h-10 md:min-h-12 px-3 md:px-4 py-2 md:py-3 bg-white border-r border-[#cfd4dc] flex justify-center items-center gap-2 hover:bg-[#f8f9fb]"
              >
                <img src={leftarrow.src} alt="Previous" className="w-5 md:w-6 h-5 md:h-6" />
              </button>
              <button
                onClick={goToNext}
                className="self-stretch min-h-10 md:min-h-12 px-3 md:px-4 py-2 md:py-3 bg-white border-r border-[#cfd4dc] flex justify-center items-center gap-2 hover:bg-[#f8f9fb]"
              >
                <img src={rightarrow.src} alt="Next" className="w-5 md:w-6 h-5 md:h-6" />
              </button>
            </div>
          </div>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsModalOpen(true)}
              className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-1 outline-offset-[-1px] outline-[#cfd4dc] inline-flex justify-center items-center gap-1 overflow-hidden hover:bg-[#f8f9fb]"
            >
              <div className="px-0.5 flex justify-center items-center">
                <span className="text-[#344053] text-sm sm:text-base md:text-lg font-normal font-['Outfit'] leading-normal">
                  {format(currentDate, 'MMM yyyy')}
                </span>
              </div>
              <IoChevronDown className={`w-5 sm:w-6 h-5 sm:h-6 text-[#344053] transition-transform ${isModalOpen ? 'rotate-180' : ''}`} />
            </button>

            <DatePickerModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSelect={(date) => {
                setCurrentDate(date);
              }}
              currentDate={currentDate}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-[#cfd4dc] flex justify-start items-start overflow-hidden">
            <button
              onClick={() => setView('agenda')}
              className={`min-h-10 md:min-h-12 px-3 sm:px-4 md:px-5 py-2 md:py-3 bg-white border-r border-[#cfd4dc] flex justify-center items-center gap-1 md:gap-2 ${
                view === 'agenda' ? 'bg-[#f8f9fb] text-[#006198] font-semibold' : 'text-[#4a4c56]'
              }`}
            >
              <span className="text-xs sm:text-sm md:text-base font-['Outfit'] leading-tight">List</span>
            </button>
            <button
              onClick={() => setView('month')}
              className={`min-h-10 md:min-h-12 px-3 sm:px-4 md:px-5 py-2 md:py-3 border-r border-[#cfd4dc] flex justify-center items-center gap-1 md:gap-2 ${
                view === 'month' ? 'bg-[#f8f9fb] text-[#006198] font-semibold' : 'bg-white text-[#4a4c56]'
              }`}
            >
              <span className="text-xs sm:text-sm md:text-base font-['Outfit'] leading-tight">Month</span>
            </button>
            <button
              onClick={() => setView('day')}
              className={`hidden md:flex min-h-10 md:min-h-12 px-3 sm:px-4 md:px-5 py-2 md:py-3 justify-center items-center gap-1 md:gap-2 ${
                view === 'day' ? 'bg-[#f8f9fb] text-[#006198] font-semibold' : 'bg-white text-[#4a4c56]'
              }`}
            >
              <span className="text-xs sm:text-sm md:text-base font-['Outfit'] leading-tight">Day</span>
            </button>
          </div>
          <button className="hidden md:flex px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-[#006198] rounded-lg justify-center items-center gap-1 md:gap-2 hover:bg-[#004d7a]">
            <span className="text-center text-white text-sm sm:text-base md:text-lg font-medium font-['Outfit'] leading-normal">
              Find Events
            </span>
          </button>
        </div>
      </div>
    );
  };

  // Loading state component
  const LoadingState = () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006199]"></div>
    </div>
  );

  return (
    <>
      <div className="overflow-x-hidden w-full">
        {/* Hero Section */}
        <div className="box px-5">
          <div className="background h-[200px] sm:h-[338px] md:h-[528px] rounded-3xl overflow-hidden">
            <div 
              className="content flex justify-center"
              style={{
                backgroundImage: `url(${bgimg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <div className="text flex flex-col items-center justify-start w-full mt-[50px] md:mt-[135px] px-4">
                <div className="w-full max-w-[1280px] -mt-8 sm:-mt-0 flex flex-col items-center justify-start gap-2 md:gap-4">
                  <div className="text-center text-white text-2xl sm:text-4xl md:text-[64px] font-bold font-['Figtree'] capitalize">
                    Welcome to Cayman Biz Events
                  </div>
                  <div className="w-full md:w-[783px] text-center text-white text-sm sm:text-xl md:text-2xl font-semibold font-['Figtree'] capitalize leading-tight md:leading-[38.40px]">
                    the ultimate hub for corporate events and networking opportunities in the Cayman Islands!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="box mx-auto px-2 md:px-4 py-4 md:py-8">
          <div className="max-w-full mx-5 bg-white rounded-2xl overflow-hidden p-3 md:p-6 -mt-20 md:-mt-36">
            <CustomToolbar />
            
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                {/* Calendar Views */}
                {view === 'month' && (
                  <div className="overflow-x-hidden">
                    {/* Mobile Calendar View */}
                    <div className="block md:hidden">
                      <div className="flex flex-col gap-3 px-1">
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                          const day = i + 1;
                          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                          const dayEvents = getEventsForDate(date);
                          
                          return (
                            <div 
                              key={i} 
                              onClick={() => handleDayClick(date, dayEvents)}
                              className="bg-[#f2f7fa] rounded-lg overflow-hidden cursor-pointer hover:bg-[#e5f0f7] transition-colors"
                            >
                              <div className="grid grid-cols-12">
                                <div className="col-span-4 p-5 flex flex-col justify-center">
                                  <div className="text-[#006198] text-3xl font-normal leading-none">{day}</div>
                                  <div className="text-[#4A4C56] text-sm font-normal mt-2">{format(date, 'EEEE')}</div>
                                </div>
                                
                                <div className={`col-span-8 ${dayEvents.length > 0 ? 'bg-[#FFF0F5]' : 'bg-white'} p-5 flex justify-center items-center min-h-[140px]`}>
                                  {dayEvents.length > 0 ? (
                                    <div className="w-full">
                                      {dayEvents.map((event, idx) => {
                                        if (!event || !event.start || !event.end) return null;
                                        
                                        const isHighlighted = dayEvents.length > 0;
                                        return (
                                          <div key={event.id || idx} className="mb-2">
                                            <div className={`${isHighlighted ? 'text-[#FF69B4]' : 'text-[#006198]'} text-lg font-normal truncate`}>
                                              {event.title}
                                            </div>
                                            <div className="text-[#4A4C56] text-sm">
                                              {formatEventTime(event)} - {formatEventTime({ startTime: event.originalEndTime })}
                                            </div>
                                            {event.description && (
                                              <div className="text-[#4A4C56] text-sm truncate">
                                                {event.description}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="text-[#006198] text-lg font-normal text-center">
                                      No Events Today
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Desktop Calendar View */}
                    <div className="hidden md:block">
                      <CalendarGrid
                        events={events}
                        currentDate={currentDate}
                      />
                    </div>
                  </div>
                )}

                {view === 'agenda' && (
                  <div className="overflow-x-hidden">
                    <div className="space-y-4">
                      {events.length > 0 ? (
                        events
                          .sort((a, b) => a.start - b.start)
                          .map((event, index) => (
                            <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                              <div className="font-semibold text-lg text-[#25314c] truncate">{event.title}</div>
                              <div className="text-sm text-gray-600">
                                {formatEventTime(event)} - {formatEventTime({ startTime: event.originalEndTime })}
                              </div>
                              {event.description && (
                                <div className="mt-2 text-sm text-gray-600">
                                  {renderDescriptionWithLinks(event.description)}
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">No events found</div>
                      )}
                    </div>
                  </div>
                )}

                {view === 'day' && (
                  <div className="overflow-x-hidden">
                    <div className="min-h-[600px] border rounded-lg">
                      <div className="text-center p-4 border-b bg-gray-50">
                        <h2 className="text-xl font-semibold text-[#25314c]">
                          {format(currentDate, 'MMMM d, yyyy')}
                        </h2>
                      </div>
                      <div className="divide-y">
                        {events
                          .filter(event => 
                            new Date(event.start).toDateString() === currentDate.toDateString()
                          )
                          .sort((a, b) => new Date(a.start) - new Date(b.start))
                          .map((event) => (
                            <div key={event.id} className="p-4 hover:bg-gray-50">
                              <div className="font-semibold text-[#25314c] truncate">{event.title}</div>
                              <div className="text-sm text-gray-600">
                                {formatEventTime(event)} - {formatEventTime({ startTime: event.originalEndTime })}
                              </div>
                              {event.description && (
                                <div className="mt-2 text-sm text-gray-600">
                                  {renderDescriptionWithLinks(event.description)}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal - Will work for both mobile and desktop */}
      <EventDetailsModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        events={selectedEvents}
        date={selectedDate}
      />



    </>
  );
}