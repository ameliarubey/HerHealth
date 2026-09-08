# HerHealth Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading health & wellness apps (Flo, Clue, Headspace) combined with modern productivity tools (Notion, Linear) for data-rich sections. This hybrid approach balances emotional warmth with functional clarity.

**Core Principles**:
- Empowering & Supportive: Design should feel like a caring companion, not clinical software
- Data Clarity: Complex cycle information must be instantly understandable
- Calm & Focused: Avoid visual clutter; create breathing room for emotional safety
- Delightful Micro-moments: Subtle animations that feel rewarding, not distracting

---

## Typography

**Font Families**:
- Primary: Inter or DM Sans (clean, modern, excellent readability for data)
- Accent/Headers: Poppins or Plus Jakarta Sans (friendly, approachable warmth)

**Hierarchy**:
- Hero/Page Titles: text-4xl to text-5xl, font-semibold or font-bold
- Section Headers: text-2xl to text-3xl, font-semibold
- Card Titles: text-lg to text-xl, font-medium
- Body Text: text-base, font-normal
- Labels/Metadata: text-sm, font-medium
- Fine Print: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Element gaps: gap-4, gap-6, gap-8

**Grid System**:
- Mobile: Single column, full-width cards
- Tablet: 2-column grids for features/symptoms
- Desktop: 3-column max for card layouts, 2-column for dashboard widgets

**Container Widths**:
- Dashboard: max-w-7xl (wide workspace)
- Forms/Logs: max-w-2xl (focused input)
- Content Articles: max-w-3xl (readable text)

---

## Component Library

### Navigation
- Bottom tab bar (mobile): Home, Calendar, Log, Insights, Profile icons
- Top navigation (desktop): Horizontal menu with user avatar dropdown
- Pill-style active indicators for current section

### Dashboard Cards
- Rounded corners (rounded-xl or rounded-2xl)
- Elevated cards with soft shadows (shadow-md)
- Icon badges for cycle phases (menstrual, follicular, ovulatory, luteal)
- Large, bold numbers for "Days until next period"
- Quick-action buttons with icons (Add Mood, Log Symptoms, Add Note)

### Calendar Component
- Month view grid with date cells
- Different cell treatments:
  - Period days: Filled circles
  - Ovulation: Special icon/marker
  - Fertile window: Subtle background shading
  - Today: Bold border
  - Tap cells to expand with logged data

### Data Input Forms
- Emoji selectors for moods (happy, sad, anxious, energized, etc.)
- Icon buttons for symptoms with multi-select capability
- Slider for flow intensity (light to heavy)
- Expandable text areas for notes
- Tag chips for categorization

### Analytics/Charts
- Line graphs for cycle length trends (smooth curves, not jagged)
- Bar charts for symptom frequency
- Circular progress indicators for cycle phase
- Comparison view (This Cycle vs Average)
- Export button with PDF/CSV options

### Educational Content
- Article cards with featured images
- Category tags (Nutrition, Exercise, Mental Health)
- Reading time indicators
- Bookmark functionality
- "Cycle Wisdom" daily tips in notification-style cards

### Wellness Zone
- Meditation audio player with waveform visualization
- Workout suggestion cards with difficulty badges
- Food recommendation tiles with phase-specific icons
- Self-care checklist with satisfying checkboxes

### Partner Mode
- Toggle switch for visibility controls
- Simplified timeline view (respects privacy settings)
- Gentle notification cards
- Separate login screen with supportive messaging

### Buttons & CTAs
- Primary: Rounded-full or rounded-lg, px-6 py-3
- Secondary: Outlined with border-2
- Icon buttons: Square/circular with hover states
- Floating action button (mobile): Add/log quick entry

### Modals & Overlays
- Centered modals with backdrop blur
- Slide-up sheets for mobile (drawer pattern)
- Success confirmations with checkmark animations
- Gentle error states with helpful messaging

---

## Images

### Hero Section (Landing/Onboarding)
**Large Hero Image**: Soft, abstract illustration of a woman meditating or in nature (calming landscape, gentle sunrise). Should convey peace, self-care, and empowerment. Place as full-width background with overlay for text readability.

**Dashboard Hero (Daily View)**
**Small Accent Illustration**: Subtle icon or mini-illustration representing current cycle phase (flower blooming for ovulation, moon for menstrual). Place in top card alongside cycle day counter.

### Educational Content
**Article Thumbnails**: Health-focused stock images or soft illustrations for nutrition, exercise, wellness topics. Use in card headers (16:9 aspect ratio).

### Wellness Zone
**Meditation/Workout Cards**: Serene nature imagery or abstract gradient backgrounds. Keep calming and non-distracting.

### Profile/Settings
**Avatar Upload**: User-uploaded profile photo with circular crop. Default to gentle gradient placeholder if no upload.

---

## Visual Treatments

- Soft, rounded corners throughout (rounded-lg to rounded-2xl)
- Generous whitespace between sections (never cramped)
- Subtle gradient backgrounds for phase indicators (dawn/sunrise for follicular, bright for ovulation, sunset for luteal, night for menstrual)
- Glassmorphism for overlays (backdrop-blur-md with semi-transparent backgrounds)
- Micro-interactions: Gentle scale on button press, smooth transitions for tab switching
- Data visualization with soft curves, never harsh angles

**Theme Variations** (user-selectable):
- Rose Gold: Warm pinks, soft golds, cream backgrounds
- Moonlight: Cool blues, lavenders, silver accents
- Calm Teal: Sage greens, aqua blues, natural earth tones

All themes maintain high contrast for accessibility while feeling gentle and supportive.