import { useMemo } from 'react';
import { RouteStep } from '../redux/slices/map/mapsSlice';

const STEP_RADIUS_METERS = 40;

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function useTurnByTurn(
  steps: RouteStep[],
  userLat?: number,
  userLng?: number,
) {
  const currentStepIndex = useMemo(() => {
    if (!userLat || !userLng || steps.length === 0) return 0;

    // Find the closest step start location to the user
    let closestIndex = 0;
    let closestDistance = Infinity;

    steps.forEach((step, index) => {
      const d = haversineMeters(
        userLat,
        userLng,
        step.startLocation.lat,
        step.startLocation.lng,
      );
      if (d < closestDistance) {
        closestDistance = d;
        closestIndex = index;
      }
    });

    // If user is within radius of the NEXT step, advance
    const nextIndex = closestIndex + 1;
    if (nextIndex < steps.length) {
      const distToNext = haversineMeters(
        userLat,
        userLng,
        steps[nextIndex].startLocation.lat,
        steps[nextIndex].startLocation.lng,
      );
      if (distToNext < STEP_RADIUS_METERS) return nextIndex;
    }

    return closestIndex;
  }, [steps, userLat, userLng]);

  const currentStep = steps[currentStepIndex] ?? null;
  const nextStep = steps[currentStepIndex + 1] ?? null;
  const isLastStep = currentStepIndex === steps.length - 1;
  const hasSteps = steps.length > 0;

  // Distance from user to the next step's start location
  const distanceToNextMeters = useMemo(() => {
    if (!userLat || !userLng || !nextStep) return null;
    return Math.round(
      haversineMeters(
        userLat,
        userLng,
        nextStep.startLocation.lat,
        nextStep.startLocation.lng,
      ),
    );
  }, [userLat, userLng, nextStep]);

  return {
    currentStep,
    nextStep,
    currentStepIndex,
    totalSteps: steps.length,
    isLastStep,
    hasSteps,
    distanceToNextMeters,
  };
}
