import type { AppId, Conversation, Me, Person, Post } from '@/types';

export const ME_ID = 'me';

export const seedMe: Me = {
  name: 'Marc',
  age: 31,
  hood: 'Gràcia',
  bio: 'Corro antes de trabajar, cocino los domingos y siempre tengo un disco nuevo que recomendar.',
  interests: ['Indie', 'Vinilos', 'Running', 'Cocinar', 'Montaña'],
  color: 'music',
};

export const people: Person[] = [
  {
    id: 'laia',
    name: 'Laia',
    age: 29,
    hood: 'Poblenou',
    km: 2.4,
    verified: true,
    bio: 'Fisio de día, trail runner los findes. Si hay una cima cerca, quiero subirla. Después, vermut.',
    interests: ['Montaña', 'Running', 'Indie', 'Vermut', 'Playa', 'Fotografía', 'Pirineo'],
    apps: ['strava', 'spotify', 'maps'],
    color: 'sport',
    reason: 'Los dos subís a la montaña los findes y salís a correr antes de que abra la ciudad.',
    icebreakers: [
      '¿Cuál es la mejor cima que has subido este año?',
      '¿Corres sola o con grupo?',
      'Recomiéndame una ruta para este finde',
      '¿Vermut después de correr o antes?',
    ],
    replies: [
      '¡Me encanta! Justo estaba pensando en eso.',
      'Jaja, totalmente. ¿Y tú qué tal la semana?',
      'Pues este sábado subo a Montserrat, si te animas avisa.',
      'Uf, me lo apunto. Tengo una lista infinita de rutas pendientes.',
      '¿Te va un café el jueves por Poblenou?',
    ],
  },
  {
    id: 'nerea',
    name: 'Nerea',
    age: 27,
    hood: 'Sant Antoni',
    km: 1.8,
    verified: true,
    bio: 'Ilustradora. Colecciono mercados, libros de segunda mano y discos que nadie conoce.',
    interests: ['Vinilos', 'Mercados', 'Libros', 'Diseño', 'Café de especialidad', 'Jazz'],
    apps: ['spotify', 'maps'],
    color: 'culture',
    reason: 'Os gustan los vinilos y perderos por los mercados el sábado por la mañana.',
    icebreakers: [
      '¿Cuál es el último disco que has comprado?',
      '¿Qué mercado me recomiendas?',
      'Enséñame algo que hayas dibujado esta semana',
    ],
    replies: [
      '¡Hola! Qué bien que me escribas por eso.',
      'Ese disco lo tengo, la cara B es mejor.',
      'El de Sant Antoni los domingos es otro mundo.',
      'Te paso una lista, dame un minuto.',
    ],
  },
  {
    id: 'alex',
    name: 'Álex',
    age: 30,
    hood: 'Sants',
    km: 3.1,
    verified: false,
    bio: 'Pincho vinilos en un bar de Sants los jueves. Corro para compensar las cenas.',
    interests: ['Vinilos', 'Indie', 'Running', 'Conciertos', 'Cine', 'Ramen'],
    apps: ['spotify', 'strava'],
    color: 'music',
    reason: 'Escucháis el mismo indie y los dos salís a correr entre semana.',
    icebreakers: [
      '¿Qué vas a pinchar este jueves?',
      '¿Concierto pendiente este mes?',
      'Dime tu ramen favorito de Barcelona',
      '¿Cuál es tu disco de cabecera?',
    ],
    replies: [
      'Jajaja buenísimo.',
      'Este jueves cierro con Delta Norte, vente.',
      'Brutal ese disco, lo tengo en bucle.',
      'Pues yo corro por Montjuïc casi siempre.',
      '¿Te paso la lista de la sesión?',
    ],
  },
  {
    id: 'clara',
    name: 'Clara',
    age: 28,
    hood: 'Eixample',
    km: 1.2,
    verified: true,
    bio: 'Arquitecta. Me pierdo en museos y vuelvo con hambre. Cocino ramen casero los viernes.',
    interests: ['Cocinar', 'Museos', 'Diseño', 'Ramen', 'Cine', 'Escapadas'],
    apps: ['maps'],
    color: 'food',
    reason: 'A los dos os gusta cocinar y tenéis buen ojo para los sitios con encanto.',
    icebreakers: [
      '¿Qué museo me recomiendas?',
      '¿Cuál es tu receta estrella?',
      'Escapada de un día: ¿dónde irías?',
    ],
    replies: [
      '¡Qué bien! Me alegra que te escribas.',
      'El caldo lleva 12 horas, no hay atajos.',
      'Me encantaría probar tu risotto, jaja.',
      'Este finde hay una expo nueva en el CCCB.',
    ],
  },
  {
    id: 'jordi',
    name: 'Jordi',
    age: 32,
    hood: 'Horta',
    km: 4.6,
    verified: true,
    bio: 'Profe de mates. Bici al trabajo, montaña los domingos y paella para doce en verano.',
    interests: ['Montaña', 'Ciclismo', 'Cocinar', 'Running', 'Pirineo', 'Podcasts'],
    apps: ['strava', 'maps'],
    color: 'places',
    reason: 'Compartís montaña, cocina y la manía de madrugar para entrenar.',
    icebreakers: [
      '¿Tu ruta de bici favorita?',
      '¿Qué podcast escuchas entrenando?',
      'Secreto para una buena paella',
    ],
    replies: [
      'Buenas, ¿qué tal?',
      'El Pedraforca por la tartera es una pasada.',
      'Te paso el track de la ruta.',
      'El socarrat no se negocia.',
    ],
  },
  {
    id: 'paula',
    name: 'Paula',
    age: 26,
    hood: 'Gràcia',
    km: 0.6,
    verified: true,
    bio: 'Barista y fan del indie de bandas pequeñas. Siempre con cámara analógica encima.',
    interests: ['Indie', 'Café de especialidad', 'Fotografía', 'Cocinar', 'Conciertos', 'Vinilos'],
    apps: ['spotify', 'photos'],
    color: 'music',
    reason: 'Vivís en Gràcia, os gusta el indie y los dos cocináis más de lo que admitís.',
    icebreakers: [
      '¿Qué café me recomiendas en Gràcia?',
      '¿Qué carrete llevas ahora en la cámara?',
      'Concierto pequeño favorito del año',
    ],
    replies: [
      '¡Hola, vecino!',
      'Ese grupo lo vi en la Sala Upload, increíble.',
      'Pásate por la cafetería, te invito a un filtro.',
      'Jaja, sí, revelo yo misma.',
    ],
  },
  {
    id: 'sergi',
    name: 'Sergi',
    age: 30,
    hood: 'Raval',
    km: 2.0,
    verified: false,
    bio: 'Cocinero en un bar de tapas. En mis días libres, surf en la Barceloneta o lo que haya.',
    interests: ['Cocinar', 'Surf', 'Vermut', 'Rap', 'Playa'],
    apps: ['maps'],
    color: 'food',
    reason: 'Los dos cocináis por placer y no perdonáis un buen vermut.',
    icebreakers: [
      '¿Qué plato te sale mejor?',
      '¿Hay olas este finde?',
      'Tu bar de vermut favorito',
    ],
    replies: [
      '¡Ey! ¿Cómo va?',
      'Eso con un poco de ajo negro queda brutal.',
      'Si hay olas, mañana estoy en el agua a las 8.',
      'Te paso el sitio, no falla.',
    ],
  },
  {
    id: 'irene',
    name: 'Irene',
    age: 25,
    hood: 'Sant Andreu',
    km: 5.3,
    verified: true,
    bio: 'Estudio cine. Escalo los martes, voy al teatro los jueves y leo en el tren.',
    interests: ['Cine', 'Escalada', 'Teatro', 'Libros', 'Indie', 'Montaña'],
    apps: ['spotify'],
    color: 'culture',
    reason: 'Os mueve la montaña y el indie, y ella siempre tiene una peli que recomendar.',
    icebreakers: [
      '¿Qué peli me recomiendas para este finde?',
      '¿Dónde escalas en Barcelona?',
      'Último libro que te ha volado la cabeza',
      '¿Teatro o cine?',
    ],
    replies: [
      '¡Hola! Qué ilusión que me escribas.',
      'Tienes que ver «La ciudad de los ríos», en serio.',
      'Escalo en el rocódromo de Sant Andreu.',
      'Te la apunto, ¿la has visto en cine?',
      'Jajaja me has pillado.',
    ],
  },
  {
    id: 'dani',
    name: 'Dani',
    age: 33,
    hood: 'Badalona',
    km: 9.8,
    verified: false,
    bio: 'Sin descripción.',
    interests: ['Pádel'],
    apps: [],
    color: 'sport',
    reason: '',
    icebreakers: [],
    replies: ['…'],
    hiddenFromDiscover: true,
  },
];

