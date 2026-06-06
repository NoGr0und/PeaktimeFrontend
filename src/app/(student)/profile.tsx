import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Theme } from '../../constants/theme';
import { enrollmentService, ProfessorEnrollment } from '../../services/enrollmentService';
import { useAuth } from '../../services/AuthContext';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [professor, setProfessor] = useState<ProfessorEnrollment | null>(null);

  useEffect(() => {
    checkEnrollment();
  }, []);

  const checkEnrollment = async () => {
    const prof = await enrollmentService.getProfessor();
    setProfessor(prof);
  };

  const handleJoin = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Erro', 'O código deve ter exatamente 6 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      await enrollmentService.joinProfessor(code);
      
      const prof = await enrollmentService.getProfessor();
      setProfessor(prof);
      
      Alert.alert('Sucesso', 'Vinculado ao professor com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Meu Perfil</Text>
            <Text style={styles.subtitle}>Gerencie sua conta e professor</Text>
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

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 200 }}
            style={{ marginTop: Theme.spacing.xl }}
          >
            <Text style={styles.sectionTitle}>Vínculo com Professor</Text>
            
            {professor ? (
              <Card glass style={styles.card}>
                <View style={styles.profContainer}>
                  <View style={[styles.avatarPlaceholder, { backgroundColor: Theme.colors.secondary }]}>
                    <Text style={styles.avatarText}>{professor.professor.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.profName}>{professor.professor.name}</Text>
                  <Text style={styles.profEmail}>{professor.professor.email}</Text>
                  
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Vínculo Ativo</Text>
                  </View>
                </View>
              </Card>
            ) : (
              <Card glass style={styles.card}>
                <Text style={styles.cardTitle}>Adicionar Professor</Text>
                <Text style={styles.cardText}>
                  Insira o código de 6 dígitos gerado pelo seu professor para ter acesso aos seus treinos diários.
                </Text>
                
                <Input
                  placeholder="A1B2C3"
                  value={code}
                  onChangeText={(text) => setCode(text.toUpperCase())}
                  maxLength={6}
                  autoCapitalize="characters"
                  style={styles.codeInput}
                />
                
                <Button 
                  title="Vincular" 
                  onPress={handleJoin} 
                  isLoading={isLoading}
                />
              </Card>
            )}
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
  sectionTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
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
  },
  logoutButton: {
    marginTop: Theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  cardText: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  codeInput: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xl,
    textAlign: 'center',
    letterSpacing: 4,
  },
  profContainer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: 24,
    color: Theme.colors.background,
  },
  profName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  profEmail: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  badge: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
    borderWidth: 1,
    borderColor: Theme.colors.success,
  },
  badgeText: {
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.success,
    fontSize: Theme.typography.sizes.xs,
  },
});
