import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Clock, Users, Star } from 'lucide-react-native';
import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext'; // Adjust path as needed
import { API_BASE_URL } from '@/utils/constants';
import { apiService } from '@/services/api';
import { useRouter } from 'expo-router'; // ✅ new import


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
  const router = useRouter(); // ✅ router initialization


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

// --- Replace the hardcoded courses in CoursesScreen with this: ---

export default function CoursesScreen() {
  const { courses, loading } = useUserCourses();
  const router = useRouter(); // ✅ router initialization


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.subtitle}>Continue your learning journey</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
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
                    courseId: course.id.toString(), // Make sure it's a string
                    title: course.title,            // Optional, use it on the next screen if needed
                  },
                })
              }
            >
              <View style={[styles.courseIcon, { backgroundColor: '#2563EB20' }]}>
                <BookOpen size={24} color="#2563EB" />
              </View>
              <View style={styles.courseContent}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseInstructor}>{course.description}</Text>
                {/* You can add more info here if needed */}
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.promoBannerContainer}>
            <TouchableOpacity
              style={styles.promoBanner}
              onPress={() => {
                router.push('https://sankalp.spectov.in/#services');
              }}
            >
              <Text style={styles.promoTitle}>Explore More Courses 🚀</Text>
              <Text style={styles.promoSubtitle}>
                Discover new opportunities and grow your skills.
              </Text>
              <Text style={styles.promoLink}>View All Courses</Text>
            </TouchableOpacity>
          </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  promoBannerContainer: {
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  promoBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#3B82F6',
    borderWidth: 1,
  },

  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 6,
  },

  promoSubtitle: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 10,
    textAlign: 'center',
  },

  promoLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    textDecorationLine: 'underline',
  },

});