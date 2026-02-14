import { motion } from 'framer-motion';
import { FiSunrise, FiSunset, FiSun, FiMoon, FiClock, FiLoader } from 'react-icons/fi';
import LocationSelector from './LocationSelector';
import FiqhSelector, { getFiqhName } from './FiqhSelector';
import { useState, useEffect } from 'react';

const prayerList = [
    { key: 'fajr', label: 'Fajr', icon: FiSunrise, labelUrdu: 'فجر' },
    { key: 'dhuhr', label: 'Dhuhr', icon: FiSun, labelUrdu: 'ظہر' },
    { key: 'asr', label: 'Asr', icon: FiSun, labelUrdu: 'عصر' },
    { key: 'maghrib', label: 'Maghrib', icon: FiSunset, labelUrdu: 'مغرب' },
    { key: 'isha', label: 'Isha', icon: FiMoon, labelUrdu: 'عشاء' },
];

function parseTime(timeStr) {
    if (!timeStr) return NaN;
    // Strip any timezone suffix like "(PKT)" and trim
    const clean = timeStr.replace(/\s*\(.*\)/, '').trim();
    const [h, m] = clean.split(':').map(Number);
    return h * 60 + m;
}

function formatTime12(time24) {
    if (!time24) return '--:--';
    const clean = time24.replace(/\s*\(.*\)/, '').trim();
    const [h, m] = clean.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '--:--';
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function getCurrentPrayer(prayerTimes) {
    if (!prayerTimes) return null;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { key: 'fajr', time: prayerTimes.fajr },
        { key: 'dhuhr', time: prayerTimes.dhuhr },
        { key: 'asr', time: prayerTimes.asr },
        { key: 'maghrib', time: prayerTimes.maghrib },
        { key: 'isha', time: prayerTimes.isha },
    ];
    
    for (let i = 0; i < prayers.length; i++) {
        const prayerMinutes = parseTime(prayers[i].time);
        if (isNaN(prayerMinutes)) continue;
        
        if (currentMinutes < prayerMinutes) {
            return i > 0 ? prayers[i - 1].key : null;
        }
    }
    
    return prayers[prayers.length - 1].key;
}

export default function PrayerTimesCard({ prayerTimes, loading, error, location, updateLocation, fiqh, setFiqh }) {
    const [currentPrayer, setCurrentPrayer] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    useEffect(() => {
        const updateCurrent = () => {
            setCurrentPrayer(getCurrentPrayer(prayerTimes));
        };
        
        updateCurrent();
        const interval = setInterval(updateCurrent, 60000); // Update every minute
        
        return () => clearInterval(interval);
    }, [prayerTimes]);

    useEffect(() => {
        if (prayerTimes) {
            setLastUpdated(new Date().toLocaleTimeString());
        }
    }, [prayerTimes]);

    return (
        <div className="space-y-4">
            {/* Fiqh selector */}
            <FiqhSelector fiqh={fiqh} onFiqhChange={setFiqh} />
            
            {/* Location selector */}
            <LocationSelector location={location} onLocationChange={updateLocation} />

            {/* Current Fiqh Badge */}
            <div className="text-center py-2 px-4 bg-gold/5 border border-gold/20 rounded-lg">
                <p className="text-xs text-gold/70">
                    Currently showing times for: <span className="font-semibold text-gold">{fiqh === 'jaferia' ? 'Fiqh-e-Jaferia' : 'Fiqh-e-Hanafiya'}</span>
                </p>
            </div>

            {/* Today's Hijri date */}
            {prayerTimes && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-2"
                >
                    <p className="text-sm font-arabic text-gold/60">
                        {prayerTimes.hijriDay} {prayerTimes.hijriMonthAr} {prayerTimes.hijriYear}
                    </p>
                    <p className="text-xs text-cream/40 mt-0.5">
                        {prayerTimes.hijriDay} {prayerTimes.hijriMonth} {prayerTimes.hijriYear} {prayerTimes.hijriDesignation}
                    </p>
                </motion.div>
            )}

            {/* All prayer times */}
            <div className="glass-card p-4" key={`prayer-times-${fiqh}`}>
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xs text-gold/50 uppercase tracking-wider flex items-center gap-2">
                        <FiClock size={12} />
                        Prayer Times
                        <span className="text-cream/30">• {getFiqhName(fiqh)}</span>
                    </h3>
                    {lastUpdated && (
                        <span className="text-[10px] text-cream/20">
                            Updated: {lastUpdated}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    {prayerList.map(({ key, label, icon: Icon, labelUrdu }, index) => {
                        const isCurrent = currentPrayer === key;
                        
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className={`relative py-2.5 px-3 rounded-lg transition-all
                                    ${ isCurrent 
                                        ? 'bg-gold/10 border border-gold/30' 
                                        : 'hover:bg-gold/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`transition-colors ${
                                            isCurrent ? 'text-gold' : 'text-gold/40'
                                        }`} size={14} />
                                        <span className={`text-sm ${
                                            isCurrent ? 'text-cream font-medium' : 'text-cream/80'
                                        }`}>{label}</span>
                                        <span className="text-xs text-gold/30 font-arabic">{labelUrdu}</span>
                                    </div>
                                    {loading ? (
                                        <div className="w-16 h-4 bg-midnight/50 rounded animate-pulse" />
                                    ) : (
                                        <span className={`text-sm font-medium ${
                                            isCurrent ? 'text-gold' : 'text-cream'
                                        }`}>
                                            {formatTime12(prayerTimes?.[key])}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Progress bar for current prayer */}
                                {isCurrent && !loading && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="mt-2 h-1 bg-midnight/30 rounded-full overflow-hidden"
                                        style={{ transformOrigin: 'left' }}
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-gold to-gold-light"
                                            animate={{ width: ['0%', '100%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Error state */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                    <p className="text-sm text-red-400">{error}</p>
                    <p className="text-xs text-cream/30 mt-1">Please check your internet connection</p>
                </motion.div>
            )}
        </div>
    );
}
