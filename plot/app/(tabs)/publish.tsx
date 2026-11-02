import { Redirect } from 'expo-router';

/** La pestaña «Publicar» abre el modal desde la barra; esta ruta nunca se muestra. */
export default function PublishTab() {
  return <Redirect href="/compose" />;
}
