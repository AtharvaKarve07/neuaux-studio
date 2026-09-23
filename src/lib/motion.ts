// Shared motion tokens. CSS mirrors the same curves in globals.css.

/** Strong ease-out for entrances and UI responses. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Strong ease-in-out for on-screen movement. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** iOS-like drawer curve. */
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** Tile <-> viewer shared element. Carries a little momentum. */
export const SPRING_SHARED = { type: "spring", duration: 0.5, bounce: 0.2 } as const;

/** Critically damped spring for things that should settle without overshoot. */
export const SPRING_SETTLE = { type: "spring", duration: 0.4, bounce: 0 } as const;

/** Snap back after a released drag that did not commit. */
export const SPRING_SNAP = { type: "spring", duration: 0.4, bounce: 0.15 } as const;

/** Swipe distance (fraction of stage width) and release velocity (px/s) that commit a gesture. */
export const SWIPE_DISTANCE = 0.22;
export const SWIPE_VELOCITY = 500;
export const DISMISS_DISTANCE = 110;
export const DISMISS_VELOCITY = 600;
