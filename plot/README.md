# PLOT

App de citas con formato de red social. **Anti-swipe:** aquí no se desliza a nadie. Cada persona publica lo que le gusta (fotos, estados, canciones, rutas y sitios), la app te enseña gente afín y puedes escribir a quien quieras sin necesidad de match.

Esto es una **demo para enseñar en un iPhone**. No hay servidor: todos los datos son inventados y se guardan en el propio teléfono.

- Contraseña para entrar: **`123`**
- Expo SDK 58 · React Native 0.88 · TypeScript estricto · Expo Router · Zustand

---

## 1. Instalación

Necesitas Node.js 20 o superior.

```bash
cd plot
npm install
```

## 2. Abrir la app en el iPhone con Expo Go

1. Instala **Expo Go** desde la App Store en el iPhone.
2. Conecta el ordenador y el iPhone **a la misma red wifi**.
3. En el ordenador, dentro de la carpeta `plot`:

   ```bash
   npx expo start
   ```

4. Abre la **Cámara** del iPhone y apunta al código QR que aparece en la terminal. Toca el aviso y se abrirá en Expo Go.

Si la wifi no deja que los dispositivos se vean (pasa en oficinas y hoteles), arranca con túnel:

```bash
npx expo start --tunnel
```

> Consejo para la presentación: antes de empezar, abre la app una vez, ve a **Perfil › Ajustes › Reiniciar demo** y deja el iPhone en la pantalla de bienvenida.

### Build para TestFlight (opcional)

`eas.json` ya está configurado. Con una cuenta de Apple Developer:

```bash
npx eas-cli@latest build --platform ios --profile production
```

```bash
npx eas-cli@latest submit --platform ios
```

El `bundleIdentifier` es `com.plot.demo`; cámbialo en `app.json` por uno de tu equipo antes de compilar.

## 3. Acceso

- **Ya tengo cuenta** → contraseña **`123`** → entras directo a Descubrir (la cuenta de Marc ya existe en la demo).
- Una contraseña distinta hace temblar el campo, vibra y muestra «Contraseña incorrecta».
- **Crear cuenta** recorre el onboarding de 3 pasos (intereses, apps y perfil listo).

## 4. Reiniciar la demo

**Perfil › rueda de Ajustes › Reiniciar demo › Reiniciar.**

Vuelve todo al estado inicial: publicaciones, chats, solicitudes, bloqueos, ajustes, filtros y apps conectadas. Te deja en la pantalla de bienvenida. Úsalo entre presentación y presentación.

## 5. Guion de presentación (5 minutos)

| Min | Pantalla | Qué hacer | Qué contar |
|---|---|---|---|
| 0:00 | **Bienvenida** | Enseña el collage de intereses y el titular. | «Anti-swipe: aquí no deslizas a nadie. Ves lo que le gusta a la gente y le escribes». |
| 0:20 | **Login** | Toca **Ya tengo cuenta**. Escribe `000` y pulsa **Ir**: tiembla y vibra. Escribe `123` y entra. | Acceso con una sola contraseña, sin SMS. |
| 0:45 | **Descubrir** | Cambia entre **Para ti** y **Música**. Abre **Filtros** (icono arriba a la derecha), activa **Solo perfiles verificados**, baja la distancia y pulsa **Aplicar**. Tira hacia abajo para refrescar. | La lista se recalcula de verdad. Cada tarjeta explica **por qué** te la recomendamos y qué tenéis en común. Sin porcentajes ni likes. |
| 1:30 | **Perfil de Laia** | Toca la tarjeta de Laia. Enseña «En común contigo» y «También le gusta…». Cambia el control a **Rutas**. | El perfil es lo que publica, no una foto para juzgar. |
| 2:00 | **Escribirle desde una publicación** | En una publicación toca **Responder a esto**. Se abre el chat con la publicación citada. Escribe algo y envía. | Puedes empezar hablando de algo concreto que ha publicado. |
| 2:20 | **Respuesta automática** | Espera dos segundos: aparece «escribiendo…», luego su respuesta, y «Leído» bajo tu mensaje. Toca **+** y manda una canción. | Mensajes con tarjetas de Spotify, Strava, Maps o fotos. |
| 2:50 | **Solicitudes** | Vuelve y entra en **Chats › Solicitudes**. Enseña la de Paula (a qué publicación respondió). Toca **Ver** en «1 mensaje oculto por el filtro» y luego toca el mensaje difuminado. | Quien te escribe por primera vez no sabe que lo has leído hasta que respondes. Hay filtro de lenguaje ofensivo. |
| 3:30 | **Publicar una canción** | Toca **Publicar** (centro de la barra) › **Canción**, busca «nora», elige una, etiqueta **Indie** y pulsa **Publicar**. | Publicar es tan rápido como compartir una canción. |
| 4:00 | **Mi perfil** | La canción aparece la primera. Toca **Ver como otros**. | «Sin likes ni seguidores. Solo lo que te gusta». |
| 4:20 | **Ajustes y bloqueo** | Abre la rueda › **Quién puede escribirme**. Vuelve a un chat, toca **…** › **Bloquear** y confirma. Enséñalo en **Ajustes › Usuarios bloqueados**. | Silenciar, bloquear y reportar están siempre a dos toques. |

## 6. Qué está simulado

| Función | Cómo se simula |
|---|---|
| Cuentas y servidor | No hay backend. Todo se guarda en el iPhone con AsyncStorage. |
| Spotify, Strava y Google Maps | Conectar muestra un spinner de 1 s. Los catálogos (15 canciones, 8 actividades, 10 lugares) son inventados. |
| Fotos | **Reales**: «Fotos» pide el permiso del carrete y las publicaciones de foto usan tus fotos. |
| Respuestas en el chat | Cada persona tiene un banco de respuestas y contesta a los 1,5–2,5 s. |
| Filtro de mensajes ofensivos | La solicitud oculta viene marcada en los datos de ejemplo. |
| Reportar | Muestra la confirmación de envío; no se manda a ningún sitio. |
| Contactar con soporte | Abre el correo con `mailto:soporte@plot.app`. |
| Fotos de los perfiles | Bloques de color con una etiqueta, por ejemplo «[Foto · Pedraforca]». |

## 7. Estructura

```
plot/
├── app/                 Rutas (Expo Router)
│   ├── (tabs)/          Descubrir · Publicar · Chats · Perfil
│   ├── onboarding/      Intereses · Apps · Perfil listo
│   ├── chat/[id].tsx    Conversación y primer mensaje
│   ├── person/[id].tsx  Perfil de otra persona (y «Ver como otros»)
│   ├── compose.tsx      Crear publicación (modal)
│   ├── filters.tsx      Filtros (hoja)
│   ├── report/[id].tsx  Reportar (hoja)
│   └── settings/        Ajustes · Bloqueados · Centro de seguridad
└── src/
    ├── components/      Button, Chip, Avatar, PostCard, Input, Segmented, BottomSheet, Toast, TabBar…
    ├── theme/           Colores, tipografía, espaciado y radios
    ├── store/           Estado con Zustand + persistencia
    ├── data/            seed.ts y catálogos
    └── utils/           Háptica, fechas, confirmaciones…
```

## 8. Comprobaciones

```bash
npx tsc --noEmit
```

```bash
npx expo lint
```

Las dos pasan sin errores ni avisos. El mapa de qué hace cada elemento tocable está en [`INTERACCIONES.md`](INTERACCIONES.md).
