/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Color scheme definitions

// Base colors
const primary = '#4A6FFF';       // Rich blue for primary elements
const secondary = '#FF7E42';     // Vibrant orange for CTAs and highlights
const success = '#2CC66D';       // Green for success states
const error = '#FF4D4F';         // Red for error states
const warning = '#FFB547';       // Amber for warning states

export default {
  light: {
    text: '#212B36',             // Dark charcoal for text
    background: '#F7F9FC',       // Light blueish-gray for background
    tint: primary,
    tabIconDefault: '#9CA3AF',   // Medium gray for inactive tabs
    tabIconSelected: primary,    // Primary blue for active tabs
    cardBackground: '#FFFFFF',   // White for cards
    border: '#E5E9F0',           // Light gray for borders
    buttonBackground: primary,   // Primary blue for buttons
    buttonText: '#FFFFFF',       // White for button text
    secondaryButton: '#E6EEFF',  // Light blue for secondary buttons
    secondaryButtonText: primary, // Primary blue for secondary button text
    shadow: '#1A202C',           // Dark color for shadows
  },
  dark: {
    text: '#F7F9FC',             // Light gray for text
    background: '#121825',       // Dark blue-gray background
    tint: '#6B8AFF',             // Lighter blue for dark mode
    tabIconDefault: '#6B7280',   // Dimmed gray for inactive tabs
    tabIconSelected: '#6B8AFF',  // Lighter blue for active tabs
    cardBackground: '#1E2433',   // Darker blue-gray for cards
    border: '#2D3748',           // Mid-dark gray for borders
    buttonBackground: '#6B8AFF', // Lighter blue for buttons
    buttonText: '#FFFFFF',       // White for button text
    secondaryButton: '#2D3748',  // Mid-dark gray for secondary buttons
    secondaryButtonText: '#6B8AFF', // Lighter blue for secondary button text
    shadow: '#000000',           // Black for shadows
  },
  // Global colors that are the same in both light and dark modes
  primary,
  secondary,
  success,
  error,
  warning,
};
