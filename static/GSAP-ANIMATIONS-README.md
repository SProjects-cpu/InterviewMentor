# GSAP Animations for Interview Mentor Platform

This document provides instructions on how to use the GSAP animations implemented for the Interview Mentor platform.

## Overview

The animations are implemented using GSAP (GreenSock Animation Platform), a professional-grade JavaScript animation library. The animations are designed to be:

- Professional and polished
- Subtle yet engaging
- Performance-optimized
- Accessible (respects reduced-motion preferences)
- Cross-browser compatible
- Mobile-first

## Files

- `gsap-animations.js`: Contains all the JavaScript animation logic
- `gsap-animations.css`: Contains additional CSS styles for animations

## How to Use

### 1. Include the Files

The files are already included in the landing page. To add them to other pages:

```html
<!-- In the head section -->
<link rel="stylesheet" href="{{ url_for('static', filename='gsap-animations.css') }}">

<!-- Before the closing body tag -->
<script src="{{ url_for('static', filename='gsap-animations.js') }}"></script>
```

### 2. Animation Classes

Add these classes to your HTML elements to apply animations:

#### Text Animations

- `animate-text`: Add to any text container for word-by-word animation
- `text-reveal`: For character-by-character text reveal
- `staggered-list`: Add to lists for staggered entrance of items

#### Card Animations

- `glass-card`, `feature-card`, `testimonial-card`: Already styled for hover animations

#### Button Animations

- `btn-magnetic`: Add to buttons for magnetic hover effect
- `btn-glass`: Add to buttons for glass morphism effect with ripple

#### Link Animations

- `animated-link`: Add to links for underline animation on hover

#### Scroll Animations

- `parallax-bg`: Add to background elements for parallax effect
  - Use `data-parallax-speed="-50"` to control speed (negative values move opposite to scroll)
- `reveal-image`: Add to images for clip-path reveal on scroll
- `floating-element`: Add to elements for subtle floating animation

### 3. Custom Animations

For custom animations, you can modify the `gsap-animations.js` file. The main functions are:

- `animateHeroSection()`: Hero section animations
- `animateNavigation()`: Navigation elements animations
- `animateContentCards()`: Content card animations
- `animateTextElements()`: Text animations
- `initScrollAnimations()`: Scroll-triggered animations
- `initInteractiveAnimations()`: Interactive element animations
- `initSpecialEffects()`: Special effects

## Accessibility

The animations automatically respect the user's motion preferences. If a user has enabled the "prefers-reduced-motion" setting in their operating system, animations will be minimal.

## Performance Considerations

- Animations use GPU-accelerated properties where possible
- Scroll events are debounced
- Animations are conditionally loaded
- Mobile-optimized versions are provided

## Browser Support

The animations are compatible with all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Android Chrome)

## Troubleshooting

If animations are not working:

1. Check the browser console for errors
2. Verify that GSAP and its plugins loaded correctly
3. Ensure the element you're trying to animate exists in the DOM
4. Check if the user has "prefers-reduced-motion" enabled

## Examples

### Hero Section Animation

```html
<section class="hero-section">
  <h1 class="hero-title">Your Title Here</h1>
  <p class="hero-subtitle">Your subtitle here</p>
  <div class="cta-buttons">
    <a href="#" class="btn btn-primary btn-lg btn-glass btn-magnetic">Primary CTA</a>
    <a href="#" class="btn btn-outline-light btn-lg btn-glass animated-link">Secondary CTA</a>
  </div>
</section>
```

### Content Card Animation

```html
<div class="glass-card feature-card">
  <div class="feature-icon">
    <i class="fas fa-code"></i>
  </div>
  <h3 class="feature-title">Feature Title</h3>
  <p class="feature-description animate-text">Feature description goes here.</p>
  <a href="#" class="btn btn-sm btn-outline-light mt-3 animated-link">Learn More</a>
</div>
```

### Text Animation

```html
<p class="animate-text">This text will animate word by word when scrolled into view.</p>
<ul class="animate-list staggered-list">
  <li><a href="#" class="animated-link">List item 1</a></li>
  <li><a href="#" class="animated-link">List item 2</a></li>
  <li><a href="#" class="animated-link">List item 3</a></li>
</ul>
``` 