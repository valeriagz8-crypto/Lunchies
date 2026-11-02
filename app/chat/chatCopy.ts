/**
 * Fixed copy for the chat page in both languages, kept out of the JSX.
 * Both entries must carry the same keys: a test checks that.
 */

import type { Lang } from "@/lib/chatData";

const EN = {
  eyebrow: "Lunchies assistant",
  titleLead: "Chat with",
  titleAccent: "Lunchies",
  description:
    "Get personalized lunch ideas, information about our service, and general guidance for school lunches.",
  medicalNote:
    "This chat provides general guidance and is not a substitute for professional medical advice.",
  heroCards: [
    { icon: "✨", label: "Lunchbox ideas" },
    { icon: "ℹ️", label: "Questions about the service" },
    { icon: "🧑", label: "Talk to a person" },
  ],
  greeting:
    "Hi! I'm Lunchies, your guide for healthy and practical school lunches. To give you a better recommendation, let me ask you a few quick questions.",
  questions: {
    age: "1. What is your child's age?",
    allergy: "2. Does your child have any allergies or food preferences?",
    allergyList: "Which ones? Pick all that apply, then press Continue.",
    preferenceList:
      "Which preferences? Pick all that apply, then press Continue.",
    intent: "3. How can I help you today?",
  },
  askQuestion:
    "Sure. Type your question about Lunchies below and I'll answer from what's on the site.",
  ideaIntro: (age: string) =>
    `Here's a balanced lunchbox idea for a ${age} year old:`,
  languageLabel: "Language",
  exclusion: {
    replaced: (ingredient: string) =>
      `Got it, no ${ingredient}. Here's another idea:`,
    notInIdea: (ingredient: string) =>
      `There's no ${ingredient} in that idea, but here's a different one anyway:`,
    tooMany:
      "I can only swap one thing in a conversation. Someone from the Lunchies team can help you with the rest.",
    noneLeft:
      "I don't have an idea that works with all of that. Someone from the Lunchies team can put something together for you.",
  },
  rating: {
    prompt: "Was this helpful?",
    up: "Yes, this was helpful",
    down: "No, this was not helpful",
    thanks: "Thanks for your feedback.",
  },
  review: {
    title: "This needs a review from a Lunchies team member.",
    body: "If you'd like personalized help, leave your contact details and a member of our team will take a look.",
    cta: "Leave your contact details",
    contactLabel: "Email or phone",
    contactPlaceholder: "you@example.com or 55 1234 5678",
    noteLabel: "Anything else we should know? (optional)",
    notePlaceholder: "A specific allergy, a dietary need, a special request",
    submit: "Send to the team",
    sending: "Sending...",
    cancel: "Cancel",
    sent: "Thanks, we have your details. Someone from the Lunchies team will take a look.",
  },
  composer: {
    placeholder: "Type a message...",
    send: "Send message",
  },
  reset: "Start a new conversation",
  continue: "Continue",
  sidebar: {
    doHere: {
      title: "What can you do here?",
      items: [
        "Get personalized lunchbox ideas",
        "Ask questions about Lunchies",
        "Request help from a person on our team",
      ],
    },
    howItWorks: {
      title: "How it works",
      steps: [
        "Answer 3 quick questions",
        "Get a personalized response",
        "Rate your experience",
      ],
    },
    care: {
      title: "Built with care",
      body: "Responses are based on general guidance for balanced and practical school lunches.",
    },
  },
};

const ES: typeof EN = {
  eyebrow: "Asistente Lunchies",
  titleLead: "Chatea con",
  titleAccent: "Lunchies",
  description:
    "Recibe ideas de loncheras personalizadas, información sobre el servicio y orientación general para las comidas de la escuela.",
  medicalNote:
    "Este chat da orientación general y no sustituye la opinión de un profesional de la salud.",
  heroCards: [
    { icon: "✨", label: "Ideas para la lonchera" },
    { icon: "ℹ️", label: "Dudas sobre el servicio" },
    { icon: "🧑", label: "Hablar con una persona" },
  ],
  greeting:
    "¡Hola! Soy Lunchies, tu guía para loncheras escolares saludables y prácticas. Para darte una mejor recomendación, déjame hacerte unas preguntas rápidas.",
  questions: {
    age: "1. ¿Qué edad tiene tu hijo?",
    allergy: "2. ¿Tiene alguna alergia o preferencia de comida?",
    allergyList: "¿Cuáles? Marca todas las que apliquen y dale a Continuar.",
    preferenceList:
      "¿Qué preferencias? Marca todas las que apliquen y dale a Continuar.",
    intent: "3. ¿Cómo te puedo ayudar hoy?",
  },
  askQuestion:
    "Claro. Escribe tu duda sobre Lunchies aquí abajo y te respondo con lo que está en el sitio.",
  ideaIntro: (age: string) =>
    `Esta es una idea de lonchera balanceada para ${age} años:`,
  languageLabel: "Idioma",
  exclusion: {
    replaced: (ingredient: string) =>
      `Va, sin ${ingredient}. Aquí tienes otra idea:`,
    notInIdea: (ingredient: string) =>
      `Esa idea no lleva ${ingredient}, pero aquí va otra de todos modos:`,
    tooMany:
      "Solo puedo cambiar una cosa por conversación. Alguien del equipo de Lunchies puede ayudarte con lo demás.",
    noneLeft:
      "No tengo una idea que funcione con todo eso. Alguien del equipo de Lunchies puede armarte algo.",
  },
  rating: {
    prompt: "¿Te sirvió?",
    up: "Sí, me sirvió",
    down: "No, no me sirvió",
    thanks: "Gracias por tu opinión.",
  },
  review: {
    title: "Esto necesita que lo revise alguien del equipo de Lunchies.",
    body: "Si quieres ayuda personalizada, déjanos tus datos y alguien del equipo lo revisa.",
    cta: "Dejar mis datos de contacto",
    contactLabel: "Correo o teléfono",
    contactPlaceholder: "tu@ejemplo.com o 55 1234 5678",
    noteLabel: "¿Algo más que debamos saber? (opcional)",
    notePlaceholder: "Una alergia específica, una necesidad alimenticia, una petición especial",
    submit: "Enviar al equipo",
    sending: "Enviando...",
    cancel: "Cancelar",
    sent: "Listo, ya tenemos tus datos. Alguien del equipo de Lunchies lo va a revisar.",
  },
  composer: {
    placeholder: "Escribe un mensaje...",
    send: "Enviar mensaje",
  },
  reset: "Empezar una conversación nueva",
  continue: "Continuar",
  sidebar: {
    doHere: {
      title: "¿Qué puedes hacer aquí?",
      items: [
        "Recibir ideas de loncheras personalizadas",
        "Preguntar sobre Lunchies",
        "Pedir ayuda de alguien del equipo",
      ],
    },
    howItWorks: {
      title: "Cómo funciona",
      steps: [
        "Responde 3 preguntas rápidas",
        "Recibe una respuesta personalizada",
        "Califica tu experiencia",
      ],
    },
    care: {
      title: "Hecho con cuidado",
      body: "Las respuestas se basan en orientación general para loncheras escolares balanceadas y prácticas.",
    },
  },
};

export const CHAT_PAGE_COPY: Record<Lang, typeof EN> = { en: EN, es: ES };
