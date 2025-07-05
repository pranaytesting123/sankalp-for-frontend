import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  // 🔍 Debug network connectivity to backend server
  useEffect(() => {
    fetch("https://sankalp-deploy-1.onrender.com/api/test-db")
      .then(res => res.json())
      .then(data => {
        console.log("✅ API test response:", data);
      })
      .catch(err => {
        console.log("❌ Network error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      });
  }, []);

  // 🔁 Auth-based redirection
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
