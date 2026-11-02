# Interacciones de PLOT

Cada elemento tocable de la app y lo que hace. Los chips y avatares que solo muestran información no son tocables (no parecen botones y no reaccionan al toque).

Convenciones: **Toast** = aviso negro arriba de la pantalla; si lleva «Deshacer», el cambio se puede revertir durante 4,5 s. **Confirmación** = alerta nativa de iOS con Cancelar.

## 1. Bienvenida (`app/welcome.tsx`)

| Elemento | Resultado |
|---|---|
| Crear cuenta | Abre el onboarding (paso 1). |
| Ya tengo cuenta | Abre Iniciar sesión. |
| Enlace «Condiciones» | Abre la hoja legal en la pestaña Condiciones. |
| Enlace «Política de privacidad» | Abre la hoja legal en la pestaña Privacidad. |

## 1b. Hoja legal (`app/legal.tsx`)

| Elemento | Resultado |
|---|---|
| Segmentado Condiciones / Privacidad | Cambia el texto mostrado. |
| Grabber / deslizar hacia abajo | Cierra la hoja. |

## 2. Iniciar sesión (`app/login.tsx`)

| Elemento | Resultado |
|---|---|
| Volver (‹) | Vuelve a Bienvenida. |
| Campo Contraseña | Entrada segura. Al escribir se borra el error. |
| Ojo / ojo tachado | Muestra u oculta la contraseña. |
| Tecla «Ir» del teclado | Igual que Entrar. |
| Entrar (desactivado si el campo está vacío) | `123`: háptica de éxito y entra a Descubrir (u onboarding si nunca se completó). Otra: el campo tiembla, háptica de error y «Contraseña incorrecta». |

## 3. Onboarding · Intereses (`app/onboarding/index.tsx`)

| Elemento | Resultado |
|---|---|
| Atrás (‹) | Vuelve a Bienvenida. |
| Cada chip de interés (40) | Se activa o desactiva (sólido con ✓ / suave). Actualiza «X de 5 elegidos · te faltan Y». |
| Continuar (activo con 5 o más) | Guarda los intereses y pasa a Conectar apps. |

## 4. Onboarding · Conectar apps (`app/onboarding/apps.tsx`)

| Elemento | Resultado |
|---|---|
| Atrás (‹) | Vuelve a Intereses. |
| Conectar (Spotify, Strava, Google Maps) | Spinner 1 s → «Conectado ✓», háptica y toast. |
| Conectar (Fotos) | Pide el permiso real del carrete. Si se deniega: alerta con «Abrir Ajustes». Si se concede: spinner 1 s → «Conectado ✓». |
| Conectado ✓ | Confirmación «¿Desconectar…?» → desconecta, toast con Deshacer. |
| Continuar | Paso 3. |
| Ahora no | Paso 3. |

## 5. Onboarding · Perfil listo (`app/onboarding/ready.tsx`)

| Elemento | Resultado |
|---|---|
| Atrás (‹) | Vuelve a Conectar apps. |
| Empezar a descubrir | Termina el onboarding, inicia sesión y abre Descubrir. |
| Hacer mi primera publicación | Termina el onboarding, abre Descubrir y encima el modal Crear publicación. |

El mensaje «Ya hay X personas cerca con 3 intereses en común» se calcula con los intereses elegidos.

## 6. Barra de pestañas (`src/components/TabBar.tsx`)

| Elemento | Resultado |
|---|---|
| Descubrir / Chats / Perfil | Cambia de pestaña (háptica ligera). |
| Publicar (botón violeta) | Abre el modal Crear publicación (no cambia de pestaña). |
| Badge en Chats | Suma de no leídos (sin silenciados) + solicitudes visibles. Se actualiza en vivo. |

## 7. Descubrir (`app/(tabs)/discover.tsx`)

| Elemento | Resultado |
|---|---|
| Filtros (icono deslizadores; violeta si hay filtros) | Abre la hoja de Filtros. |
| Para ti / Música / Deporte / Comida / Lugares / Cultura | Filtra la lista por categoría y reordena por intereses en común de esa categoría. |
| Quitar filtros (solo con filtros activos) | Restablece filtros, toast. |
| Tirar hacia abajo | Spinner y reordena las recomendaciones, toast «Recomendaciones actualizadas». |
| Tarjeta de persona | Abre su perfil. |
| Ver perfil | Abre su perfil. |
| Escribir | Abre el chat (primer mensaje si no hay conversación). |
| Restablecer filtros (estado vacío) | Restablece filtros y vuelve a «Para ti». |

Las personas bloqueadas no aparecen.

## 8. Filtros (`app/filters.tsx`, hoja)

