import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { YStack, XStack, Text, H2, AnimatePresence } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useEnrollment } from '@/hooks/use-enrollment';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LogOut, Link2, CheckCircle2, AlertCircle } from '@tamagui/lucide-icons';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const { linkedProfessor, isLoading, error, setError, fetchProfessor, joinWithCode } = useEnrollment();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch linked professor details when page comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfessor();
    }, [fetchProfessor])
  );

  const getInitials = (name: string) => {
    if (!name) return 'AL';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLink = async () => {
    if (code.length !== 6) {
      setError('O código de convite deve conter exatamente 6 caracteres');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await joinWithCode(code.toUpperCase());
      setCode('');
    } catch {
      // Error is set automatically by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <YStack gap="$four" padding="$four" width="100%">
          <H2 color="$color" fontWeight="bold">Perfil</H2>

          {/* Student Profile Card */}
          <Card variant="flat" padding="$four" gap="$three">
            <XStack gap="$three" alignItems="center">
              <XStack
                width={64}
                height={64}
                borderRadius={32}
                backgroundColor="$primaryLight"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="$primary" fontWeight="bold" fontSize={22}>
                  {getInitials(user?.name || '')}
                </Text>
              </XStack>
              <YStack gap="$half" flex={1}>
                <Text fontSize={18} fontWeight="bold" color="$color">
                  {user?.name || 'Aluno'}
                </Text>
                <Text fontSize={14} color="$textSecondary">
                  {user?.email}
                </Text>
                <XStack
                  backgroundColor="$backgroundSelected"
                  paddingHorizontal="$two"
                  paddingVertical="$half"
                  borderRadius="$radius.half"
                  alignSelf="flex-start"
                >
                  <Text fontSize={12} fontWeight="600" color="$primary">
                    ALUNO
                  </Text>
                </XStack>
              </YStack>
            </XStack>
          </Card>

          {/* Vinculation Section */}
          {linkedProfessor ? (
            <Card variant="elevated" gap="$three" padding="$four">
              <XStack gap="$two" alignItems="center">
                <CheckCircle2 size={20} color="#0052cc" />
                <Text fontSize={16} fontWeight="bold" color="$color">
                  Professor Vinculado
                </Text>
              </XStack>
              <Text fontSize={14} color="$textSecondary">
                Você está vinculado e recebendo treinos do seguinte professor:
              </Text>

              <XStack gap="$three" alignItems="center" backgroundColor="$backgroundElement" padding="$three" borderRadius="$radius.one">
                <XStack
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor="$backgroundSelected"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="$primary" fontWeight="bold" fontSize={16}>
                    {getInitials(linkedProfessor.professor?.name || '')}
                  </Text>
                </XStack>
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color="$color">
                    {linkedProfessor.professor?.name || 'Professor'}
                  </Text>
                  <Text fontSize={13} color="$textSecondary">
                    {linkedProfessor.professor?.email}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          ) : (
            <Card variant="elevated" gap="$three" padding="$four">
              <XStack gap="$two" alignItems="center">
                <Link2 size={20} color="#0052cc" />
                <Text fontSize={16} fontWeight="bold" color="$color">
                  Vincular Professor
                </Text>
              </XStack>
              <Text fontSize={14} color="$textSecondary">
                Insira o código de convite de 6 caracteres fornecido pelo seu professor para receber seus planos de treino.
              </Text>

              <YStack gap="$two">
                <Input
                  placeholder="Código (ex: A1B2C3)"
                  value={code}
                  onChangeText={(text) => {
                    setError(null);
                    setCode(text.toUpperCase());
                  }}
                  maxLength={6}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  accessibilityLabel="Campo para digitar código de convite de 6 caracteres"
                />

                <AnimatePresence>
                  {error && (
                    <XStack gap="$two" alignItems="center" padding="$two" backgroundColor="$primaryLight" borderRadius="$radius.half" marginVertical="$one">
                      <AlertCircle size={16} color="#0052cc" />
                      <Text fontSize={13} color="$primary" fontWeight="500" flex={1}>
                        {error}
                      </Text>
                    </XStack>
                  )}
                </AnimatePresence>

                <Button
                  variant="primary"
                  onPress={handleLink}
                  isLoading={isSubmitting || isLoading}
                  disabled={code.length !== 6}
                  width="100%"
                  marginTop="$two"
                >
                  Confirmar Vínculo
                </Button>
              </YStack>
            </Card>
          )}

          {/* Session Log out */}
          <Button
            variant="outline"
            onPress={logout}
            icon={<LogOut size={18} />}
            width="100%"
            marginTop="$two"
          >
            Sair da Conta
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
