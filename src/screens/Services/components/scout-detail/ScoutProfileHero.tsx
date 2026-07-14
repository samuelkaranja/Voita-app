import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ArrowLeft, Share2, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface ScoutProfileHeroProps {
  imageUri: string;
  avatarUri?: string;
  isVerified?: boolean;
  onShare?: () => void;
}

export const ScoutProfileHero: React.FC<ScoutProfileHeroProps> = ({
  imageUri,
  avatarUri,
  isVerified,
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

      {/* Header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* <Text style={styles.headerTitle}>Scout Profile</Text>

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
        </View> */}
      </View>

      {/* Verified badge */}
      {isVerified && (
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280,
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
