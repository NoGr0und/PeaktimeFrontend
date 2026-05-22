import React, { useState, useEffect } from 'react';
import { Clipboard, Platform } from 'react-native';
import { YStack, XStack, Text, Button as TButton } from 'tamagui';
import { Copy, Check, RefreshCw } from '@tamagui/lucide-icons';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { InviteCode } from '@/types/enrollment';

interface InviteCodeDisplayProps {
  inviteCode: InviteCode | null;
  onGenerate: () => Promise<any>;
  isLoading: boolean;
}

export function InviteCodeDisplay({ inviteCode, onGenerate, isLoading }: InviteCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Handle Clipboard copy
  const handleCopy = async () => {
    if (!inviteCode) return;
    const textToCopy = inviteCode.code;

    let success = false;
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          success = true;
        } catch (e) {
          console.warn('Failed to copy using navigator.clipboard', e);
        }
      }
    }

    if (!success) {
      try {
        Clipboard.setString(textToCopy);
        success = true;
      } catch (e) {
        console.warn('Failed to copy using Clipboard API', e);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate and update expiration countdown
  useEffect(() => {
    if (!inviteCode) {
      const id = setTimeout(() => setTimeLeft(''), 0);
      return () => clearTimeout(id);
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(inviteCode.expiresAt) - +new Date();
      if (difference <= 0) {
        return 'Expirado';
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (hours > 0) {
        return `Expira em ${hours}h ${minutes}m`;
      }
      const seconds = Math.floor((difference / 1000) % 60);
      return `Expira em ${minutes}m ${seconds}s`;
    };

    // Calculate initial value asynchronously to avoid set-state-in-effect
    const initialId = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 0);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(initialId);
      clearInterval(timer);
    };
  }, [inviteCode]);

  const isExpired = timeLeft === 'Expirado';

  return (
    <Card variant="elevated" gap="$three" padding="$four" width="100%" maxWidth={400} alignSelf="center">
      <YStack gap="$two" alignItems="center">
        <Text fontSize={16} fontWeight="600" color="$textSecondary" textAlign="center">
          Código de Convite
        </Text>
        <Text fontSize={14} color="$textSecondary" textAlign="center">
          Compartilhe este código com seus alunos para que eles se vinculem à sua conta.
        </Text>
      </YStack>

      {inviteCode && !isExpired ? (
        <YStack gap="$three" alignItems="center" marginVertical="$two">
          <XStack
            backgroundColor="$backgroundSelected"
            paddingVertical="$three"
            paddingHorizontal="$five"
            borderRadius="$radius.two"
            borderWidth={1}
            borderColor="$primary"
            borderStyle="dashed"
            alignItems="center"
            gap="$three"
          >
            <Text
              fontSize={32}
              fontWeight="bold"
              fontFamily="$mono"
              letterSpacing={4}
              color="$primary"
              accessibilityLabel={`Código de convite: ${inviteCode.code}`}
            >
              {inviteCode.code}
            </Text>
            
            <TButton
              size="$small"
              circular
              backgroundColor="$background"
              pressStyle={{ opacity: 0.7 }}
              onPress={handleCopy}
              accessibilityLabel="Copiar código de convite"
              icon={copied ? <Check size={18} color="#0052cc" /> : <Copy size={18} color="#5c677d" />}
            />
          </XStack>

          <Text fontSize={13} fontWeight="500" color={copied ? '$primary' : '$textSecondary'}>
            {copied ? 'Código copiado!' : timeLeft}
          </Text>

          <Button
            variant="outline"
            size="small"
            onPress={onGenerate}
            isLoading={isLoading}
            icon={<RefreshCw size={14} />}
          >
            Gerar Novo Código
          </Button>
        </YStack>
      ) : (
        <YStack gap="$three" alignItems="center" marginVertical="$three">
          {isExpired && (
            <Text fontSize={14} color="$accent" fontWeight="500">
              O código anterior expirou.
            </Text>
          )}
          <Button variant="primary" onPress={onGenerate} isLoading={isLoading} width="100%">
            Gerar Código de Convite
          </Button>
        </YStack>
      )}
    </Card>
  );
}
