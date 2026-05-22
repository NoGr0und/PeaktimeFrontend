import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { YStack, XStack, Text, H2 } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/use-auth';
import { useEnrollment } from '@/hooks/use-enrollment';
import { InviteCodeDisplay } from '@/components/InviteCodeDisplay';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogOut } from '@tamagui/lucide-icons-2';
import Head from 'expo-router/head';

export default function ProfessorProfile() {
  const { user, logout } = useAuth();
  const { inviteCode, generateInviteCode, isLoading } = useEnrollment();

  const getInitials = (name: string) => {
    if (!name) return 'PR';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <Head>
        <title>Meu Perfil - Professor - Peaktime</title>
        <meta name="description" content="Gerencie seu perfil de professor e código de convite no Peaktime." />
      </Head>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <YStack gap="$four" padding="$four" width="100%">
            <H2 color="$color" fontWeight="bold">Perfil</H2>

          {/* Profile Details Card */}
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
                  {user?.name || 'Professor'}
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
                    PROFESSOR
                  </Text>
                </XStack>
              </YStack>
            </XStack>
          </Card>

          {/* Invitation Card */}
          <InviteCodeDisplay
            inviteCode={inviteCode}
            onGenerate={generateInviteCode}
            isLoading={isLoading}
          />

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
    </>
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
