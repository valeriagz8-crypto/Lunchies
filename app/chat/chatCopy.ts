/** Fixed copy for the chat page, kept out of the JSX. */

export const CHAT_PAGE_COPY = {
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
} as const;
