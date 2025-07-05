import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { resetPassword } = useAuth();
  const router = useRouter();

  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !password) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, otp, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Password reset successful');
      router.push('/auth');
    } else {
      Alert.alert('Error', result.message || 'Password reset failed rp');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.label}>OTP</Text>
      <TextInput value={otp} onChangeText={setOTP} style={styles.input} keyboardType="number-pad" />

      <Text style={styles.label}>New Password</Text>
      <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <TouchableOpacity onPress={handleReset} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
