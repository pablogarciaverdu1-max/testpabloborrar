import { ActionSheetIOS, Alert, Platform } from 'react-native';

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

/** Diálogo de confirmación nativo de iOS. */
export function confirm({ title, message, confirmText, cancelText = 'Cancelar', destructive, onConfirm, onCancel }: ConfirmOptions) {
  if (Platform.OS === 'web') {
    // Solo para probar en el navegador: en iPhone se usa la alerta nativa.
    if (globalThis.confirm?.(`${title}${message ? `\n\n${message}` : ''}`)) onConfirm();
    else onCancel?.();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel', onPress: onCancel },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

type Action = { label: string; destructive?: boolean; onPress: () => void };

/** Menú de acciones nativo (hoja de acciones en iOS). */
export function showActions(title: string | undefined, actions: Action[]) {
  if (Platform.OS === 'ios') {
    const options = [...actions.map((a) => a.label), 'Cancelar'];
    const destructiveButtonIndex = actions.map((a, i) => (a.destructive ? i : -1)).filter((i) => i >= 0);
    ActionSheetIOS.showActionSheetWithOptions(
      { title, options, cancelButtonIndex: options.length - 1, destructiveButtonIndex },
      (index) => {
        if (index < actions.length) actions[index].onPress();
      },
    );
    return;
  }
  if (Platform.OS === 'web') {
    const labels = actions.map((a, i) => `${i + 1}. ${a.label}`).join('\n');
    const answer = Number(globalThis.prompt?.(`${title ?? ''}\n${labels}`) ?? 0);
    if (answer >= 1 && answer <= actions.length) actions[answer - 1].onPress();
    return;
  }
  Alert.alert(title ?? '', undefined, [
    ...actions.map((a) => ({ text: a.label, style: a.destructive ? ('destructive' as const) : ('default' as const), onPress: a.onPress })),
    { text: 'Cancelar', style: 'cancel' as const },
  ]);
}
