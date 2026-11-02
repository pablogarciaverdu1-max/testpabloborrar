import { router } from 'expo-router';
import { Ban, Bell, LogOut, MapPin, RotateCcw, ShieldCheck, ShieldAlert } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { AppGlyph } from '@/components/AppGlyph';
import { Group, Row, SwitchRow } from '@/components/Group';
import { Txt } from '@/components/Txt';
import { appInfo, appOrder } from '@/data/catalog';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import { categories, colors, space } from '@/theme';
import type { WhoCanWrite } from '@/types';
import { confirm } from '@/utils/confirm';
import { notifySuccess } from '@/utils/haptics';
import { useAppConnection } from '@/utils/useAppConnection';

const whoOptions: { value: WhoCanWrite; label: string; detail: string }[] = [
  { value: 'everyone', label: 'Todo el mundo', detail: 'Cualquier persona puede enviarte una solicitud' },
  { value: 'verified', label: 'Solo perfiles verificados', detail: 'Las solicitudes de perfiles sin verificar no te llegan' },
  { value: 'common', label: 'Solo con intereses en común', detail: 'Tiene que compartir al menos un interés contigo' },
];

export default function SettingsScreen() {
  const settings = useApp((s) => s.settings);
  const setSettings = useApp((s) => s.setSettings);
  const blocked = useApp((s) => s.blocked);
  const resetDemo = useApp((s) => s.resetDemo);
  const logout = useApp((s) => s.logout);
  const { apps, connecting, toggle } = useAppConnection();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scroll}>
      <Group title="Quién puede escribirme" footer={`Ahora: ${whoOptions.find((o) => o.value === settings.whoCanWrite)?.label}.`}>
        {whoOptions.map((o) => (
          <Row
            key={o.value}
            label={o.label}
            detail={o.detail}
            checked={settings.whoCanWrite === o.value}
            onPress={() => {
              setSettings({ whoCanWrite: o.value });
              toast(`Quién puede escribirte: ${o.label.toLowerCase()}`);
            }}
          />
        ))}
      </Group>

      <Group title="Privacidad y avisos">
        <SwitchRow
          icon={ShieldAlert}
          iconBg={categories.music.soft}
          label="Filtrar mensajes ofensivos"
          detail="Ocultamos las solicitudes con lenguaje ofensivo"
          value={settings.offensiveFilter}
          onChange={(v) => setSettings({ offensiveFilter: v })}
        />
        <SwitchRow
          icon={MapPin}
          iconBg={categories.places.soft}
          label="Mostrar mi distancia"
          detail={settings.showDistance ? 'Los demás ven a cuántos km estás' : 'Tu distancia está oculta'}
          value={settings.showDistance}
          onChange={(v) => setSettings({ showDistance: v })}
        />
        <SwitchRow
          icon={Bell}
          iconBg={categories.food.soft}
          label="Notificaciones"
          detail={settings.notifications ? 'Te avisamos de mensajes nuevos' : 'No recibirás avisos'}
          value={settings.notifications}
          onChange={(v) => {
            setSettings({ notifications: v });
            toast(v ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
          }}
        />
      </Group>

      <Group title="Apps conectadas" footer="Al conectar una app solo compartimos lo que tú publiques.">
        {appOrder.map((a) => (
          <Row
            key={a}
            label={appInfo[a].name}
            detail={apps[a] ? 'Conectada' : 'Sin conectar'}
            right={
              <View style={styles.appRight}>
                <AppGlyph app={a} size={28} />
                {connecting[a] ? <ActivityIndicator color={colors.primary} style={styles.spinner} /> : null}
              </View>
            }
            onPress={() => toggle(a)}
            value={connecting[a] ? undefined : apps[a] ? 'Desconectar' : 'Conectar'}
          />
        ))}
      </Group>

      <Group title="Seguridad">
        <Row icon={Ban} label="Usuarios bloqueados" value={blocked.length ? String(blocked.length) : 'Ninguno'} chevron onPress={() => router.push('/settings/blocked')} />
        <Row icon={ShieldCheck} label="Centro de seguridad" chevron onPress={() => router.push('/settings/safety')} />
      </Group>

      <Group title="Demo" footer="Devuelve perfiles, chats, publicaciones y ajustes al estado inicial. Útil para repetir la presentación.">
        <Row
          icon={RotateCcw}
          label="Reiniciar demo"
          destructive
          onPress={() =>
            confirm({
              title: '¿Reiniciar la demo?',
              message: 'Se borrarán tus publicaciones, mensajes, bloqueos y ajustes. Volverás a la pantalla de bienvenida.',
              confirmText: 'Reiniciar',
              destructive: true,
              onConfirm: () => {
                notifySuccess();
                router.dismissAll();
                resetDemo();
                router.replace('/welcome');
              },
            })
          }
        />
      </Group>

      <Group>
        <Row
          icon={LogOut}
          label="Cerrar sesión"
          destructive
          onPress={() =>
            confirm({
              title: '¿Cerrar sesión?',
              message: 'Tus datos se quedan guardados en este iPhone. Para volver a entrar necesitarás tu contraseña.',
              confirmText: 'Cerrar sesión',
              destructive: true,
              onConfirm: () => {
                router.dismissAll();
                logout();
                router.replace('/welcome');
              },
            })
          }
        />
      </Group>

      <Txt variant="footnote" color={colors.text3} align="center">
        PLOT 1.0 · Demo
      </Txt>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: space.lg, gap: space.xl, paddingBottom: space.xxxl },
  appRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  spinner: { marginLeft: space.xs },
});
