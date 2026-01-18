"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ChevronLeft, Loader2, Globe, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useAssistantStore } from "@/lib/store"
import { assistantService } from "@/lib/services"
import type { CreateAssistantInput, ResponseLength } from "@/lib/types"

/**
 * 🪟 MODAL DE CREACIÓN/EDICIÓN DE ASISTENTES
 * 
 * Este componente es un poco complejo porque:
 * - Tiene 2 pasos (datos básicos + configuración)
 * - Valida en tiempo real mientras escribes
 * - Usa React Query para las mutaciones (crear/editar)
 * - Maneja errores y muestra toasts
 * 
 * Flujo:
 * 1. Usuario clickea "Crear Asistente" o "Editar"
 * 2. Se abre este modal
 * 3. Paso 1: Rellena nombre, idioma, tono
 * 4. Paso 2: Ajusta porcentajes de respuestas
 * 5. Click "Guardar" -> Mutation -> Toast de éxito
 */

export function AssistantModal() {
  const queryClient = useQueryClient()
  const { isModalOpen, closeModal, modalMode, editingAssistant } = useAssistantStore()

  // Estado del formulario
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<CreateAssistantInput>({
    name: "",
    language: "Español",
    tone: "Profesional",
    responseLength: { short: 33, medium: 34, long: 33 },
    audioEnabled: false,
    rules: "",
  })

  // Errores de validación que mostraremos al usuario
  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * 🔄 Cuando el modal se abre, inicializamos el formulario
   * Si es edición, llenamos con los datos del asistente
   * Si es creación, formulario vacío
   */
  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === "edit" && editingAssistant) {
        setFormData({
          name: editingAssistant.name,
          language: editingAssistant.language,
          tone: editingAssistant.tone,
          responseLength: { ...editingAssistant.responseLength },
          audioEnabled: editingAssistant.audioEnabled,
          rules: editingAssistant.rules,
        })
      } else {
        setFormData({
          name: "",
          language: "Español",
          tone: "Profesional",
          responseLength: { short: 33, medium: 34, long: 33 },
          audioEnabled: false,
          rules: "",
        })
      }
      setStep(1)
      setErrors({})
    }
  }, [isModalOpen, modalMode, editingAssistant])

  /**
   * ✨ CREACIÓN - Mutation para crear un asistente nuevo
   * React Query maneja el loading, errores, y actualiza la cache automáticamente
   */
  const createMutation = useMutation({
    mutationFn: (data: CreateAssistantInput) => assistantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
      toast.success("Asistente creado", {
        description: "El nuevo asistente ha sido creado exitosamente.",
      })
      closeModal()
    },
    onError: () => {
      toast.error("Error al crear", {
        description: "No se pudo crear el asistente. Inténtalo de nuevo.",
      })
    },
  })

  /**
   * ✏️ ACTUALIZACIÓN - Mutation para editar un asistente existente
   */
  const updateMutation = useMutation({
    mutationFn: (data: CreateAssistantInput) =>
      assistantService.update(editingAssistant!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
      queryClient.invalidateQueries({ queryKey: ["assistant", editingAssistant?.id] })
      toast.success("Asistente actualizado", {
        description: "Los cambios han sido guardados exitosamente.",
      })
      closeModal()
    },
    onError: () => {
      toast.error("Error al actualizar", {
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      })
    },
  })

  /**
   * ✅ VALIDAR PASO 1
   * - Nombre requerido
   * - Nombre mínimo 3 caracteres
   */
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * ✅ VALIDAR PASO 2
   * - La suma de porcentajes DEBE ser exactamente 100%
   * (Esta es la validación más importante del formulario)
   */
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}
    const total = formData.responseLength.short + formData.responseLength.medium + formData.responseLength.long

    if (total !== 100) {
      newErrors.responseLength = `La suma debe ser 100% (actualmente: ${total}%)`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * ➡️ Avanzar al paso 2
   * Solo si el paso 1 es válido
   */
  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  /**
   * ⬅️ Volver al paso 1
   * Limpiamos errores cuando volvemos
   */
  const handleBack = () => {
    setStep(1)
    setErrors({})
  }

  /**
   * 💾 Guardar el asistente
   * Valida paso 2, luego llama a la mutation correspondiente
   */
  const handleSave = () => {
    if (validateStep2()) {
      if (modalMode === "create") {
        createMutation.mutate(formData)
      } else {
        updateMutation.mutate(formData)
      }
    }
  }

  /**
   * 🎚️ Actualizar los sliders de porcentajes
   * Mantiene cada valor entre 0 y 100
   */
  const updateResponseLength = (key: keyof ResponseLength, value: number) => {
    setFormData((prev) => ({
      ...prev,
      responseLength: {
        ...prev.responseLength,
        [key]: Math.max(0, Math.min(100, value)),
      },
    }))
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {modalMode === "create" ? "Crear nuevo asistente" : "Editar asistente"}
          </DialogTitle>
          <DialogDescription>
            Paso {step} de 2: {step === 1 ? "Datos básicos" : "Configuración de respuestas"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        {/* Step 1: Basic Data */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del asistente *</Label>
              <Input
                id="name"
                placeholder="Ej: Asistente de Ventas"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma *</Label>
              <Select value={formData.language} onValueChange={(value: any) =>
                setFormData((prev) => ({ ...prev, language: value }))
              }>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Español">Español</SelectItem>
                  <SelectItem value="Inglés">Inglés</SelectItem>
                  <SelectItem value="Portugués">Portugués</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tono/Personalidad *</Label>
              <Select value={formData.tone} onValueChange={(value: any) =>
                setFormData((prev) => ({ ...prev, tone: value }))
              }>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Profesional">Profesional</SelectItem>
                  <SelectItem value="Amigable">Amigable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Response Configuration */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Longitud de respuestas * (suma debe ser 100%)</Label>
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Respuestas cortas</span>
                      <span className="text-sm text-muted-foreground">{formData.responseLength.short}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.responseLength.short}
                      onChange={(e) => updateResponseLength("short", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Respuestas medias</span>
                      <span className="text-sm text-muted-foreground">{formData.responseLength.medium}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.responseLength.medium}
                      onChange={(e) => updateResponseLength("medium", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Respuestas largas</span>
                      <span className="text-sm text-muted-foreground">{formData.responseLength.long}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.responseLength.long}
                      onChange={(e) => updateResponseLength("long", Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className={`text-sm font-semibold ${
                        formData.responseLength.short +
                          formData.responseLength.medium +
                          formData.responseLength.long ===
                        100
                          ? "text-green-600"
                          : "text-destructive"
                      }`}>
                        {formData.responseLength.short + formData.responseLength.medium + formData.responseLength.long}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {errors.responseLength && (
                <p className="text-sm text-destructive">{errors.responseLength}</p>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Checkbox
                id="audioEnabled"
                checked={formData.audioEnabled}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    audioEnabled: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="audioEnabled" className="cursor-pointer flex-1 mb-0">
                Habilitar respuestas de audio
              </Label>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
          )}

          {step === 1 ? (
            <Button onClick={handleNext}>Siguiente</Button>
          ) : (
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modalMode === "create" ? "Crear" : "Guardar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
