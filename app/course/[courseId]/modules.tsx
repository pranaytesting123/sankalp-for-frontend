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
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Play, Clock, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>Course Modules</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading modules...</Text>
      </View>
    </SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>Course Modules</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedByWeek).map(([week, mods]) => (
          <View key={week} style={styles.weekBlock}>
            <LinearGradient
              colors={['#F3E8FF', '#EDE9FE']}
              style={styles.weekHeader}
            >
              <BookOpen size={20} color="#8B5CF6" />
              <Text style={styles.weekTitle}>Week {week}</Text>
            </LinearGradient>
            
            {mods.map((mod) => (
              <TouchableOpacity
                key={mod.id}
                style={styles.moduleCard}
                onPress={() => router.push({
                  pathname: `/course/${courseId}/player`,
                  params: { moduleId: mod.id.toString() }
                })}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.moduleIcon}
                >
                  <Play size={16} color="#FFFFFF" />
                </LinearGradient>
                
                <View style={styles.moduleContent}>
                  <Text style={styles.moduleTitle}>Day {mod.day}: {mod.title}</Text>
                  <View style={styles.moduleInfo}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.moduleInfoText}>Tap to watch</Text>
                  </View>
                </View>
                
                <View style={styles.moduleArrow}>
                  <Text style={styles.arrowText}>▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  weekBlock: {
    marginBottom: 24,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  moduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  moduleArrow: {
    padding: 8,
  },
  arrowText: {
    color: '#8B5CF6',
    fontSize: 12,
  },
});