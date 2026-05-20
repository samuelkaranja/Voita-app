import React from 'react';
import { StatusBar, ScrollView, StyleSheet, View } from 'react-native';

// 1. IMPORT THE SAFE AREA HOOK
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CommunityHero from './components/CommunityHero';
import EmergencyDirectory from './components/EmergencyDirectory';
import ServiceScoutCard from './components/ServiceScoutCard';
import DiscussionSection from './components/DiscussionSection';
import NewsCard from './components/NewsCard';

const NEWS_DATA = [
  {
    id: '1',
    author: 'Ezekiel K.',
    time: '2h ago',
    tag: '#MaintenanceTips',
    badge: 'TOYOTA OWNER',
    title: 'Best brake pads for wet weather conditions in Nairobi?',
    content:
      "I've noticed a significant decrease in stopping power since the heavy rains started. Does anyone have experience with the new ceramic options from Brembo, or should I stick to OEM?",
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    author: 'Sarah M.',
    time: '5h ago',
    tag: '#EVMobility',
    badge: 'HYBRID TECH',
    title: 'Charging station reliability on the highway to Nakuru',
    content:
      'Planning my first long trip with the new hybrid. Are the fast-chargers at the major fuel stations actually operational, or should I rely purely on the ICE engine for this stretch?',
    likes: 42,
    comments: 15,
  },
  {
    id: '3',
    author: 'David O.',
    time: '1d ago',
    tag: '#OffRoading',
    badge: '4X4 EXPERT',
    title: 'Top 5 mud-terrain tires for weekend trails',
    content:
      "After testing three different brands last season, I've compiled a list of what actually works in deep clay. Hint: pressure management is more important than the tread pattern itself.",
    likes: 89,
    comments: 32,
  },
];

export default function CommunityScreen() {
  // 2. INITIALIZE THE SAFE AREA INSETS
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      {/* 3. ASSIGN THE SPACING TO contentContainerStyle */}
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: insets.bottom + 95 }}
      >
        <CommunityHero />
        <EmergencyDirectory />
        <ServiceScoutCard />

        <DiscussionSection />

        {/* Map through news data to render cards */}
        <View>
          {NEWS_DATA.map(item => (
            <NewsCard
              key={item.id}
              author={item.author}
              time={item.time}
              tag={item.tag}
              badge={item.badge}
              title={item.title}
              content={item.content}
              likes={item.likes}
              comments={item.comments}
              onJoinPress={() => console.log(`Joining discussion ${item.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f6f4',
  },
});
