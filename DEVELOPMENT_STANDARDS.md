# Development Standards & Design Philosophy

## Overview

This document outlines the core design philosophies, technical standards, and best practices for the Shopping List frontend application. These guidelines ensure consistency and maintainability across all development work.

## 🎯 Core Design Philosophy

### Mobile-First Approach
- **Primary philosophy**: Design and develop for mobile users first
- **Progressive enhancement**: Start with mobile base styles, enhance for larger screens
- **Touch-first interactions**: All interactive elements optimized for touch
- **Performance priority**: Mobile performance considerations drive all decisions

### User Experience Principles
- **Accessibility first**: WCAG 2.1 AA compliance minimum
- **Performance matters**: Fast loading and smooth interactions
- **Intuitive design**: Clear, predictable user interactions
- **Consistent patterns**: Reusable design patterns across the app

## 🛠 Technical Standards

### CSS Architecture

#### CSS Modules
- **Required**: All component styling must use CSS modules
- **Naming convention**: `ComponentName.module.css`
- **Class naming**: Use descriptive, semantic class names
- **No global styles**: Component-specific styles only (except in `index.css`)

```tsx
// ✅ Correct
import styles from './ShoppingListCard.module.css';
<div className={styles.card}>

// ❌ Incorrect
<div className="card">
```

#### Mobile-First Media Queries
- **Required**: Use `min-width` media queries only
- **Breakpoint system**:
  ```css
  /* Base: Mobile (no media query) */
  .element { /* mobile styles */ }
  
  /* Tablet portrait */
  @media (min-width: 481px) { }
  
  /* Tablet landscape / Desktop */
  @media (min-width: 769px) { }
  
  /* Large desktop */
  @media (min-width: 1201px) { }
  ```

#### Touch-Optimized Styling
- **Minimum touch targets**: 44px minimum for interactive elements
- **Touch feedback**: Use `:active` states for immediate visual feedback
- **Hover considerations**: Apply hover effects only on non-touch devices
- **Focus indicators**: Clear, accessible focus states

```css
/* ✅ Correct mobile-first approach */
.button {
  min-height: 48px; /* Mobile touch target */
  min-width: 44px;
}

.button:active {
  transform: scale(0.95); /* Touch feedback */
}

/* Desktop enhancements */
@media (min-width: 769px) {
  .button:hover {
    transform: translateY(-1px);
  }
}
```

### Component Architecture

#### React Component Standards
- **Functional components**: Use function components with hooks
- **TypeScript**: All components must be typed
- **Props interface**: Define clear interfaces for all props
- **Accessibility**: Include proper ARIA attributes and semantic HTML

```tsx
// ✅ Component template
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  prop1, 
  prop2 
}) => {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};
```

#### File Structure
```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.module.css
│   │   └── index.ts (optional barrel export)
├── utils/
├── hooks/
└── types/
```

### Performance Standards

#### CSS Performance
- **Efficient selectors**: Avoid deep nesting (max 3 levels)
- **Minimal specificity**: Keep specificity low and consistent
- **Hardware acceleration**: Use `transform` for animations
- **Critical CSS**: Inline critical styles when possible

#### React Performance
- **Memoization**: Use `useMemo`/`useCallback` for expensive operations
- **Code splitting**: Lazy load non-critical components
- **Bundle optimization**: Regular bundle size audits

### Accessibility Requirements

#### Touch Accessibility
- **Touch target size**: Minimum 44px (WCAG 2.1 guideline)
- **Touch spacing**: Adequate spacing between touch targets
- **Focus management**: Clear focus indicators and logical tab order

#### Visual Accessibility
- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Reduced motion**: Respect `prefers-reduced-motion`
- **High contrast**: Support for high contrast mode

#### Screen Reader Support
- **Semantic HTML**: Use proper HTML elements
- **ARIA labels**: Provide context where needed
- **Live regions**: Update screen readers on dynamic content changes

## 📋 Development Checklist

### Before Starting New Features
- [ ] Review existing components for reusability
- [ ] Consider mobile-first design approach
- [ ] Plan responsive breakpoints
- [ ] Consider accessibility requirements

