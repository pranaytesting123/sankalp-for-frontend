import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  TrendingUp
} from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { useRouter } from 'expo-router';

const AUTH_KEY = 'auth';
const { width } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
}

const useAuthData = () => {
  const [authData, setAuthData] = useState<{
    token: string;
    user: User;
    remember: boolean;
  } | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedAuth = await SecureStore.getItemAsync(AUTH_KEY);
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          setAuthData(parsed);
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      }
    };

    loadAuthData();
  }, []);

  return authData;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const authData = useAuthData();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const username = authData?.user?.name || user?.name || 'Student';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!authData?.user?.id) return;
        const response = await apiService.get(`/api/user-courses/${authData.user.id}`);
        if (response?.success && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.warn('Invalid course response:', response);
          setCourses([]);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    const fetchRecommendedCourses = async () => {
      try {
        if (!authData?.user?.id) return;
        const response = await apiService.get(`/api/recommend-courses/${authData.user.id}`);
        if (response?.success && Array.isArray(response.data)) {
          setRecommended(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch recommended courses:', error);
      }
    };

    fetchCourses();
    fetchRecommendedCourses();
  }, [authData]);

  const stats = [
    { icon: BookOpen, label: 'Courses', value: courses.length.toString(), color: '#8B5CF6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{username}</Text>
            </View>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {username.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {courses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Sparkles size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Continue Learning</Text>
              </View>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            {courses.slice(0, 3).map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() =>
                  router.push({
                    pathname: '/course/[courseId]/modules',
                    params: { courseId: course.id, videoId: course.videoId, title: course.title },
                  })
                }
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.courseGradient}
                >
                  <BookOpen size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseSubtitle}>Continue where you left off</Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.sectionTitleContainer}>
            <TrendingUp size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Your Progress</Text>
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <LinearGradient
                key={index}
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.statCard}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.statIcon}
                >
                  <stat.icon size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {recommended.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Sparkles size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Recommended for You</Text>
            </View>
            {recommended.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => Linking.openURL('https://sankalp.spectov.in/#services')}
              >
                <LinearGradient
                  colors={['#A855F7', '#9333EA']}
                  style={styles.courseGradient}
                >
                  <BookOpen size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 13 }} numberOfLines={2}>
                    {course.description}
                  </Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginRight: 4,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});