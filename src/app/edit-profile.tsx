import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../services/AuthContext';
import { authService } from '../services/authService';
import { Theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AnimatedBackground } from '../components/layout/AnimatedBackground';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(() => {
    if (!user?.phone || user.phone === 'null') return '';
    return user.phone;
  });
  
  const [birthDate, setBirthDate] = useState(() => {
    if (!user?.birthDate || user.birthDate === 'null') return '';
    const date = new Date(user.birthDate);
    const day = String(date.getDate() + 1).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  });
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !birthDate.trim()) {
      Alert.alert('Erro', 'Nome e Data de Nascimento são obrigatórios.');
      return;
    }

    let finalBirthDate = birthDate.trim();
    
    // Auto-format 6 digit raw string (e.g. 230305 to 23/03/05)
    if (/^\d{6}$/.test(finalBirthDate)) {
      finalBirthDate = `${finalBirthDate.slice(0, 2)}/${finalBirthDate.slice(2, 4)}/${finalBirthDate.slice(4, 6)}`;
    }

    // Basic date format check DD/MM/YY
    if (!/^\d{2}\/\d{2}\/\d{2}$/.test(finalBirthDate)) {
      Alert.alert('Erro', 'A data de nascimento deve estar no formato DD/MM/YY ou DDMMAA (ex: 230305)');
      return;
    }

    setLoading(true);
    try {
      const [day, month, shortYear] = finalBirthDate.split('/');
      const fullYear = parseInt(shortYear) >= 30 ? `19${shortYear}` : `20${shortYear}`;
      const dateIso = new Date(`${fullYear}-${month}-${day}`).toISOString();
      const updatedUser = await authService.updateProfile({
        name,
        phone,
        birthDate: dateIso,
      });
      updateUser(updatedUser);
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Theme.colors.background, Theme.colors.surface]} style={styles.container}>
        <AnimatedBackground variant="profile-pulse" iconName="account-edit" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Informações</Text>
            <Text style={styles.subtitle}>Altere os dados da sua conta.</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome Completo"
              icon="account"
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
            />
            
            <Input
              label="Data de nascimento"
              icon="calendar"
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="Ex: 25/10/95"
            />

            <Input
              label="Telefone (Opcional)"
              icon="phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Ex: 11999999999"
              keyboardType="phone-pad"
            />

            {/* Email and Password fields are disabled as per requirements */}
            <View style={styles.disabledField}>
              <Text style={styles.disabledLabel}>E-mail (Inalterável)</Text>
              <Text style={styles.disabledValue}>{user?.email}</Text>
            </View>

            <Button
              title={loading ? 'Salvando...' : 'Salvar Alterações'}
              onPress={handleSave}
              disabled={loading}
              style={styles.saveButton}
            />
            <Button
              title="Cancelar"
              onPress={() => router.back()}
              variant="outline"
              disabled={loading}
              style={styles.cancelButton}
            />
          </View>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: Theme.typography.fonts.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  disabledField: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  disabledLabel: {
    fontSize: 12,
    fontFamily: Theme.typography.fonts.medium,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  disabledValue: {
    fontSize: 16,
    fontFamily: Theme.typography.fonts.regular,
    color: Theme.colors.text,
  },
  saveButton: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 10,
  }
});