| Elemento | Resultado |
|---|---|
| Slider Distancia máxima (1–25 km) | Cambia el valor (háptica por paso). |
| − / + Desde | Edad mínima (18 hasta la máxima). Se desactiva en el límite. |
| − / + Hasta | Edad máxima (mínima hasta 60). Se desactiva en el límite. |
| Interruptor Solo perfiles verificados | Activa o desactiva. |
| Restablecer | Devuelve el borrador a los valores por defecto. |
| Aplicar | Guarda los filtros, cierra la hoja, toast «Filtros aplicados». |
| Deslizar hacia abajo | Cierra sin aplicar. |

## 9. Perfil de otra persona (`app/person/[id].tsx`)

| Elemento | Resultado |
|---|---|
| Volver (‹) | Vuelve. También funciona el gesto de deslizar desde el borde. |
| … (Más opciones) | Abre el menú de seguridad (sección 20). |
| Segmentado Todo / Música / Rutas / Lugares | Filtra las publicaciones. |
| Responder a esto (en cada publicación) | Abre el chat con esa publicación citada. |
| Escribir a [nombre] (fijo abajo) | Abre el chat. |

### 9b. Ver como otros (`/person/me`)

| Elemento | Resultado |
|---|---|
| Volver (‹) | Vuelve a Mi perfil. |
| Segmentado | Filtra mis publicaciones. |
| Volver a mi perfil | Vuelve a Mi perfil. |

## 10. Mi perfil (`app/(tabs)/profile.tsx`)

| Elemento | Resultado |
|---|---|
| Rueda (Ajustes) | Abre Ajustes. |
| Editar perfil | Abre Editar perfil (modal). |
| Ver como otros | Abre mi perfil con el diseño de la pantalla 9. |
| Cada miniatura de la cuadrícula | Abre el detalle de la publicación (hoja). |
| Crear publicación (si no hay ninguna) | Abre el modal Crear publicación. |

## 11. Detalle de mi publicación (`app/post/[id].tsx`, hoja)

| Elemento | Resultado |
|---|---|
| Cerrar (×) | Cierra la hoja. |
| Editar texto | Pasa a modo edición con contador. |
| Cancelar (en edición) | Descarta y vuelve a la vista. |
| Guardar (activo si hay cambios) | Guarda el texto, háptica, toast «Texto actualizado». |
| Eliminar | Confirmación → borra, cierra y toast con Deshacer (la restaura en su sitio). |

## 12. Editar perfil (`app/edit-profile.tsx`, modal)

| Elemento | Resultado |
|---|---|
| Cancelar | Si hay cambios: confirmación «¿Descartar cambios?». Si no, cierra. |
| Guardar (activo si hay cambios válidos) | Guarda nombre, bio e intereses, cierra y toast. |
| Nombre | Error «Escribe tu nombre» si está vacío. |
| Bio | Contador 160. |
| Chips de intereses | Activan o desactivan (mínimo 3). |
| Deslizar el modal hacia abajo | Igual que Cancelar (pide confirmación si hay cambios). |

## 13. Crear publicación (`app/compose.tsx`, modal)

| Elemento | Resultado |
|---|---|
| Cancelar / deslizar hacia abajo | Si hay cambios: confirmación «¿Descartar publicación?». Si no, cierra. |
| Publicar (activo si el formulario es válido) | Háptica, guarda la publicación la primera, cierra, va a Mi perfil y toast «Publicado». |
| Foto / Estado / Canción / Actividad / Lugar | Cambia el formulario. |
| Foto · Elegir del carrete | Abre el selector real de fotos del iPhone. |
| Foto · Cambiar foto | Vuelve a abrir el selector. |
| Estado · campo | Contador 280 (rojo cuando quedan menos de 20). |
| Canción · buscador | Filtra las 15 canciones por título o artista. |
| Canción / Actividad / Lugar · fila | Selecciona (✓). Tocar de nuevo deselecciona. |
| Lugar · buscador | Filtra los 10 lugares. |
| Visible para (Todo el mundo / Intereses en común) | Cambia la visibilidad y su explicación. |
| Etiquetar interés (chips) | Selecciona un interés (uno a la vez). |

## 14. Chats (`app/(tabs)/chats.tsx`)

| Elemento | Resultado |
|---|---|
| Segmentado Conversaciones / Solicitudes (con número) | Cambia la lista. |
| Buscador | Filtra por nombre y por texto de cualquier mensaje. |
| Fila de conversación | Abre el chat y lo marca como leído (el badge baja). |
| Deslizar fila a la izquierda › Silenciar / Activar | Silencia, icono de campana tachada y toast con Deshacer. |
| Deslizar fila a la izquierda › Eliminar | Quita la conversación y toast con Deshacer. |
| Ir a Descubrir (lista vacía) | Abre Descubrir. |

## 15. Solicitudes (`app/(tabs)/chats.tsx`, segmento Solicitudes)

