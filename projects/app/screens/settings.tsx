import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/contexts/app-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useApp();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    logout();
    router.replace('/sign-in');
  };

  const SettingItem = ({
    icon,
    title,
    value,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {value && <Text style={[styles.settingValue, { color: colors.icon }]}>{value}</Text>}
      {onPress && <Ionicons name="chevron-forward" size={20} color={colors.icon} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={48} color="#FFFFFF" />
        </View>
        <Text style={[styles.email, { color: colors.text }]}>{user?.email || 'user@athensgo.com'}</Text>
        <Text style={[styles.memberSince, { color: colors.icon }]}>Member since 2024</Text>
      </View>

      {/* Payment Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment</Text>
        <View style={[styles.cardContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={32} color={colors.primary} />
            <Text style={[styles.cardType, { color: colors.text }]}>Credit Card</Text>
          </View>
          <Text style={[styles.cardNumber, { color: colors.text }]}>1234 **** **** ****</Text>
          <Text style={[styles.cardExpiry, { color: colors.icon }]}>Expires 12/25</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          value="Enabled"
          onPress={() => alert('Notifications settings (mock)')}
        />
        <SettingItem
          icon="language-outline"
          title="Language"
          value="English"
          onPress={() => alert('Language settings (mock)')}
        />
        <SettingItem
          icon="moon-outline"
          title="Theme"
          value={colorScheme === 'dark' ? 'Dark' : 'Light'}
          onPress={() => alert('Theme settings (mock)')}
        />
        <SettingItem
          icon="location-outline"
          title="Location Services"
          value="Enabled"
          onPress={() => alert('Location settings (mock)')}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
        <SettingItem
          icon="help-circle-outline"
          title="Help Center"
          onPress={() => alert('Help Center (mock)')}
        />
        <SettingItem
          icon="chatbubble-outline"
          title="Contact Us"
          onPress={() => alert('Contact Us (mock)')}
        />
        <SettingItem
          icon="document-text-outline"
          title="Terms & Conditions"
          onPress={() => alert('Terms & Conditions (mock)')}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => alert('Privacy Policy (mock)')}
        />
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: '#FF4444' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: colors.icon }]}>Version 1.0.0 (Hackathon Demo)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 2,
  },
  cardExpiry: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#FF4444',
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
