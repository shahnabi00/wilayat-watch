import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import CalendarGrid from './components/CalendarGrid';
import PrayerTimesCard from './components/PrayerTimesCard';
import RamadanTimesSelector from './components/RamadanTimesSelector';
import TasbihCounter from './components/TasbihCounter';
import QiblaFinder from './components/QiblaFinder';
import UpcomingEvents from './components/UpcomingEvents';
import EventModal from './components/EventModal';
import Footer from './components/Footer';
import { usePrayerTimes } from './hooks/usePrayerTimes';

function AppContent() {
  const prayerTimesData = usePrayerTimes();
  const { prayerTimes, location, updateLocation, loading, error, refreshTimes } = prayerTimesData;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="min-h-screen flex flex-col"
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gradient-gold mb-3">
            Islamic Calendar 2026
          </h2>
          <p className="text-sm md:text-base text-cream/40 max-w-lg mx-auto">
            A comprehensive Fiqah Jafria calendar with accurate Shia prayer times,
            important events, and Hijri date tracking.
          </p>
          <p className="mt-2 font-arabic text-gold/30 text-lg">
            تقویم اسلامی ۲۰۲۶ — فقہ جعفریہ
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="calendar">
          {/* Calendar - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <CalendarGrid />
            
            {/* Feature cards row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TasbihCounter />
              <QiblaFinder location={location} />
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6" id="prayer-times">
            <RamadanTimesSelector 
              location={location} 
              updateLocation={updateLocation}
            />
            <PrayerTimesCard 
              prayerTimes={prayerTimes}
              loading={loading}
              error={error}
              location={location}
              updateLocation={updateLocation}
            />
            <UpcomingEvents />
          </div>
        </div>
      </main>

      <Footer />
      <EventModal />
    </motion.div>
  );
}

export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <ThemeProvider>
      <AppProvider>
        <AnimatePresence mode="wait">
          {showLoading ? (
            <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
          ) : (
            <AppContent key="content" />
          )}
        </AnimatePresence>
      </AppProvider>
    </ThemeProvider>
  );
}