| Elemento | Resultado |
|---|---|
| Cabecera de la tarjeta (avatar y nombre) | Abre su perfil. |
| Responder | Pasa la solicitud a Conversaciones y abre el chat. |
| Ignorar | La quita, toast con Deshacer. |
| Bloquear a [nombre] | Confirmación → bloquea, toast con Deshacer. |
| Ver / Ocultar (fila «1 mensaje oculto por el filtro») | Muestra u oculta la tarjeta del mensaje filtrado. |
| Mensaje difuminado | Al tocarlo se revela el texto. |
| Bloquear (mensaje filtrado) | Confirmación → bloquea. |
| Ignorar (mensaje filtrado) | Lo quita, toast con Deshacer. |

«Quién puede escribirme» y el filtro ofensivo de Ajustes cambian qué solicitudes se ven aquí.

## 16. Conversación (`app/chat/[id].tsx`)

| Elemento | Resultado |
|---|---|
| Volver (‹) / gesto de borde | Vuelve. |
| Avatar y nombre | Abre su perfil. |
| … (Más opciones) | Menú de seguridad (sección 20). |
| + (Adjuntar) | Abre la hoja Adjuntar (sección 18). |
| Campo de mensaje + tecla Enviar | Envía. |
| Botón ↑ (desactivado si está vacío) | Envía (háptica media). Tras 0,5 s «Leído», «escribiendo…» y respuesta a los 1,5–2,5 s. |
| Barra «Respondiendo a…» × | Quita la publicación citada. |
| Mantener pulsado un mensaje | Hoja de acciones: Copiar (portapapeles + toast) y Eliminar (toast). |

La lista baja sola al último mensaje, al llegar «escribiendo…» y al abrir el teclado.

## 17. Primer mensaje (mismo archivo, conversación vacía)

| Elemento | Resultado |
|---|---|
| Chips para romper el hielo | Rellenan el campo de texto (el elegido se ve en violeta). |
| Publicación (2 últimas) | La cita o la quita («Citar» / «Citada»). |
| Enviar | Crea la conversación en Conversaciones y sigue como la sección 16. |

## 18. Hoja Adjuntar (`src/components/AttachSheet.tsx`)

| Elemento | Resultado |
|---|---|
| Canción / Actividad / Lugar | Abre la lista con buscador. |
| Foto | Cierra la hoja y abre el carrete real; envía la foto elegida. |
| ‹ (Volver a adjuntar) | Vuelve al menú. |
| Buscador | Filtra la lista. |
| Fila de la lista | Envía la tarjeta al chat y cierra. |
| Fondo oscuro / deslizar el grabber | Cierra la hoja. |

## 19. Ajustes (`app/settings/index.tsx`)

| Elemento | Resultado |
|---|---|
| Todo el mundo / Solo verificados / Solo con intereses en común | Marca ✓, guarda, actualiza el pie «Ahora: …», toast y filtra Solicitudes. |
| Filtrar mensajes ofensivos | Activa o desactiva; si se apaga, el mensaje filtrado aparece como solicitud normal. |
| Mostrar mi distancia | Activa o desactiva; se refleja en «Ver como otros». |
| Notificaciones | Activa o desactiva, toast. |
| Spotify / Strava / Google Maps / Fotos | Igual que en el onboarding (conectar con spinner, desconectar con confirmación). |
| Usuarios bloqueados | Abre la lista (muestra el número). |
| Centro de seguridad | Abre los consejos. |
| Reiniciar demo | Confirmación → todo vuelve al estado inicial y abre Bienvenida. |
| Cerrar sesión | Confirmación → abre Bienvenida (los datos se conservan). |
| ‹ (cabecera) / gesto de borde | Vuelve a Mi perfil. |

### 19b. Usuarios bloqueados (`app/settings/blocked.tsx`)

| Elemento | Resultado |
|---|---|
| Desbloquear | La persona vuelve a Descubrir y Chats, toast con Deshacer. |

### 19c. Centro de seguridad (`app/settings/safety.tsx`)

| Elemento | Resultado |
|---|---|
| Contactar con soporte | Abre el correo con `mailto:soporte@plot.app`. Si no hay app de correo, toast de error. |

## 20. Menú de seguridad (`src/components/SafetySheet.tsx`, hoja)

| Elemento | Resultado |
|---|---|
| Silenciar / Activar conversación | Cambia el silencio, toast con Deshacer, icono en la lista de chats. |
| Bloquear a [nombre] | Confirmación → bloquea, la quita de Chats y Descubrir, la añade a Usuarios bloqueados, vuelve a Chats o Descubrir y toast con Deshacer. |
| Reportar | Abre Reportar. |
| Cancelar / fondo / grabber | Cierra la hoja. |

## 21. Reportar (`app/report/[id].tsx`, hoja)

| Elemento | Resultado |
|---|---|
| Spam / Acoso / Perfil falso / Contenido inapropiado / Otro | Selecciona el motivo. |
| Comentario (opcional) | Texto libre, contador 300. |
| Cancelar | Cierra. |
| Enviar (activo con motivo) | Spinner 0,9 s → pantalla «Gracias por avisarnos». |
| Bloquear también a [nombre] | Confirmación → bloquea y abre Descubrir. |
| Listo | Cierra. |
