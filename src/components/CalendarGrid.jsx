import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { useCalendar } from '../hooks/useCalendar';
import moment from 'moment-hijri';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getCalendarDays(month, year) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({
            day: prevMonthLastDay - i,
            isCurrentMonth: false,
            date: new Date(year, month - 2, prevMonthLastDay - i),
        });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        days.push({
            day,
            isCurrentMonth: true,
            date: new Date(year, month - 1, day),
        });
    }

    // Fill remaining cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month, i),
        });
    }

    return days;
}

function getHijriDate(date) {
    try {
        const m = moment(date);
        return {
            day: m.iDate(),
            month: m.format('iMMMM'),
            year: m.iYear(),
        };
    } catch {
        return null;
    }
}

function getHijriMonthName(month, year) {
    try {
        const m = moment(new Date(year, month - 1, 15));
        return `${m.format('iMMMM')} ${m.iYear()} AH`;
    } catch {
        return '';
    }
}

const eventTypeColors = {
    wiladat: { bg: 'bg-green-500', dot: 'bg-green-400', border: 'border-green-500/30' },
    shahadat: { bg: 'bg-red-500', dot: 'bg-red-400', border: 'border-red-500/30' },
    eid: { bg: 'bg-gold', dot: 'bg-gold', border: 'border-gold/30' },
};

export default function CalendarGrid() {
    const { selectedMonth, selectedYear, navigateMonth, goToToday, setSelectedEvent } = useAppContext();
    const { getEventsForDate } = useCalendar();
    const [direction, setDirection] = useState(0);

    const calendarDays = useMemo(
        () => getCalendarDays(selectedMonth, selectedYear),
        [selectedMonth, selectedYear]
    );

    const hijriLabel = useMemo(
        () => getHijriMonthName(selectedMonth, selectedYear),
        [selectedMonth, selectedYear]
    );

    const today = new Date();
    const isToday = (date) =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const handlePrev = () => {
        if (selectedYear <= 2026 && selectedMonth <= 1) return;
        setDirection(-1);
        navigateMonth(-1);
    };

    const handleNext = () => {
        if (selectedYear >= 2026 && selectedMonth >= 12) return;
        setDirection(1);
        navigateMonth(1);
    };

    const formatDateStr = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    return (
        <div className="glass-card p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <motion.h2
                        key={`${selectedMonth}-${selectedYear}`}
                        initial={{ opacity: 0, x: direction * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-serif text-cream"
                    >
                        {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                    </motion.h2>
                    <motion.p
                        key={`hijri-${selectedMonth}-${selectedYear}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gold/70 text-sm font-arabic mt-1"
                    >
                        {hijriLabel}
                    </motion.p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="px-3 py-1.5 text-xs font-medium text-gold border border-gold/30 rounded-lg 
                       hover:bg-gold/10 transition-colors duration-200 flex items-center gap-1.5"
                    >
                        <FiCalendar size={12} />
                        Today
                    </button>
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-lg border border-gold/20 text-gold/70 hover:text-gold 
                       hover:border-gold/40 hover:bg-gold/5 transition-all duration-200"
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-lg border border-gold/20 text-gold/70 hover:text-gold 
                       hover:border-gold/40 hover:bg-gold/5 transition-all duration-200"
                    >
                        <FiChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map(day => (
                    <div
                        key={day}
                        className={`text-center text-xs font-medium py-2 
              ${day === 'Fri' ? 'text-gold' : 'text-cream/50'}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedMonth}-${selectedYear}`}
                    initial={{ opacity: 0, x: direction * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -30 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-7 gap-px"
                >
                    {calendarDays.map((dayObj, index) => {
                        const dateStr = formatDateStr(dayObj.date);
                        const events = dayObj.isCurrentMonth ? getEventsForDate(dateStr) : [];
                        const hijri = dayObj.isCurrentMonth ? getHijriDate(dayObj.date) : null;
                        const isTodayCell = isToday(dayObj.date);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.008 }}
                                onClick={() => events.length > 0 && setSelectedEvent(events[0])}
                                className={`
                  relative min-h-[70px] md:min-h-[90px] p-1.5 md:p-2 rounded-lg border transition-all duration-200
                  ${dayObj.isCurrentMonth
                                        ? 'border-gold/5 hover:border-gold/20 hover:bg-midnight-light/40 cursor-pointer'
                                        : 'border-transparent opacity-30'
                                    }
                  ${isTodayCell ? 'border-gold/40 bg-gold/5 ring-1 ring-gold/20' : ''}
                  ${events.length > 0 ? 'cursor-pointer' : ''}
                `}
                            >
                                <div className="flex items-start justify-between">
                                    <span className={`text-sm font-medium ${isTodayCell ? 'text-gold font-bold' :
                                            dayObj.isCurrentMonth ? 'text-cream' : 'text-cream/30'
                                        }`}>
                                        {dayObj.day}
                                    </span>
                                    {hijri && (
                                        <span className="text-[10px] text-gold/40 font-arabic">
                                            {hijri.day}
                                        </span>
                                    )}
                                </div>

                                {/* Event indicators */}
                                {events.length > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                        {events.slice(0, 2).map((event, i) => {
                                            const typeColor = eventTypeColors[event.eventType] || eventTypeColors.eid;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex items-center gap-1 group`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${typeColor.dot} flex-shrink-0`} />
                                                    <span className="text-[9px] md:text-[10px] text-cream/70 truncate leading-tight">
                                                        {event.eventName.length > 20
                                                            ? event.eventName.slice(0, 18) + '…'
                                                            : event.eventName}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {events.length > 2 && (
                                            <span className="text-[9px] text-gold/50">+{events.length - 2} more</span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gold/10">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-cream/50">Wiladat</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-cream/50">Shahadat</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-xs text-cream/50">Eid</span>
                </div>
            </div>
        </div>
    );
}
