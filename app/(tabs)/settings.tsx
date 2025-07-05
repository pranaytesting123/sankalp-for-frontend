import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Shield, CircleHelp as HelpCircle, FileText, Star, LogOut, ChevronRight, Moon, Globe, Download, Trash2, Settings as SettingsIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [downloadOverWifiOnly, setDownloadOverWifiOnly] = useState(true);

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          type: 'switch',
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          icon: Download,
          label: 'Download over WiFi only',
          type: 'switch',
          value: downloadOverWifiOnly,
          onToggle: setDownloadOverWifiOnly,
        },
        {
          icon: Globe,
          label: 'Language',
          type: 'navigation',
          value: 'English',
          onPress: () => Alert.alert('Language', 'Language selection coming soon!'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: Shield,
          label: 'Privacy & Security',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
        },
        {
          icon: Trash2,
          label: 'Clear Cache',
          type: 'navigation',
          onPress: () => {
            Alert.alert(
              'Clear Cache',
              'This will clear temporary files and free up storage space.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully!') },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          type: 'navigation',
          onPress: () => Alert.alert('Help', 'Help center coming soon!'),
        },
        {
          icon: FileText,
          label: 'Terms & Conditions',
          type: 'navigation',
          onPress: () => Alert.alert('Terms', 'Terms & Conditions coming soon!'),
        },
        {
          icon: Star,
          label: 'Rate the App',
          type: 'navigation',
          onPress: () => Alert.alert('Rate App', 'Thank you for your interest in rating our app!'),
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: logout 
        },
      ]
    );
  };

  const renderSettingItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingItem, !isLast && styles.settingItemBorder]}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.settingItemLeft}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.settingIcon}
        >
          <item.icon size={20} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          {item.value && item.type === 'navigation' && (
            <Text style={styles.settingValue}>{item.value}</Text>
          )}
        </View>
      </View>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <ChevronRight size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your app preferences</Text>
          </View>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.headerIcon}
          >
            <SettingsIcon size={24} color="#8B5CF6" />
          </LinearGradient>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.groupCard}
            >
              {group.items.map((item, itemIndex) =>
                renderSettingItem(item, itemIndex, itemIndex === group.items.length - 1)
              )}
            </LinearGradient>
          </View>
        ))}

        {/* App Information */}
        <View style={styles.settingGroup}>
          <Text style={styles.groupTitle}>About</Text>
          
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.groupCard}
          >
            <LinearGradient
              colors={['#F3E8FF', '#EDE9FE']}
              style={styles.appInfo}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.appIcon}
              >
                <SettingsIcon size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.appName}>Sankalp Educational Platform</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                Empowering students with quality education and innovative learning experiences.
              </Text>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by the Sankalp Team
          </Text>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  settingGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  groupCard: {
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutSection: {
    marginBottom: 32,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});