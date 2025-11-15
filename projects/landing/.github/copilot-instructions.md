# AthensGo Landing Page - GitHub Copilot Instructions

## Project Overview

React-based landing page for AthensGo built with Vite. Showcases the app's features, provides download links, and includes an interactive quiz to help users discover their ideal Athens experience. Features modern animations and a full component library from Radix UI.

## Tech Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.x
- **Runtime**: Bun (for package management)
- **Language**: TypeScript (ESs2020+, strict mode)
- **Styling**: TailwindCSS 3.4 with custom config
- **UI Library**: Radix UI (shadcn/ui components)
- **Animations**: Framer Motion 12.x
- **Routing**: React Router DOM 6.x
- **State Management**: @tanstack/react-query 5.x
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Architecture

### Project Structure

```
src/
├── components/
│   ├── ui/              # Radix UI components (shadcn/ui)
│   ├── quiz/            # Quiz-related components
│   └── NavLink.tsx      # Custom components
├── pages/
│   ├── Index.tsx        # Landing page
│   └── NotFound.tsx     # 404 page
├── hooks/
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notifications
├── lib/
│   └── utils.ts         # Utility functions (cn, etc.)
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Global styles + Tailwind
```

### Routing Setup

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

## Coding Standards

### Components

#### Functional Components
```typescript
import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  title: string;
  description?: string;
  onAction?: () => void;
};

export const FeatureCard = ({ title, description, onAction }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-white p-6 shadow-md"
    >
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
    </motion.div>
  );
};
```

### Styling with TailwindCSS

#### Basic Usage
```typescript
<div className="flex flex-col gap-4 p-8 bg-athens-cream">
  <h1 className="text-4xl font-bold text-athens-blue">
    Welcome to AthensGo
  </h1>
  <p className="text-lg text-gray-700">
    Your personal Athens guide
  </p>
</div>
```

#### Responsive Design
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* content */}
</div>
```

#### Dark Mode (via next-themes)
```typescript
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
};
```

### Radix UI Components (shadcn/ui)

Components are in `src/components/ui/`. Import and use them:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

export const Example = () => (
  <Card>
    <CardHeader>
      <CardTitle>Athens Routes</CardTitle>
    </CardHeader>
    <CardContent>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Details</Button>
        </DialogTrigger>
        <DialogContent>
          {/* dialog content */}
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
);
```

#### Available Components
- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Collapsible, Context Menu, Dialog
- Dropdown Menu, Hover Card, Input
- Label, Menubar, Navigation Menu
- Popover, Progress, Radio Group
- Scroll Area, Select, Separator
- Slider, Switch, Tabs
- Toast, Toggle, Tooltip

### Animations with Framer Motion

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Basic animation
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.3 }}
>
  {/* content */}
</motion.div>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>

// AnimatePresence for exit animations
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Forms with React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
});

type FormData = z.infer<typeof schema>;

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Toast Notifications

```typescript
import { useToast } from '@/hooks/use-toast';

export const Example = () => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: 'Success!',
      description: 'Your itinerary has been saved.',
      variant: 'default', // or 'destructive'
    });
  };
  
  return <button onClick={handleClick}>Save</button>;
};
```

### Data Fetching with React Query

```typescript
import { useQuery } from '@tanstack/react-query';

const fetchRoutes = async () => {
  const response = await fetch('/api/routes');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

export const RoutesList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.map(route => (
        <div key={route.id}>{route.name}</div>
      ))}
    </div>
  );
};
```

### Icons with Lucide React

```typescript
import { 
  MapPin, 
  Sparkles, 
  Users, 
  Calendar, 
  Heart,
  Download,
  Menu,
  X 
} from 'lucide-react';

<div className="flex items-center gap-2">
  <MapPin className="w-5 h-5 text-athens-orange" />
  <span>Athens, Greece</span>
</div>
```

## Utility Functions

