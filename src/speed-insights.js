// Vercel Speed Insights Integration
// This script injects Speed Insights tracking for the static site

import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights with default configuration
injectSpeedInsights({
  debug: false, // Set to true during development if needed
  sampleRate: 1 // Track 100% of page views
});
