import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Theme } from '../../constants/theme';
import { useAuth } from '../../services/AuthContext';
import { MotiView } from 'moti';

export default function ProfessorProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Meu Perfil</Text>
            <Text style={styles.subtitle}>Visão de Professor</Text>
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Card glass style={styles.card}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Conta Professor</Text>
                  </View>
                </View>
              </View>
              
              <Button 
                title="Sair da Conta" 
                variant="outline" 
                onPress={handleLogout} 
                style={styles.logoutButton}
              />
            </Card>
          </MotiView>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: 120, // For bottom tab bar
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xxl,
    color: Theme.colors.text,
  },
  subtitle: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  card: {
    padding: Theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  profileInfo: {
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: Theme.spacing.sm,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 24,
    color: Theme.colors.background,
  },
  badge: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.primary,
    fontSize: Theme.typography.sizes.xs,
  },
});
