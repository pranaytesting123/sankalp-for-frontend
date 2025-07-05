import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Clock, Users, Star, Sparkles, ExternalLink } from 'lucide-react-native';
import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/utils/constants';
import { apiService } from '@/services/api';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Course = {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  created_at?: string;
  syllabus?: string;
};

export function useUserCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await apiService.get(`/api/user-courses/${user.id}`);

      if (response.success) {
        setCourses(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch courses');
      }

      setLoading(false);
    };

    fetchCourses();
  }, [user?.id]);
  console.log('♥♥♥useUserCourses courses are♥♥♥ :', courses);
  return { courses, loading };
}

export default function CoursesScreen() {
  const { courses, loading } = useUserCourses();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>My Courses</Text>
            <Text style={styles.subtitle}>Continue your learning journey</Text>
          </View>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.headerIcon}
          >
            <BookOpen size={24} color="#8B5CF6" />
          </LinearGradient>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading your courses...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() =>
                router.push({
                  pathname: '/course/[courseId]/modules',
                  params: {
                    courseId: course.id.toString(),
                    title: course.title,
                  },
                })
              }
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.courseIcon}
              >
                <BookOpen size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.courseContent}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseInstructor}>{course.description}</Text>
                <View style={styles.courseBadge}>
                  <Sparkles size={12} color="#8B5CF6" />
                  <Text style={styles.courseBadgeText}>Enrolled</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <LinearGradient
            colors={['#F3E8FF', '#EDE9FE']}
            style={styles.promoBannerContainer}
          >
            <TouchableOpacity
              style={styles.promoBanner}
              onPress={() => {
                router.push('https://sankalp.spectov.in/#services');
              }}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.promoIcon}
              >
                <ExternalLink size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Explore More Courses 🚀</Text>
                <Text style={styles.promoSubtitle}>
                  Discover new opportunities and grow your skills.
                </Text>
                <Text style={styles.promoLink}>View All Courses</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  headerIcon: {
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
    paddingHorizontal: 24,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  courseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  courseBadgeText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginLeft: 4,
  },
  promoBannerContainer: {
    marginTop: 8,
    marginBottom: 32,
    borderRadius: 20,
    padding: 2,
  },
  promoBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  promoLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});