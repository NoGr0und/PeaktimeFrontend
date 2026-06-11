import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Theme } from '../../constants/theme';
import { enrollmentService, InviteCode } from '../../services/enrollmentService';
import { MotiView } from 'moti';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground';

export default function InviteScreen() {
  const [invite, setInvite] = useState<InviteCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCode = async () => {
    try {
      setIsLoading(true);
      const code = await enrollmentService.generateInvite();
      setInvite(code);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o código.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <AnimatedBackground iconName="ticket-account" />
      <View style={styles.header}>
        <Text style={styles.title}>Convites</Text>
        <Text style={styles.subtitle}>Gere códigos para seus alunos se vincularem a você.</Text>
      </View>

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <Card glass style={styles.card}>
          {invite ? (
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Seu Código de Convite:</Text>
              <Text style={styles.code}>{invite.code}</Text>
              <Text style={styles.expiresText}>Válido por 48 horas</Text>
              <Button 
                title="Gerar Novo Código" 
                variant="outline" 
                onPress={handleGenerateCode} 
                style={styles.button}
                isLoading={isLoading}
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Você ainda não gerou nenhum código recente.</Text>
              <Button 
                title="Gerar Código" 
                onPress={handleGenerateCode} 
                isLoading={isLoading}
              />
            </View>
          )}
        </Card>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    paddingTop: 60,
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
  codeContainer: {
    alignItems: 'center',
  },
  codeLabel: {
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  code: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: 48,
    color: Theme.colors.primary,
    letterSpacing: 8,
    marginBottom: Theme.spacing.sm,
  },
  expiresText: {
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.sizes.sm,
    marginBottom: Theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
  },
  emptyText: {
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
});
