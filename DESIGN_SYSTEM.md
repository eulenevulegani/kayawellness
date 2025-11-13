# KAYA Design System

## Brand Philosophy
Every design decision should reinforce the **cosmic-wellness fusion**: the vastness of the universe meeting intimate personal growth. Users should feel they're exploring their own infinite inner space.

## Theme Colors

### Primary Brand Colors (The Cosmic Palette)
- **Primary Gradient**: `from-cyan-400 to-teal-400` (Main CTAs, primary actions - represents possibility & growth)
- **Background**: `bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900` (Deep space - vast & infinite)
- **Secondary**: `from-cyan-500/20 to-teal-500/20` (Nebula clouds - soft, ethereal backgrounds)

### Accent Colors (Cosmic Events)
- **Success/Growth**: `from-green-400 to-teal-400` (New life emerging)
- **Achievement**: `from-yellow-400 to-orange-400` (Starburst moments)
- **Streak/Fire**: `from-orange-400 to-red-500` (Cosmic energy, dedication)
- **Progress**: `from-purple-500 to-blue-500` (Stellar evolution)

## Typography Scale (Cosmic Voice)

### Headings (Light, Ethereal, Spacious)
- **H1 (Page Title)**: `text-3xl md:text-5xl font-light tracking-wide` - Use sparingly, for major moments
- **H2 (Section Title)**: `text-2xl md:text-3xl font-light` - Gentle hierarchy
- **H3 (Card Title)**: `text-xl font-semibold` - Clear but not heavy
- **H4 (Subsection)**: `text-lg font-medium` - Subtle emphasis

### Body Text (Readable, Calming)
- **Body Large**: `text-base text-white/90 leading-relaxed` - Primary content
- **Body**: `text-sm text-white/80 leading-relaxed` - Secondary content
- **Small**: `text-xs text-white/70` - Metadata
- **Caption**: `text-xs text-white/60` - Subtle hints

### Voice Principles
- Use "light" and "thin" font weights for cosmic etherealness
- Letter-spacing for KAYA logo: `tracking-[0.3em]`
- Line height should feel airy: `leading-relaxed`

## Component Patterns

### Buttons (Cosmic Interactions)
```tsx
// Primary CTA (Starburst - for main actions)
className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-900 rounded-full font-semibold hover:opacity-90 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30"

// Secondary Button (Nebula - for alternative actions)
className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium hover:bg-white/20 hover:border-white/30 transition transform hover:scale-105"

// Tertiary/Ghost Button (Stellar whisper)
className="px-4 py-2 text-white/80 hover:text-white transition"

// Interactive Card Button (When entire card is clickable)
className="w-full text-left transition transform hover:scale-[1.02] active:scale-[0.98]"
```

### Cards (Cosmic Containers)
```tsx
// Standard Card (Floating in space)
className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"

// Accent Card - Cyan (Nebula glow)
className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 rounded-2xl p-6 shadow-lg shadow-cyan-500/10"

// Featured Card (Stellar highlight)
className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"

// Active/Selected State
className="border-cyan-400 shadow-lg shadow-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-teal-500/20"
```

### Layout
```tsx
// Full Page Container with Scroll
className="min-h-screen p-6 overflow-y-auto"

// Content Max Width
className="max-w-6xl mx-auto"

// Sections
className="mb-6" // between major sections
```

## Spacing System
- **Tight**: `gap-2` / `p-2` / `mb-2`
- **Normal**: `gap-4` / `p-4` / `mb-4`
- **Comfortable**: `gap-6` / `p-6` / `mb-6`
- **Spacious**: `gap-8` / `p-8` / `mb-8`

## Animation Principles (Cosmic Motion)

### Core Animations
```css
/* Gentle Pulse - For breathing, living elements */
@keyframes gentle-pulse {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}
.animate-gentle-pulse { animation: gentle-pulse 4s ease-in-out infinite; }

/* Fade In - Page transitions */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.7s ease-out forwards; }

/* Particle Float - Cosmic dust */
@keyframes particle-float {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
}
```

### Motion Guidelines
1. **Scale on hover**: `hover:scale-105` for buttons, `hover:scale-[1.02]` for cards
2. **Active feedback**: `active:scale-95` for pressed states
3. **Smooth transitions**: Always use `transition` or `transition-all duration-300`
4. **Pulse for importance**: Active elements should gently pulse (orbs, notifications)
5. **Float for particles**: Background elements should drift weightlessly

## Consistent Patterns
1. All full-page views should have `overflow-y-auto` for scrolling
2. Page headers always use `text-3xl font-light text-white tracking-wide`
3. Primary CTA buttons always use cyan-teal gradient with shadow
4. Secondary actions use white/10 with border and backdrop-blur
5. All cards have subtle backdrop-blur for depth
6. Border colors always at 10-30% opacity for subtlety
7. Rounded corners: `rounded-2xl` for cards, `rounded-full` for buttons
8. All interactive elements should have scale transform on hover
9. Icons should be 20-24px for nav, 16-20px inline
10. Empty states should feel hopeful, not discouraging
