import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { useJobs } from '../context/JobContext';
import JobCard from '../../components/JobCard';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const { bookmarkedJobs } = useJobs();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (bookmarkedJobs.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <MaterialIcons name="bookmark-border" size={64} color="#8e8e93" />
        <Text style={styles.emptyText}>No bookmarked jobs yet</Text>
        <Text style={styles.emptySubText}>
          Bookmark jobs to view them here, even when offline
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookmarkedJobs}
        renderItem={({ item }) => <JobCard job={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
}); 