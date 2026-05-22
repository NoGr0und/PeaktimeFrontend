import React, { useState } from 'react';
import { StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { YStack, XStack, Text, H1, View } from 'tamagui';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/use-theme';
import { UserRole } from '@/types/auth';

export default function RegisterScreen() {
  const { register } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>('ALUNO');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Auto-format birth date (DD/MM/YYYY)
  const handleBirthDateChange = (text: string) => {
    const clean = text.replace(/\D/g, '');
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    if (clean.length > 4) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    }
    setBirthDate(formatted.slice(0, 10));
    if (errors.birthDate) {
      setErrors((prev) => ({ ...prev, birthDate: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome completo é obrigatório.';
    
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido.';
    }

    if (!birthDate.trim()) {
      newErrors.birthDate = 'Data de nascimento é obrigatória.';
    } else {
      // Validate DD/MM/YYYY format
      const dateReg = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateReg.test(birthDate)) {
        newErrors.birthDate = 'Formato inválido (DD/MM/AAAA).';
      } else {
        const parts = birthDate.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        const currentYear = new Date().getFullYear();
        if (
          dateObj.getFullYear() !== year ||
          dateObj.getMonth() !== month ||
          dateObj.getDate() !== day
        ) {
          newErrors.birthDate = 'Data inexistente.';
        } else if (year < 1900 || year > currentYear) {
          newErrors.birthDate = 'Ano inválido.';
        }
      }
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve conter ao menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setGeneralError(null);
    if (!validate()) return;

    setIsLoading(true);

    // Convert birth date DD/MM/YYYY to YYYY-MM-DD for the API
    const parts = birthDate.split('/');
    const apiBirthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    try {
      await register({
        email: email.trim(),
        name: name.trim(),
        birthDate: apiBirthDate,
        role,
        phone: phone.trim() || undefined,
        password,
      });
      // Context will update automatically if session is returned
      // If it doesn't log in immediately (e.g. requires email verification), alert the user
      alert('Cadastro realizado com sucesso! Verifique seu e-mail, se necessário.');
      router.replace('/(auth)/login' as any);
    } catch (e: any) {
      setGeneralError(e?.message || 'Erro ao realizar o cadastro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Criar Nova Conta - Peaktime</title>
        <meta name="description" content="Cadastre-se no Peaktime como Aluno ou Professor para gerenciar treinos e nutrição." />
      </Head>
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
          <YStack gap="$five" width="100%" maxWidth={480} alignSelf="center">
            {/* Header section */}
            <YStack alignItems="center" gap="$one" marginTop="$three">
              <H1 fontSize={28} fontWeight="800" color="$color" letterSpacing={-0.5}>
                Criar Nova Conta
              </H1>
              <Text fontSize={14} color="$textSecondary" textAlign="center">
                Preencha seus dados para se cadastrar
              </Text>
            </YStack>

            {/* Registration Card */}
            <Card variant="elevated" padding="$five" gap="$four">
              {generalError && (
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
                    {generalError}
                  </Text>
                </XStack>
              )}

              {/* Role selection section */}
              <YStack gap="$two">
                <Text fontSize={14} fontWeight="600" color="$textSecondary" marginLeft={4}>
                  Quem é você?
                </Text>
                <XStack gap="$three">
                  <Pressable
                    style={[
                      styles.roleCard,
                      {
                        borderColor: role === 'ALUNO' ? theme.primary : theme.backgroundSelected,
                        backgroundColor: role === 'ALUNO' ? theme.primaryLight : theme.background,
                      },
                    ]}
                    onPress={() => setRole('ALUNO')}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: role === 'ALUNO' }}
                    accessibilityLabel="Tipo de usuário: Aluno"
                  >
                    <SymbolView
                      name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                      size={24}
                      tintColor={role === 'ALUNO' ? theme.primary : theme.textSecondary}
                    />
                    <Text
                      fontWeight="700"
                      color={role === 'ALUNO' ? theme.primary : theme.text}
                      marginTop={4}
                    >
                      Sou Aluno
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.roleCard,
                      {
                        borderColor: role === 'PROFESSOR' ? theme.primary : theme.backgroundSelected,
                        backgroundColor: role === 'PROFESSOR' ? theme.primaryLight : theme.background,
                      },
                    ]}
                    onPress={() => setRole('PROFESSOR')}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: role === 'PROFESSOR' }}
                    accessibilityLabel="Tipo de usuário: Professor"
                  >
                    <SymbolView
                      name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                      size={24}
                      tintColor={role === 'PROFESSOR' ? theme.primary : theme.textSecondary}
                    />
                    <Text
                      fontWeight="700"
                      color={role === 'PROFESSOR' ? theme.primary : theme.text}
                      marginTop={4}
                    >
                      Sou Professor
                    </Text>
                  </Pressable>
                </XStack>
              </YStack>

              {/* Inputs Form */}
              <YStack gap="$three">
                <Input
                  label="Nome Completo"
                  placeholder="Seu nome aqui"
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  error={errors.name}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'person', android: 'person_outline', web: 'person' }}
                      size={18}
                      tintColor={theme.textSecondary}
                    />
                  }
                  accessibilityLabel="Campo de nome completo"
                />

                <Input
                  label="E-mail"
                  placeholder="exemplo@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  error={errors.email}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
                      size={18}
                      tintColor={theme.textSecondary}
                    />
                  }
                  accessibilityLabel="Campo de e-mail"
                />

                <XStack gap="$three">
                  <View flex={1}>
                    <Input
                      label="Nascimento"
                      placeholder="DD/MM/AAAA"
                      keyboardType="number-pad"
                      value={birthDate}
                      onChangeText={handleBirthDateChange}
                      error={errors.birthDate}
                      leftIcon={
                        <SymbolView
                          name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                          size={18}
                          tintColor={theme.textSecondary}
                        />
                      }
                      accessibilityLabel="Campo de data de nascimento"
                    />
                  </View>
                  <View flex={1}>
                    <Input
                      label="Telefone (Opcional)"
                      placeholder="(99) 99999-9999"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={(val) => setPhone(val)}
                      leftIcon={
                        <SymbolView
                          name={{ ios: 'phone', android: 'phone', web: 'phone' }}
                          size={18}
                          tintColor={theme.textSecondary}
                        />
                      }
                      accessibilityLabel="Campo de telefone"
                    />
                  </View>
                </XStack>

                <Input
                  label="Senha"
                  placeholder="No mínimo 6 caracteres"
                  isPassword
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  error={errors.password}
                  leftIcon={
                    <SymbolView
                      name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                      size={18}
                      tintColor={theme.textSecondary}
                    />
                  }
                  accessibilityLabel="Campo de senha de cadastro"
                />
              </YStack>

              <Button
                variant="primary"
                isLoading={isLoading}
                onPress={handleRegister}
                marginTop="$two"
                accessibilityLabel="Botão de cadastrar"
              >
                Cadastrar e Acessar
              </Button>
            </Card>

            {/* Footer link to Login */}
            <XStack justifyContent="center" alignItems="center" gap="$one" marginBottom="$five">
              <Text fontSize={14} color="$textSecondary">
                Já possui uma conta?
              </Text>
              <Button
                variant="ghost"
                size="small"
                padding={0}
                onPress={() => router.replace('/(auth)/login' as any)}
                accessibilityLabel="Ir para tela de login"
              >
                Faça Login
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
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
    paddingVertical: 20,
  },
  roleCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
});
