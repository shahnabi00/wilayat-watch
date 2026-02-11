import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const names = [
    { english: 'Muhammad', arabic: 'محمد ﷺ', honorific: '(saw)' },
    { english: 'Ali', arabic: 'علی علیہ السلام', honorific: '(as)' },
    { english: 'Fatimah', arabic: 'فاطمۃ سلام اللہ علیہا', honorific: '(sa)' },
    { english: 'Hasan', arabic: 'حسن علیہ السلام', honorific: '(as)' },
    { english: 'Husayn', arabic: 'حسین علیہ السلام', honorific: '(as)' },
];

const letterVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        }
    },
};

const nameContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: [0, 0.6, 0],
        scale: [0.8, 1.2, 0.8],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        }
    },
};

// SVG path for a decorative Islamic geometric border
const decorativePath = "M50,0 L100,50 L50,100 L0,50 Z";

export default function LoadingScreen({ onLoadingComplete }) {
    const [currentNameIndex, setCurrentNameIndex] = useState(0);
    const [showAllNames, setShowAllNames] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (currentNameIndex < names.length - 1) {
            const timer = setTimeout(() => {
                setCurrentNameIndex(prev => prev + 1);
            }, 700);
            return () => clearTimeout(timer);
        } else {
            const showAllTimer = setTimeout(() => {
                setShowAllNames(true);
            }, 800);
            return () => clearTimeout(showAllTimer);
        }
    }, [currentNameIndex]);

    useEffect(() => {
        if (showAllNames) {
            const exitTimer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => {
                    onLoadingComplete?.();
                }, 800);
            }, 2000);
            return () => clearTimeout(exitTimer);
        }
    }, [showAllNames, onLoadingComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-midnight overflow-hidden"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Background glow effects */}
                    <motion.div
                        className="absolute w-96 h-96 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(212, 168, 67, 0.15) 0%, transparent 70%)',
                        }}
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                    />

                    <motion.div
                        className="absolute w-64 h-64 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(212, 168, 67, 0.1) 0%, transparent 60%)',
                            top: '20%',
                            right: '20%',
                        }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                    />

                    {/* Decorative corner elements */}
                    <svg className="absolute top-8 left-8 w-16 h-16 text-gold/20" viewBox="0 0 100 100">
                        <motion.path
                            d={decorativePath}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                    </svg>

                    <svg className="absolute bottom-8 right-8 w-16 h-16 text-gold/20 rotate-180" viewBox="0 0 100 100">
                        <motion.path
                            d={decorativePath}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
                        />
                    </svg>

                    <div className="text-center relative z-10">
                        {/* Title */}
                        <motion.p
                            className="text-gold/60 text-sm tracking-[0.3em] uppercase mb-8 font-sans"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 1 }}
                        >
                            بسم اللہ الرحمن الرحیم
                        </motion.p>

                        {/* Sequential name reveal */}
                        {!showAllNames && (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentNameIndex}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                    className="mb-4"
                                >
                                    <p className="font-arabic text-4xl md:text-5xl text-gold mb-2 text-shadow-gold">
                                        {names[currentNameIndex].arabic}
                                    </p>
                                    <p className="font-serif text-2xl md:text-3xl text-cream">
                                        {names[currentNameIndex].english}{' '}
                                        <span className="text-gold/70 text-lg">{names[currentNameIndex].honorific}</span>
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* All names together */}
                        {showAllNames && (
                            <motion.div
                                variants={nameContainerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-3"
                            >
                                {names.map((name, index) => (
                                    <motion.div
                                        key={name.english}
                                        variants={letterVariants}
                                        className="flex items-center justify-center gap-4"
                                    >
                                        <span className="font-arabic text-2xl md:text-3xl text-gold/80">
                                            {name.arabic}
                                        </span>
                                    </motion.div>
                                ))}
                                
                                {/* Surah Fatiha dedication */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="mt-8 pt-6 border-t border-gold/20"
                                >
                                    <p className="text-sm text-cream/60 leading-relaxed max-w-md mx-auto">
                                        Recite a Surah Fatiha for
                                    </p>
                                    <p className="text-lg font-serif text-gold/90 mt-2">
                                        Syed Tatheer Hussain
                                    </p>
                                    <p className="text-xs text-cream/40 italic mt-1">
                                        (My Grandfather)
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Bottom decorative line */}
                        <motion.div
                            className="mt-12 flex items-center justify-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            <motion.div
                                className="h-px bg-gradient-to-r from-transparent to-gold/50"
                                initial={{ width: 0 }}
                                animate={{ width: 80 }}
                                transition={{ delay: 1.5, duration: 1.5 }}
                            />
                            <motion.div
                                className="w-2 h-2 rounded-full bg-gold"
                                animate={{
                                    boxShadow: ['0 0 10px rgba(212,168,67,0.3)', '0 0 20px rgba(212,168,67,0.6)', '0 0 10px rgba(212,168,67,0.3)'],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-px bg-gradient-to-l from-transparent to-gold/50"
                                initial={{ width: 0 }}
                                animate={{ width: 80 }}
                                transition={{ delay: 1.5, duration: 1.5 }}
                            />
                        </motion.div>

                        {/* Wilayat Watch brand */}
                        <motion.h2
                            className="mt-6 text-sm tracking-[0.4em] uppercase text-cream/40 font-sans"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                        >
                            Wilayat Watch
                        </motion.h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
