import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSunrise, FiSun, FiSunset, FiMoon } from 'react-icons/fi';

const prayerIcons = {
    fajr: FiSunrise,
    dhuhr: FiSun,
    asr: FiSun,
    maghrib: FiSunset,
    isha: FiMoon,
};

function parseTime(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    return time;
}

function getNextPrayer(prayerTimes) {
    if (!prayerTimes) return null;

    const now = new Date();
    console.log('Current time:', now.toLocaleString());
    
    const prayers = [
        { name: 'Fajr', key: 'fajr', time: parseTime(prayerTimes.fajr) },
        { name: 'Dhuhr', key: 'dhuhr', time: parseTime(prayerTimes.dhuhr) },
        { name: 'Asr', key: 'asr', time: parseTime(prayerTimes.asr) },
        { name: 'Maghrib', key: 'maghrib', time: parseTime(prayerTimes.maghrib) },
        { name: 'Isha', key: 'isha', time: parseTime(prayerTimes.isha) },
    ];

    console.log('Prayer times for comparison:', prayers.map(p => ({ 
        name: p.name, 
        time: p.time?.toLocaleTimeString() 
    })));

    // Find next prayer
    for (const prayer of prayers) {
        if (prayer.time && prayer.time > now) {
            console.log('Next prayer found:', prayer.name, prayer.time.toLocaleString());
            return prayer;
        }
    }

    // If no prayer today, return Fajr tomorrow
    const fajrTomorrow = parseTime(prayerTimes.fajr);
    if (fajrTomorrow) {
        fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
        console.log('All prayers passed, next is Fajr tomorrow:', fajrTomorrow.toLocaleString());
        return { name: 'Fajr', key: 'fajr', time: fajrTomorrow };
    }

    return null;
}

function getTimeRemaining(targetTime) {
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, total: diff };
}

export default function PrayerCountdown({ prayerTimes }) {
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);

    useEffect(() => {
        const next = getNextPrayer(prayerTimes);
        setNextPrayer(next);

        const interval = setInterval(() => {
            if (next && next.time) {
                const remaining = getTimeRemaining(next.time);
                setTimeRemaining(remaining);

                // Update next prayer if time passed
                if (!remaining) {
                    setNextPrayer(getNextPrayer(prayerTimes));
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [prayerTimes]);

    if (!nextPrayer || !timeRemaining) {
        return null;
    }

    const Icon = prayerIcons[nextPrayer.key] || FiClock;
    const progress = 100 - (timeRemaining.total / (6 * 60 * 60 * 1000)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 relative overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FiClock className="text-gold/60" size={16} />
                        <span className="text-xs text-gold/50 uppercase tracking-wider">Next Prayer</span>
                    </div>
                    <Icon className="text-gold/40" size={20} />
                </div>

                <div className="text-center mb-4">
                    <h3 className="text-2xl font-serif text-cream mb-2">{nextPrayer.name}</h3>
                    <p className="text-xs text-cream/40">
                        {nextPrayer.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                        <motion.div
                            key={timeRemaining.hours}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-3xl font-bold text-gold"
                        >
                            {String(timeRemaining.hours).padStart(2, '0')}
                        </motion.div>
                        <div className="text-[10px] text-cream/40 uppercase tracking-wider mt-1">Hours</div>
                    </div>
                    <div className="text-2xl text-gold/30">:</div>
                    <div className="text-center">
                        <motion.div
                            key={timeRemaining.minutes}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-3xl font-bold text-gold"
                        >
                            {String(timeRemaining.minutes).padStart(2, '0')}
                        </motion.div>
                        <div className="text-[10px] text-cream/40 uppercase tracking-wider mt-1">Minutes</div>
                    </div>
                    <div className="text-2xl text-gold/30">:</div>
                    <div className="text-center">
                        <motion.div
                            key={timeRemaining.seconds}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-3xl font-bold text-gold"
                        >
                            {String(timeRemaining.seconds).padStart(2, '0')}
                        </motion.div>
                        <div className="text-[10px] text-cream/40 uppercase tracking-wider mt-1">Seconds</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-midnight/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
