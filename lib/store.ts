import { create } from "zustand"
import type { Assistant, ChatMessage } from "./types"

interface AssistantStore {
  assistants: Assistant[]
  selectedAssistant: Assistant | null
  chatMessages: Record<string, ChatMessage[]>
  isModalOpen: boolean
  modalMode: "create" | "edit"
  editingAssistant: Assistant | null

  // Assistant management
  setAssistants: (assistants: Assistant[]) => void
  addAssistant: (assistant: Assistant) => void
  updateAssistant: (assistant: Assistant) => void
  deleteAssistant: (id: string) => void
  setSelectedAssistant: (assistant: Assistant | null) => void

  // Modal management
  openModal: (mode: "create" | "edit", assistant?: Assistant) => void
  closeModal: () => void
  setEditingAssistant: (assistant: Assistant | null) => void

  // Chat management
  addChatMessage: (assistantId: string, message: ChatMessage) => void
  clearChatMessages: (assistantId: string) => void
  getChatMessages: (assistantId: string) => ChatMessage[]
}

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  assistants: [],
  selectedAssistant: null,
  chatMessages: {},
  isModalOpen: false,
  modalMode: "create",
  editingAssistant: null,

  setAssistants: (assistants) => set({ assistants }),

  addAssistant: (assistant) =>
    set((state) => ({
      assistants: [...state.assistants, assistant],
    })),

  updateAssistant: (assistant) =>
    set((state) => ({
      assistants: state.assistants.map((a) => (a.id === assistant.id ? assistant : a)),
      selectedAssistant: state.selectedAssistant?.id === assistant.id ? assistant : state.selectedAssistant,
    })),

  deleteAssistant: (id) =>
    set((state) => ({
      assistants: state.assistants.filter((a) => a.id !== id),
      selectedAssistant: state.selectedAssistant?.id === id ? null : state.selectedAssistant,
    })),

  setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),

  openModal: (mode, assistant) =>
    set({
      isModalOpen: true,
      modalMode: mode,
      editingAssistant: assistant || null,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      editingAssistant: null,
    }),

  setEditingAssistant: (assistant) => set({ editingAssistant: assistant }),

  addChatMessage: (assistantId, message) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [assistantId]: [...(state.chatMessages[assistantId] || []), message],
      },
    })),

  clearChatMessages: (assistantId) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [assistantId]: [],
      },
    })),

  getChatMessages: (assistantId) => {
    const state = get()
    return state.chatMessages[assistantId] || []
  },
}))
