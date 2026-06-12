import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Theme } from '../../constants/theme';
import { authService } from '../../services/authService';
import { useAuth } from '../../services/AuthContext';
import { MotiView } from 'moti';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      const user = await authService.login(email, password);
      signIn(user);
    } catch (error) {
      Alert.alert('Erro', 'E-mail ou senha incorretos');
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
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000 }}
            style={styles.headerContainer}
          >
            <Text style={styles.title}>PEAK<Text style={{ color: Theme.colors.primary }}>TIME</Text></Text>
            <Text style={styles.subtitle}>Find your strength</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 400 }}
            style={styles.formContainer}
          >
            <Card glass style={styles.card}>
              <Text style={styles.cardTitle}>Bem-vindo de volta</Text>
              
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
                transition={{ type: 'timing', duration: 500, delay: 800 }}
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
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 1000 }}
              >
                <Button 
                  title="Entrar" 
                  onPress={handleLogin} 
                  isLoading={isLoading}
                  style={styles.button}
                />
              </MotiView>
              
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 500, delay: 1200 }}
              >
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Ainda não tem conta? </Text>
                  <Link href="/(auth)/register" asChild>
                    <Text style={styles.registerLink}>Cadastre-se</Text>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    fontFamily: Theme.typography.fonts.black,
    fontSize: Theme.typography.sizes.xxxl,
    color: Theme.colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  button: {
    marginTop: Theme.spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.lg,
  },
  registerText: {
    color: Theme.colors.textSecondary,
    fontFamily: Theme.typography.fonts.regular,
  },
  registerLink: {
    color: Theme.colors.primary,
    fontFamily: Theme.typography.fonts.bold,
  },
});
