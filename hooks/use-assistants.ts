"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { assistantService, initializeAssistants } from "@/lib/services"
import { initialAssistants } from "@/lib/mock-data"
import { useAssistantStore } from "@/lib/store"
import type { Assistant, AssistantFormData } from "@/lib/types"
import { useEffect, useRef } from "react"

export function useAssistants() {
  const queryClient = useQueryClient()
  const { setAssistants, addAssistant, updateAssistant, removeAssistant } = useAssistantStore()
  const initialized = useRef(false)

  // Initialize mock data on first load
  useEffect(() => {
    if (!initialized.current) {
      initializeAssistants(initialAssistants)
      initialized.current = true
    }
  }, [])

  const query = useQuery({
    queryKey: ["assistants"],
    queryFn: assistantService.getAll,
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (query.data) {
      setAssistants(query.data)
    }
  }, [query.data, setAssistants])

  const createMutation = useMutation({
    mutationFn: (data: AssistantFormData) => assistantService.create(data),
    onSuccess: (newAssistant) => {
      addAssistant(newAssistant)
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssistantFormData> }) => assistantService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["assistants"] })
      const previousAssistants = queryClient.getQueryData<Assistant[]>(["assistants"])
      updateAssistant(id, data)
      return { previousAssistants }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAssistants) {
        setAssistants(context.previousAssistants)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assistantService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["assistants"] })
      const previousAssistants = queryClient.getQueryData<Assistant[]>(["assistants"])
      removeAssistant(id)
      return { previousAssistants }
    },
    onError: (_err, _id, context) => {
      if (context?.previousAssistants) {
        setAssistants(context.previousAssistants)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] })
    },
  })

  return {
    assistants: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createAssistant: createMutation.mutateAsync,
    updateAssistant: updateMutation.mutateAsync,
    deleteAssistant: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
