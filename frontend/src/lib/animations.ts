import { Variants, Transition } from 'framer-motion';

// Performance-optimized animation presets
export const animationConfig = {
  fast: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  normal: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  slow: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springFast: { type: 'spring', stiffness: 400, damping: 25 },
} as const;

// Page transition animations - optimized for performance
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

export const pageTransition: Transition = {
  ...animationConfig.normal,
};

// Optimized card animations - reduced transforms for better performance
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.normal,
  },
  hover: {
    y: -2,
    transition: animationConfig.fast,
  },
  tap: {
    scale: 0.98,
    transition: animationConfig.fast,
  },
};

// Lightweight container animations
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.05,
    },
  },
};

// Simplified item animations
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.fast,
  },
};

// Performance-optimized button animations
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: animationConfig.fast,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Quick fade animations
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: animationConfig.normal,
  },
};

// Optimized slide animations - reduced distance for smoother performance
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: animationConfig.normal,
  },
};

export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: animationConfig.normal,
  },
};

// Lightweight scale animation
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: animationConfig.normal,
  },
};

// Removed heavy bounce animation - replaced with subtle scale
export const subtleScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: animationConfig.spring,
  },
};

// Removed infinite animations for better performance
// Use these sparingly and only when necessary
export const gentleFloatVariants: Variants = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Optimized loading spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Optimized modal animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: animationConfig.normal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: animationConfig.fast,
  },
};

// Lightweight backdrop animations
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: animationConfig.normal,
  },
  exit: {
    opacity: 0,
    transition: animationConfig.fast,
  },
};

// Simplified text reveal animation
export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.normal,
  },
};

// Optimized navigation animations
export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.normal,
  },
};

// Performance-optimized sidebar animations
export const sidebarVariants: Variants = {
  closed: {
    x: '-100%',
    transition: animationConfig.normal,
  },
  open: {
    x: 0,
    transition: animationConfig.normal,
  },
};

// ShadCN-compatible animation utilities
export const shadcnAnimations = {
  // Hover effects for interactive elements
  hoverLift: {
    y: -1,
    transition: animationConfig.fast,
  },
  hoverScale: {
    scale: 1.02,
    transition: animationConfig.fast,
  },
  // Focus states
  focusRing: {
    boxShadow: '0 0 0 2px hsl(var(--ring))',
    transition: animationConfig.fast,
  },
  // Loading states
  pulse: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Reduced motion variants for accessibility
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 }
  },
};

// Performance monitoring utilities
export const performanceConfig = {
  // Use will-change for better performance
  willChange: 'transform, opacity',
  // Prefer transform over layout-changing properties
  preferTransform: true,
  // Enable hardware acceleration
  enableHardwareAcceleration: true,
};

// Easing presets
export const easingPresets = {
  easeOut: [0.25, 0.46, 0.45, 0.94],
  easeIn: [0.55, 0.055, 0.675, 0.19],
  easeInOut: [0.645, 0.045, 0.355, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
};
