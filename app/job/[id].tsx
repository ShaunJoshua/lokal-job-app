import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Pressable, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Job, useJobs } from '../context/JobContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function JobDetailScreen() {
  const params = useLocalSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { jobs, bookmarkedJobs, bookmarkJob, removeBookmark, isBookmarked } = useJobs();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Extract ID in a safe way
  const getNormalizedId = () => {
    try {
      if (params.id && typeof params.id === 'string') {
        return decodeURIComponent(params.id);
      } else if (params.id) {
        return String(params.id);
      } else if (params[0] && typeof params[0] === 'string') {
        return decodeURIComponent(params[0]);
      } else {
        const pathId = window.location?.pathname?.split('/').pop();
        if (pathId) {
          return decodeURIComponent(pathId);
        }
        return '';
      }
    } catch (e) {
      console.error('Error parsing ID:', e);
      return '';
    }
  };

  useEffect(() => {
    const jobId = getNormalizedId();
    
    try {
      // Try to find job using multiple matching strategies
      let foundJob = jobs.find(j => j.id === jobId) || 
                     bookmarkedJobs.find(j => j.id === jobId);
                     
      // If no exact match, try flexible matching
      if (!foundJob) {
        foundJob = jobs.find(j => String(j.id).toLowerCase() === String(jobId).toLowerCase()) || 
                  bookmarkedJobs.find(j => String(j.id).toLowerCase() === String(jobId).toLowerCase());
      }
      
      // Last resort - try to find by substring
      if (!foundJob && jobId) {
        foundJob = jobs.find(j => String(j.id).includes(jobId) || String(jobId).includes(j.id)) ||
                  bookmarkedJobs.find(j => String(j.id).includes(jobId) || String(jobId).includes(j.id));
      }
      
      if (foundJob) {
        setJob(foundJob);
      } else {
        setError(`Job not found (ID: ${jobId})`);
      }
    } catch (err) {
      console.error('Error finding job:', err);
      setError('Error loading job details');
    }
    
    setLoading(false);
  }, [params, jobs, bookmarkedJobs]);

  const handleBookmarkToggle = () => {
    if (!job) return;
    
    const jobId = getNormalizedId();
    const jobWithId = job.id ? job : { ...job, id: jobId };
    
    if (isBookmarked(jobWithId.id)) {
      removeBookmark(jobWithId.id);
    } else {
      bookmarkJob(jobWithId);
    }
  };

  const handlePhoneCall = () => {
    if (!job?.phone) return;
    
    const cleanedPhone = job.phone.replace(/[^\d+]/g, '');
    const phoneUrl = `tel:${cleanedPhone}`;
    
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          setError('Phone calls are not supported on this device');
        }
      })
      .catch(err => {
        console.error('An error occurred when trying to make a call:', err);
        setError('Unable to make phone call');
      });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
        <Text style={{ color: theme.text, marginTop: 16 }}>Loading job details...</Text>
      </View>
    );
  }

  if (error || !job) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: Colors.error }]}>
          {error || 'Job not found'}
        </Text>
        <Text style={{ color: theme.text + '99', marginVertical: 8 }}>
          ID: {getNormalizedId() || 'Unknown'}
        </Text>
        <Text 
          style={[styles.backLink, { color: theme.tint, marginTop: 16 }]}
          onPress={() => router.back()}
        >
          Go back to jobs
        </Text>
      </View>
    );
  }

  const bookmarked = job.id ? isBookmarked(job.id) : false;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.topBar, { backgroundColor: Colors.primary }]} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{job.title || 'Untitled Job'}</Text>
            {job.company && (
              <Text style={[styles.company, { color: theme.text + 'CC' }]}>{job.company}</Text>
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
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Job Details</Text>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={20} color={theme.tabIconDefault} />
              <Text style={[styles.detailText, { color: theme.text + 'CC' }]}>
                {job.location || 'Location not specified'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="attach-money" size={20} color={theme.tabIconDefault} />
              <Text style={[styles.detailText, { color: theme.text + 'CC' }]}>
                {job.salary || 'Salary not specified'}
              </Text>
            </View>
            
            {job.phone && (
              <Pressable 
                style={styles.detailRow} 
                onPress={handlePhoneCall}
              >
                <MaterialIcons name="phone" size={20} color={theme.tint} />
                <Text style={[styles.detailText, styles.phoneNumber, { color: theme.tint }]}>
                  {job.phone}
                </Text>
              </Pressable>
            )}
          </View>

          {job.description && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.descriptionSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
                <Text style={[styles.description, { color: theme.text + 'CC' }]}>
                  {job.description}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        backgroundColor: theme.cardBackground, 
        borderTopColor: theme.border 
      }]}>
        <Pressable
          style={[
            styles.bookmarkButton,
            bookmarked ? 
              { backgroundColor: theme.buttonBackground, borderColor: theme.buttonBackground } : 
              { backgroundColor: theme.secondaryButton, borderColor: theme.tint }
          ]}
          onPress={handleBookmarkToggle}
        >
          <MaterialIcons 
            name={bookmarked ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={bookmarked ? theme.buttonText : theme.tint} 
          />
          <Text 
            style={[
              styles.bookmarkButtonText,
              { color: bookmarked ? theme.buttonText : theme.tint }
            ]}
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Text>
        </Pressable>

        {job.phone && (
          <Pressable
            style={[
              styles.callButton,
              { backgroundColor: Colors.primary, borderColor: Colors.primary }
            ]}
            onPress={handlePhoneCall}
          >
            <MaterialIcons 
              name="phone" 
              size={24} 
              color="#FFFFFF" 
            />
            <Text 
              style={[
                styles.bookmarkButtonText,
                { color: "#FFFFFF" }
              ]}
            >
              Call
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topBar: {
    height: 4,
    width: '100%',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
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
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  detailsSection: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    flex: 1,
  },
  phoneNumber: {
    textDecorationLine: 'underline',
  },
  descriptionSection: {
    padding: 20,
    paddingTop: 0,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        paddingBottom: 32, // Add extra padding for iOS devices with home indicator
      },
    }),
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
    marginLeft: 8,
  },
  bookmarkButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  backLink: {
    fontSize: 16,
  },
}); 