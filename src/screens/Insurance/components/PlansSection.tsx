import React from 'react';
import { View } from 'react-native';
import PlanCard from './PlanCard';

export default function PlansSection() {
  return (
    <View>
      <PlanCard
        type="telematics"
        title="Telematics"
        description="AI-driven safety scoring that rewards calm driving with lower premiums."
      />

      <PlanCard
        type="pay"
        title="Pay per KM"
        description="Ideal for the urban minimalist. Only pay for the distance you travel."
        dark
      />

      <PlanCard
        type="classic"
        title="Classic"
        description="Comprehensive fixed coverage for total peace of mind in any terrain."
      />

      <PlanCard
        type="group"
        title="Group Plans"
        description="Aggregate your household's safety and unlock tiered community discounts."
      />
    </View>
  );
}
