import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import { useCalendar } from '../hooks/useCalendar';
import { useAppContext } from '../context/AppContext';

const typeStyles = {
    wiladat: { dot: 'bg-green-400', text: 'text-green-400/80', label: 'Wiladat' },
    shahadat: { dot: 'bg-red-400', text: 'text-red-400/80', label: 'Shahadat' },
    eid: { dot: 'bg-gold', text: 'text-gold/80', label: 'Eid' },
};

export default function UpcomingEvents() {
    const { getUpcomingEvents } = useCalendar();
    const { setSelectedEvent } = useAppContext();
    const upcoming = getUpcomingEvents(6);

    if (upcoming.length === 0) return null;

    return (
        <div className="glass-card p-4 md:p-6" id="events">
            <h3 className="text-xs text-gold/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiCalendar size={12} />
                Upcoming Events
            </h3>

            <div className="space-y-2">
                {upcoming.map((event, index) => {
                    const style = typeStyles[event.eventType] || typeStyles.eid;
                    const eventDate = new Date(event.gregorianDate);
                    const daysFromNow = Math.ceil(
                        (eventDate.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
                    );

                    return (
                        <motion.button
                            key={`${event.gregorianDate}-${event.eventName}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.06 * index }}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full text-left flex items-start gap-3 py-2.5 px-3 rounded-lg 
                         hover:bg-gold/5 transition-all duration-200 group"
                        >
                            {/* Date badge */}
                            <div className="flex-shrink-0 w-12 text-center">
                                <div className="text-lg font-serif text-cream leading-tight">
                                    {eventDate.getDate()}
                                </div>
                                <div className="text-[9px] text-cream/30 uppercase">
                                    {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className={`w-0.5 self-stretch rounded-full ${style.dot} opacity-40`} />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-cream/80 group-hover:text-cream transition-colors truncate">
                                    {event.eventName}
                                </p>
                                {event.eventNameUrdu && (
                                    <p className="text-xs text-gold/30 font-arabic truncate mt-0.5">
                                        {event.eventNameUrdu}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] ${style.text}`}>{style.label}</span>
                                    <span className="text-[10px] text-cream/20">•</span>
                                    <span className="text-[10px] text-cream/30">
                                        {daysFromNow === 0
                                            ? 'Today'
                                            : daysFromNow === 1
                                                ? 'Tomorrow'
                                                : `In ${daysFromNow} days`}
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
