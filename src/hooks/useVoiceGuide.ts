import { useEffect, useRef } from 'react';
import Tts from 'react-native-tts';
import { RouteStep } from '../redux/slices/map/mapsSlice';

// Distance in meters at which to give the "in Xm" early warning
const EARLY_WARNING_METERS = 200;

export function useVoiceGuide(
  currentStep: RouteStep | null,
  nextStep: RouteStep | null,
  currentStepIndex: number,
  distanceToNextMeters: number | null,
  isLastStep: boolean,
  hasSteps: boolean,
) {
  const lastAnnouncedStepIndex = useRef<number>(-1);
  const earlyWarningGiven = useRef<boolean>(false);
  const hasAnnouncedArrival = useRef<boolean>(false);

  // Initialise TTS once on mount
  useEffect(() => {
    Tts.setDefaultLanguage('en-KE').catch(() => {
      // en-KE may not be available on all devices — fall back silently
      Tts.setDefaultLanguage('en-US');
    });
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    return () => {
      Tts.stop();
    };
  }, []);

  // Announce current step when step index changes
  useEffect(() => {
    if (!currentStep || !hasSteps) return;
    if (currentStepIndex === lastAnnouncedStepIndex.current) return;

    // Reset early warning flag for the new step
    earlyWarningGiven.current = false;
    lastAnnouncedStepIndex.current = currentStepIndex;

    // Stop anything currently being spoken
    Tts.stop();

    if (isLastStep) {
      if (!hasAnnouncedArrival.current) {
        hasAnnouncedArrival.current = true;
        Tts.speak('You have arrived at your destination');
      }
      return;
    }

    Tts.speak(currentStep.instruction);
  }, [currentStepIndex, currentStep, hasSteps, isLastStep]);

  // Early warning — announce next step as user approaches it
  useEffect(() => {
    if (!nextStep) return;
    if (distanceToNextMeters === null) return;
    if (earlyWarningGiven.current) return;
    if (isLastStep) return;

    if (distanceToNextMeters <= EARLY_WARNING_METERS) {
      earlyWarningGiven.current = true;
      Tts.stop();

      const distanceText =
        distanceToNextMeters >= 1000
          ? `In ${(distanceToNextMeters / 1000).toFixed(1)} kilometres`
          : `In ${distanceToNextMeters} metres`;

      Tts.speak(`${distanceText}, ${nextStep.instruction}`);
    }
  }, [distanceToNextMeters, nextStep, isLastStep]);

  // Reset arrival flag when steps are cleared (new destination)
  useEffect(() => {
    if (!hasSteps) {
      hasAnnouncedArrival.current = false;
      lastAnnouncedStepIndex.current = -1;
      earlyWarningGiven.current = false;
      Tts.stop();
    }
  }, [hasSteps]);
}
