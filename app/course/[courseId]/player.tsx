import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '@/services/api';
import { API_BASE_URL } from '@/utils/constants';


// Define your API base URL here or import it from your config


export default function PlayerScreen() {
  const { moduleId } = useLocalSearchParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log('PlayerScreen moduleId:', moduleId);
  useEffect(() => {
    const fetchToken = async () => {
      if (!moduleId) {
        setError('No moduleId provided');
        setLoading(false);
        return;
      }
      try {
        // 1) get userId from SecureStore
        const authJson = await SecureStore.getItemAsync('auth');
        if (!authJson) throw new Error('Not logged in');
        const { user } = JSON.parse(authJson) as { user: { id: number } };
        const userId = user.id;

        // 2) request video token
        const resp = await apiService.post('/api/generate-video-token-mobile', {
          userId,
          moduleId: parseInt(moduleId, 10),
        });

        if (!resp.success || !resp.data?.token) {
          throw new Error(resp.message || 'Failed to generate video token');
        }

        setToken(resp.data.token);
      } catch (err: any) {
        console.error('Error generating video token:', err);
        setError(err.message || 'Error generating token');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [moduleId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error || !token) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Unable to load video.'}</Text>
      </View>
    );
  }

  // 3) build secure‑video URL
  const secureVideoUrl = `${API_BASE_URL}/api/secure-video-mobile/${moduleId}?token=${token}`;
  console.log('Secure video URL:', secureVideoUrl);
  return (
    <WebView
      source={{ uri: secureVideoUrl }}
      style={styles.webview}
      javaScriptEnabled
      startInLoadingState
      renderLoading={() => (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#F87171',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
