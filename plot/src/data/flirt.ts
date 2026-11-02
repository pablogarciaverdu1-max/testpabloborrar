import type { CategoryId } from '@/theme';

export type Topic = CategoryId | 'general';

export type FlirtQuestion = {
  id: string;
  topic: Topic;
  question: string;
  /** Respuestas posibles de la otra persona a esta pregunta en concreto. */
  answers: string[];
};

/** Preguntas para romper el hielo con tono de ligue, por categoría. */
export const flirtQuestions: FlirtQuestion[] = [
  // Restaurantes
  {
    id: 'food-1',
    topic: 'food',
    question: '¿A qué restaurante me llevarías a cenar en una primera cita?',
    answers: [
      'A un japonés pequeñito en Gràcia que tiene solo seis mesas. Si te portas bien, te dejo elegir el postre.',
      'A una taberna de la Barceloneta con arroz de los de verdad. ¿Te va el plan o eres más de tapas?',
    ],
  },
  {
    id: 'food-2',
    topic: 'food',
    question: 'Primera cita: ¿compartimos postre o cada uno el suyo?',
    answers: [
      'Compartir, siempre. Aunque te aviso: la última cucharada es mía.',
      'Depende del postre. Si es tarta de queso, pide la tuya, que yo no comparto.',
    ],
  },
  {
    id: 'food-3',
    topic: 'food',
    question: '¿Vermut al mediodía o cena con velas para conocernos?',
    answers: [
      'Vermut, sin duda. Las velas para la segunda cita, si me convences.',
      'Cena con velas suena muy de peli… pero acepto el reto.',
    ],
  },
  {
    id: 'food-4',
    topic: 'food',
    question: 'Si cocinara para ti en la segunda cita, ¿qué plato te conquistaría?',
    answers: [
      'Un buen risotto. Si te sale cremoso, ya tienes medio camino hecho.',
      'Algo con mucho queso. Soy fácil de conquistar, lo admito.',
    ],
  },
  // Deporte
  {
    id: 'sport-1',
    topic: 'sport',
    question: '¿Nos echamos una carrera y quien pierda invita a cenar?',
    answers: [
      'Trato hecho. Ve mirando la carta, que yo no pienso perder.',
      'Acepto, pero elijo yo el recorrido. Con cuestas, para que sufras un poquito.',
    ],
  },
  {
    id: 'sport-2',
    topic: 'sport',
    question: 'Primera cita subiendo a Montserrat: ¿plan perfecto o demasiado intenso?',
    answers: [
      'Plan perfecto si arriba hay bocadillo y vistas. Y si te cansas, te espero… un rato.',
      'Me encanta. Así vemos si eres de los que hablan subiendo o de los que se quedan sin aire.',
    ],
  },
  {
    id: 'sport-3',
    topic: 'sport',
    question: '¿Qué deporte me enseñarías en una primera cita?',
    answers: [
      'Escalada. Te aseguro yo, así que vas a tener que fiarte de mí desde el primer día.',
      'A correr de verdad, sin parar cada cinco minutos. Luego te invito a un café.',
    ],
  },
  // Música
  {
    id: 'music-1',
    topic: 'music',
    question: 'Si nuestra primera cita tuviera banda sonora, ¿qué canción sonaría?',
    answers: [
      '«Luz de agosto», de Las Mareas Lentas. Tranquila al principio y luego te atrapa.',
      'Algo de Nora Valle. Suave, para hablar sin gritar… y para que no se noten mis nervios.',
    ],
  },
  {
    id: 'music-2',
    topic: 'music',
    question: '¿Concierto en primera fila o vinilo en el sofá para conocernos?',
    answers: [
      'Concierto pequeño y después vinilo. ¿Por qué elegir si podemos tener las dos cosas?',
      'Vinilo en el sofá. Así te escucho a ti más que a la música.',
    ],
  },
  {
    id: 'music-3',
    topic: 'music',
    question: '¿Qué canción me pondrías para conquistarme?',
    answers: [
      'Una que no conozcas. Así cada vez que suene te vas a acordar de mí.',
      'Eso no se cuenta por chat. Se pone en directo y se mira la cara que pones.',
    ],
  },
  // Lugares
  {
    id: 'places-1',
    topic: 'places',
    question: '¿A qué mirador me llevarías a ver el atardecer?',
    answers: [
      'A los Bunkers del Carmel, pero un martes, que no hay nadie. Llevo yo las cervezas.',
      'A uno secreto que no sale en Instagram. Si te lo enseño, ya no te libras de mí.',
    ],
  },
  {
    id: 'places-2',
    topic: 'places',
    question: 'Escapada de un día tú y yo: ¿a dónde nos escapamos?',
    answers: [
      'Calella de Palafrugell. Baño, arroz y vuelta con el atardecer. ¿Conduces tú o yo?',
      'Cap de Creus. Hay un rincón donde solo se oye el mar. Te va a encantar.',
    ],
  },
  {
    id: 'places-3',
    topic: 'places',
    question: '¿Cuál es tu rincón favorito de Barcelona para una primera cita?',
    answers: [
      'Una terraza escondida en el Born. Si quieres, te la enseño este finde.',
      'El Parc de la Ciutadella al caer la tarde. Sencillo, pero nunca falla.',
    ],
  },
  // Cultura
  {
    id: 'culture-1',
    topic: 'culture',
    question: '¿Qué peli veríamos en nuestra primera cita?',
    answers: [
      'Una en versión original en los Verdi y luego a discutirla con un vino.',
      'Una de miedo. Así tengo excusa para agarrarme a tu brazo.',
    ],
  },
  {
    id: 'culture-2',
    topic: 'culture',
    question: '¿Museo y café después, o café y museo después?',
    answers: [
      'Café primero, que en los museos me pongo a hablar demasiado bajito.',
      'Museo primero. Así en el café ya tenemos de qué hablar.',
    ],
  },
  {
    id: 'culture-3',
    topic: 'culture',
    question: '¿Qué libro me regalarías para que te conociera mejor?',
    answers: [
      'Uno con muchas páginas subrayadas. Así ves lo que me gusta sin que te lo diga.',
      'Te lo regalo en persona, con dedicatoria. No te lo voy a desvelar por aquí.',
    ],
  },
  // General (pestaña «Todo»)
  {
    id: 'general-1',
    topic: 'general',
    question: '¿Cuál sería tu plan perfecto para una primera cita conmigo?',
    answers: [
      'Algo sencillo: un paseo, un vermut y dejar que la tarde decida. ¿Te apuntas?',
      'Uno en el que se nos pase la hora sin darnos cuenta. El sitio me da un poco igual.',
    ],
  },
  {
    id: 'general-2',
    topic: 'general',
    question: 'Si quedamos este finde, ¿qué no puede faltar?',
    answers: [
      'Buena conversación y algo rico para picar. Lo demás, improvisamos.',
      'Que no mires el móvil. Bueno, salvo para enseñarme tus fotos de viaje.',
    ],
  },
];

export function questionsFor(topic: Topic): FlirtQuestion[] {
  return flirtQuestions.filter((q) => q.topic === topic);
}

export const questionById = (id?: string) => flirtQuestions.find((q) => q.id === id);

/** Respuesta estable para cada persona y pregunta. */
export function answerFor(questionId: string, personId: string): string | undefined {
  const q = questionById(questionId);
  if (!q) return undefined;
  let h = 0;
  for (const c of personId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return q.answers[h % q.answers.length];
}
