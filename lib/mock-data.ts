import type { Assistant } from "./types"

/**
 * 💬 RESPUESTAS SIMULADAS PARA EL CHAT
 * 
 * Estas son las respuestas que el asistente "da" en el chat simulado.
 * Cada vez que el usuario envía un mensaje, elegimos una aleatoriamente.
 * 
 * En una app real, estas vendrían de una API con un modelo de IA.
 * Aquí las hardcodeamos para simular comportamiento realista.
 */
export const simulatedResponses = [
  "Entendido, ¿en qué más puedo ayudarte?",
  "Esa es una excelente pregunta. Déjame explicarte...",
  "Claro, con gusto te ayudo con eso.",
  "¿Podrías darme más detalles sobre tu consulta?",
  "Perfecto, he registrado esa información.",
  "Te entiendo perfectamente. Aquí está la solución...",
  "Excelente punto. Déjame profundizar en esto.",
  "Claro, permíteme asistirte con eso.",
  "Entiendo tu inquietud. Aquí va mi respuesta...",
  "¡Qué buena pregunta! La respuesta es...",
]

/**
 * 🎬 DATOS INICIALES - Asistentes de ejemplo
 * 
 * La aplicación comienza con estos dos asistentes ya creados.
 * Esto ayuda al usuario a ver cómo se vería con datos reales.
 * 
 * Cada vez que recargamos la página, volvemos a estos datos.
 * (No hay persistencia real implementada)
 */
export const initialAssistants: Assistant[] = [
  {
    id: "1",
    name: "Asistente de Ventas",
    language: "Español",
    tone: "Profesional",
    responseLength: {
      short: 30,    // 30% respuestas cortas
      medium: 50,   // 50% respuestas medianas
      long: 20,     // 20% respuestas largas
    },
    audioEnabled: true,  // Este sí tiene audio
    rules: "Eres un asistente especializado en ventas. Siempre sé cordial y enfócate en identificar necesidades del cliente antes de ofrecer productos.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Soporte Técnico",
    language: "Inglés",
    tone: "Amigable",
    responseLength: {
      short: 20,    // 20% respuestas cortas
      medium: 30,   // 30% respuestas medianas
      long: 50,     // 50% respuestas largas (explica más)
    },
    audioEnabled: false,  // Este no tiene audio
    rules: "Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar.",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]
