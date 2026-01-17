"use client"

import { Bot, Pencil, Trash2, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Assistant } from "@/lib/types"

interface AssistantRowProps {
  assistant: Assistant
  onEdit: (assistant: Assistant) => void
  onDelete: (assistant: Assistant) => void
  onTrain: (assistant: Assistant) => void
}

const toneColors: Record<Assistant["tone"], string> = {
  Formal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Casual: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Profesional: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Amigable: "bg-pink-500/10 text-pink-400 border-pink-500/20",
}

export function AssistantRow({ assistant, onEdit, onDelete, onTrain }: AssistantRowProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:border-primary/20 transition-colors">
        {/* Assistant info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold leading-none truncate">{assistant.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {assistant.language}
              </Badge>
              <Badge variant="outline" className={`text-xs ${toneColors[assistant.tone]}`}>
                {assistant.tone}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => onEdit(assistant)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => onTrain(assistant)}>
                <GraduationCap className="h-4 w-4" />
                <span className="sr-only">Entrenar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Entrenar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive"
                onClick={() => onDelete(assistant)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eliminar</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
