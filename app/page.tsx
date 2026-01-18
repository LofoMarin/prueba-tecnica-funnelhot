"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Plus, Loader2, Trash2, Edit2, BookOpen, Globe, Palette, Volume2, VolumeX, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { AssistantModal } from "@/components/assistant-modal"
import { assistantService } from "@/lib/services"
import { useAssistantStore } from "@/lib/store"

/**
 * 📄 PÁGINA PRINCIPAL - LISTADO DE ASISTENTES
 *
 * Esta es la página que ves al entrar a http://localhost:3000
 *
 * Aquí mostramos:
 * - Un grid de tarjetas con todos los asistentes
 * - Información de cada uno (nombre, idioma, tono, audio)
 * - Gráfico de distribución de respuestas (cortas, medias, largas)
 * - Botones de acciones (Editar, Eliminar, Entrenar)
 *
 * Estados manejados:
 * - Loading: Muestra skeletons mientras carga
 * - Empty: Muestra mensaje bonito cuando no hay asistentes
 * - Data: Muestra el grid de tarjetas
 */

export default function HomePage() {
  const queryClient = useQueryClient()
  const { setAssistants, openModal } = useAssistantStore()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  /**
   * 📖 QUERY - Obtener lista de asistentes
   * React Query maneja automáticamente:
   * - Loading state
   * - Caché
   * - Reintentos
   * - Sincronización
   */
  const { data: assistants = [], isLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: () => assistantService.getAll(),
    staleTime: 0, // Los datos se consideran "stale" inmediatamente (siempre refrescar)
  })

  /**
   * 🔄 Sincronización: Cada vez que React Query trae datos,
   * los guardamos también en Zustand para acceso global
   */
  useEffect(() => {
    setAssistants(assistants)
  }, [assistants.length, setAssistants])

  /**
   * 🗑️ MUTATION - Eliminar un asistente
   *
   * Flujo:
   * 1. Usuario clickea eliminar
   * 2. Se abre un AlertDialog pidiendo confirmación
   * 3. Si confirma, ejecutamos esta mutation
   * 4. El backend (mock) lo elimina
   * 5. React Query invalida el cache automáticamente
   * 6. Mostramos un toast de éxito
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => assistantService.delete(id),
    onSuccess: () => {
      // Invalida el cache, fuerza que React Query refetch los datos
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
      toast.success("Asistente eliminado", {
        description: "El asistente ha sido eliminado correctamente.",
      })
      setDeleteTarget(null)
    },
    onError: () => {
      // Si falla (10% de probabilidad), mostramos error
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar el asistente. Inténtalo de nuevo.",
      })
    },
  })

  /**
   * 🪟 Abre el modal en modo creación
   */
  const handleCreateClick = () => {
    openModal("create")
  }

  /**
   * ✏️ Abre el modal en modo edición con los datos del asistente
   */
  const handleEditClick = (assistant: any) => {
    openModal("edit", assistant)
  }

  /**
   * 🗑️ Prepara el asistente para eliminación
   * (Abre el AlertDialog)
   */
  const handleDeleteClick = (assistant: any) => {
    setDeleteTarget(assistant.id)
  }

  /**
   * ✅ Confirma la eliminación y ejecuta la mutation
   */
  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with title and create button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Mis Asistentes</h1>
            <p className="text-muted-foreground mt-2">Crea y entrena tus asistentes de IA personalizados</p>
          </div>
          <Button onClick={handleCreateClick} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Crear Asistente
          </Button>
        </div>

        {/* Assistants Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : assistants.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No hay asistentes</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-sm">
                Comienza creando tu primer asistente de IA personalizado
              </p>
              <Button onClick={handleCreateClick} gap-2>
                <Plus className="h-4 w-4" />
                Crear Asistente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assistants.map((assistant) => (
              <Card key={assistant.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{assistant.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">ID: {assistant.id}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Opciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(assistant)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(assistant)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {/* Assistant details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{assistant.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span>{assistant.tone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assistant.audioEnabled ? (
                        <>
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <span>Audio habilitado</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                          <span>Sin audio</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Response length distribution */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Distribución de respuestas</p>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                      <div
                        className="bg-blue-500 transition-all"
                        style={{ width: `${assistant.responseLength.short}%` }}
                        title={`Cortas: ${assistant.responseLength.short}%`}
                      />
                      <div
                        className="bg-amber-500 transition-all"
                        style={{ width: `${assistant.responseLength.medium}%` }}
                        title={`Medias: ${assistant.responseLength.medium}%`}
                      />
                      <div
                        className="bg-green-500 transition-all"
                        style={{ width: `${assistant.responseLength.long}%` }}
                        title={`Largas: ${assistant.responseLength.long}%`}
                      />
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Cortas
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Medias
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Largas
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/asistant/${assistant.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Entrenar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AssistantModal />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asistente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El asistente y todos sus datos serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
