import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRotateCcw, FiCheck } from 'react-icons/fi';

const TASBIH_PRESETS = [
    { name: 'Subhan Allah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33 },
    { name: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33 },
    { name: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 34 },
    { name: 'Custom', arabic: 'ذکر', target: 100 },
];

export default function TasbihCounter() {
    const [count, setCount] = useState(0);
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);

    const currentPreset = TASBIH_PRESETS[selectedPreset];
    const isComplete = count >= currentPreset.target;

    const handleIncrement = useCallback(() => {
        const newCount = count + 1;
        setCount(newCount);

        if (newCount === currentPreset.target) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
            
            // Vibrate if supported
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    }, [count, currentPreset.target]);

    const handleReset = () => {
        setCount(0);
        setShowCelebration(false);
    };

    const progress = (count / currentPreset.target) * 100;

    return (
        <div className="glass-card p-6 relative overflow-hidden">
            {/* Celebration overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-gold/20 backdrop-blur-sm z-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            className="text-center"
                        >
                            <FiCheck className="text-green-400 mx-auto mb-2" size={48} />
                            <p className="text-xl font-serif text-cream">Masha Allah!</p>
                            <p className="text-sm text-gold/80 mt-1">Target Completed</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="mb-4">
                <h3 className="text-xs text-gold/50 uppercase tracking-wider mb-3">Digital Tasbih</h3>
                
                {/* Preset selector */}
                <div className="grid grid-cols-4 gap-2">
                    {TASBIH_PRESETS.map((preset, idx) => (
                        <button
                            key={preset.name}
                            onClick={() => {
                                setSelectedPreset(idx);
                                setCount(0);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                                selectedPreset === idx
                                    ? 'bg-gold/20 text-gold border border-gold/30'
                                    : 'bg-midnight/50 text-cream/50 border border-transparent hover:border-gold/20'
                            }`}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Arabic text */}
            <motion.div
                key={selectedPreset}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <p className="text-3xl font-arabic text-gold text-shadow-gold mb-2">
                    {currentPreset.arabic}
                </p>
                <p className="text-sm text-cream/60">{currentPreset.name}</p>
            </motion.div>

            {/* Counter display */}
            <motion.button
                onClick={handleIncrement}
                whileTap={{ scale: 0.95 }}
                className="w-full aspect-square max-w-[200px] mx-auto mb-6 relative group"
            >
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-midnight/50"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className={isComplete ? 'text-green-400' : 'text-gold'}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        style={{
                            strokeDasharray: '283',
                            strokeDashoffset: 0,
                        }}
                    />
                </svg>

                {/* Count */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={count}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-6xl font-bold ${isComplete ? 'text-green-400' : 'text-gold'}`}
                    >
                        {count}
                    </motion.div>
                    <div className="text-xs text-cream/40 mt-2">
                        of {currentPreset.target}
                    </div>
                </div>

                {/* Ripple effect on tap */}
                <div className="absolute inset-0 rounded-full border-2 border-gold/0 group-active:border-gold/30 transition-all duration-200" />
            </motion.button>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight/50 
                             text-cream/70 hover:text-cream hover:bg-midnight/70 
                             transition-all duration-200 text-sm"
                >
                    <FiRotateCcw size={14} />
                    Reset
                </button>
                
                <div className="text-xs text-cream/40">
                    Tap to count
                </div>
            </div>
        </div>
    );
}