const minutes = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const hours = (h: number) => minutes(h * 60);
const days = (d: number) => hours(d * 24);

function buildPosts(): Post[] {
  return [
    // Marc
    { id: 'm1', authorId: ME_ID, type: 'song', songId: 's5', text: 'Para los domingos sin prisa.', createdAt: hours(5), category: 'music', tag: 'Indie', visibility: 'everyone' },
    { id: 'm2', authorId: ME_ID, type: 'activity', activityId: 'a1', text: 'Collserola antes del trabajo.', createdAt: days(1), category: 'sport', tag: 'Running', visibility: 'everyone' },
    { id: 'm3', authorId: ME_ID, type: 'photo', photoLabel: 'Foto · Pedraforca', text: 'Arriba del todo. Valió la pena el madrugón.', createdAt: days(3), category: 'places', tag: 'Montaña', visibility: 'everyone' },
    { id: 'm4', authorId: ME_ID, type: 'status', text: 'Domingo de risotto de setas y vinilo nuevo. ¿Alguien tiene un buen proveedor de setas en Gràcia?', createdAt: days(4), category: 'food', tag: 'Cocinar', visibility: 'everyone' },
    { id: 'm5', authorId: ME_ID, type: 'place', placeId: 'p10', text: 'Mi mercado de cabecera.', createdAt: days(6), category: 'places', visibility: 'everyone' },
    { id: 'm6', authorId: ME_ID, type: 'photo', photoLabel: 'Foto · Estantería de vinilos', text: 'La colección crece más rápido que la estantería.', createdAt: days(9), category: 'music', tag: 'Vinilos', visibility: 'everyone' },
    // Laia
    { id: 'l1', authorId: 'laia', type: 'activity', activityId: 'a3', text: 'Tirada larga con vistas a toda Barcelona.', createdAt: hours(3), category: 'sport', tag: 'Running', visibility: 'everyone' },
    { id: 'l2', authorId: 'laia', type: 'photo', photoLabel: 'Foto · Montserrat', text: 'Niebla abajo, sol arriba.', createdAt: days(2), category: 'places', tag: 'Montaña', visibility: 'everyone' },
    { id: 'l3', authorId: 'laia', type: 'song', songId: 's1', text: 'Mi canción para correr de este mes.', createdAt: days(4), category: 'music', tag: 'Indie', visibility: 'everyone' },
    { id: 'l4', authorId: 'laia', type: 'place', placeId: 'p8', text: 'Baño de octubre. Sí, estaba fría.', createdAt: days(8), category: 'places', tag: 'Playa', visibility: 'everyone' },
    // Nerea
    { id: 'n1', authorId: 'nerea', type: 'photo', photoLabel: 'Foto · Puesto de discos', text: 'Hallazgo del domingo: un jazz japonés del 78.', createdAt: hours(8), category: 'music', tag: 'Vinilos', visibility: 'everyone' },
    { id: 'n2', authorId: 'nerea', type: 'place', placeId: 'p3', text: 'Domingo = libros de segunda mano.', createdAt: days(3), category: 'places', tag: 'Mercados', visibility: 'everyone' },
    { id: 'n3', authorId: 'nerea', type: 'status', text: 'Busco cafetería tranquila para dibujar por las mañanas. Acepto recomendaciones.', createdAt: days(6), category: 'culture', tag: 'Diseño', visibility: 'everyone' },
    // Álex
    { id: 'x1', authorId: 'alex', type: 'song', songId: 's15', text: 'Así cerré la sesión del jueves.', createdAt: hours(12), category: 'music', tag: 'Indie', visibility: 'everyone' },
    { id: 'x2', authorId: 'alex', type: 'activity', activityId: 'a2', text: 'Series con lluvia. Épico o tonto, no lo sé.', createdAt: days(2), category: 'sport', tag: 'Running', visibility: 'everyone' },
    { id: 'x3', authorId: 'alex', type: 'status', text: 'Top 3 ramen de Barcelona. Debate abierto.', createdAt: days(5), category: 'food', tag: 'Ramen', visibility: 'everyone' },
    { id: 'x4', authorId: 'alex', type: 'photo', photoLabel: 'Foto · Cabina de DJ', text: 'Jueves en el bar.', createdAt: days(10), category: 'music', tag: 'Conciertos', visibility: 'everyone' },
    // Clara
    { id: 'c1', authorId: 'clara', type: 'photo', photoLabel: 'Foto · Ramen casero', text: 'Doce horas de caldo.', createdAt: days(1), category: 'food', tag: 'Cocinar', visibility: 'everyone' },
    { id: 'c2', authorId: 'clara', type: 'place', placeId: 'p9', text: 'Escapada de un día. Repetiría mañana.', createdAt: days(4), category: 'places', tag: 'Escapadas', visibility: 'everyone' },
    { id: 'c3', authorId: 'clara', type: 'status', text: 'La nueva expo del CCCB es de las mejores del año.', createdAt: days(7), category: 'culture', tag: 'Museos', visibility: 'everyone' },
    // Jordi
    { id: 'j1', authorId: 'jordi', type: 'activity', activityId: 'a4', text: 'Subida al Tibidabo antes de clase.', createdAt: hours(20), category: 'sport', tag: 'Ciclismo', visibility: 'everyone' },
    { id: 'j2', authorId: 'jordi', type: 'activity', activityId: 'a5', text: 'Por fin el Pedraforca.', createdAt: days(5), category: 'sport', tag: 'Montaña', visibility: 'everyone' },
    { id: 'j3', authorId: 'jordi', type: 'photo', photoLabel: 'Foto · Paella para doce', text: 'Socarrat perfecto.', createdAt: days(9), category: 'food', tag: 'Cocinar', visibility: 'everyone' },
    // Paula
    { id: 'pa1', authorId: 'paula', type: 'song', songId: 's7', text: 'La banda de mi barrio. Id a verlos.', createdAt: hours(6), category: 'music', tag: 'Indie', visibility: 'everyone' },
    { id: 'pa2', authorId: 'paula', type: 'photo', photoLabel: 'Foto · Carrete revelado', text: 'Primer carrete del otoño.', createdAt: days(2), category: 'culture', tag: 'Fotografía', visibility: 'everyone' },
    { id: 'pa3', authorId: 'paula', type: 'status', text: 'Hoy en la cafetería: filtro de Etiopía. Pasad.', createdAt: days(5), category: 'food', tag: 'Café de especialidad', visibility: 'everyone' },
    // Sergi
    { id: 'se1', authorId: 'sergi', type: 'photo', photoLabel: 'Foto · Olas en la Barceloneta', text: 'Poco tamaño pero muy limpias.', createdAt: days(1), category: 'sport', tag: 'Surf', visibility: 'everyone' },
    { id: 'se2', authorId: 'sergi', type: 'status', text: 'Croquetas de jamón y ajo negro. Nueva carta el viernes.', createdAt: days(3), category: 'food', tag: 'Cocinar', visibility: 'everyone' },
    { id: 'se3', authorId: 'sergi', type: 'song', songId: 's12', text: 'Lo que suena en la cocina.', createdAt: days(6), category: 'music', tag: 'Rap', visibility: 'everyone' },
    // Irene
    { id: 'i1', authorId: 'irene', type: 'status', text: '«La ciudad de los ríos» en la Filmoteca. Salí sin palabras.', createdAt: hours(10), category: 'culture', tag: 'Cine', visibility: 'everyone' },
    { id: 'i2', authorId: 'irene', type: 'photo', photoLabel: 'Foto · Vía de escalada', text: 'Martes de rocódromo.', createdAt: days(2), category: 'sport', tag: 'Escalada', visibility: 'everyone' },
    { id: 'i3', authorId: 'irene', type: 'song', songId: 's11', text: 'Para leer en el tren.', createdAt: days(4), category: 'music', tag: 'Indie', visibility: 'everyone' },
    { id: 'i4', authorId: 'irene', type: 'place', placeId: 'p2', text: 'Próximo objetivo.', createdAt: days(11), category: 'places', tag: 'Montaña', visibility: 'everyone' },
    // Más publicaciones para que cada perfil tenga varias categorías
    { id: 'l5', authorId: 'laia', type: 'place', placeId: 'p13', text: 'Vermut de domingo después de correr. Ritual sagrado.', createdAt: days(5), category: 'food', tag: 'Vermut', visibility: 'everyone' },
    { id: 'l6', authorId: 'laia', type: 'photo', photoLabel: 'Foto · Exposición de fotografía', text: 'Expo de fotografía de montaña. Salí con ganas de cumbre.', createdAt: days(9), category: 'culture', tag: 'Fotografía', visibility: 'everyone' },
    { id: 'n4', authorId: 'nerea', type: 'place', placeId: 'p12', text: 'El mejor ramen del barrio. No acepto discusión.', createdAt: days(2), category: 'food', visibility: 'everyone' },
    { id: 'x5', authorId: 'alex', type: 'photo', photoLabel: 'Foto · Atardecer en el Carmel', text: 'Mi sitio para desconectar antes de pinchar.', createdAt: days(3), category: 'places', tag: 'Miradores', visibility: 'everyone' },
    { id: 'x6', authorId: 'alex', type: 'status', text: 'Peli del finde: cualquiera que tenga buena banda sonora. Acepto propuestas.', createdAt: days(7), category: 'culture', tag: 'Cine', visibility: 'everyone' },
    { id: 'c4', authorId: 'clara', type: 'song', songId: 's3', text: 'Lo que suena mientras dibujo planos.', createdAt: days(2), category: 'music', visibility: 'everyone' },
    { id: 'c5', authorId: 'clara', type: 'place', placeId: 'p14', text: 'Cena de viernes. Pedid las croquetas.', createdAt: days(6), category: 'food', tag: 'Cocinar', visibility: 'everyone' },
    { id: 'j4', authorId: 'jordi', type: 'place', placeId: 'p2', text: 'Mirad qué cara norte. Volveré.', createdAt: days(3), category: 'places', tag: 'Pirineo', visibility: 'everyone' },
    { id: 'j5', authorId: 'jordi', type: 'song', songId: 's10', text: 'Para las subidas largas.', createdAt: days(8), category: 'music', visibility: 'everyone' },
    { id: 'pa4', authorId: 'paula', type: 'photo', photoLabel: 'Foto · Calles de Gràcia', text: 'Mi barrio a las ocho de la mañana.', createdAt: days(4), category: 'places', visibility: 'everyone' },
    { id: 'se4', authorId: 'sergi', type: 'place', placeId: 'p11', text: 'Donde ceno cuando no cocino yo.', createdAt: days(2), category: 'food', tag: 'Vermut', visibility: 'everyone' },
    { id: 'se5', authorId: 'sergi', type: 'place', placeId: 'p8', text: 'Aquí me encontraréis si hay olas.', createdAt: days(8), category: 'places', tag: 'Playa', visibility: 'everyone' },
    { id: 'i5', authorId: 'irene', type: 'photo', photoLabel: 'Foto · Brunch de domingo', text: 'Brunch antes de la Filmoteca.', createdAt: days(6), category: 'food', visibility: 'everyone' },
  ];
}

