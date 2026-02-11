import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const typeConfig = {
    wiladat: {
        label: 'Wiladat',
        gradient: 'from-green-500/20 to-green-600/5',
        border: 'border-green-500/30',
        accent: 'text-green-400',
        badge: 'badge-wiladat',
        icon: '🌙',
    },
    shahadat: {
        label: 'Shahadat',
        gradient: 'from-red-500/20 to-red-600/5',
        border: 'border-red-500/30',
        accent: 'text-red-400',
        badge: 'badge-shahadat',
        icon: '🕯️',
    },
    eid: {
        label: 'Eid / Occasion',
        gradient: 'from-gold/20 to-gold/5',
        border: 'border-gold/30',
        accent: 'text-gold',
        badge: 'badge-eid',
        icon: '✨',
    },
};

export default function EventModal() {
    const { selectedEvent, setSelectedEvent } = useAppContext();

    if (!selectedEvent) return null;

    const config = typeConfig[selectedEvent.eventType] || typeConfig.eid;

    return (
        <AnimatePresence>
            {selectedEvent && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedEvent(null)}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`
              relative w-full max-w-md bg-gradient-to-b ${config.gradient} 
              bg-midnight-light border ${config.border} 
              rounded-2xl shadow-2xl overflow-hidden
            `}>
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full 
                         bg-midnight/50 text-cream/70 hover:text-cream 
                         hover:bg-midnight/80 transition-colors"
                            >
                                <FiX size={18} />
                            </button>

                            {/* Icon */}
                            <div className="text-center pt-8 pb-4">
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.1 }}
                                    className="text-5xl"
                                >
                                    {config.icon}
                                </motion.span>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-8 text-center">
                                <span className={config.badge}>
                                    {config.label}
                                </span>

                                <h3 className="mt-4 text-xl md:text-2xl font-serif text-cream leading-tight">
                                    {selectedEvent.eventName}
                                </h3>

                                {selectedEvent.eventNameUrdu && (
                                    <p className="mt-3 text-2xl font-arabic text-gold/80 text-shadow-gold">
                                        {selectedEvent.eventNameUrdu}
                                    </p>
                                )}

                                <div className="mt-4 flex items-center justify-center gap-3 text-sm text-cream/60">
                                    <span>{new Date(selectedEvent.gregorianDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}</span>
                                </div>

                                {selectedEvent.hijriDay && (
                                    <p className="mt-1 text-sm text-gold/60 font-arabic">
                                        {selectedEvent.hijriDay} {selectedEvent.hijriMonth} {selectedEvent.hijriYear} AH
                                    </p>
                                )}

                                {selectedEvent.description && (
                                    <p className="mt-4 text-sm text-cream/60 leading-relaxed">
                                        {selectedEvent.description}
                                    </p>
                                )}

                                {/* Decorative divider */}
                                <div className="mt-6 flex items-center justify-center gap-2">
                                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/30" />
                                    <div className={`w-1.5 h-1.5 rounded-full ${config.accent.replace('text-', 'bg-')}`} />
                                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/30" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
