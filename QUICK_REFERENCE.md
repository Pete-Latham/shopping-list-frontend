# Quick Reference Guide

## 🚀 Creating New Components

### 1. Use the Template
```bash
# Copy the templates to your new component
cp templates/Component.template.tsx src/components/YourComponent/YourComponent.tsx
cp templates/Component.module.css.template src/components/YourComponent/YourComponent.module.css
```

### 2. Follow the Naming Convention
- Component file: `YourComponent.tsx`
- Styles file: `YourComponent.module.css`
- Export component: `export const YourComponent: React.FC<Props> = ...`

## 📱 Mobile-First CSS Checklist

### ✅ Always Start With Mobile
```css
/* ✅ Correct - Mobile base styles */
.button {
  min-height: 48px;
  width: 100%;
  font-size: 1rem;
}

/* ✅ Then enhance for desktop */
@media (min-width: 769px) {
  .button {
    width: auto;
    min-width: 120px;
  }
}
```

### ❌ Never Start With Desktop
```css
/* ❌ Wrong - Desktop-first approach */
.button {
  width: 120px;
}

@media (max-width: 768px) {
  .button {
    width: 100%;
  }
}
```

## 🎯 Standard Breakpoints

```css
/* Mobile base (no media query) */
.element { }

/* Tablet portrait: 481px+ */
@media (min-width: 481px) { }

/* Tablet landscape/Desktop: 769px+ */
@media (min-width: 769px) { }

/* Large desktop: 1201px+ */
@media (min-width: 1201px) { }
```

## 👆 Touch Target Requirements

```css
/* Minimum touch targets */
.interactive-element {
  min-height: 44px;
  min-width: 44px;
}

/* Recommended for primary actions */
.primary-button {
  min-height: 48px;
  min-width: 48px;
}
```

## 🎨 Using Design Tokens

```css
/* Colors */
background: var(--mantine-color-blue-6);
color: var(--mantine-color-text);
border: 1px solid var(--mantine-color-gray-2);

/* Dark mode colors */
background: var(--mantine-color-dark-6);
border-color: var(--mantine-color-dark-4);
```

## 🔄 Touch vs Hover Interactions

```css
/* Touch feedback for mobile */
.button:active {
  transform: scale(0.98);
}

/* Hover effects only on desktop */
@media (min-width: 769px) {
  .button:hover {
    transform: translateY(-1px);
  }
}
```

## ♿ Accessibility Essentials

```tsx
// Proper semantic HTML
<button 
  type="button"
  aria-label="Close dialog"
  onClick={handleClose}
>
  ×
</button>

// Focus management
<div 
  role="region"
  aria-labelledby="section-title"
>
  <h2 id="section-title">Section Title</h2>
</div>
```

## 📦 Component Interface Template

```tsx
interface ComponentProps {
  // Required props
  id: string;
  title: string;
  
  // Optional props with defaults
  isVisible?: boolean;
  variant?: 'primary' | 'secondary';
  
  // Event handlers
  onAction?: (id: string) => void;
  
  // Composition
  children?: React.ReactNode;
  className?: string;
}
```

## 🧪 Testing Commands

```bash
# Type check
npx tsc --noEmit

# Lint check
npm run lint

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🔍 Common Issues & Solutions

### Issue: Component not responsive on mobile
**Solution**: Check if you're using CSS modules and mobile-first breakpoints
```css
/* Make sure you're using min-width, not max-width */
@media (min-width: 481px) { /* ✅ */ }
@media (max-width: 768px) { /* ❌ */ }
```

### Issue: Touch targets too small
**Solution**: Ensure minimum 44px touch targets
```css
.button {
  min-height: 44px;
  min-width: 44px;
}
```

### Issue: Hover effects on mobile
**Solution**: Only apply hover on desktop breakpoints
```css
/* ❌ Wrong - affects mobile */
.button:hover { }

/* ✅ Correct - desktop only */
@media (min-width: 769px) {
  .button:hover { }
}
```

## 🎛️ VS Code Settings for Project

Add to your `.vscode/settings.json`:
```json
{
  "css.lint.unknownAtRules": "ignore",
  "css.customData": [".vscode/css-data.json"],
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🚨 Pre-Commit Checklist

- [ ] Used CSS modules for styling
- [ ] Started with mobile styles (no media query)
- [ ] Used min-width for responsive breakpoints
- [ ] Touch targets minimum 44px
- [ ] TypeScript interfaces defined
- [ ] Accessibility attributes added
- [ ] No console errors/warnings
- [ ] Tested on mobile device or dev tools
