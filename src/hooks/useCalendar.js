import { useMemo } from 'react';
import calendarData from '../data/calendarData.json';

export function useCalendar() {
    const allEvents = useMemo(() => {
        return calendarData.months.flatMap(month => month.events);
    }, []);

    const getEventsForMonth = (month, year) => {
        return allEvents.filter(event => {
            const date = new Date(event.gregorianDate);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
        });
    };

    const getEventsForDate = (dateStr) => {
        return allEvents.filter(event => event.gregorianDate === dateStr);
    };

    const getEventsByType = (type) => {
        return allEvents.filter(event => event.eventType === type);
    };

    const getUpcomingEvents = (count = 5) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return allEvents
            .filter(event => new Date(event.gregorianDate) >= today)
            .sort((a, b) => new Date(a.gregorianDate) - new Date(b.gregorianDate))
            .slice(0, count);
    };

    const getMonthData = (month, year) => {
        return calendarData.months.find(
            m => m.gregorianMonth === month && m.gregorianYear === year
        );
    };

    return {
        allEvents,
        getEventsForMonth,
        getEventsForDate,
        getEventsByType,
        getUpcomingEvents,
        getMonthData,
        calendarData,
    };
}
