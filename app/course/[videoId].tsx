import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import YoutubePlayer from 'react-native-youtube-iframe';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function CourseVideoScreen() {
  const { videoId, title } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {videoId ? (
        <YoutubePlayer
          height={220}
          width={width - 32}
          play={true}
          videoId={videoId.toString()}
        />
      ) : (
        <Text style={styles.errorText}>No video ID provided</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: '#2563EB',
  },
  title: {
    marginTop: 80,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});
