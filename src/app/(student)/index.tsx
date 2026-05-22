import React, { useCallback, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { YStack, XStack, Text, Spinner, Card as TCard } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import Head from 'expo-router/head';
import { CheckCircle2, Award, Moon, RefreshCw, AlertTriangle } from '@tamagui/lucide-icons-2';

import { useAuth } from '@/hooks/use-auth';
import { useWorkouts } from '@/hooks/use-workouts';
import { WorkoutCard } from '@/components/WorkoutCard';
import { Button } from '@/components/ui/Button';

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    todayWorkout,
    isCompletedToday,
    isLoading,
    error,
    fetchTodayWorkout,
    completeWorkout,
  } = useWorkouts();

  const [completing, setCompleting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTodayWorkout();
    }, [fetchTodayWorkout])
  );

  const handleComplete = async () => {
    if (!todayWorkout) return;
    setCompleting(true);
    try {
      await completeWorkout(todayWorkout.id);
      setShowFeedback(true);
      // Keep feedback visible or dismiss it after 6 seconds
      setTimeout(() => {
        setShowFeedback(false);
      }, 6000);
    } catch {
      // Error is set in workouts hook, catch to avoid unhandled promise rejection
    } finally {
      setCompleting(false);
    }
  };

  const getFirstName = (name?: string) => {
    if (!name) return 'Aluno';
    return name.split(' ')[0];
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const renderContent = () => {
    if (isLoading && !todayWorkout) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" py="$six">
          <Spinner size="large" color="$primary" />
          <Text mt="$three" color="$textSecondary" fontSize={14}>
            Carregando seu treino...
          </Text>
        </YStack>
      );
    }

    if (error) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" py="$six" px="$four" gap="$three">
          <AlertTriangle size={48} color="$accent" />
          <Text fontSize={16} fontWeight="bold" textAlign="center" color="$color">
            Não foi possível carregar seu treino
          </Text>
          <Text fontSize={14} color="$textSecondary" textAlign="center">
            {error}
          </Text>
          <Button variant="outline" size="small" icon={<RefreshCw size={14} />} onPress={fetchTodayWorkout}>
            Tentar Novamente
          </Button>
        </YStack>
      );
    }

    if (!todayWorkout) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" py="$six" px="$four" gap="$four">
          <XStack
            width={72}
            height={72}
            borderRadius={36}
            backgroundColor="$backgroundSelected"
            justifyContent="center"
            alignItems="center"
          >
            <Moon size={36} color="$primary" />
          </XStack>
          <YStack gap="$two" alignItems="center">
            <Text fontSize={18} fontWeight="bold" textAlign="center" color="$color">
              Dia de Descanso
            </Text>
            <Text fontSize={15} color="$textSecondary" textAlign="center">
              Nenhum treino planejado para hoje. Aproveite para descansar!
            </Text>
          </YStack>
        </YStack>
      );
    }

    return (
      <YStack gap="$four" flex={1}>
        <WorkoutCard dayPlan={todayWorkout} />

        {/* Completion Success Feedback Message */}
        {(isCompletedToday || showFeedback) && (
          <TCard
            backgroundColor="$primaryLight"
            borderColor="$primary"
            borderWidth={1}
            borderRadius="$radius.two"
            padding="$four"
            gap="$two"
          >
            <XStack gap="$three" alignItems="center">
              <Award size={24} color="$primary" />
              <YStack flex={1}>
                <Text fontWeight="bold" fontSize={16} color="$primary">
                  Treino Concluído!
                </Text>
                <Text fontSize={14} color="$textSecondary">
                  Parabéns pela dedicação de hoje. Continue assim!
                </Text>
              </YStack>
            </XStack>
          </TCard>
        )}

        <Button
          variant={isCompletedToday ? 'outline' : 'primary'}
          size="large"
          onPress={handleComplete}
          isLoading={completing}
          disabled={isCompletedToday}
          icon={isCompletedToday ? <CheckCircle2 size={20} color="#0052cc" /> : undefined}
          accessibilityLabel={isCompletedToday ? "Treino marcado como concluído para hoje" : "Clique para concluir o treino de hoje"}
        >
          {isCompletedToday ? 'Treino Concluído' : 'Concluir Treino'}
        </Button>
      </YStack>
    );
  };

  return (
    <>
      <Head>
        <title>Treino de Hoje - Peaktime</title>
        <meta name="description" content="Visualize seu cronograma de exercícios diários e registre suas conclusões no Peaktime." />
      </Head>
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <YStack gap="$four" padding="$four" width="100%" maxWidth={800} alignSelf="center">
          {/* Header Greeting */}
          <YStack gap="$one" mb="$two">
            <Text fontSize={24} fontWeight="bold" color="$color">
              Olá, {getFirstName(user?.name)}!
            </Text>
            <Text fontSize={14} color="$textSecondary" textTransform="capitalize">
              {getFormattedDate()}
            </Text>
          </YStack>

          {renderContent()}
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
