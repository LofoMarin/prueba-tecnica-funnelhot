import type { Assistant, CreateAssistantInput } from "./types"
import { initialAssistants } from "./mock-data"

/**
 * 🔧 SERVICIOS MOCK - SIMULACIÓN DE BACKEND
 * 
 * Aquí simularemos las llamadas a un backend real.
 * En producción, esto sería un cliente HTTP (fetch, axios, etc)
 * que hablaría con una API real.
 * 
 * Por ahora, mantenemos los datos en memoria en `assistantsDB`.
 * Cada función simula un delay de 100-500ms como lo haría una API real.
 * 
 * IMPORTANTE: Al refrescar la página, los datos se reinician.
 * Esto es intencional para esta prueba.
 */

// 💾 Base de datos simulada - vive en memoria
let assistantsDB: Assistant[] = [...initialAssistants]

/**
 * ⏱️ Simula un delay aleatorio como lo haría una petición HTTP real
 * 100-500ms es un rango realista para una API moderna
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const randomDelay = () => delay(100 + Math.random() * 400)

/**
 * 💥 Simula errores ocasionales para testear el manejo de errores
 * Por defecto 10% de probabilidad (útil para testing)
 */
const simulateError = (probability: number = 0.1) => {
  if (Math.random() < probability) {
    throw new Error("Simulated error occurred")
  }
}

export const assistantService = {
  /**
   * 📖 GET ALL - Obtiene la lista completa de asistentes
   * Se llama cuando cargamos la página principal
   */
  async getAll(): Promise<Assistant[]> {
    await randomDelay()
    return [...assistantsDB]
  },

  /**
   * 🔎 GET BY ID - Obtiene un asistente específico por su ID
   * Se llama cuando entramos a la página de entrenamiento
   */
  async getById(id: string): Promise<Assistant> {
    await randomDelay()
    const assistant = assistantsDB.find((a) => a.id === id)
    if (!assistant) {
      throw new Error(`Assistant with id ${id} not found`)
    }
    return { ...assistant }
  },

  /**
   * ➕ CREATE - Crea un nuevo asistente
   * - Genera un ID único (timestamp)
   * - Agrrega timestamps de creación/actualización
   * - Lo agrega a la "base de datos"
   */
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

  /**
   * ✏️ UPDATE - Actualiza un asistente existente
   * - Encuentra el asistente por ID
   * - Merge los datos nuevos con los existentes
   * - Actualiza el timestamp de actualización
   */
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

  /**
   * 🗑️ DELETE - Elimina un asistente
   * - 10% de probabilidad de error (para testing)
   * - Lo remueve del array
   */
  async delete(id: string): Promise<void> {
    await randomDelay()
    // Simula ocasionales errores (10% de probabilidad)
    simulateError(0.1)
    const index = assistantsDB.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error(`Assistant with id ${id} not found`)
    }
    assistantsDB.splice(index, 1)
  },

  /**
   * 📝 UPDATE RULES - Actualiza las instrucciones de entrenamiento
   * Se llama cuando presionamos "GUARDAR" en la página de entrenamiento
   */
  async updateRules(id: string, rules: string): Promise<Assistant> {
    await randomDelay()
    return this.update(id, { rules })
  },

  /**
   * 🔄 RESET - Reinicia los datos al estado inicial
   * Útil para testing, resetea todo a los datos de mock-data.ts
   */
  reset(): void {
    assistantsDB = [...initialAssistants]
  },
}
