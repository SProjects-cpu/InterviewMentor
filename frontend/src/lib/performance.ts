/**
 * Performance monitoring utilities for animations
 * Helps track and optimize animation performance
 */

// Performance monitoring for animations
export class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private isMonitoring = false;

  static getInstance(): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.measureFPS();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  private measureFPS(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Log performance warnings
      if (this.fps < 30) {
        console.warn(`Low FPS detected: ${this.fps}fps - Consider optimizing animations`);
      }
    }

    requestAnimationFrame(() => this.measureFPS());
  }

  getFPS(): number {
    return this.fps;
  }
}

// Utility to check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility to enable hardware acceleration for elements
export const enableHardwareAcceleration = (element: HTMLElement): void => {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
};

// Utility to optimize animation performance
export const optimizeForAnimation = (element: HTMLElement): void => {
  element.style.willChange = 'transform, opacity';
  enableHardwareAcceleration(element);
};

// Cleanup function to remove will-change after animation
export const cleanupAfterAnimation = (element: HTMLElement): void => {
  element.style.willChange = 'auto';
};

// Performance-optimized animation frame utility
export const requestOptimizedFrame = (callback: () => void): number => {
  return requestAnimationFrame(() => {
    // Use setTimeout to ensure the callback runs after layout
    setTimeout(callback, 0);
  });
};

// Debounced resize handler for responsive animations
export const createDebouncedResizeHandler = (
  callback: () => void,
  delay: number = 100
): (() => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Animation performance best practices
export const animationBestPractices = {
  // Use transform instead of changing layout properties
  preferTransform: true,
  
  // Keep animations under 300ms for UI interactions
  maxInteractionDuration: 300,
  
  // Use easing functions that feel natural
  recommendedEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Limit concurrent animations
  maxConcurrentAnimations: 3,
  
  // Use will-change sparingly and clean up after
  useWillChangeCarefully: true,
};

// Performance monitoring hook for React components
export const useAnimationPerformance = () => {
  const monitor = AnimationPerformanceMonitor.getInstance();
  
  const startMonitoring = () => monitor.startMonitoring();
  const stopMonitoring = () => monitor.stopMonitoring();
  const getFPS = () => monitor.getFPS();
  
  return {
    startMonitoring,
    stopMonitoring,
    getFPS,
    prefersReducedMotion: prefersReducedMotion(),
  };
};

// Intersection Observer for scroll-triggered animations
export const createScrollAnimationObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Utility to batch DOM reads and writes for better performance
export class DOMBatcher {
  private readQueue: (() => void)[] = [];
  private writeQueue: (() => void)[] = [];
  private isScheduled = false;

  read(fn: () => void): void {
    this.readQueue.push(fn);
    this.schedule();
  }

  write(fn: () => void): void {
    this.writeQueue.push(fn);
    this.schedule();
  }

  private schedule(): void {
    if (this.isScheduled) return;
    
    this.isScheduled = true;
    requestAnimationFrame(() => {
      // Execute all reads first
      while (this.readQueue.length) {
        const fn = this.readQueue.shift();
        fn?.();
      }
      
      // Then execute all writes
      while (this.writeQueue.length) {
        const fn = this.writeQueue.shift();
        fn?.();
      }
      
      this.isScheduled = false;
    });
  }
}

export const domBatcher = new DOMBatcher();
