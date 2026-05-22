import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { YStack, XStack, Text, H1 } from 'tamagui';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      // RootNavigation guard in _layout.tsx will handle redirect automatically
    } catch (e: any) {
      setError(e?.message || 'Falha ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundElement }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <YStack gap="$five" width="100%" maxWidth={450} alignSelf="center">
            {/* Header / Logo section */}
            <YStack alignItems="center" gap="$two" marginTop="$five">
              <XStack
                backgroundColor="$primary"
                width={64}
                height={64}
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
                shadowColor={theme.primary}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.2}
                shadowRadius={8}
                elevation={4}
              >
                <SymbolView
                  name={{ ios: 'bolt.fill', android: 'flash_on', web: 'bolt' }}
                  size={32}
                  tintColor="#ffffff"
                />
              </XStack>
              <H1 fontSize={32} fontWeight="800" color="$color" letterSpacing={-0.5} marginTop="$two">
                Peak<Text color="$primary">time</Text>
              </H1>
              <Text fontSize={16} color="$textSecondary" textAlign="center">
                Seu app de acompanhamento fitness personalizado
              </Text>
            </YStack>

            {/* Login Card */}
            <Card variant="elevated" padding="$five" gap="$four">
              <YStack gap="$two">
                <Text fontSize={20} fontWeight="700" color="$color">
                  Acesse sua conta
                </Text>
                <Text fontSize={14} color="$textSecondary">
                  Insira suas credenciais para continuar
                </Text>
              </YStack>

              {error && (
                <XStack
                  backgroundColor="#fff2f0"
                  borderColor="#ffccc7"
                  borderWidth={1}
                  borderRadius="$radius.one"
                  padding="$three"
                  alignItems="center"
                  gap="$two"
                >
                  <SymbolView
                    name={{ ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' }}
                    size={18}
                    tintColor="#ff4d4f"
                  />
                  <Text fontSize={13} color="#ff4d4f" flex={1}>
                    {error}
                  </Text>
                </XStack>
              )}

              <YStack gap="$three">
                <Input
                  label="E-mail"
                  placeholder="exemplo@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (error) setError(null);
                  }}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
                      size={18}
                      tintColor={theme.textSecondary}
                    />
                  }
                  accessibilityLabel="Campo de e-mail"
                />

                <Input
                  label="Senha"
                  placeholder="Sua senha segura"
                  isPassword
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (error) setError(null);
                  }}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                      size={18}
                      tintColor={theme.textSecondary}
                    />
                  }
                  accessibilityLabel="Campo de senha"
                />
              </YStack>

              <Button
                variant="primary"
                isLoading={isLoading}
                onPress={handleLogin}
                marginTop="$two"
                accessibilityLabel="Botão de entrar"
              >
                Entrar
              </Button>
            </Card>

            {/* Footer Sign Up Link */}
            <XStack justifyContent="center" alignItems="center" gap="$one" marginBottom="$five">
              <Text fontSize={14} color="$textSecondary">
                Não tem uma conta?
              </Text>
              <Button
                variant="ghost"
                size="small"
                padding={0}
                onPress={() => router.push('/(auth)/register' as any)}
                accessibilityLabel="Ir para tela de cadastro"
              >
                Cadastre-se
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
