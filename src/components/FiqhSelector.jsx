import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiChevronDown } from 'react-icons/fi';

const FIQH_OPTIONS = [
    {
        value: 'jaferia',
        label: 'Fiqh-e-Jaferia',
        labelUrdu: 'فقہ جعفریہ',
        description: 'Shia Ithna Ashari',
        method: 0, // Jafari method
        school: 0,
    },
    {
        value: 'hanafiya',
        label: 'Fiqh-e-Hanafiya',
        labelUrdu: 'فقہ حنفیہ',
        description: 'Hanafi (Karachi)',
        method: 1, // Karachi method
        school: 1, // Hanafi school for Asr
    },
];

export default function FiqhSelector({ fiqh, onFiqhChange }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const currentFiqh = FIQH_OPTIONS.find(f => f.value === fiqh) || FIQH_OPTIONS[0];

    const handleSelect = (fiqhOption) => {
        console.log('FiqhSelector - Changing fiqh to:', fiqhOption.value, 'with method:', fiqhOption.method, 'school:', fiqhOption.school);
        onFiqhChange(fiqhOption.value);
        setIsOpen(false);
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
                <FiBook className="text-gold group-hover:text-gold-light transition-colors" size={16} />
                <div className="flex-1 text-left">
                    <p className="text-sm text-cream font-medium">{currentFiqh.label}</p>
                    <p className="text-xs text-cream/40 font-arabic">{currentFiqh.labelUrdu}</p>
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
                        className="absolute z-30 mt-2 w-full overflow-hidden 
                       bg-midnight-light border border-gold/20 rounded-xl shadow-2xl"
                        style={{ transformOrigin: 'top' }}
                    >
                        <div className="py-1">
                            {FIQH_OPTIONS.map((fiqhOption) => (
                                <button
                                    key={fiqhOption.value}
                                    onClick={() => handleSelect(fiqhOption)}
                                    className={`w-full text-left px-4 py-3 transition-colors
                                        ${fiqh === fiqhOption.value
                                            ? 'bg-gold/10 border-l-2 border-gold'
                                            : 'hover:bg-gold/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-cream font-medium">
                                                {fiqhOption.label}
                                            </p>
                                            <p className="text-xs text-gold/60 font-arabic mt-0.5">
                                                {fiqhOption.labelUrdu}
                                            </p>
                                            <p className="text-[10px] text-cream/30 mt-1">
                                                {fiqhOption.description}
                                            </p>
                                        </div>
                                        {fiqh === fiqhOption.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-2 h-2 bg-gold rounded-full"
                                            />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Export the mapping for use in usePrayerTimes
export function getFiqhMethod(fiqh) {
    const option = FIQH_OPTIONS.find(f => f.value === fiqh);
    return option ? option.method : 0; // Default to Jaferia
}

export function getFiqhSchool(fiqh) {
    const option = FIQH_OPTIONS.find(f => f.value === fiqh);
    return option ? option.school : 0; // Default to Jaferia
}

export function getFiqhName(fiqh) {
    const option = FIQH_OPTIONS.find(f => f.value === fiqh);
    return option ? option.description : 'Shia (Qum)';
}
