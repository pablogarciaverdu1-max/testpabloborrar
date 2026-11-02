import * as ImagePicker from 'expo-image-picker';

import { toast } from '@/store/useToast';

import { notifyError } from './haptics';

/** Abre el carrete real y devuelve la URI de la foto elegida. */
export async function pickPhoto(): Promise<string | undefined> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return undefined;
    return result.assets[0].uri;
  } catch {
    notifyError();
    toast('No hemos podido abrir tus fotos', { tone: 'danger' });
    return undefined;
  }
}
