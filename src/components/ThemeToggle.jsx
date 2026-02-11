import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full 
                     bg-gold/10 hover:bg-gold/20 border border-gold/20 
                     transition-colors duration-300 group"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-3"
            >
                <FiMoon className="text-gold" size={16} />
            </motion.div>
            
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute left-3"
            >
                <FiSun className="text-gold" size={16} />
            </motion.div>

            <span className="ml-6 text-xs text-gold/70 group-hover:text-gold transition-colors">
                {isDark ? 'Dark' : 'Light'}
            </span>
        </motion.button>
    );
}