### During Development
- [ ] Start with mobile styles (no media query)
- [ ] Add progressive enhancements with `min-width` queries
- [ ] Test touch interactions on actual devices
- [ ] Validate accessibility with screen reader testing
- [ ] Check performance impact

### Before Code Review
- [ ] CSS modules used for all styling
- [ ] Mobile-first media queries implemented
- [ ] Touch targets meet 44px minimum
- [ ] Focus states clearly visible
- [ ] TypeScript interfaces defined
- [ ] No console errors or warnings

### Quality Assurance
- [ ] Test on multiple mobile devices
- [ ] Verify in both light and dark modes
- [ ] Check reduced motion preference handling
- [ ] Validate with accessibility tools
- [ ] Performance audit completed

## 🎨 Design Tokens & Patterns

### Colors
Use Mantine's color system with CSS variables:
```css
/* Primary colors */
var(--mantine-color-blue-6)    /* Primary brand */
var(--mantine-color-green-6)   /* Success states */
var(--mantine-color-red-6)     /* Error states */
var(--mantine-color-dimmed)    /* Secondary text */
```

### Typography Scale
```css
/* Mobile-first typography */
font-size: 1rem;      /* Base mobile */
font-size: 1.1rem;    /* Slightly larger */
font-size: 1.25rem;   /* Headings mobile */
font-size: 2.2em;     /* Main heading mobile */

/* Desktop enhancements */
@media (min-width: 769px) {
  font-size: 3.2em;  /* Main heading desktop */
}
```

### Spacing System
```css
/* Consistent spacing scale */
gap: 0.5rem;    /* 8px - tight */
gap: 1rem;      /* 16px - normal */
gap: 1.5rem;    /* 24px - loose */
gap: 2rem;      /* 32px - section spacing */
```

## 🔄 Review Process

### Code Review Focus Areas
1. **Mobile-first implementation**: Verify styles start with mobile base
2. **CSS Modules usage**: Ensure no global styles in components
3. **Touch optimization**: Check interactive element sizing
4. **Accessibility compliance**: Verify focus states and semantic HTML
5. **Performance impact**: Consider bundle size and runtime performance

### Testing Requirements
- **Mobile devices**: Test on actual iOS and Android devices
- **Accessibility tools**: Use screen readers and automated testing
- **Performance monitoring**: Regular Lighthouse audits
- **Cross-browser testing**: Verify in major mobile browsers

## 📚 Resources & References

### Documentation
- [Mantine UI Documentation](https://mantine.dev/)
- [CSS Modules Guide](https://github.com/css-modules/css-modules)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Touch Target Guidelines](https://developers.google.com/web/fundamentals/accessibility/accessible-styles#multi-device_responsive_design)

### Tools
- **Development**: React DevTools, Browser DevTools
- **Accessibility**: axe DevTools, Lighthouse, Screen readers
- **Performance**: Lighthouse, Bundle Analyzer
- **Testing**: Jest, React Testing Library

## 🚨 Common Pitfalls to Avoid

### CSS Anti-Patterns
- ❌ Using `max-width` media queries (desktop-first)
- ❌ Global styles in component files
- ❌ Hover effects without touch considerations
- ❌ Small touch targets (<44px)

### React Anti-Patterns
- ❌ Missing TypeScript interfaces
- ❌ Inline styles instead of CSS modules
- ❌ Missing accessibility attributes
- ❌ Performance-heavy re-renders

### Mobile UX Anti-Patterns
- ❌ Assuming hover interactions work
- ❌ Small, hard-to-tap buttons
- ❌ Horizontal scrolling (except carousels)
- ❌ Zoom-triggering inputs on iOS

## 📈 Continuous Improvement

### Regular Audits
- **Monthly**: Performance and accessibility audits
- **Quarterly**: Design system consistency review
- **Per release**: Mobile device testing
- **Ongoing**: User feedback integration

### Standards Evolution
This document should be updated as:
- New patterns emerge
- Technology standards change
- User feedback indicates improvements
- Accessibility guidelines evolve

---

**Remember**: These standards exist to maintain consistency and quality. When in doubt, prioritize mobile users and accessibility.
