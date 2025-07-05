import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { validateOTP } from '@/utils/validation';

export default function VerifyOTPScreen() {
  const { email, type } = useLocalSearchParams<{ email: string; type: string }>();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  const { verifyOTP, resendOTP } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (otp.length === 6) {
      setError('');
    }
  }, [otp]);

  const handleVerifyOTP = async () => {
    const validation = validateOTP(otp);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyOTP(otp, email);
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const result = await resendOTP(email);
      
      if (result.success) {
        setCountdown(60);
        setCanResend(false);
        setOtp('');
        Alert.alert('Success', 'OTP has been resent to your email');
      } else {
        Alert.alert('Error', result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F3E8FF', '#EDE9FE', '#FFFFFF']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="#8B5CF6" />
              </TouchableOpacity>
              
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.iconContainer}
              >
                <Mail size={48} color="#FFFFFF" />
              </LinearGradient>
              
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to
              </Text>
              <Text style={styles.email}>{email}</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Enter verification code</Text>
              
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                error={!!error}
              />
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <Button
                title={type === 'register' ? 'Verify & Create Account' : 'Verify & Sign In'}
                onPress={handleVerifyOTP}
                loading={isLoading}
                disabled={otp.length !== 6}
                fullWidth
                size="large"
              />

              <View style={styles.resendContainer}>
                {!canResend ? (
                  <Text style={styles.countdownText}>
                    Resend code in {formatTime(countdown)}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} disabled={isResending}>
                    <Text style={[styles.resendText, isResending && styles.resendTextDisabled]}>
                      {isResending ? 'Sending...' : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.helpText}>
                <Text style={styles.helpTextContent}>
                  Didn't receive the code? Check your spam folder or try resending.
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  countdownText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
  helpText: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  helpTextContent: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});