import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import Navigation from '../../assets/onboarding/Navigation.svg';
import Services from '../../assets/onboarding/Services.svg';
import Community from '../../assets/onboarding/Community.svg';
import Alert from '../../assets/onboarding/Alerts.svg';

export interface OnboardingSlideData {
  id: string;
  Illustration: FC<SvgProps>;
  title: string;
  description: string;
}

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 'navigate',
    Illustration: Navigation,
    title: 'Navigate safely',
    description:
      'Get turn-by-turn directions with speed camera alerts, flood warnings, and a Lady-Friendly safe route option.',
  },
  {
    id: 'services',
    Illustration: Services,
    title: 'Find trusted services',
    description:
      'Discover verified mechanics, car washes, towing, and scouts near you — all in one place.',
  },
  {
    id: 'community',
    Illustration: Community,
    title: 'Connect with drivers',
    description:
      'Join local and brand-specific community chats to share road tips and stay in the loop.',
  },
  {
    id: 'alerts',
    Illustration: Alert,
    title: 'Stay in the know',
    description:
      'Get timely alerts on road conditions, vehicle maintenance reminders, and community activity.',
  },
];
