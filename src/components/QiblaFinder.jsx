import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiNavigation, FiMapPin } from 'react-icons/fi';

function calculateQibla(latitude, longitude) {
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const lat1 = (latitude * Math.PI) / 180;
    const lat2 = (kaabaLat * Math.PI) / 180;
    const dLng = ((kaabaLng - longitude) * Math.PI) / 180;

    const y = Math.sin(dLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);

    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
}

function getCompassDirection(angle) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(angle / 22.5) % 16;
    return directions[index];
}

export default function QiblaFinder({ location }) {
    const [deviceHeading, setDeviceHeading] = useState(0);
    const [isSupported, setIsSupported] = useState(true);
    const [qiblaAngle, setQiblaAngle] = useState(0);

    useEffect(() => {
        if (!location) return;

        const angle = calculateQibla(location.latitude, location.longitude);
        setQiblaAngle(angle);
    }, [location]);

    useEffect(() => {
        if (!('DeviceOrientationEvent' in window)) {
            setIsSupported(false);
            return;
        }

        const handleOrientation = (event) => {
            if (event.alpha !== null) {
                setDeviceHeading(360 - event.alpha);
            }
        };

        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        setIsSupported(false);
                    }
                })
                .catch(() => setIsSupported(false));
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const relativeAngle = (qiblaAngle - deviceHeading + 360) % 360;
    const compassDirection = getCompassDirection(qiblaAngle);

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs text-gold/50 uppercase tracking-wider">Qibla Direction</h3>
                <FiMapPin className="text-gold/40" size={14} />
            </div>

            {/* Compass */}
            <div className="relative aspect-square max-w-[250px] mx-auto mb-4">
                {/* Compass base */}
                <motion.div
                    animate={{ rotate: -deviceHeading }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    className="absolute inset-0"
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Outer circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gold/20"
                        />
                        
                        {/* Direction markers */}
                        {['N', 'E', 'S', 'W'].map((dir, i) => {
                            const angle = i * 90;
                            const rad = (angle * Math.PI) / 180;
                            const x = 100 + 75 * Math.sin(rad);
                            const y = 100 - 75 * Math.cos(rad);
                            
                            return (
                                <text
                                    key={dir}
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={`text-sm font-semibold ${dir === 'N' ? 'fill-gold' : 'fill-cream/40'}`}
                                >
                                    {dir}
                                </text>
                            );
                        })}

                        {/* Tick marks */}
                        {[...Array(36)].map((_, i) => {
                            const angle = i * 10;
                            const rad = (angle * Math.PI) / 180;
                            const x1 = 100 + 85 * Math.sin(rad);
                            const y1 = 100 - 85 * Math.cos(rad);
                            const x2 = 100 + (angle % 30 === 0 ? 75 : 80) * Math.sin(rad);
                            const y2 = 100 - (angle % 30 === 0 ? 75 : 80) * Math.cos(rad);
                            
                            return (
                                <line
                                    key={i}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="currentColor"
                                    strokeWidth={angle % 30 === 0 ? 2 : 1}
                                    className="text-gold/30"
                                />
                            );
                        })}
                    </svg>
                </motion.div>

                {/* Qibla pointer */}
                <motion.div
                    animate={{ rotate: qiblaAngle }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="relative">
                        <FiNavigation
                            className="text-gold drop-shadow-[0_0_10px_rgba(212,168,67,0.6)]"
                            size={48}
                            style={{ transform: 'rotate(45deg)' }}
                        />
                        <div className="absolute inset-0 text-gold blur-md opacity-50">
                            <FiNavigation size={48} style={{ transform: 'rotate(45deg)' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gold shadow-gold-glow" />
                </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-2">
                <div>
                    <p className="text-2xl font-bold text-gold">
                        {Math.round(qiblaAngle)}°
                    </p>
                    <p className="text-xs text-cream/40">
                        {compassDirection} from {location?.city || 'your location'}
                    </p>
                </div>

                {!isSupported && (
                    <p className="text-xs text-cream/40 italic mt-2">
                        Compass requires device orientation sensors
                    </p>
                )}

                <p className="text-[10px] text-gold/30 mt-3">
                    ☪️ Direction to Masjid al-Haram, Makkah
                </p>
            </div>
        </div>
    );
}
