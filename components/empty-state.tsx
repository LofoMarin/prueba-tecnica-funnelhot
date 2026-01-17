"use client"

import { Bot, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onCreateClick: () => void
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Bot className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-balance text-center">No hay asistentes creados</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6 text-pretty">
        Crea tu primer asistente de IA para comenzar a automatizar conversaciones y mejorar la experiencia de tus
        usuarios.
      </p>
      <Button onClick={onCreateClick} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Crear Asistente
      </Button>
    </div>
  )
}
