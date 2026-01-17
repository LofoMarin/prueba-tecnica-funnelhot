import type { Assistant, CreateAssistantInput } from "./types"
import { initialAssistants } from "./mock-data"

// Simulate data persistence in memory
let assistantsDB: Assistant[] = [...initialAssistants]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const randomDelay = () => delay(100 + Math.random() * 400)

const simulateError = (probability: number = 0.1) => {
  if (Math.random() < probability) {
    throw new Error("Simulated error occurred")
  }
}

export const assistantService = {
  // Get all assistants
  async getAll(): Promise<Assistant[]> {
    await randomDelay()
    return [...assistantsDB]
  },

  // Get assistant by ID
  async getById(id: string): Promise<Assistant> {
    await randomDelay()
    const assistant = assistantsDB.find((a) => a.id === id)
    if (!assistant) {
      throw new Error(`Assistant with id ${id} not found`)
    }
    return { ...assistant }
  },

  // Create new assistant
  async create(data: CreateAssistantInput): Promise<Assistant> {
    await randomDelay()
    const newAssistant: Assistant = {
      id: Date.now().toString(),
      ...data,
      rules: data.rules || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    assistantsDB.push(newAssistant)
    return { ...newAssistant }
  },

  // Update assistant
  async update(id: string, data: Partial<CreateAssistantInput>): Promise<Assistant> {
    await randomDelay()
    const index = assistantsDB.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error(`Assistant with id ${id} not found`)
    }
    const updated: Assistant = {
      ...assistantsDB[index],
      ...data,
      updatedAt: new Date(),
    }
    assistantsDB[index] = updated
    return { ...updated }
  },

  // Delete assistant
  async delete(id: string): Promise<void> {
    await randomDelay()
    // Simulate occasional error (10% probability)
    simulateError(0.1)
    const index = assistantsDB.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error(`Assistant with id ${id} not found`)
    }
    assistantsDB.splice(index, 1)
  },

  // Update rules/training
  async updateRules(id: string, rules: string): Promise<Assistant> {
    await randomDelay()
    return this.update(id, { rules })
  },

  // Reset to initial state (useful for testing)
  reset(): void {
    assistantsDB = [...initialAssistants]
  },
}
