/**
 * Development-only logging utility
 * Prevents console logs in production
 */

export const devLog = (...args) => {
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.log(...args);
  }
};

export const devError = (...args) => {
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.error(...args);
  }
};

export const devWarn = (...args) => {
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.warn(...args);
  }
};

export const devInfo = (...args) => {
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.info(...args);
  }
};





