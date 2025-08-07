# CSS Modules Migration Guide

## Overview

This project has been successfully migrated to use CSS Modules alongside Mantine UI components. This hybrid approach gives us the best of both worlds: the power and consistency of Mantine's component system combined with scoped, maintainable custom styling.

## Benefits Achieved

✅ **Scoped Styling**: CSS classes are automatically scoped to components, preventing naming conflicts  
✅ **Type Safety**: TypeScript support for CSS class names with autocompletion  
✅ **Better Maintainability**: Clear relationship between components and their styles  
✅ **Tree Shaking**: Unused CSS can be eliminated from the final bundle  
✅ **Hybrid Architecture**: Mantine components + CSS modules for custom styling  

## File Structure

```
src/
├── App.module.css                      # Main app layout styles
├── App.tsx                            # Uses CSS modules
├── components/
│   ├── ShoppingListCard.module.css    # Card-specific styles
│   ├── ShoppingListCard.tsx           # Mantine + CSS modules
│   ├── ShoppingListItem.module.css    # Item-specific styles
│   ├── ShoppingListItem.tsx           # Mantine + CSS modules
│   ├── AddItemForm.module.css         # Form-specific styles
│   └── AddItemForm.tsx                # Mantine + CSS modules
└── index.css                          # Global styles only
```

## Usage Examples

### 1. Basic CSS Modules Usage

```tsx
import styles from './Component.module.css';

export const Component = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello World</h1>
    </div>
  );
};
```

### 2. Conditional Classes with clsx

```tsx
import { clsx } from 'clsx';
import styles from './Component.module.css';

export const Component = ({ isActive, isDisabled }) => {
  return (
    <div className={clsx(styles.container, {
      [styles.active]: isActive,
      [styles.disabled]: isDisabled
    })}>
      Content
    </div>
  );
};
```

### 3. Combining Mantine with CSS Modules

```tsx
import { Button } from '@mantine/core';
import styles from './Component.module.css';

export const Component = () => {
  return (
    <div className={styles.container}>
      {/* Use Mantine component with custom CSS module class */}
      <Button className={styles.customButton}>
        Click Me
      </Button>
    </div>
  );
};
```

## Best Practices

### 1. Naming Conventions

- Use **camelCase** for class names in CSS modules:
  ```css
  .cardContainer { }
  .primaryButton { }
  .isActive { }
  ```

- Use **kebab-case** for CSS custom properties:
  ```css
  .container {
    --primary-color: blue;
    --border-radius: 8px;
  }
  ```

### 2. Component Organization

```css
/* Component.module.css */

/* Main component styles */
.container {
  /* Base styles */
}

/* Variants */
.container.primary {
  /* Primary variant */
}

.container.secondary {
  /* Secondary variant */
}

/* State classes */
.container.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Child elements */
.title {
  /* Title styles */
}

.content {
  /* Content styles */
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    /* Mobile styles */
  }
}
```

### 3. Integration with Mantine

- **Use Mantine for**: Core UI components, form inputs, buttons, modals
- **Use CSS Modules for**: Custom layouts, animations, component-specific styling
- **Use CSS Variables**: Leverage Mantine's CSS variables in your modules

```css
.customCard {
  background: var(--mantine-color-body);
  border: 1px solid var(--mantine-color-gray-3);
  color: var(--mantine-color-text);
}
```

### 4. File Organization

- One CSS module file per component
- Name CSS modules as `ComponentName.module.css`
- Keep global styles in `index.css`
- Use CSS custom properties for theming

## Migration Checklist

- [x] Convert `App.css` to `App.module.css`
- [x] Update component imports to use CSS modules
- [x] Add `clsx` for conditional class handling
- [x] Create component-specific CSS module files
- [x] Update className usage to use CSS module classes
- [x] Clean up unused CSS files
- [x] Verify build process works correctly
- [x] Test responsive design
- [x] Test dark mode compatibility

## TypeScript Support

Vite automatically generates TypeScript declarations for CSS modules. You get:

- **Autocompletion** for CSS class names
- **Type checking** for class name usage
- **IntelliSense** in your IDE

```tsx
// TypeScript will know about all classes in styles
import styles from './Component.module.css';

// ✅ Autocomplete available
<div className={styles.container}>

// ❌ TypeScript error for non-existent class
<div className={styles.nonExistentClass}>
```

## Performance Benefits

1. **CSS Tree Shaking**: Unused styles are eliminated
2. **Scoped Styles**: Reduced CSS bundle size
3. **Better Caching**: Styles are bundled with components
4. **Reduced Runtime**: No runtime CSS-in-JS overhead

## Development Workflow

1. Create component TypeScript file
2. Create corresponding `.module.css` file
3. Import styles and use className properties
4. Use `clsx` for conditional styling
5. Leverage Mantine components for UI elements
6. Use CSS custom properties for theming

## Common Patterns

### Animation Classes

```css
.fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Responsive Design

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
```

### Dark Mode Support

```css
.card {
  background: var(--mantine-color-body);
  border: 1px solid var(--mantine-color-gray-3);
}

@media (prefers-color-scheme: dark) {
  .card {
    border-color: var(--mantine-color-dark-4);
  }
}
```

## Resources

- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Vite CSS Modules Guide](https://vitejs.dev/guide/features.html#css-modules)
- [Mantine Styling Guide](https://mantine.dev/styles/styles-api/)
- [clsx Documentation](https://github.com/lukeed/clsx)
