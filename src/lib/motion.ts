/**
 * Centralized animation configuration for GS Greetings AI.
 * All easing curves, durations, spring configs, and stagger intervals
 * are defined here so the entire site feels consistent.
 */

// ─── Easing Curves ───────────────────────────────────────────────────────────

export const ease = {
  /** Smooth deceleration — great for entrances */
  outExpo: [0.16, 1, 0.3, 1] as const,
  /** Smooth acceleration + deceleration */
  inOutCubic: [0.65, 0, 0.35, 1] as const,
  /** Quick start, slow finish — premium feel */
  outQuart: [0.25, 1, 0.5, 1] as const,
  /** Gentle bounce at end */
  outBack: [0.34, 1.56, 0.64, 1] as const,
  /** Linear for continuous motion */
  linear: [0, 0, 1, 1] as const,
  /** Soft ease for subtle animations */
  soft: [0.4, 0, 0.2, 1] as const,
} as const;

// CSS-compatible easing strings
export const cssEase = {
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ─── Durations (seconds) ─────────────────────────────────────────────────────

export const duration = {
  /** Micro-interactions: button hover, icon change */
  instant: 0.15,
  /** Small UI elements: tooltips, focus rings */
  fast: 0.25,
  /** Standard transitions: cards, modals */
  normal: 0.5,
  /** Page elements: section reveals, text reveals */
  slow: 0.8,
  /** Cinematic: hero entrance, page transitions */
  cinematic: 1.2,
  /** Very slow: background gradients, ambient motion */
  ambient: 2.0,
} as const;

// ─── Stagger Intervals (seconds) ─────────────────────────────────────────────

export const stagger = {
  /** Character-by-character text reveals */
  character: 0.02,
  /** Word-by-word text reveals */
  word: 0.05,
  /** List items, grid items */
  item: 0.08,
  /** Section-level staggers */
  section: 0.15,
} as const;

// ─── Spring Configs (for Framer Motion / React Spring) ───────────────────────

export const spring = {
  /** Snappy response — buttons, small interactions */
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.8 },
  /** Smooth — modals, page elements */
  smooth: { type: 'spring' as const, stiffness: 200, damping: 26, mass: 1 },
  /** Bouncy — playful interactions, magnetic buttons */
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15, mass: 1 },
  /** Gentle — background elements, parallax */
  gentle: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 1.5 },
  /** Magnetic — cursor magnetic pull */
  magnetic: { type: 'spring' as const, stiffness: 150, damping: 15, mass: 0.5 },
} as const;

// ─── React Spring Configs ────────────────────────────────────────────────────

export const reactSpring = {
  snappy: { tension: 400, friction: 30, mass: 0.8 },
  smooth: { tension: 200, friction: 26, mass: 1 },
  bouncy: { tension: 300, friction: 15, mass: 1 },
  gentle: { tension: 100, friction: 20, mass: 1.5 },
  magnetic: { tension: 150, friction: 15, mass: 0.5 },
} as const;

// ─── Framer Motion Transition Presets ────────────────────────────────────────

export const transition = {
  /** Fade in from below — default reveal */
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, ease: ease.outExpo },
  },
  /** Fade in from above */
  fadeDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, ease: ease.outExpo },
  },
  /** Fade in from left */
  fadeLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.slow, ease: ease.outExpo },
  },
  /** Fade in from right */
  fadeRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: duration.slow, ease: ease.outExpo },
  },
  /** Scale up from slightly smaller */
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration.normal, ease: ease.outExpo },
  },
  /** Cinematic page entrance */
  pageEnter: {
    initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: { duration: duration.cinematic, ease: ease.outExpo },
  },
} as const;

// ─── GSAP Defaults ───────────────────────────────────────────────────────────

export const gsapDefaults = {
  /** Default ease for GSAP animations */
  ease: 'expo.out',
  /** Default duration */
  duration: duration.slow,
} as const;

// ─── Scroll Trigger Defaults ─────────────────────────────────────────────────

export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none none',
} as const;