### cn() - Class Name Merger
```typescript
import { cn } from '@/lib/utils';

// Conditionally combine classes
<div className={cn(
  'rounded-lg p-4',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)}>
  {/* content */}
</div>
```

## Custom Hooks

### useMobile
```typescript
import { useMobile } from '@/hooks/use-mobile';

export const ResponsiveComponent = () => {
  const isMobile = useMobile();
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
};
```

## AthensGo-Specific Features

### Landing Page Sections

1. **Hero Section**
   - Main headline and CTA
   - App download buttons
   - Hero image/animation

2. **Features Section**
   - AI-powered itineraries
   - Personalized recommendations
   - Interactive maps
   - Offline support

3. **How It Works**
   - Step-by-step guide
   - Visual flow

4. **Quiz Section**
   - Interactive preference quiz
   - Personality-based route suggestions
   - Results with recommendations

5. **Popular Routes**
   - Pre-made itinerary samples
   - Duration and highlights
   - Visual cards

6. **Testimonials/Social Proof**
   - User reviews
   - App ratings
   - Download stats

7. **Footer**
   - Links, social media
   - Contact information
   - Legal/privacy

### Quiz Component Pattern

```typescript
type QuizQuestion = {
  id: string;
  question: string;
  options: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
  }>;
};

export const Quiz = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setCurrentStep(prev => prev + 1);
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        {/* question */}
      </motion.div>
    </AnimatePresence>
  );
};
```

### Mobile Menu Pattern

```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
  {mobileMenuOpen ? <X /> : <Menu />}
</button>

<AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* menu items */}
    </motion.div>
  )}
</AnimatePresence>
```

## Running the App

```bash
# Development server (hot reload)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint
bun run lint
```

## Environment Variables

Create `.env` (not committed):
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_KEY=your-key
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

Note: Variables must be prefixed with `VITE_` to be available in the app.

## Performance Optimization

- Use `React.lazy()` for code splitting
- Implement route-based code splitting
- Optimize images (WebP, lazy loading)
- Use `useMemo()` and `useCallback()` for expensive computations
- Minimize bundle size (check with `bun run build`)
- Implement virtualization for long lists

```typescript
import React, { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

## SEO & Meta Tags

```typescript
import { Helmet } from 'react-helmet';

<Helmet>
  <title>AthensGo - Your Personal Athens Travel Guide</title>
  <meta name="description" content="Discover Athens with AI-powered personalized itineraries" />
  <meta property="og:title" content="AthensGo" />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="/og-image.jpg" />
</Helmet>
```

## Accessibility

- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Provide `alt` text for images
- Ensure keyboard navigation works
- Use ARIA labels when needed
- Maintain color contrast ratios
- Test with screen readers

```typescript
<button 
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
>
  <Menu />
</button>
```

## Key Dependencies

- `react`, `react-dom` - React framework
- `vite` - Build tool
- `react-router-dom` - Routing
- `@radix-ui/*` - UI component primitives
- `framer-motion` - Animations
- `@tanstack/react-query` - Data fetching
- `react-hook-form` - Form handling
- `@hookform/resolvers`, `zod` - Form validation
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `class-variance-authority`, `clsx`, `tailwind-merge` - Utility functions
- `next-themes` - Theme management
- `sonner` - Toast notifications

## Build & Deploy

### Build
```bash
bun run build
# Output in dist/
```

### Deploy to Vercel/Netlify
```bash
# Set build command: bun run build
# Set output directory: dist
```

### Environment Variables in Production
Add `VITE_*` variables in your hosting platform's environment settings.

## Troubleshooting

### Clear cache
```bash
rm -rf node_modules dist
bun install
bun run dev
```

### Build errors
- Check TypeScript errors: `tsc --noEmit`
- Check for missing environment variables
- Verify all imports are correct

### Styling issues
- Clear Tailwind cache
- Check `tailwind.config.ts` configuration
- Verify component imports from `@/components/ui`

