import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ArrowLeft, Share2, Heart, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface DetailHeroProps {
  imageUri: string;
  verified?: boolean;
  isFavourited?: boolean;
  onShare?: () => void;
  onFavourite?: () => void;
}

export const DetailHero: React.FC<DetailHeroProps> = ({
  imageUri,
  verified,
  isFavourited,
  onShare,
  onFavourite,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Verified badge */}
      {verified && (
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={13} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.verifiedText}>Verified Specialist</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    gap: 5,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
