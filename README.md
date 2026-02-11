# 🌙 Wilayat Watch — Islamic Calendar 2026 (Fiqah Jafria)

A premium, spiritual web application showcasing the 2026 Fiqah Jafria calendar with integrated Shia prayer times, an animated Panjtan Pak loading screen, and a deep midnight-blue + gold aesthetic.

![Wilayat Watch](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📅 Complete 2026 Fiqah Jafria Calendar
- **Full Year Coverage**: All 12 months of 2026 with mapped Hijri dates
- **Event Types**:
  - 🟢 **Wiladat** (Birth anniversaries)
  - 🔴 **Shahadat** (Martyrdom anniversaries)
  - 🟡 **Eid** (Celebrations & special occasions)
- **Interactive Calendar Grid**: Click on events for detailed information
- **Bilingual Support**: English & Urdu text for all events

### 🕌 Accurate Prayer Times
- **Shia Ithna-Ashari Method**: Calculation method from Leva Institute, Qum (method=0)
- **Real-time Data**: Integrated with [AlAdhan API](https://aladhan.com/prayer-times-api)
- **Key Times Highlighted**:
  - Sehri (Imsak)
  - Iftar (Maghrib)
  - All 5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, Isha
- **Multi-City Support**: 40+ curated cities worldwide with pre-configured coordinates
- **Local Storage**: Remembers your selected location

### 🎨 Beautiful Spiritual Design
- **Midnight Blue & Gold Theme**: Deep navy (#0a1628) with elegant gold accents (#d4a843)
- **Glassmorphism UI**: Modern frosted glass effect cards with subtle borders
- **Animated Panjtan Pak Loading Screen**: 
  - Sequential reveal of the Five Holy Names
  - Arabic calligraphy with glow effects
  - Smooth transitions using Framer Motion
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🌍 Location Support
Cities include: Rawalpindi, Islamabad, Karachi, Lahore, Tehran, Qom, Mashhad, Karbala, Najaf, Makkah, Madinah, Dubai, London, New York, Toronto, and 25+ more!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed
- Modern web browser

### Installation

```bash
# Clone or navigate to the project directory
cd "C:\Users\User\Desktop\wilayat watch"

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
wilayat watch/
├── public/                      # Static assets
├── src/
│   ├── components/              # React components
│   │   ├── LoadingScreen.jsx    # Panjtan Pak animation
│   │   ├── Header.jsx           # Navigation header
│   │   ├── CalendarGrid.jsx     # Main calendar display
│   │   ├── PrayerTimesCard.jsx  # Prayer times widget
│   │   ├── UpcomingEvents.jsx   # Event list sidebar
│   │   ├── EventModal.jsx       # Event detail popup
│   │   ├── LocationSelector.jsx # City picker dropdown
│   │   └── Footer.jsx           # Footer with quote
│   ├── context/
│   │   └── AppContext.jsx       # Global state management
│   ├── hooks/
│   │   ├── useCalendar.js       # Calendar data hook
│   │   └── usePrayerTimes.js    # Prayer times API hook
│   ├── data/
│   │   └── calendarData.json    # 2026 events database
│   ├── App.jsx                  # Main app component
│   ├── index.css                # Global styles + Tailwind
│   └── main.jsx                 # React entry point
├── index.html                   # HTML template
├── tailwind.config.js           # Tailwind theme config
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## 🛠 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.3.1 | Build tool & dev server |
| **Tailwind CSS** | 3.4.19 | Utility-first styling |
| **Framer Motion** | 12.34.0 | Animation library |
| **Luxon** | 3.7.2 | Date/time handling |
| **moment-hijri** | 3.0.0 | Hijri calendar conversion |
| **React Icons** | 5.5.0 | Icon components |

## 🎨 Design System

### Color Palette
```css
Midnight:     #0a1628 (deep navy blue)
Midnight Light: #1a2744
Gold:         #d4a843
Gold Light:   #f0d078
Cream:        #f5f0e8
Soft White:   #fafaf7
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Arabic/Urdu**: Amiri

### Components
- Glassmorphism cards with `backdrop-blur-lg`
- Gold gradient text effects
- Animated event badges
- Responsive grid layouts

## 📖 API Integration

### AlAdhan Prayer Times API
**Endpoint**: `https://api.aladhan.com/v1/timings/{date}`

**Parameters**:
- `latitude` & `longitude`: City coordinates
- `method=0`: Shia Ithna-Ashari (Leva Institute, Qum)

**Response Mapping**:
- Imsak → Sehri
- Maghrib → Iftar

## 📅 Calendar Data Structure

Events in `calendarData.json` follow this schema:

```json
{
  "gregorianDate": "2026-01-13",
  "hijriDay": 13,
  "hijriMonth": "Rajab",
  "hijriYear": 1447,
  "eventName": "Wiladat Imam Ali (as)",
  "eventNameUrdu": "ولادت حضرت علی علیہ السلام",
  "eventType": "wiladat",
  "description": "Birth anniversary of Imam Ali ibn Abi Talib (as)"
}
```

## 🎯 Key Features Implemented

- ✅ Animated Panjtan Pak loading screen with sequential name reveal
- ✅ Full 2026 calendar with accurate Hijri date mapping
- ✅ Real-time prayer times for 40+ cities
- ✅ Interactive event modals with bilingual content
- ✅ Upcoming events sidebar
- ✅ Responsive mobile-first design
- ✅ Month navigation with smooth animations
- ✅ Location persistence using localStorage
- ✅ Color-coded event types (Wiladat/Shahadat/Eid)
- ✅ Glassmorphism UI with gold accents

## 🔮 Future Enhancements

- [ ] Add authentic Arabic calligraphy SVGs for Panjtan Pak names
- [ ] Implement PWA (Progressive Web App) support
- [ ] Add notification reminders for prayers
- [ ] Multi-language support (Farsi, Arabic)
- [ ] Export calendar to PDF/iCal
- [ ] Dark/Light mode toggle
- [ ] Integration with more prayer time calculation methods

## 📄 License

This project is created for spiritual and educational purposes for the Shia Muslim community.

## 💝 Dedication

*Made with love for the Ahl ul-Bayt (as)*

> **إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا**
> 
> "Allah only intends to keep impurity away from you, O People of the Household, and to purify you completely."
> 
> — Surah Al-Ahzab, Ayah 33

---

**Wilayat Watch** © 2026 | Prayer times via AlAdhan API • Method: Shia Ithna-Ashari (Qum)
