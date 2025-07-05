import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, CreditCard as Edit3, Mail, Phone, Calendar, BookOpen, Trophy, Star, Settings, ChevronRight, X, Check } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateFullName, validatePhone } from '@/utils/validation';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '12', color: '#8B5CF6' },
    { icon: Trophy, label: 'Certificates', value: '8', color: '#059669' },
    { icon: Star, label: 'Average Score', value: '4.8', color: '#F59E0B' },
    { icon: Calendar, label: 'Days Active', value: '45', color: '#7C3AED' },
  ];

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => setIsEditModalVisible(true) },
    { icon: BookOpen, label: 'My Courses', action: () => {} },
    { icon: Trophy, label: 'Achievements', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
  ];

  const handleUpdateProfile = async () => {
    const nameValidation = validateFullName(editForm.fullName);
    const phoneValidation = validatePhone(editForm.phone);
    
    const newErrors: { fullName?: string; phone?: string } = {};
    
    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.error;
    }
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 1500);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.avatar}
              >
                <User size={48} color="#8B5CF6" />
              </LinearGradient>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.verificationBadge}
            >
              <Check size={12} color="#FFFFFF" />
              <Text style={styles.verificationText}>Verified Account</Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <LinearGradient
                key={index}
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.statCard}
              >
                <LinearGradient
                  colors={[stat.color, stat.color + '80']}
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

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.infoCard}
          >
            <View style={styles.infoItem}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.infoIcon}
              >
                <Mail size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.infoIcon}
              >
                <Phone size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Not added'}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.menuCard}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={item.action}
              >
                <View style={styles.menuItemLeft}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.menuIcon}
                  >
                    <item.icon size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            <Input
              label="Full Name"
              value={editForm.fullName}
              onChangeText={(text) => {
                setEditForm(prev => ({ ...prev, fullName: text }));
                if (errors.fullName) {
                  setErrors(prev => ({ ...prev, fullName: undefined }));
                }
              }}
              placeholder="Enter your full name"
              error={errors.fullName}
            />

            <Input
              label="Phone Number"
              value={editForm.phone}
              onChangeText={(text) => {
                setEditForm(prev => ({ ...prev, phone: text }));
                if (errors.phone) {
                  setErrors(prev => ({ ...prev, phone: undefined }));
                }
              }}
              placeholder="+91 9876543210"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Button
              title="Update Profile"
              onPress={handleUpdateProfile}
              loading={isLoading}
              fullWidth
              size="large"
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verificationText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  statsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
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
    marginBottom: 8,
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
  infoCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 52,
  },
  menuCard: {
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
});