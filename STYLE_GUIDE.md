# KAYA Visual Style Quick Reference

## 🎨 Color Palette

### Primary Theme
```
Cyan-Teal Gradient: from-cyan-400 to-teal-400
Background: from-cyan-500/20 to-teal-500/20
Border: border-cyan-400/30
Icon Color: text-cyan-400
```

### Accent Colors
```
Success: from-green-400 to-teal-400
Warning: from-yellow-400 to-orange-400
Streak/Fire: from-orange-400 to-red-500
Gamification: from-purple-900 via-blue-900 to-indigo-900
```

## 📝 Typography

```
H1 Page Title:     text-3xl font-light text-white
H2 Section:        text-2xl font-semibold text-white
H3 Card Title:     text-xl font-semibold text-white
H4 Subsection:     text-lg font-semibold text-white

Body Large:        text-base text-white/90
Body:              text-sm text-white/80
Body Secondary:    text-sm text-white/70
Small:             text-xs text-white/60
Caption:           text-xs text-white/50
```

## 🔘 Buttons

### Primary CTA
```tsx
bg-gradient-to-r from-cyan-400 to-teal-400 
text-cyan-900 
rounded-full 
px-6 py-3 
font-semibold 
hover:opacity-90 
text-sm
```

### Secondary Button
```tsx
bg-white/10 
text-white 
rounded-full 
px-6 py-3 
font-semibold 
hover:bg-white/20 
text-sm
```

## 📦 Cards

### Standard Card
```tsx
bg-white/5 
backdrop-blur-md 
rounded-xl 
p-6 
border border-white/10
```

### Themed Card (Cyan)
```tsx
bg-gradient-to-br from-cyan-500/20 to-teal-500/20 
border border-cyan-400/30 
rounded-xl 
p-6
```

### Streak Card (Orange)
```tsx
bg-gradient-to-br from-orange-500/20 to-red-500/20 
border border-orange-500/30 
rounded-xl 
p-6
```

## 📐 Layout

### Full Page Container
```tsx
<div className="min-h-screen p-6 overflow-y-auto">
  <div className="max-w-5xl mx-auto">
    {/* Content */}
  </div>
</div>
```

### Page Header
```tsx
<header className="mb-6">
  <h1 className="text-3xl font-light text-white">Title</h1>
  <p className="text-white/70 text-sm mt-1">Subtitle</p>
</header>
```

## 📏 Spacing

```
Tight:        gap-2 / p-2 / mb-2
Normal:       gap-4 / p-4 / mb-4
Comfortable:  gap-6 / p-6 / mb-6
Spacious:     gap-8 / p-8 / mb-8
```

## ✨ Special Cases

### Crisis Banner
```tsx
bg-gradient-to-r from-red-500/20 to-orange-500/20 
border-2 border-red-400/50
```

### Premium Unlock
```tsx
bg-gradient-to-br from-cyan-500/20 to-teal-500/20 
border border-cyan-400/30
```

### Gamification Section
```tsx
bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900
```

## 🎯 Usage Rules

1. ✅ Always use cyan-teal for primary actions
2. ✅ Use white/10 or white/20 for secondary actions
3. ✅ All pages must have overflow-y-auto for scrolling
4. ✅ Maintain text hierarchy (3xl → 2xl → xl → lg → base → sm → xs)
5. ✅ Use backdrop-blur-md for depth on cards
6. ✅ Border opacity should be 10-30% for subtlety
7. ✅ Section spacing: mb-6 between major sections
8. ✅ Card padding: p-4 (compact) or p-6 (standard)

## 🚫 Don't Do

- ❌ Mix purple/blue gradients with cyan/teal outside gamification
- ❌ Use fixed heights (h-[90vh]) - use min-h-screen instead
- ❌ Vary font sizes arbitrarily - follow hierarchy
- ❌ Forget hover states on interactive elements
- ❌ Use solid colors for CTA buttons - use gradients
