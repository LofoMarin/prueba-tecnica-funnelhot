"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Plus,
  Loader2,
  Trash2,
  Edit2,
  BookOpen,
  Globe,
  Palette,
  Volume2,
  VolumeX,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AssistantModal } from "@/components/assistant-modal"
import { assistantService } from "@/lib/services"
import { useAssistantStore } from "@/lib/store"
import type { Assistant } from "@/lib/types"

export default function HomePage() {
  const queryClient = useQueryClient()
  const { setAssistants, openModal } = useAssistantStore()
  const [deleteTarget, setDeleteTarget] = useState<Assistant | null>(null)

  // Fetch assistants
  const { data: assistants = [], isLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: () => assistantService.getAll(),
    staleTime: 0,
  })

  // Update store when assistants change - with proper dependency tracking
  useEffect(() => {
    if (assistants.length > 0 || assistants.length === 0) {
      setAssistants(assistants)
    }
  }, [assistants.length, setAssistants])

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => assistantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
      toast.success("Asistente eliminado", {
        description: "El asistente ha sido eliminado correctamente.",
      })
      setDeleteTarget(null)
    },
    onError: () => {
      toast.error("Error al eliminar", {
        description: "No se pudo eliminar el asistente. Inténtalo de nuevo.",
      })
    },
  })

  const handleCreateClick = () => {
    openModal("create")
  }

  const handleEditClick = (assistant: Assistant) => {
    openModal("edit", assistant)
  }

  const handleDeleteClick = (assistant: Assistant) => {
    setDeleteTarget(assistant)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Gestión de Asistentes IA</h1>
            <p className="text-muted-foreground">
              Crea y gestiona asistentes de IA para automatizar interacciones con leads
            </p>
          </div>

          <Button onClick={handleCreateClick} size="lg" className="w-full sm:w-fit">
            <Plus className="mr-2 h-5 w-5" />
            Crear Asistente
          </Button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && assistants.length === 0 && (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Sin asistentes aún</h3>
                <p className="text-muted-foreground mb-6">
                  Crea tu primer asistente de IA para comenzar a automatizar interacciones
                </p>
                <Button onClick={handleCreateClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primer asistente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assistants grid */}
        {!isLoading && assistants.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assistants.map((assistant) => (
              <Card key={assistant.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2">{assistant.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {assistant.id}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(assistant)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(assistant)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Idioma:</span>
                      <span className="font-medium">{assistant.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tono:</span>
                      <span className="font-medium">{assistant.tone}</span>
                    </div>
                  </div>

                  {/* Response length preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Distribución de respuestas:</p>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                      <div
                        className="bg-blue-500"
                        style={{ width: `${assistant.responseLength.short}%` }}
                        title={`Cortas: ${assistant.responseLength.short}%`}
                      />
                      <div
                        className="bg-yellow-500"
                        style={{ width: `${assistant.responseLength.medium}%` }}
                        title={`Medias: ${assistant.responseLength.medium}%`}
                      />
                      <div
                        className="bg-green-500"
                        style={{ width: `${assistant.responseLength.long}%` }}
                        title={`Largas: ${assistant.responseLength.long}%`}
                      />
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span><span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>Cortas {assistant.responseLength.short}%</span>
                      <span><span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>Medias {assistant.responseLength.medium}%</span>
                      <span><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>Largas {assistant.responseLength.long}%</span>
                    </div>
                  </div>

                  {/* Audio badge */}
                  <div className="flex items-center gap-1 text-xs">
                    {assistant.audioEnabled ? (
                      <>
                        <Volume2 className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600">Audio habilitado</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Sin audio</span>
                      </>
                    )}
                  </div>
                </CardContent>

                {/* Actions */}
                <div className="px-6 pb-4 pt-3 border-t">
                  <Link href={`/asistant/${assistant.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Entrenar
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <AssistantModal />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asistente?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar "{deleteTarget?.name}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
