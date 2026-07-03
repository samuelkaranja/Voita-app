import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteStep } from '../../../redux/slices/map/mapsSlice';

interface Props {
  currentStep: RouteStep;
  nextStep: RouteStep | null;
  distanceToNextMeters: number | null;
  currentStepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
}

function getManeuverIcon(maneuver?: string): string {
  switch (maneuver) {
    case 'turn-left':
      return '↰';
    case 'turn-right':
      return '↱';
    case 'turn-sharp-left':
      return '↺';
    case 'turn-sharp-right':
      return '↻';
    case 'turn-slight-left':
      return '↖';
    case 'turn-slight-right':
      return '↗';
    case 'roundabout-left':
    case 'roundabout-right':
      return '⟲';
    case 'uturn-left':
    case 'uturn-right':
      return '↩';
    case 'merge':
      return '⤵';
    case 'ramp-left':
    case 'ramp-right':
      return '↪';
    case 'ferry':
      return '⛴';
    default:
      return '↑';
  }
}

export default function TurnByTurnBanner({
  currentStep,
  nextStep,
  distanceToNextMeters,
  currentStepIndex,
  totalSteps,
  isLastStep,
}: Props) {
  const icon = getManeuverIcon(currentStep.maneuver);

  return (
    <View style={styles.container}>
      {/* Main instruction */}
      <View style={styles.mainRow}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.instructionWrap}>
          <Text style={styles.instruction} numberOfLines={2}>
            {currentStep.instruction}
          </Text>
          <Text style={styles.distance}>{currentStep.distance}</Text>
        </View>
        {/* Step counter */}
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentStepIndex + 1}/{totalSteps}
          </Text>
        </View>
      </View>

      {/* Next step preview */}
      {nextStep && !isLastStep && (
        <View style={styles.nextRow}>
          <Text style={styles.nextLabel}>Then</Text>
          <Text style={styles.nextIcon}>
            {getManeuverIcon(nextStep.maneuver)}
          </Text>
          <Text style={styles.nextInstruction} numberOfLines={1}>
            {nextStep.instruction}
          </Text>
          {distanceToNextMeters !== null && (
            <Text style={styles.nextDistance}>
              in{' '}
              {distanceToNextMeters >= 1000
                ? `${(distanceToNextMeters / 1000).toFixed(1)}km`
                : `${distanceToNextMeters}m`}
            </Text>
          )}
        </View>
      )}

      {/* Arriving */}
      {isLastStep && (
        <View style={styles.nextRow}>
          <Text style={styles.arrivingText}>🏁 Arriving at destination</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d2b1f',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(143, 246, 208, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    color: '#8ff6d0',
  },
  instructionWrap: {
    flex: 1,
  },
  instruction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 20,
  },
  distance: {
    fontSize: 12,
    color: '#8ff6d0',
    marginTop: 2,
    fontWeight: '500',
  },
  counter: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterText: {
    fontSize: 11,
    color: '#aaa',
    fontWeight: '600',
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  nextLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  nextIcon: {
    fontSize: 13,
    color: '#8ff6d0',
  },
  nextInstruction: {
    flex: 1,
    fontSize: 12,
    color: '#ccc',
  },
  nextDistance: {
    fontSize: 11,
    color: '#8ff6d0',
    fontWeight: '600',
  },
  arrivingText: {
    fontSize: 13,
    color: '#8ff6d0',
    fontWeight: '600',
  },
});
