import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Linking } from 'react-native';

import { appInfo } from '@/data/catalog';
import { useApp } from '@/store/useApp';
import { toast } from '@/store/useToast';
import type { AppId } from '@/types';

import { confirm } from './confirm';
import { notifyError, notifySuccess } from './haptics';

/** Conectar y desconectar apps (simulado). «Fotos» pide el permiso real del carrete. */
export function useAppConnection() {
  const apps = useApp((s) => s.apps);
  const setApp = useApp((s) => s.setApp);
  const [connecting, setConnecting] = useState<Partial<Record<AppId, boolean>>>({});

  const connect = async (app: AppId) => {
    setConnecting((c) => ({ ...c, [app]: true }));
    if (app === 'photos') {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!res.granted) {
        setConnecting((c) => ({ ...c, [app]: false }));
        notifyError();
        confirm({
          title: 'Sin acceso a tus fotos',
          message: 'Puedes darle permiso a PLOT desde Ajustes de iOS para elegir fotos de tu carrete.',
          confirmText: 'Abrir Ajustes',
          cancelText: 'Ahora no',
          onConfirm: () => {
            Linking.openSettings().catch(() => undefined);
          },
        });
        return;
      }
    }
    setTimeout(() => {
      setApp(app, true);
      setConnecting((c) => ({ ...c, [app]: false }));
      notifySuccess();
      toast(`${appInfo[app].name} conectado`, { tone: 'success' });
    }, 1000);
  };

  const toggle = (app: AppId) => {
    if (connecting[app]) return;
    if (apps[app]) {
      confirm({
        title: `¿Desconectar ${appInfo[app].name}?`,
        message: 'Dejaremos de mostrar en tu perfil lo que compartes desde esta app.',
        confirmText: 'Desconectar',
        destructive: true,
        onConfirm: () => {
          setApp(app, false);
          toast(`${appInfo[app].name} desconectado`, { undo: () => setApp(app, true) });
        },
      });
    } else {
      void connect(app);
    }
  };

  return { apps, connecting, toggle };
}
