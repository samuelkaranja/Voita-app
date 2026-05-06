import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProviderCard = ({
  provider,
  onBookNow,
  badgeText = 'PARTNER', // Default value
  ctaText = 'BOOK NOW', // Default value
}) => {
  const imageSource =
    typeof provider.imageUrl === 'string'
      ? { uri: provider.imageUrl }
      : provider.imageUrl;

  return (
    <View style={styles.cardContainer}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>
            ⭐ {provider.rating} ({provider.reviewCount})
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{provider.name}</Text>
          {provider.isVerified && <Text style={styles.verifiedCheck}>✅</Text>}
        </View>

        <View style={styles.badgeRow}>
          {/* Dynamic Badge Text */}
          <View style={[styles.badge, styles.partnerBadge]}>
            <Text style={styles.partnerText}>{badgeText.toUpperCase()}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.distanceText}>{provider.distance} MILES</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {provider.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.priceLevel}>{provider.priceLevel}</Text>

          {/* Dynamic Call to Action */}
          <TouchableOpacity onPress={onBookNow} style={styles.bookNowContainer}>
            <Text style={styles.bookNowText}>{ctaText.toUpperCase()}</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  partnerBadge: {
    backgroundColor: '#e0f2f1',
  },
  partnerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00796b',
  },
  distanceText: {
    fontSize: 10,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  priceLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bookNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookNowText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00796b',
    marginRight: 4,
  },
  chevron: {
    fontSize: 14,
    color: '#00796b',
  },
});

export default ProviderCard;
