import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiChevronDown, FiSearch } from 'react-icons/fi';
import { CITIES_BY_COUNTRY } from '../hooks/usePrayerTimes';

export default function LocationSelector({ location, onLocationChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCities = useMemo(() => {
        if (!searchQuery.trim()) return CITIES_BY_COUNTRY;

        const query = searchQuery.toLowerCase();
        const result = {};

        Object.entries(CITIES_BY_COUNTRY).forEach(([country, cities]) => {
            const filtered = cities.filter(
                c =>
                    c.city.toLowerCase().includes(query) ||
                    c.country.toLowerCase().includes(query)
            );
            if (filtered.length > 0) {
                result[country] = filtered;
            }
        });

        return result;
    }, [searchQuery]);

    const handleSelect = (city) => {
        onLocationChange(city);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/20 
                   bg-midnight-light/60 hover:border-gold/40 hover:bg-midnight-light 
                   transition-all duration-200 group w-full"
            >
                <FiMapPin className="text-gold group-hover:text-gold-light transition-colors" size={16} />
                <div className="flex-1 text-left">
                    <p className="text-sm text-cream font-medium">{location.city}</p>
                    <p className="text-xs text-cream/40">{location.country}</p>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FiChevronDown className="text-gold/50" size={16} />
                </motion.div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-30 mt-2 w-full max-h-80 overflow-hidden 
                       bg-midnight-light border border-gold/20 rounded-xl shadow-2xl"
                        style={{ transformOrigin: 'top' }}
                    >
                        {/* Search */}
                        <div className="p-3 border-b border-gold/10">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/40" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search city..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-midnight/60 border border-gold/10 rounded-lg
                           text-sm text-cream placeholder-cream/30 focus:outline-none 
                           focus:border-gold/30 transition-colors"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* City list */}
                        <div className="overflow-y-auto max-h-60 py-1">
                            {Object.entries(filteredCities).map(([country, cities]) => (
                                <div key={country}>
                                    <div className="px-3 py-1.5 text-[10px] font-semibold text-gold/50 
                               uppercase tracking-wider sticky top-0 bg-midnight-light">
                                        {country}
                                    </div>
                                    {cities.map((city) => (
                                        <button
                                            key={`${city.city}-${city.country}`}
                                            onClick={() => handleSelect(city)}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors
                        ${location.city === city.city && location.country === city.country
                                                    ? 'bg-gold/10 text-gold'
                                                    : 'text-cream/70 hover:bg-gold/5 hover:text-cream'
                                                }`}
                                        >
                                            {city.city}
                                        </button>
                                    ))}
                                </div>
                            ))}

                            {Object.keys(filteredCities).length === 0 && (
                                <p className="text-center py-6 text-cream/30 text-sm">No cities found</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => { setIsOpen(false); setSearchQuery(''); }}
                />
            )}
        </div>
    );
}
