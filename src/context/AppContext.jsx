import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const FIQH_STORAGE_KEY = 'wilayat-watch-fiqh';

export function AppProvider({ children }) {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    // Fiqh preference: 'jaferia' or 'hanafiya'
    const [fiqh, setFiqhState] = useState(() => {
        try {
            const saved = localStorage.getItem(FIQH_STORAGE_KEY);
            return saved || 'jaferia'; // Default to Jaferia
        } catch {
            return 'jaferia';
        }
    });

    const setFiqh = useCallback((newFiqh) => {
        console.log('AppContext - setFiqh called with:', newFiqh);
        setFiqhState(newFiqh);
        try {
            localStorage.setItem(FIQH_STORAGE_KEY, newFiqh);
        } catch {
            // localStorage might be full or disabled
        }
    }, []);

    const navigateMonth = useCallback((direction) => {
        setSelectedMonth(prev => {
            let newMonth = prev + direction;
            if (newMonth > 12) {
                setSelectedYear(y => y + 1);
                return 1;
            }
            if (newMonth < 1) {
                setSelectedYear(y => y - 1);
                return 12;
            }
            return newMonth;
        });
    }, []);

    const goToToday = useCallback(() => {
        const now = new Date();
        setSelectedMonth(now.getMonth() + 1);
        setSelectedYear(now.getFullYear());
    }, []);

    const value = {
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        navigateMonth,
        goToToday,
        isLoading,
        setIsLoading,
        selectedEvent,
        setSelectedEvent,
        fiqh,
        setFiqh,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