function buildConversations(): Record<string, Conversation> {
  return {
    laia: {
      personId: 'laia',
      status: 'chat',
      unread: 2,
      muted: false,
      startedFromPostId: 'm3',
      seen: true,
      messages: [
        { id: 'laia-1', from: 'laia', createdAt: days(1), text: '¡Hola Marc! Vi tu foto del Pedraforca. ¿Subiste por la tartera?', quotedPostId: 'm3' },
        { id: 'laia-2', from: 'me', createdAt: hours(22), text: '¡Hola Laia! Sí, por la tartera. Las piernas aún se acuerdan.' },
        { id: 'laia-3', from: 'laia', createdAt: minutes(42), text: 'Jaja, normal. Yo este finde voy a Montserrat.' },
        { id: 'laia-4', from: 'laia', createdAt: minutes(40), text: '¿Te apuntas a correr por la Carretera de les Aigües algún día?' },
      ],
    },
    alex: {
      personId: 'alex',
      status: 'chat',
      unread: 1,
      muted: false,
      seen: true,
      messages: [
        { id: 'alex-1', from: 'me', createdAt: days(2), text: 'Te paso esto, creo que te va a gustar.', attachment: { type: 'song', refId: 's5' } },
        { id: 'alex-2', from: 'alex', createdAt: hours(2), text: 'Brutal ese disco. Lo pincho el jueves seguro.' },
      ],
    },
    clara: {
      personId: 'clara',
      status: 'chat',
      unread: 0,
      muted: false,
      seen: true,
      messages: [
        { id: 'clara-1', from: 'clara', createdAt: days(3), text: '¿Ese risotto de setas lleva caldo casero?', quotedPostId: 'm4' },
        { id: 'clara-2', from: 'me', createdAt: days(3), text: 'Siempre. Y un chorrito de vino blanco al final.' },
        { id: 'clara-3', from: 'clara', createdAt: days(2), text: 'Vale, me has convencido.' },
        { id: 'clara-4', from: 'me', createdAt: days(2), text: 'Te paso la receta cuando quieras.' },
      ],
      startedFromPostId: 'm4',
    },
    jordi: {
      personId: 'jordi',
      status: 'chat',
      unread: 0,
      muted: false,
      seen: true,
      messages: [
        { id: 'jordi-1', from: 'me', createdAt: days(5), text: '¡Qué buena la del Pedraforca! Yo subí hace poco.' },
        { id: 'jordi-2', from: 'jordi', createdAt: days(5), text: 'Te paso el track de la ruta.' },
        { id: 'jordi-3', from: 'jordi', createdAt: days(5), attachment: { type: 'activity', refId: 'a5' } },
      ],
    },
    paula: {
      personId: 'paula',
      status: 'request',
      unread: 1,
      muted: false,
      startedFromPostId: 'm1',
      messages: [
        { id: 'paula-1', from: 'paula', createdAt: hours(1), text: 'Bruma en directo es otra cosa. ¿Fuiste al concierto de la Upload?', quotedPostId: 'm1' },
      ],
    },
    sergi: {
      personId: 'sergi',
      status: 'request',
      unread: 1,
      muted: false,
      startedFromPostId: 'm4',
      messages: [
        { id: 'sergi-1', from: 'sergi', createdAt: hours(4), text: 'Para setas buenas, el puesto del fondo del Mercat de la Llibertat. Dile que vas de mi parte.', quotedPostId: 'm4' },
      ],
    },
    dani: {
      personId: 'dani',
      status: 'request',
      unread: 1,
      muted: false,
      filtered: true,
      startedFromPostId: 'm6',
      messages: [
        { id: 'dani-1', from: 'dani', createdAt: hours(7), text: 'Vaya colección más ridícula, seguro que eres un idiota insoportable.', quotedPostId: 'm6' },
      ],
    },
  };
}

export const allApps: AppId[] = ['spotify', 'strava', 'maps', 'photos'];

export function createSeed() {
  return {
    me: { ...seedMe, interests: [...seedMe.interests] },
    posts: buildPosts(),
    conversations: buildConversations(),
  };
}
