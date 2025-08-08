# 🛒 Shopping Lists Frontend

A mobile-first React application for managing shopping lists, built with modern web technologies and optimized for touch interactions.

## 🌟 Features

- **Mobile-First Design**: Optimized for mobile users with progressive enhancement for desktop
- **Touch-Optimized**: 44px+ touch targets, gesture support, and mobile-friendly interactions
- **Responsive**: Adaptive layouts that work seamlessly across all device sizes
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **PWA Ready**: Installable as a mobile app with offline capabilities
- **Modern Stack**: React 19, TypeScript, Vite, and Mantine UI components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server

#### Running Frontend Only
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`

#### Full Development Setup (Frontend + Backend)

1. **Start the backend server** (in a separate terminal):
   ```bash
   # Navigate to your backend directory
   cd ../shopping-list-backend
   
   # Start the backend server on port 3000
   npm run dev
   ```

2. **Start the frontend development server**:
   ```bash
   # In the frontend directory
   npm run dev
   ```

3. **Access the application**:
   - Frontend: `http://localhost:5173/`
   - Backend API: `http://localhost:3000/`

The frontend is configured with a Vite proxy to automatically forward API requests to the backend, avoiding CORS issues during development.

## 📱 Mobile-First Development

This project follows a **strict mobile-first approach**. All new development must:

1. Start with mobile base styles (no media queries)
2. Use `min-width` media queries for progressive enhancement
3. Ensure 44px+ touch targets for all interactive elements
4. Test on actual mobile devices

See [Development Standards](./DEVELOPMENT_STANDARDS.md) for detailed guidelines.

## 📚 Documentation

- **[Development Standards](./DEVELOPMENT_STANDARDS.md)** - Core philosophies and technical standards
- **[Mobile-First Improvements](./MOBILE_FIRST_IMPROVEMENTS.md)** - Details on mobile optimizations
- **[Quick Reference](./QUICK_REFERENCE.md)** - Common patterns and solutions
- **[Component Templates](./templates/)** - Templates for consistent development

## 🎨 Tech Stack

- **React 19** - UI library with modern concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Mantine** - Component library with accessibility built-in
- **CSS Modules** - Scoped styling approach
- **TanStack Query** - Server state management
- **Axios** - HTTP client for API communication

## 🎯 Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   └── ComponentName.module.css
├── hooks/              # Custom React hooks  
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

### CSS Architecture
- **CSS Modules** for component-scoped styles
- **Mobile-first** breakpoints using `min-width` queries
- **Mantine design tokens** for consistent theming
- **Touch-optimized** interactions with proper feedback

### Responsive Breakpoints
```css
/* Mobile (base) - no media query */
/* Tablet portrait: 481px+ */
/* Tablet landscape/Desktop: 769px+ */
/* Large desktop: 1201px+ */
```

## ⚙️ Development Workflow

### Before Starting Work
1. Review [Development Standards](./DEVELOPMENT_STANDARDS.md)
2. Check existing components for reusability
3. Plan mobile-first approach
4. Consider accessibility requirements

### Creating New Components
```bash
# Use the provided templates
cp templates/Component.template.tsx src/components/NewComponent/NewComponent.tsx
cp templates/Component.module.css.template src/components/NewComponent/NewComponent.module.css
```

### Quality Checks
```bash
# Type checking
npx tsc --noEmit

# Linting  
npm run lint

# Build test
npm run build
```

## 🧪 Testing

### Mobile Testing
- **Required**: Test on actual mobile devices
- **Browser DevTools**: Use mobile simulation mode
- **Touch Targets**: Verify 44px minimum size
- **Performance**: Run Lighthouse mobile audits

### Accessibility Testing
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Readers**: Test with VoiceOver/NVDA
- **Color Contrast**: Verify WCAG AA compliance
- **Reduced Motion**: Test motion preferences

## 📦 Deployment

The app is optimized for modern hosting platforms:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### PWA Features
- Web app manifest for installation
- Mobile-optimized meta tags
- Apple touch icon support
- Theme color integration

## 🤝 Contributing

### Code Standards
- Follow [Development Standards](./DEVELOPMENT_STANDARDS.md)
- Use provided [component templates](./templates/)
- Ensure mobile-first approach
- Include TypeScript interfaces
- Add accessibility attributes
- Test on mobile devices

### Pull Request Checklist
- [ ] Mobile-first CSS implementation
- [ ] Touch targets meet 44px minimum
- [ ] TypeScript interfaces defined
- [ ] Accessibility attributes included
- [ ] No console errors/warnings
- [ ] Tested on mobile devices

## 🐛 Issues & Support

For questions about development standards or mobile-first implementation, refer to:
- [Development Standards](./DEVELOPMENT_STANDARDS.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
