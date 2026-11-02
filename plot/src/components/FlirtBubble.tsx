import { Pencil, Send, Shuffle, Sparkles, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { questionsFor, type Topic } from '@/data/flirt';
import { categories, colors, gutter, radius, space } from '@/theme';
import type { Person } from '@/types';
import { tapLight, tapMedium } from '@/utils/haptics';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Txt } from './Txt';

type Props = {
  visible: boolean;
  person: Person;
  topic: Topic;
  onClose: () => void;
  onSend: (questionId: string, text: string) => void;
  onWriteOwn: (text: string) => void;
};

/** Muelle con poca amortiguación: la burbuja «rebota» al aparecer. */
const bounce = { damping: 7, stiffness: 190, mass: 0.8 };

/** Burbuja emergente con una pregunta de ligue según la categoría que estás mirando. */
export function FlirtBubble({ visible, person, topic, onClose, onSend, onWriteOwn }: Props) {
  const reduced = useReducedMotion();
  const list = useMemo(() => questionsFor(topic), [topic]);
  const [index, setIndex] = useState(0);
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const tilt = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    opacity.set(withTiming(1, { duration: 180 }));
    if (reduced) {
      scale.set(1);
    } else {
      scale.set(0.3);
      scale.set(withSpring(1, bounce));
      tilt.set(withSequence(withTiming(-4, { duration: 120 }), withSpring(0, bounce)));
    }
  }, [visible, reduced, scale, opacity, tilt]);

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${tilt.value}deg` }],
  }));

  if (!visible || list.length === 0) return null;
  const q = list[index % list.length];
  const cat = topic === 'general' ? undefined : categories[topic];

  const another = () => {
    tapLight();
    setIndex((i) => i + 1);
    if (!reduced) {
      scale.set(withSequence(withTiming(0.86, { duration: 90 }), withSpring(1, bounce)));
      tilt.set(withSequence(withTiming(3, { duration: 90 }), withSpring(0, bounce)));
    }
  };

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar pregunta" />
        <View style={styles.content} pointerEvents="box-none">
          <View style={styles.top}>
            <View style={[styles.tag, { backgroundColor: cat ? cat.solid : colors.primarySoft }]}>
              <Sparkles size={14} color={colors.ink} />
              <Txt variant="footnoteStrong" color={colors.ink}>
                {cat ? cat.label : 'Para romper el hielo'}
              </Txt>
            </View>
            <IconButton icon={X} label="Cerrar" tone="glass" onPress={onClose} />
          </View>

          <Animated.View style={[styles.bubbleWrap, bubbleStyle]} accessibilityViewIsModal accessibilityLiveRegion="polite">
            <View style={styles.bubble}>
              <Txt variant="caption" color={colors.onPrimaryMuted}>
                PREGÚNTALE A {person.name.toUpperCase()}
              </Txt>
              <Txt variant="title2" color={colors.white} accessibilityRole="header">
                {q.question}
              </Txt>
            </View>
            <View style={styles.tail} />
          </Animated.View>

          <View style={styles.to}>
            <Avatar photoId={person.id} name={person.name} color={person.color} size={40} verified={person.verified} />
            <Txt variant="subheadStrong" color={colors.white}>
              Para {person.name}
            </Txt>
          </View>

          <View style={styles.actions}>
            <Button
              label="Enviar pregunta"
              icon={Send}
              haptic={false}
              onPress={() => {
                tapMedium();
                onSend(q.id, q.question);
              }}
            />
            <View style={styles.row}>
              <Button label="Otra pregunta" icon={Shuffle} variant="light" size="md" flex onPress={another} />
              <Button label="Escribir la mía" icon={Pencil} variant="dark" size="md" flex onPress={() => onWriteOwn(q.question)} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'center' },
  content: { paddingHorizontal: gutter, gap: space.lg, maxWidth: 480, width: '100%', alignSelf: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.chip },
  bubbleWrap: { alignItems: 'flex-end' },
  bubble: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: radius.cardLg,
    borderBottomRightRadius: 8,
    padding: space.xl,
    gap: space.sm,
    shadowColor: colors.ink,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  tail: { width: 22, height: 22, backgroundColor: colors.primary, marginTop: -12, marginRight: 18, transform: [{ rotate: '45deg' }], borderRadius: 4 },
  to: { flexDirection: 'row', alignItems: 'center', gap: space.sm, alignSelf: 'flex-end' },
  actions: { gap: space.sm, marginTop: space.sm },
  row: { flexDirection: 'row', gap: space.sm },
});
