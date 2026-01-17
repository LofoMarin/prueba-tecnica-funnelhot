"use client"

import { Bot, MoreVertical, Pencil, Trash2, GraduationCap, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Assistant } from "@/lib/types"

interface AssistantCardProps {
  assistant: Assistant
  onEdit: (assistant: Assistant) => void
  onDelete: (assistant: Assistant) => void
  onTrain: (assistant: Assistant) => void
}

const languageFlags: Record<Assistant["language"], string> = {
  Español: "ES",
  Inglés: "EN",
  Portugués: "PT",
}

const toneColors: Record<Assistant["tone"], string> = {
  Formal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Casual: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Profesional: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Amigable: "bg-pink-500/10 text-pink-400 border-pink-500/20",
}

export function AssistantCard({ assistant, onEdit, onDelete, onTrain }: AssistantCardProps) {
  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold leading-none tracking-tight text-balance">{assistant.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">{languageFlags[assistant.language]}</span>
                <span className="text-muted-foreground/40">•</span>
                <Badge variant="outline" className={`text-xs px-2 py-0 ${toneColors[assistant.tone]}`}>
                  {assistant.tone}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(assistant)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTrain(assistant)}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Entrenar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(assistant)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {assistant.audioEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-success" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
                <span className="text-xs">Audio {assistant.audioEnabled ? "activo" : "inactivo"}</span>
              </div>
            </div>

            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-chart-1/10 text-chart-1 cursor-help">
                    C:{assistant.responseLength.short}%
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Respuestas cortas: {assistant.responseLength.short}%</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-chart-2/10 text-chart-2 cursor-help">
                    M:{assistant.responseLength.medium}%
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Respuestas medias: {assistant.responseLength.medium}%</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-chart-3/10 text-chart-3 cursor-help">
                    L:{assistant.responseLength.long}%
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Respuestas largas: {assistant.responseLength.long}%</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
