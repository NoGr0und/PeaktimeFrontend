import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Theme } from '../../constants/theme';
import { useAuth } from '../../services/AuthContext';
import { Role } from '../../types';
import { MotiView } from 'moti';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState<Role>('ALUNO');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signIn } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !dob) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      const user = await authService.register(name, email, password, role, dob);
      signIn(user);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[Theme.colors.background, Theme.colors.surface]}
        style={styles.container}
      >
        <AnimatedBackground iconName="dumbbell" variant="blobs" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            style={styles.formContainer}
          >
            <Card glass style={styles.card}>
              <Text style={styles.cardTitle}>Criar Conta</Text>
              
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 400 }}
              >
                <View style={styles.roleSelector}>
                  <TouchableOpacity 
                    style={[styles.roleOption, role === 'ALUNO' && styles.roleSelected]}
                    onPress={() => setRole('ALUNO')}
                  >
                    <Text style={[styles.roleText, role === 'ALUNO' && styles.roleTextSelected]}>Aluno</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.roleOption, role === 'PROFESSOR' && styles.roleSelected]}
                    onPress={() => setRole('PROFESSOR')}
                  >
                    <Text style={[styles.roleText, role === 'PROFESSOR' && styles.roleTextSelected]}>Professor</Text>
                  </TouchableOpacity>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 500 }}
              >
                <Input
                  label="Nome Completo"
                  placeholder="Jane Doe"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 600 }}
              >
                <Input
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </MotiView>
              
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 700 }}
              >
                <Input
                  label="Senha"
                  placeholder="********"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 800 }}
              >
                <Input
                  label="Data de Nascimento"
                  placeholder="DD/MM/AAAA"
                  value={dob}
                  onChangeText={setDob}
                />
              </MotiView>
              
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 1000 }}
              >
                <Button 
                  title="Cadastrar" 
                  onPress={handleRegister} 
                  isLoading={isLoading}
                  style={styles.button}
                />
              </MotiView>
              
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 500, delay: 1200 }}
              >
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Já tem uma conta? </Text>
                  <Link href="/(auth)/login" asChild>
                    <Text style={styles.loginLink}>Faça Login</Text>
                  </Link>
                </View>
              </MotiView>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  formContainer: {
    width: '100%',
  },
  card: {
    padding: Theme.spacing.lg,
  },
  cardTitle: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: 4,
  },
  roleOption: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
  },
  roleSelected: {
    backgroundColor: Theme.colors.surfaceLight,
  },
  roleText: {
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.textSecondary,
  },
  roleTextSelected: {
    color: Theme.colors.primary,
  },
  button: {
    marginTop: Theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.lg,
  },
  loginText: {
    color: Theme.colors.textSecondary,
    fontFamily: Theme.typography.fonts.regular,
  },
  loginLink: {
    color: Theme.colors.primary,
    fontFamily: Theme.typography.fonts.bold,
  },
});
