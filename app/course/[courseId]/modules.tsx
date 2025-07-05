import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '@/services/api';

interface Module {
  id: number;
  courseId: number;
  title: string;
  week: number;
  day: number;
  videoUrl: string;
}

export default function CourseModulesScreen() {
  const { courseId, title } = useLocalSearchParams();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const auth = await SecureStore.getItemAsync('auth');
        if (!auth) return;

        const { user } = JSON.parse(auth);
        const response = await apiService.get(`/api/user-course-modules/${user.id}/${courseId}`);
        console.log ('Modules response:', response);
        if (response?.success) {
          setModules(response.data);
        } else {
          console.warn('Modules not found or unauthorized');
        }
      } catch (error) {
        console.error('Error fetching course modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const groupedByWeek = modules.reduce((acc: Record<number, Module[]>, mod) => {
    if (!acc[mod.week]) acc[mod.week] = [];
    acc[mod.week].push(mod);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      {Object.entries(groupedByWeek).map(([week, mods]) => (
        <View key={week} style={styles.weekBlock}>
          <Text style={styles.weekTitle}>Week {week}</Text>
          {mods.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={styles.moduleCard}
              onPress={() => router.push({
                pathname: `/course/${courseId}/player`,
                params: { moduleId: mod.id.toString() }
              })}
            >
              <Text style={styles.moduleTitle}>Day {mod.day}: {mod.title}</Text>
              <Text style={styles.videoUrl}>Tap to watch</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  weekBlock: {
    marginBottom: 24,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2563EB',
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  videoUrl: {
    fontSize: 12,
    color: '#6B7280',
  },
});
