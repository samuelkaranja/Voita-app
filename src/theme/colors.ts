export const colors = {
  // Surfaces
  background: '#F8F9FA', // Level 0 — soft off-white, reduces glare
  cardBackground: '#FFFFFF', // Level 1 — pure white cards
  surfaceMuted: '#F3F4F6', // input fields, fallback avatars, muted chips

  // Header — stays brand forest-green even in light mode (Primary color),
  // so headerText/headerTextSecondary are separate from body text tokens.
  headerBackground: '#0D2B1F',
  headerText: '#FFFFFF',
  headerTextSecondary: 'rgba(255, 255, 255, 0.72)',

  // Brand accent
  accent: '#0D2B1F', // Primary — deep forest green
  accentDark: 'rgba(13, 43, 31, 0.1)', // Primary @ 10% opacity — chip/badge fill, icon wells

  // Text
  textPrimary: '#121826', // Neutral Primary — AAA contrast body text
  textSecondary: '#6B7280', // Neutral Secondary — metadata, timestamps
  textMuted: '#9CA3AF', // lighter still — placeholders, disabled
  textClear: '#ffffff',

  // Status
  warning: '#C5A059', // Secondary Gold
  warningBackground: '#FBF1DE', // Gold tint for banners

  // Structure
  border: '#E5E7EB', // 1px card borders & separators
};
