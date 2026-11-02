import * as Haptics from 'expo-haptics';

const safe = (p: Promise<void>) => {
  p.catch(() => undefined);
};

/** Háptica ligera para selecciones. */
export const tapLight = () => safe(Haptics.selectionAsync());
/** Háptica media al enviar o publicar. */
export const tapMedium = () => safe(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
export const notifySuccess = () => safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const notifyError = () => safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
export const notifyWarning = () => safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
