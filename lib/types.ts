export interface ResponseLength {
  short: number
  medium: number
  long: number
}

export interface Assistant {
  id: string
  name: string
  language: "Español" | "Inglés" | "Portugués"
  tone: "Formal" | "Casual" | "Profesional" | "Amigable"
  responseLength: ResponseLength
  audioEnabled: boolean
  rules: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type ModalMode = "create" | "edit"

export interface AssistantFormData {
  name: string
  language: Assistant["language"]
  tone: Assistant["tone"]
  responseLength: ResponseLength
  audioEnabled: boolean
}

export interface CreateAssistantInput {
  name: string
  language: "Español" | "Inglés" | "Portugués"
  tone: "Formal" | "Casual" | "Profesional" | "Amigable"
  responseLength: ResponseLength
  audioEnabled: boolean
  rules?: string
}
