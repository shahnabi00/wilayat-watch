import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiSunrise, FiSunset, FiClock } from 'react-icons/fi';

function formatTime12(time24) {
    if (!time24) return '--:--';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Ramadan 1447 starts on Feb 19, 2026
const RAMADAN_START_2026 = new Date(2026, 1, 19); // Month is 0-indexed (1 = February)
const RAMADAN_DAYS = 30;

function getRamadanDate(dayNumber) {
    const date = new Date(RAMADAN_START_2026);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date;
}

function getCurrentRamadanDay() {
    const today = new Date();
    const diffTime = today - RAMADAN_START_2026;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 1 && diffDays <= RAMADAN_DAYS) {
        return diffDays;
    }
    return null;
}

export default function RamadanTimesSelector({ location, updateLocation }) {
    const currentRamadanDay = getCurrentRamadanDay();
    const [selectedDay, setSelectedDay] = useState(currentRamadanDay || 1);
    const [dayPrayerTimes, setDayPrayerTimes] = useState(null);
    const [isLoadingDay, setIsLoadingDay] = useState(false);

    useEffect(() => {
        const fetchDayTimes = async () => {
            if (!location || !location.latitude || !location.longitude) {
                console.log('No location available');
                return;
            }
            
            console.log('Fetching Ramadan times for:', location.city, 'Day:', selectedDay);
            setIsLoadingDay(true);
            const selectedDate = getRamadanDate(selectedDay);
            
            try {
                const day = selectedDate.getDate();
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();

                // Using method=0: Shia Ithna-Ashari (Leva Institute, Qum) - Jafari calculation
                const response = await fetch(
                    `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${location.latitude}&longitude=${location.longitude}&method=0`
                );

                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                const timings = data.data.timings;

                console.log('Ramadan times updated:', timings.Imsak, '-', timings.Maghrib);

                setDayPrayerTimes({
                    fajr: timings.Fajr,
                    sunrise: timings.Sunrise,
                    dhuhr: timings.Dhuhr,
                    asr: timings.Asr,
                    maghrib: timings.Maghrib,
                    isha: timings.Isha,
                    imsak: timings.Imsak,
                });
            } catch (err) {
                console.error('Error fetching Ramadan times:', err);
            } finally {
                setIsLoadingDay(false);
            }
        };

        fetchDayTimes();
    }, [selectedDay, location?.latitude, location?.longitude, location?.city]);

    const handleDayChange = (day) => {
        setSelectedDay(day);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiCalendar className="text-gold" size={20} />
                    <h3 className="text-lg font-serif text-cream">Ramadan 1447 Times</h3>
                </div>
                {currentRamadanDay && (
                    <span className="text-xs text-gold/60 bg-gold/10 px-2 py-1 rounded">
                        Today: {currentRamadanDay} Ramadan
                    </span>
                )}
            </div>

            {/* Day Selector */}
            <div className="space-y-2">
                <label className="text-xs text-cream/60 uppercase tracking-wider">Select Ramadan Day</label>
                <select
                    value={selectedDay}
                    onChange={(e) => handleDayChange(Number(e.target.value))}
                    className="w-full bg-midnight/50 border border-gold/20 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-gold/40 transition-colors"
                >
                    {Array.from({ length: RAMADAN_DAYS }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                            {day} Ramadan {day === currentRamadanDay ? '(Today)' : ''} - {getRamadanDate(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading State */}
            {isLoadingDay && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                </div>
            )}

            {/* Sehri & Iftar Times */}
            {!isLoadingDay && dayPrayerTimes && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDay}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {/* Sehri & Iftar Highlight */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-lg p-4 text-center">
                                <FiSunrise className="mx-auto text-gold/60 mb-2" size={24} />
                                <p className="text-xs text-gold/50 uppercase tracking-wider mb-1">Sehri Ends</p>
                                <p className="text-xs text-gold/40 font-arabic mb-1">سحری</p>
                                <p className="text-lg font-bold text-gold">{formatTime12(dayPrayerTimes.imsak)}</p>
                                <p className="text-[10px] text-cream/40 mt-1">Imsak</p>
                            </div>

                            <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-lg p-4 text-center">
                                <FiSunset className="mx-auto text-gold/60 mb-2" size={24} />
                                <p className="text-xs text-gold/50 uppercase tracking-wider mb-1">Iftar</p>
                                <p className="text-xs text-gold/40 font-arabic mb-1">افطار</p>
                                <p className="text-lg font-bold text-gold">{formatTime12(dayPrayerTimes.maghrib)}</p>
                                <p className="text-[10px] text-cream/40 mt-1">Maghrib</p>
                            </div>
                        </div>

                        {/* All Prayer Times for Selected Day */}
                        <div className="space-y-2">
                            <h4 className="text-xs text-cream/60 uppercase tracking-wider flex items-center gap-2">
                                <FiClock size={12} />
                                Prayer Times
                            </h4>
                            <div className="space-y-1">
                                {[
                                    { key: 'fajr', label: 'Fajr', labelUrdu: 'فجر' },
                                    { key: 'sunrise', label: 'Sunrise', labelUrdu: 'طلوع' },
                                    { key: 'dhuhr', label: 'Dhuhr', labelUrdu: 'ظہر' },
                                    { key: 'asr', label: 'Asr', labelUrdu: 'عصر' },
                                    { key: 'maghrib', label: 'Maghrib', labelUrdu: 'مغرب' },
                                    { key: 'isha', label: 'Isha', labelUrdu: 'عشاء' },
                                ].map((prayer) => (
                                    <div
                                        key={prayer.key}
                                        className="flex items-center justify-between py-2 border-b border-cream/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-cream/80">{prayer.label}</span>
                                            <span className="text-xs text-gold/40 font-arabic">{prayer.labelUrdu}</span>
                                        </div>
                                        <span className="text-sm font-mono text-gold/90">
                                            {formatTime12(dayPrayerTimes[prayer.key])}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    );
}
