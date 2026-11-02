import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Segmented } from '@/components/Segmented';
import { Txt } from '@/components/Txt';
import { colors, gutter, space } from '@/theme';

const terms = [
  ['1. Qué es PLOT', 'PLOT es una red social para conocer gente a partir de lo que le gusta. No hay deslizar, likes ni seguidores: cada persona publica sus intereses y cualquiera puede escribir a cualquiera.'],
  ['2. Edad mínima', 'Para usar PLOT tienes que tener al menos 18 años.'],
  ['3. Respeto', 'No se permite el acoso, el lenguaje ofensivo, los perfiles falsos ni el spam. Puedes bloquear y reportar a cualquier persona desde su perfil o el chat.'],
  ['4. Tu contenido', 'Lo que publicas es tuyo. Nos das permiso para mostrarlo a las personas que elijas en «Visible para».'],
  ['5. Cuenta', 'Puedes cerrar sesión o borrar tu cuenta cuando quieras desde Ajustes.'],
];

const privacy = [
  ['Qué guardamos', 'Tu perfil, tus publicaciones, tus conversaciones y tus ajustes. En esta demo todo se guarda solo en tu teléfono.'],
  ['Apps conectadas', 'Solo leemos lo que decides compartir de Spotify, Strava, Google Maps o Fotos. Puedes desconectarlas en cualquier momento.'],
  ['Ubicación', 'Mostramos la distancia aproximada, nunca tu ubicación exacta. Puedes ocultarla en Ajustes.'],
  ['Mensajes', 'Las personas nuevas te escriben a Solicitudes. No sabrán que lo has leído hasta que respondas.'],
  ['Tus derechos', 'Puedes pedir una copia de tus datos o su eliminación escribiendo a soporte.'],
];

export default function Legal() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<'terms' | 'privacy'>(params.tab === 'privacy' ? 'privacy' : 'terms');
  const content = tab === 'terms' ? terms : privacy;
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Txt variant="title1" accessibilityRole="header">
          {tab === 'terms' ? 'Condiciones' : 'Privacidad'}
        </Txt>
        <Segmented
          options={[
            { value: 'terms', label: 'Condiciones' },
            { value: 'privacy', label: 'Privacidad' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Txt variant="footnote" color={colors.text3}>
          Última actualización: octubre de 2026 · Texto de demostración
        </Txt>
        {content.map(([title, text]) => (
          <View key={title} style={styles.section}>
            <Txt variant="headline">{title}</Txt>
            <Txt variant="body" color={colors.text2}>
              {text}
            </Txt>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: gutter, paddingTop: space.xl, gap: space.md },
  body: { padding: gutter, gap: space.lg, paddingBottom: space.xxxl },
  section: { gap: space.xs },
});
