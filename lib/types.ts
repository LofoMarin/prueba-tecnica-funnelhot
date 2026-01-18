/**
 * 📦 TIPOS TYPESCRIPT - DEFINICIONES
 * 
 * Aquí definimos la forma de los datos que usamos en toda la aplicación.
 * TypeScript nos ayuda a evitar errores tipográficos y a tener autocompletado.
 * 
 * Piensa en esto como un "contrato" que dicen qué datos debe tener cada cosa.
 */

/**
 * 📊 Distribución de longitudes de respuesta
 * Ejemplo: { short: 30, medium: 50, long: 20 }
 * Significa: 30% respuestas cortas, 50% medias, 20% largas
 */
export interface ResponseLength {
  short: number
  medium: number
  long: number
}

/**
 * 🤖 Un Asistente de IA - Todo lo que necesitamos saber sobre él
 */
export interface Assistant {
  id: string                                              // Identificador único
  name: string                                           // Nombre del asistente
  language: "Español" | "Inglés" | "Portugués"          // Idioma en que responde
  tone: "Formal" | "Casual" | "Profesional" | "Amigable" // Personalidad
  responseLength: ResponseLength                         // Distribución de respuestas
  audioEnabled: boolean                                  // ¿Tiene audio habilitado?
  rules: string                                          // Instrucciones de entrenamiento
  createdAt: Date                                        // Cuándo se creó
  updatedAt: Date                                        // Cuándo se actualizó por última vez
}

/**
 * 💬 Un mensaje en el chat simulado
 */
export interface ChatMessage {
  id: string                        // Identificador único del mensaje
  role: "user" | "assistant"        // ¿Quién escribió? ¿Humano o IA?
  content: string                   // El texto del mensaje
  timestamp: Date                   // Cuándo se escribió
}

/**
 * 🪟 Modo del modal de creación/edición
 */
export type ModalMode = "create" | "edit"

/**
 * 📋 Datos que enviamos desde el formulario
 * (No incluye timestamps porque los genera el servidor)
 */
export interface AssistantFormData {
  name: string
  language: Assistant["language"]
  tone: Assistant["tone"]
  responseLength: ResponseLength
  audioEnabled: boolean
}

/**
 * ✏️ Lo que pedimos al crear/editar un asistente
 * Similar a AssistantFormData pero con rules opcional
 */
export interface CreateAssistantInput {
  name: string
  language: "Español" | "Inglés" | "Portugués"
  tone: "Formal" | "Casual" | "Profesional" | "Amigable"
  responseLength: ResponseLength
  audioEnabled: boolean
  rules?: string
}
