import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/ui/Card';
import { Theme } from '../../constants/theme';
import { enrollmentService, StudentEnrollment } from '../../services/enrollmentService';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export default function StudentsScreen() {
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await enrollmentService.getStudents();
      setStudents(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const renderStudent = ({ item, index }: { item: StudentEnrollment, index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 500, delay: index * 100 }}
    >
      <Card glass style={styles.studentCard}>
        <View style={styles.studentRow}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.student.name.charAt(0)}</Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.student.name}</Text>
            <Text style={styles.studentEmail}>{item.student.email}</Text>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push({
              pathname: '/create-workout',
              params: { studentId: item.student.id, studentName: item.student.name }
            })}
          >
            <Text style={styles.actionBtnText}>Criar Novo Treino</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </MotiView>
  );

  return (
    <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Alunos</Text>
        <Text style={styles.subtitle}>Gerencie os treinos dos seus alunos vinculados.</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Theme.colors.primary} size="large" />
        </View>
      ) : students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderStudent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não possui alunos vinculados.</Text>
          <Text style={styles.emptySubtext}>Gere um código de convite na aba 'Convites'.</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
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
  listContent: {
    padding: Theme.spacing.lg,
    paddingBottom: 100, // For bottom tab bar
  },
  studentCard: {
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  avatarText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.background,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  studentEmail: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Theme.spacing.sm,
    marginTop: Theme.spacing.xs,
    alignItems: 'flex-end',
  },
  actionBtn: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  actionBtnText: {
    fontFamily: Theme.typography.fonts.bold,
    color: Theme.colors.primary,
    fontSize: Theme.typography.sizes.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyText: {
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  emptySubtext: {
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
});
