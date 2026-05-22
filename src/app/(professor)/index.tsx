import React, { useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { YStack, XStack, Text, H2, Spinner } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { useEnrollment } from '@/hooks/use-enrollment';
import { StudentListItem } from '@/components/StudentListItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Users, Plus, AlertCircle } from '@tamagui/lucide-icons';

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { activeStudents, isLoading, error, fetchStudents } = useEnrollment();
  const router = useRouter();

  // Fetch list of students when dashboard gets focus
  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [fetchStudents])
  );

  const handleCreatePlan = (studentId: string) => {
    // In Phase 6, we'll build the create-plan screen. Navigate there.
    router.push({
      pathname: '/(professor)/create-plan',
      params: { studentId },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && activeStudents.length > 0}
            onRefresh={fetchStudents}
            colors={['#0052cc']}
            tintColor="#0052cc"
          />
        }
      >
        <YStack gap="$four" padding="$four" width="100%">
          <YStack gap="$one">
            <Text fontSize={15} color="$textSecondary" fontWeight="600">
              Prof. {user?.name || 'Professor'}
            </Text>
            <H2 color="$color" fontWeight="bold">Meus Alunos</H2>
          </YStack>

          {/* Error Banner */}
          {error && (
            <XStack gap="$two" alignItems="center" padding="$three" backgroundColor="$primaryLight" borderRadius="$radius.one">
              <AlertCircle size={18} color="#0052cc" />
              <Text fontSize={13} color="$primary" fontWeight="500" flex={1}>
                {error}
              </Text>
            </XStack>
          )}

          {isLoading && activeStudents.length === 0 ? (
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$six">
              <Spinner size="large" color="$primary" />
            </YStack>
          ) : activeStudents.length > 0 ? (
            <YStack gap="$two">
              <Text fontSize={13} color="$textSecondary" fontWeight="600" marginBottom="$one">
                VÍNCULOS ATIVOS ({activeStudents.length})
              </Text>
              {activeStudents.map((enrollment) => (
                <StudentListItem
                  key={enrollment.id}
                  enrollment={enrollment}
                  onPressAction={() => handleCreatePlan(enrollment.studentId)}
                />
              ))}
            </YStack>
          ) : (
            <Card variant="elevated" padding="$five" gap="$four" alignItems="center" justifyContent="center" marginTop="$four">
              <YStack
                width={64}
                height={64}
                borderRadius={32}
                backgroundColor="$primaryLight"
                justifyContent="center"
                alignItems="center"
                marginBottom="$two"
              >
                <Users size={32} color="#0052cc" />
              </YStack>

              <YStack gap="$two" alignItems="center">
                <Text fontSize={18} fontWeight="bold" color="$color" textAlign="center">
                  Nenhum aluno ainda
                </Text>
                <Text fontSize={14} color="$textSecondary" textAlign="center" lineHeight={20}>
                  Compartilhe seu código de convite no perfil para que seus alunos possam se vincular a você.
                </Text>
              </YStack>

              <Button
                variant="primary"
                onPress={() => router.push('/(professor)/profile' as any)}
                icon={<Plus size={16} />}
                width="100%"
                marginTop="$two"
              >
                Ver Código de Convite
              </Button>
            </Card>
          )}
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
