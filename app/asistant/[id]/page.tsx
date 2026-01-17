"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, Bot, Send, RefreshCw, Loader2, Save, Volume2, VolumeX, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { assistantService } from "@/lib/services"
import { simulatedResponses } from "@/lib/mock-data"
import { useAssistantStore } from "@/lib/store"
import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function TrainingPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const queryClient = useQueryClient()
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { chatMessages, addChatMessage, clearChatMessages } = useAssistantStore()
  const messages = chatMessages[id] || []

  const [rules, setRules] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Fetch assistant data
  const { data: assistant, isLoading } = useQuery({
    queryKey: ["assistant", id],
    queryFn: () => assistantService.getById(id),
  })

  // Initialize rules from assistant data
  useEffect(() => {
    if (assistant) {
      setRules(assistant.rules)
    }
  }, [assistant])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Save rules mutation
  const saveRulesMutation = useMutation({
    mutationFn: (newRules: string) => assistantService.updateRules(id, newRules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistant", id] })
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
      toast.success("Entrenamiento guardado", {
        description: "Las instrucciones han sido guardadas correctamente.",
      })
    },
    onError: () => {
      toast.error("Error al guardar", {
        description: "No se pudieron guardar las instrucciones. Inténtalo de nuevo.",
      })
    },
  })

  const handleSaveRules = () => {
    saveRulesMutation.mutate(rules)
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageInput.trim(),
      timestamp: new Date(),
    }

    addChatMessage(id, userMessage)
    setMessageInput("")
    setIsTyping(true)

    // Simulate assistant response with 1-2 second delay
    const delay = 1000 + Math.random() * 1000
    setTimeout(() => {
      const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)]
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      }
      addChatMessage(id, assistantMessage)
      setIsTyping(false)
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleResetChat = () => {
    clearChatMessages(id)
    toast.success("Chat reiniciado", {
      description: "La conversación ha sido eliminada.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
          <Skeleton className="h-20 w-full rounded-lg mb-6" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[500px] rounded-lg" />
            <Skeleton className="h-[500px] rounded-lg" />
          </div>
        </main>
      </div>
    )
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Asistente no encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">El asistente que buscas no existe o ha sido eliminado.</p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Volver</span>
                </Button>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg">DATOS DEL ASISTENTE</h1>
                  <p className="text-sm text-muted-foreground">{assistant.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  {assistant.language}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {assistant.tone}
                </Badge>
                {assistant.audioEnabled ? (
                  <Badge variant="secondary" className="text-xs">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Audio
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    <VolumeX className="h-3 w-3 mr-1" />
                    Sin audio
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Training section - Left */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Entrenamiento del asistente:</CardTitle>
              <p className="text-sm text-muted-foreground">
                Solo persistencia de datos en local. Que al refrescar la data permanezca una vez se le da guardar
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea
                placeholder="Escribe las instrucciones para tu asistente..."
                className="flex-1 min-h-[300px] resize-none"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
              />
              <div className="flex justify-center">
                <Button onClick={handleSaveRules} disabled={saveRulesMutation.isPending} variant="outline">
                  {saveRulesMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      GUARDAR
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat simulation section - Right */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">CHAT SIMULADO:</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleResetChat} disabled={messages.length === 0}>
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Reiniciar
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Las respuestas son completamente simuladas, se pueden obtener de un JSON, deben tener delay para simular
                el fetch de la data...
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
              {/* Messages area */}
              <ScrollArea className="flex-1 pr-4 -mr-4 min-h-[300px]">
                <div className="space-y-4 pb-2">
                  {messages.length === 0 && !isTyping && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                        <Bot className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Envía un mensaje para comenzar la conversación</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md",
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Message input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
