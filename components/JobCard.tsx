import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Job, useJobs } from '../app/context/JobContext';
import Colors from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();
  const { bookmarkJob, removeBookmark, isBookmarked } = useJobs();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  // Ensure job has an ID
  const jobId = job && job.id ? job.id : `temp-${Math.random().toString(36).substring(2, 10)}`;
  const bookmarked = isBookmarked(jobId);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(jobId);
    } else {
      const jobWithId = { ...job, id: jobId };
      bookmarkJob(jobWithId);
    }
  };

  const handleCardPress = () => {
    const encodedId = encodeURIComponent(jobId);
    router.push({
      pathname: `/job/${encodedId}`,
      params: { id: jobId }
    });
  };

  // Show placeholder card if job is undefined
  if (!job) {
    return (
      <TouchableOpacity 
        style={[styles.card, styles.placeholderCard, { backgroundColor: theme.cardBackground }]} 
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: theme.text }]}>Job data unavailable</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.cardBackground }]} 
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.topBar} />
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {job.title || 'Untitled Job'}
        </Text>
        <Pressable 
          style={styles.bookmarkButton} 
          onPress={(e) => {
            e.stopPropagation();
            handleBookmarkToggle();
          }}
          hitSlop={10}
        >
          <MaterialIcons 
            name={bookmarked ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={bookmarked ? Colors.primary : theme.tabIconDefault} 
          />
        </Pressable>
      </View>

      {job.company && (
        <Text style={[styles.company, { color: theme.text }]} numberOfLines={1}>
          {job.company}
        </Text>
      )}

      <View style={styles.tagsContainer}>
        {job.jobType && (
          <View style={[styles.tag, { backgroundColor: theme.secondaryButton }]}>
            <Text style={[styles.tagText, { color: theme.secondaryButtonText }]}>{job.jobType}</Text>
          </View>
        )}
        {job.category && (
          <View style={[styles.tag, { backgroundColor: theme.secondaryButton }]}>
            <Text style={[styles.tagText, { color: theme.secondaryButtonText }]}>{job.category}</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={theme.tabIconDefault} />
          <Text style={[styles.detailText, { color: theme.text + 'CC' }]} numberOfLines={1}>
            {job.location || 'Location not specified'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color={theme.tabIconDefault} />
          <Text style={[styles.detailText, { color: theme.text + 'CC' }]} numberOfLines={1}>
            {job.salary || 'Salary not specified'}
          </Text>
        </View>
        
        {job.phone && (
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={16} color={theme.tabIconDefault} />
            <Text style={[styles.detailText, { color: theme.text + 'CC' }]} numberOfLines={1}>
              {job.phone}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.salary, { color: Colors.primary }]}>
          {job.salary || 'Competitive salary'}
        </Text>
        <Text style={[styles.postedDate, { color: theme.text + '99' }]}>
          Posted 2 days ago
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  topBar: {
    height: 4,
    backgroundColor: Colors.primary,
    width: '100%',
  },
  placeholderCard: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  company: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salary: {
    fontSize: 16,
    fontWeight: '700',
  },
  postedDate: {
    fontSize: 12,
  },
});

export default JobCard; 