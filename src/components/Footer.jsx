import { motion } from 'framer-motion';
import { FiHeart, FiMoon } from 'react-icons/fi';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative mt-12 border-t border-gold/10"
        >
            {/* Top glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Spiritual quote */}
                <div className="text-center mb-6">
                    <p className="font-arabic text-lg text-gold/40 mb-2">
                        إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا
                    </p>
                    <p className="text-xs text-cream/30 italic">
                        "Allah only intends to keep impurity away from you, O People of the Household, and to purify you completely."
                    </p>
                    <p className="text-[10px] text-cream/20 mt-1">— Surah Al-Ahzab, Ayah 33</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <FiMoon className="text-gold/30" size={14} />
                        <span className="text-xs text-cream/30">
                            Wilayat Watch © 2026
                        </span>
                    </div>

                    <p className="text-xs text-cream/20 flex items-center gap-1">
                        Made with <FiHeart className="text-red-400/40" size={10} /> for the love of Ahl ul-Bayt (as)
                        <span className="text-cream/30 ml-1">by Syed Shahnabi</span>
                    </p>

                    <p className="text-[10px] text-cream/20">
                        Prayer times via AlAdhan API • Method: Shia Ithna-Ashari (Qum)
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
