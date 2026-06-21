import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ArrowLeft, Share2, Star, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface CarWashDetailHeroProps {
  imageUri: string;
  avatarUri?: string;
  name: string;
  rating: number;
  reviewCount: number;
  waitMins: number;
  isVerifiedPartner?: boolean;
  onShare?: () => void;
}

export const CarWashDetailHero: React.FC<CarWashDetailHeroProps> = ({
  imageUri,
  avatarUri,
  name,
  rating,
  reviewCount,
  waitMins,
  isVerifiedPartner,
  onShare,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      {/* Top header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{name}</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <Share2 size={18} color="#111827" strokeWidth={2.5} />
          </TouchableOpacity>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
      </View>

      {/* Bottom overlaid pills */}
      <View style={styles.bottomContent}>
        {isVerifiedPartner && (
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedText}>Verified Partner</Text>
          </View>
        )}
        <View style={styles.pillsRow}>
          <View style={styles.pill}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.pillText}>
              {rating.toFixed(1)} (
              {reviewCount >= 1000
                ? `${(reviewCount / 1000).toFixed(1)}k`
                : reviewCount}{' '}
              Reviews)
            </Text>
          </View>
          <View style={styles.pill}>
            <Clock size={13} color="#374151" strokeWidth={2} />
            <Text style={styles.pillText}>{waitMins} min wait</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  headerRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1D5DB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 10,
  },
  verifiedPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
