import React, { useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text, RefreshControl, Platform, Button } from 'react-native';
import { useJobs } from '../context/JobContext';
import JobCard from '../../components/JobCard';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function JobsScreen() {
  const { 
    jobs, 
    loading, 
    error, 
    fetchJobs, 
    fetchNextPage, 
    hasMoreJobs 
  } = useJobs();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMoreJobs) {
      fetchNextPage();
    }
  }, [loading, hasMoreJobs, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    fetchJobs(true);
  }, [fetchJobs]);

  if (loading && jobs.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retry} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>No jobs found</Text>
        <Text style={styles.retry} onPress={handleRefresh}>
          Tap to refresh
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} />}
        keyExtractor={(item) => {
          if (item && item.id !== undefined) {
            return item.id.toString();
          }
          return Math.random().toString(36).substring(2, 15);
        }}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={loading && jobs.length > 0} onRefresh={handleRefresh} />
        }
      />
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
  listContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 50 : 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 12,
  },
  retry: {
    fontSize: 16,
    color: '#007aff',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
});
