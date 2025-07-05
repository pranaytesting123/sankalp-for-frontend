import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validatePhone
} from '@/utils/validation';

export default function RegisterScreen() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateFullName(formData.fullName);
    if (!nameValidation.isValid) newErrors.fullName = nameValidation.error!;

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error!;

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error!;

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.error!;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) newErrors.terms = 'You must accept the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (result.success) {
        router.push({
          pathname: '/auth/verify-otp',
          params: { email: formData.email, type: 'register' }
        });
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#EFF6FF', '#DBEAFE', '#FFFFFF']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft size={24} color="#2563EB" />
              </TouchableOpacity>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join Sankalp and start your learning journey
              </Text>
            </View>

            {/* Inputs */}
            <View style={styles.form}>
              {renderInput('Full Name', 'fullName', formData.fullName, updateFormData, errors)}
              {renderInput('Email Address', 'email', formData.email, updateFormData, errors, 'email-address')}
              {renderInput('Phone Number', 'phone', formData.phone, updateFormData, errors, 'phone-pad')}
              {renderInput('Password', 'password', formData.password, updateFormData, errors, 'default', true)}
              {renderInput('Confirm Password', 'confirmPassword', formData.confirmPassword, updateFormData, errors, 'default', true)}

              <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)}>
                  <Text style={styles.checkboxLabel}>
                    {acceptTerms ? '☑' : '☐'} I agree to the Terms and Conditions
                  </Text>
                </TouchableOpacity>
                {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
              </View>

              <TouchableOpacity
                onPress={handleRegister}
                style={styles.submitButton}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/auth')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function renderInput(
  label: string,
  key: string,
  value: string,
  updateFormData: (key: string, value: string) => void,
  errors: Record<string, string>,
  keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
  secure: boolean = false
) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={text => updateFormData(key, text)}
        style={[styles.inputField, errors[key] && styles.inputError]}
        placeholder={`Enter ${label.toLowerCase()}`}
        keyboardType={keyboardType}
        secureTextEntry={secure}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 },
  header: { marginBottom: 32 },
  backButton: { alignSelf: 'flex-start', padding: 8, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { flex: 1 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#111827' },
  inputField: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4
  },
  checkboxContainer: {
    marginTop: 8,
    marginBottom: 24
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151'
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280'
  },
  loginLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600'
  }
});
