import { create } from "zustand"
import type { Assistant, ChatMessage } from "./types"

/**
 * 🧠 STORE CENTRAL DE ZUSTAND
 * 
 * Este es el corazón del estado global de la aplicación.
 * Aquí guardamos todo lo que necesita ser accesible desde cualquier componente:
 * - Lista de asistentes (para mostrar en la página principal)
 * - El asistente seleccionado (para la página de entrenamiento)
 * - El estado del modal (abierto/cerrado, creación/edición)
 * - Los mensajes del chat de cada asistente
 * 
 * ¿Por qué Zustand y no Context API?
 * Zustand es más ligero, más rápido y no requiere Provider wrapper.
 * Perfect para aplicaciones medianas como esta.
 */

interface AssistantStore {
  // 📋 ASISTENTES
  assistants: Assistant[]
  selectedAssistant: Assistant | null
  chatMessages: Record<string, ChatMessage[]>
  
  // 🪟 MODAL
  isModalOpen: boolean
  modalMode: "create" | "edit"
  editingAssistant: Assistant | null

  // 🎯 ACCIONES - ASISTENTES
  setAssistants: (assistants: Assistant[]) => void
  addAssistant: (assistant: Assistant) => void
  updateAssistant: (assistant: Assistant) => void
  deleteAssistant: (id: string) => void
  setSelectedAssistant: (assistant: Assistant | null) => void

  // 🎯 ACCIONES - MODAL
  openModal: (mode: "create" | "edit", assistant?: Assistant) => void
  closeModal: () => void
  setEditingAssistant: (assistant: Assistant | null) => void

  // 🎯 ACCIONES - CHAT
  addChatMessage: (assistantId: string, message: ChatMessage) => void
  clearChatMessages: (assistantId: string) => void
  getChatMessages: (assistantId: string) => ChatMessage[]
}

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  // Estado inicial - todo vacío al principio
  assistants: [],
  selectedAssistant: null,
  chatMessages: {},
  isModalOpen: false,
  modalMode: "create",
  editingAssistant: null,

  // 📋 Guardamos la lista completa de asistentes
  // Esto se llama cuando React Query trae los datos del backend (o mock)
  setAssistants: (assistants) => set({ assistants }),

  // ➕ Agregamos un asistente nuevo a la lista
  addAssistant: (assistant) =>
    set((state) => ({
      assistants: [...state.assistants, assistant],
    })),

  // ✏️ Actualizamos un asistente existente
  // Si es el seleccionado, también lo actualizamos en selectedAssistant
  updateAssistant: (assistant) =>
    set((state) => ({
      assistants: state.assistants.map((a) => (a.id === assistant.id ? assistant : a)),
      selectedAssistant: state.selectedAssistant?.id === assistant.id ? assistant : state.selectedAssistant,
    })),

  // 🗑️ Eliminamos un asistente de la lista
  // Si es el seleccionado, limpiamos la selección
  deleteAssistant: (id) =>
    set((state) => ({
      assistants: state.assistants.filter((a) => a.id !== id),
      selectedAssistant: state.selectedAssistant?.id === id ? null : state.selectedAssistant,
    })),

  // 🎯 Marcamos un asistente como seleccionado
  // Esto se usa cuando clickeamos "Entrenar" en una tarjeta
  setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),

  // 🪟 Abrimos el modal en modo creación o edición
  openModal: (mode, assistant) =>
    set({
      isModalOpen: true,
      modalMode: mode,
      editingAssistant: assistant || null,
    }),

  // 🪟 Cerramos el modal y limpiamos el estado
  closeModal: () =>
    set({
      isModalOpen: false,
      editingAssistant: null,
    }),

  // 🪟 Útil para cambiar qué asistente estamos editando
  setEditingAssistant: (assistant) => set({ editingAssistant: assistant }),

  // 💬 Agregamos un mensaje al chat de un asistente específico
  // Si es el primer mensaje, creamos el array
  addChatMessage: (assistantId, message) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [assistantId]: [...(state.chatMessages[assistantId] || []), message],
      },
    })),

  // 🧹 Limpiamos todos los mensajes de un asistente (reiniciar chat)
  clearChatMessages: (assistantId) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [assistantId]: [],
      },
    })),

  // 📖 Obtenemos los mensajes de un asistente específico
  // Si no hay mensajes, retornamos un array vacío
  getChatMessages: (assistantId) => {
    const state = get()
    return state.chatMessages[assistantId] || []
  },
}))
