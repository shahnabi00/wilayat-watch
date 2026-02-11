import { motion } from 'framer-motion';
import { FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-30"
        >
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FiMoon className="text-gold" size={28} />
                        <div className="absolute inset-0 text-gold blur-md opacity-40">
                            <FiMoon size={28} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-serif text-gradient-gold leading-tight tracking-wide">
                            Wilayat Watch
                        </h1>
                        <p className="text-[10px] text-cream/30 tracking-[0.2em] uppercase">
                            Fiqah Jafria Calendar 2026
                        </p>
                    </div>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#calendar" className="text-sm text-cream/60 hover:text-gold transition-colors">
                        Calendar
                    </a>
                    <a href="#prayer-times" className="text-sm text-cream/60 hover:text-gold transition-colors">
                        Prayer Times
                    </a>
                    <a href="#events" className="text-sm text-cream/60 hover:text-gold transition-colors">
                        Events
                    </a>
                    <ThemeToggle />
                </nav>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden p-2 text-gold/70 hover:text-gold transition-colors"
                >
                    {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
            </div>

            {/* Mobile nav */}
            {menuOpen && (
                <motion.nav
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-gold/10 bg-midnight-light/80 backdrop-blur-lg"
                >
                    <div className="px-4 py-3 space-y-2">
                        <a
                            href="#calendar"
                            onClick={() => setMenuOpen(false)}
                            className="block py-2 text-sm text-cream/60 hover:text-gold transition-colors"
                        >
                            Calendar
                        </a>
                        <a
                            href="#prayer-times"
                            onClick={() => setMenuOpen(false)}
                            className="block py-2 text-sm text-cream/60 hover:text-gold transition-colors"
                        >
                            Prayer Times
                        </a>
                        <a
                            href="#events"
                            onClick={() => setMenuOpen(false)}
                            className="block py-2 text-sm text-cream/60 hover:text-gold transition-colors"
                        >
                            Events
                        </a>
                        <div className="pt-2 border-t border-gold/10">
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.nav>
            )}

            {/* Bottom border glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.header>
    );
}
