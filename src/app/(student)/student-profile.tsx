import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Theme } from '../../constants/theme';
import { enrollmentService, ProfessorEnrollment } from '../../services/enrollmentService';
import { useAuth } from '../../services/AuthContext';
import { MotiView } from 'moti';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground';

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();
  const [code, setCode] = useState('');

  const { data: professorInfo, isLoading: isProfLoading } = useQuery({
    queryKey: ['myProfessor'],
    queryFn: () => enrollmentService.getProfessor(),
  });

  const joinMutation = useMutation({
    mutationFn: (inviteCode: string) => enrollmentService.joinProfessor(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfessor'] });
      Alert.alert('Sucesso', 'Vinculado ao professor com sucesso!');
    },
    onError: () => {
      Alert.alert('Erro', 'Código inválido ou expirado.');
    }
  });

  const handleJoin = () => {
    if (!code || code.length !== 6) {
      if (Platform.OS === 'web') {
        window.alert('O código deve ter exatamente 6 caracteres.');
      } else {
        Alert.alert('Erro', 'O código deve ter exatamente 6 caracteres.');
      }
      return;
    }
    joinMutation.mutate(code);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUnenroll = () => {
    if (!professorInfo) return;

    const performUnenroll = async () => {
      try {
        await enrollmentService.unenroll(professorInfo.id);
        queryClient.invalidateQueries({ queryKey: ['myProfessor'] });
        if (Platform.OS === 'web') {
          window.alert('Professor desvinculado com sucesso.');
        } else {
          Alert.alert('Sucesso', 'Professor desvinculado com sucesso.');
        }
      } catch (error) {
        if (Platform.OS === 'web') {
          window.alert('Falha ao desvincular o professor.');
        } else {
          Alert.alert('Erro', 'Falha ao desvincular o professor.');
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Tem certeza que deseja remover o vínculo com o professor ${professorInfo.professor.name}?`)) {
        performUnenroll();
      }
    } else {
      Alert.alert(
        'Desvincular Professor',
        `Tem certeza que deseja remover o vínculo com o professor ${professorInfo.professor.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Desvincular', 
            style: 'destructive',
            onPress: performUnenroll
          }
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
        <AnimatedBackground variant="profile-pulse" iconName="account-circle" />
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
              
              <View style={styles.actionsContainer}>
                <Button
                  title="Informações / Editar Conta"
                  onPress={() => router.push('/edit-profile')}
                  variant="outline"
                  style={styles.actionButton}
                  icon={<MaterialCommunityIcons name="account-edit" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />}
                />
                <Button 
                  title="Sair da Conta" 
                  variant="outline" 
                  onPress={handleSignOut} 
                  style={[styles.actionButton, styles.logoutButton]}
                  textStyle={styles.logoutText}
                />
              </View>
            </Card>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 200 }}
            style={{ marginTop: Theme.spacing.xl }}
          >
            <Text style={styles.sectionTitle}>Vínculo com Professor</Text>
            
            {professorInfo ? (
              <Card glass style={styles.card}>
                <View style={styles.profContainer}>
                  <View style={styles.profInfo}>
                    <Ionicons name="person-circle-outline" size={40} color={Theme.colors.primary} />
                    <View style={styles.profText}>
                      <Text style={styles.profName}>{professorInfo.professor.name}</Text>
                      <Text style={styles.profEmail}>{professorInfo.professor.email}</Text>
                    </View>
                  </View>
                  <Button 
                    title="Desvincular Professor" 
                    onPress={handleUnenroll} 
                    variant="outline" 
                    style={{ marginTop: 15, borderColor: Theme.colors.error }}
                    textStyle={{ color: Theme.colors.error }}
                  />
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
                  isLoading={joinMutation.isPending}
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
