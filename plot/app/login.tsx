import { router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Input } from '@/components/Input';
import { Txt } from '@/components/Txt';
import { useApp } from '@/store/useApp';
import { colors, gutter, space } from '@/theme';
import { notifyError, notifySuccess } from '@/utils/haptics';

const DEMO_PASSWORD = '123';

export default function Login() {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const login = useApp((s) => s.login);
  const onboarded = useApp((s) => s.onboarded);
  const reduced = useReducedMotion();
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const submit = () => {
    if (!password || loading) return;
    if (password !== DEMO_PASSWORD) {
      notifyError();
      setError('Contraseña incorrecta');
      if (!reduced) {
        shake.set(withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        ));
      }
      return;
    }
    setLoading(true);
    notifySuccess();
    setTimeout(() => {
      login();
      router.replace(onboarded ? '/discover' : '/onboarding');
    }, 350);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <IconButton icon={ChevronLeft} label="Volver" onPress={() => router.back()} />
        </View>
        <View style={styles.body}>
          <View style={styles.lock}>
            <Lock size={26} color={colors.primary} />
          </View>
          <Txt variant="largeTitle" accessibilityRole="header">
            Hola de nuevo
          </Txt>
          <Txt variant="body" color={colors.text2}>
            Escribe tu contraseña para entrar en PLOT.
          </Txt>
          <Animated.View style={[styles.field, shakeStyle]}>
            <Input
              label="Contraseña"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (error) setError(undefined);
              }}
              secureTextEntry={!visible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              enablesReturnKeyAutomatically
              onSubmitEditing={submit}
              placeholder="Tu contraseña"
              autoFocus
              error={error}
              right={
                <IconButton
                  icon={visible ? EyeOff : Eye}
                  label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tone="plain"
                  size={20}
                  onPress={() => setVisible((v) => !v)}
                />
              }
            />
          </Animated.View>
        </View>
        <View style={styles.footer}>
          <Button label="Entrar" onPress={submit} disabled={!password} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  top: { paddingHorizontal: gutter, paddingTop: space.sm },
  body: { flex: 1, paddingHorizontal: gutter, paddingTop: space.xl, gap: space.sm },
  lock: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  field: { marginTop: space.xl },
  footer: { paddingHorizontal: gutter, paddingBottom: space.md },
});
