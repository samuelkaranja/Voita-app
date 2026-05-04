import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Updated icon import
import { MoreHorizontal, ThumbsUp, MessageSquare } from 'lucide-react-native';

const NewsCard = ({ 
  author, 
  time, 
  tag, 
  badge,
  title, 
  content,
  likes = 24,
  comments = 8
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {author ? author.split(' ').map(n => n[0]).join('') : '??'}
          </Text>
        </View>
        
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName}>{author}</Text>
            <Text style={styles.timeText}>{time}</Text>
            <TouchableOpacity style={styles.moreOptions} hitSlop={10}>
               {/* Lucide MoreHorizontal */}
               <MoreHorizontal size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagRow}>
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>{badge}</Text>
            </View>
            <Text style={styles.hashtag}>{tag}</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.body}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.contentText} numberOfLines={4}>
          {content}
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.stats}>
          <TouchableOpacity style={styles.statItem}>
            {/* Lucide ThumbsUp */}
            <ThumbsUp size={16} color="#4B5563" strokeWidth={2.5} />
            <Text style={styles.statText}>{likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statItem}>
            {/* Lucide MessageSquare */}
            <MessageSquare size={16} color="#4B5563" strokeWidth={2.5} />
            <Text style={styles.statText}>{comments} Comments</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.joinText}>Join Discussion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownerBadge: {
    backgroundColor: '#061C14',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  ownerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  hashtag: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  body: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#414845',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 6,
  },
  joinText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
  },
});

export default NewsCard;
