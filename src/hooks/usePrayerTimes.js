import { useState, useEffect, useCallback } from 'react';
import { getFiqhMethod, getFiqhSchool } from '../components/FiqhSelector';

const DEFAULT_LOCATION = {
    city: 'Rawalpindi',
    country: 'Pakistan',
    latitude: 33.5651,
    longitude: 73.0169,
};

const STORAGE_KEY = 'wilayat-watch-location';

export function usePrayerTimes(fiqh = 'jaferia') {
    const [location, setLocation] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
        } catch {
            return DEFAULT_LOCATION;
        }
    });

    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrayerTimes = useCallback(async (loc, date = new Date(), selectedFiqh = 'jaferia') => {
        setLoading(true);
        setError(null);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        try {
            // Get the calculation method based on selected Fiqh
            // method=0: Shia Ithna-Ashari (Leva Institute, Qum) - Jafari calculation
            // method=1: University of Islamic Sciences, Karachi - Hanafi calculation
            // school=0: Shafi (earlier Asr) / school=1: Hanafi (later Asr)
            const method = getFiqhMethod(selectedFiqh);
            const school = getFiqhSchool(selectedFiqh);
            
            console.log(`Fetching prayer times for ${loc.city} with Fiqh: ${selectedFiqh}, Method: ${method}, School: ${school}`);
            
            // Add cache-busting parameter
            const timestamp = Date.now();
            const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${loc.latitude}&longitude=${loc.longitude}&method=${method}&school=${school}&_=${timestamp}`;
            console.log('API URL:', url);
            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch prayer times');
            }

            const data = await response.json();
            const timings = data.data.timings;
            const hijriDate = data.data.date.hijri;
            
            console.log('Raw API timings received:', timings);
            console.log('API meta:', data.data.meta);

            const newPrayerTimes = {
                fajr: timings.Fajr,
                sunrise: timings.Sunrise,
                dhuhr: timings.Dhuhr,
                asr: timings.Asr,
                maghrib: timings.Maghrib,
                isha: timings.Isha,
                imsak: timings.Imsak,
                midnight: timings.Midnight,
                // Sehri and Iftar times
                sehri: timings.Imsak,    // Sehri ends at Imsak
                iftar: timings.Maghrib,   // Iftar is at Maghrib
                // Hijri date from API
                hijriDay: hijriDate.day,
                hijriMonth: hijriDate.month.en,
                hijriMonthAr: hijriDate.month.ar,
                hijriYear: hijriDate.year,
                hijriDesignation: hijriDate.designation.abbreviated,
                // Gregorian info
                gregorianDate: data.data.date.readable,
            };
            
            console.log(`Prayer times received:`, {
                fiqh: selectedFiqh,
                fajr: newPrayerTimes.fajr,
                dhuhr: newPrayerTimes.dhuhr,
                asr: newPrayerTimes.asr,
                maghrib: newPrayerTimes.maghrib,
                isha: newPrayerTimes.isha,
                sehri: newPrayerTimes.sehri,
                iftar: newPrayerTimes.iftar
            });
            
            setPrayerTimes(newPrayerTimes);
        } catch (err) {
            setError(err.message || 'Unable to fetch prayer times. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateLocation = useCallback((newLocation) => {
        setLocation(newLocation);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        } catch {
            // localStorage might be full or disabled
        }
    }, []);

    useEffect(() => {
        console.log('useEffect triggered - fetching prayer times with fiqh:', fiqh);
        fetchPrayerTimes(location, new Date(), fiqh);
    }, [location, fiqh, fetchPrayerTimes]);

    const refreshTimes = useCallback((date) => {
        fetchPrayerTimes(location, date, fiqh);
    }, [location, fiqh, fetchPrayerTimes]);

    return {
        prayerTimes,
        loading,
        error,
        location,
        updateLocation,
        refreshTimes,
    };
}

// Curated list of major cities with coordinates
export const CITIES = [
    // Pakistan
    { city: 'Rawalpindi', country: 'Pakistan', latitude: 33.5651, longitude: 73.0169 },
    { city: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
    { city: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
    { city: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
    { city: 'Peshawar', country: 'Pakistan', latitude: 34.0151, longitude: 71.5249 },
    { city: 'Quetta', country: 'Pakistan', latitude: 30.1798, longitude: 66.975 },
    { city: 'Multan', country: 'Pakistan', latitude: 30.1575, longitude: 71.5249 },
    { city: 'Faisalabad', country: 'Pakistan', latitude: 31.4504, longitude: 73.135 },
    { city: 'Gilgit', country: 'Pakistan', latitude: 35.9208, longitude: 74.3144 },
    { city: 'Skardu', country: 'Pakistan', latitude: 35.2971, longitude: 75.6334 },
    // Iran
    { city: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.389 },
    { city: 'Qom', country: 'Iran', latitude: 34.6416, longitude: 50.8746 },
    { city: 'Mashhad', country: 'Iran', latitude: 36.2605, longitude: 59.6168 },
    { city: 'Isfahan', country: 'Iran', latitude: 32.6546, longitude: 51.668 },
    // Iraq
    { city: 'Karbala', country: 'Iraq', latitude: 32.6162, longitude: 44.0243 },
    { city: 'Najaf', country: 'Iraq', latitude: 32.0003, longitude: 44.3362 },
    { city: 'Baghdad', country: 'Iraq', latitude: 33.3128, longitude: 44.3615 },
    // Saudi Arabia
    { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
    { city: 'Madinah', country: 'Saudi Arabia', latitude: 24.4539, longitude: 39.6142 },
    { city: 'Jeddah', country: 'Saudi Arabia', latitude: 21.5433, longitude: 39.1728 },
    // UAE
    { city: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
    { city: 'Abu Dhabi', country: 'UAE', latitude: 24.4539, longitude: 54.3773 },
    // India
    { city: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462 },
    { city: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777 },
    { city: 'Hyderabad', country: 'India', latitude: 17.385, longitude: 78.4867 },
    { city: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.209 },
    // UK / US / Canada
    { city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278 },
    { city: 'Birmingham', country: 'UK', latitude: 52.4862, longitude: -1.8904 },
    { city: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.006 },
    { city: 'Houston', country: 'USA', latitude: 29.7604, longitude: -95.3698 },
    { city: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437 },
    { city: 'Chicago', country: 'USA', latitude: 41.8781, longitude: -87.6298 },
    { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
    // Lebanon
    { city: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018 },
    // Bahrain
    { city: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.5860 },
    // Kuwait
    { city: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774 },
    // Australia
    { city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
    { city: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
];

// Group cities by country
export const CITIES_BY_COUNTRY = CITIES.reduce((acc, city) => {
    if (!acc[city.country]) {
        acc[city.country] = [];
    }
    acc[city.country].push(city);
    return acc;
}, {});
