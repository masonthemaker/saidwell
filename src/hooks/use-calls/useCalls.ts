import { useEffect, useMemo, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { Call, CallWithDetails, UseCallsReturn, CallsChartDataPoint, CallSummary } from './types'

export function useCalls(): UseCallsReturn {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingByAgent, setIsLoadingByAgent] = useState(false)
  const [isLoadingChart, setIsLoadingChart] = useState(false)
  const [allCalls, setAllCalls] = useState<CallWithDetails[]>([])
  const [callsById, setCallsById] = useState<Record<string, CallWithDetails[]>>({})
  const [chartData, setChartData] = useState<CallsChartDataPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadAllCalls = useCallback(async () => {
    if (!user) {
      setAllCalls([])
      setError(null)
      return
    }

    try {
      setError(null)
      
      // RLS policies will automatically filter based on user's access level
      // Company owners/admins see all company calls
      // Client users see only calls for agents assigned to their client
      // Using same query pattern as agent_analytics which works perfectly
      const { data, error: queryError } = await supabase
        .from('calls')
        .select(`
          *,
          agents!inner (
            id,
            name,
            platform_name,
            company_id,
            client_id,
            clients (
              id,
              name
            ),
            companies (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (queryError) {
        setError(queryError.message)
        setAllCalls([])
        return
      }

      const formattedData: CallWithDetails[] = (data || []).map(item => ({
        ...item,
        // Ensure proper typing for arrays and objects
        tags: item.tags || [],
        transcript: item.transcript || null,
        // Add the joined data
        agent_name: item.agents.name,
        agent_platform_name: item.agents.platform_name,
        company_id: item.agents.company_id,
        client_id: item.agents.client_id,
        client_name: item.agents.clients?.name,
        company_name: item.agents.companies?.name
      }))

      setAllCalls(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setAllCalls([])
    }
  }, [supabase, user])

  const getChartData = useCallback(async (limit: number = 5, days: number = 30): Promise<CallsChartDataPoint[]> => {
    if (!user) {
      return []
    }

    try {
      setIsLoadingChart(true)
      setError(null)

      // Get calls from the last N days
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const { data, error: queryError } = await supabase
        .from('calls')
        .select(`
          created_at,
          agents!inner (
            name
          )
        `)
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: true })

      if (queryError) {
        setError(queryError.message)
        return []
      }

      // Group by agent and get top N agents by call count
      const agentCounts: Record<string, number> = {}
      data?.forEach(item => {
        const agentName = item.agents.name
        agentCounts[agentName] = (agentCounts[agentName] || 0) + 1
      })

      // Get top N agents
      const topAgents = Object.entries(agentCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([name]) => name)

      // Group data by date and transform to chart format
      const dateGroups: Record<string, Record<string, number>> = {}
      data?.forEach(item => {
        const agentName = item.agents.name
        if (!topAgents.includes(agentName)) return // Only include top agents

        const date = new Date(item.created_at).toISOString().split('T')[0] // Get YYYY-MM-DD format
        if (!dateGroups[date]) {
          dateGroups[date] = {}
        }
        dateGroups[date][agentName] = (dateGroups[date][agentName] || 0) + 1
      })

      // Convert to chart data format
      const chartData: CallsChartDataPoint[] = Object.entries(dateGroups)
        .map(([date, agents]) => ({
          date,
          ...agents
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setChartData(chartData)
      return chartData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return []
    } finally {
      setIsLoadingChart(false)
    }
  }, [supabase, user])

  const getCallsByAgentId = useCallback(async (agentId: string): Promise<CallWithDetails[]> => {
    if (!user || !agentId) {
      return []
    }

    try {
      setIsLoadingByAgent(true)
      setError(null)

      // Check if we already have this data cached
      if (callsById[agentId]) {
        return callsById[agentId]
      }

      const { data, error: queryError } = await supabase
        .from('calls')
        .select(`
          *,
          agents!inner (
            id,
            name,
            platform_name,
            company_id,
            client_id,
            clients (
              id,
              name
            ),
            companies (
              id,
              name
            )
          )
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })

      if (queryError) {
        setError(queryError.message)
        return []
      }

      const formattedData: CallWithDetails[] = (data || []).map(item => ({
        ...item,
        tags: item.tags || [],
        transcript: item.transcript || null,
        // Add the joined data
        agent_name: item.agents.name,
        agent_platform_name: item.agents.platform_name,
        company_id: item.agents.company_id,
        client_id: item.agents.client_id,
        client_name: item.agents.clients?.name,
        company_name: item.agents.companies?.name
      }))

      // Cache the result
      setCallsById(prev => ({
        ...prev,
        [agentId]: formattedData
      }))

      return formattedData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return []
    } finally {
      setIsLoadingByAgent(false)
    }
  }, [supabase, user, callsById])

  const getCallById = useCallback(async (callId: string): Promise<CallWithDetails | null> => {
    if (!user || !callId) {
      return null
    }

    try {
      setError(null)

      // Check if we already have this data in allCalls
      const existingCall = allCalls.find(call => call.id === callId)
      if (existingCall) {
        return existingCall
      }

      const { data, error: queryError } = await supabase
        .from('calls')
        .select(`
          *,
          agents!inner (
            id,
            name,
            platform_name,
            company_id,
            client_id,
            clients (
              id,
              name
            ),
            companies (
              id,
              name
            )
          )
        `)
        .eq('id', callId)
        .single()

      if (queryError) {
        setError(queryError.message)
        return null
      }

      return {
        ...data,
        tags: data.tags || [],
        transcript: data.transcript || null,
        // Add the joined data
        agent_name: data.agents.name,
        agent_platform_name: data.agents.platform_name,
        company_id: data.agents.company_id,
        client_id: data.agents.client_id,
        client_name: data.agents.clients?.name,
        company_name: data.agents.companies?.name
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return null
    }
  }, [supabase, user, allCalls])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      // Clear cache and reload
      setCallsById({})
      await loadAllCalls()
    } finally {
      setIsLoading(false)
    }
  }, [loadAllCalls])

  // Computed values
  const totalCalls = useMemo(() => allCalls.length, [allCalls])

  const totalCost = useMemo(() => {
    return allCalls.reduce((sum, call) => sum + (call.cost_cents || 0), 0)
  }, [allCalls])

  const totalDuration = useMemo(() => {
    return allCalls.reduce((sum, call) => sum + call.duration_seconds, 0)
  }, [allCalls])

  const agentCount = useMemo(() => {
    const uniqueAgentIds = new Set(allCalls.map(call => call.agent_id))
    return uniqueAgentIds.size
  }, [allCalls])

  const summary = useMemo((): CallSummary => {
    if (allCalls.length === 0) {
      return {
        total_calls: 0,
        total_duration_seconds: 0,
        total_cost_cents: 0,
        avg_duration_seconds: 0,
        avg_cost_cents: 0,
        success_rate: 0,
        by_type: {},
        by_status: {}
      }
    }

    const completedCalls = allCalls.filter(call => 
      call.status === 'Completed' || call.status === 'Resolved'
    ).length

    const byType: Record<string, number> = {}
    const byStatus: Record<string, number> = {}

    allCalls.forEach(call => {
      byType[call.type] = (byType[call.type] || 0) + 1
      byStatus[call.status] = (byStatus[call.status] || 0) + 1
    })

    return {
      total_calls: allCalls.length,
      total_duration_seconds: totalDuration,
      total_cost_cents: totalCost,
      avg_duration_seconds: Math.round(totalDuration / allCalls.length),
      avg_cost_cents: Math.round(totalCost / allCalls.length),
      success_rate: Math.round((completedCalls / allCalls.length) * 100),
      by_type: byType,
      by_status: byStatus
    }
  }, [allCalls, totalDuration, totalCost])

  // Load data on mount and when user changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        await loadAllCalls()
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [loadAllCalls])

  return {
    // Loading states
    isLoading,
    isLoadingByAgent,
    isLoadingChart,
    
    // Data
    allCalls,
    callsById,
    chartData,
    summary,
    
    // Methods
    refresh,
    getCallsByAgentId,
    getChartData,
    getCallById,
    
    // Computed values
    totalCalls,
    totalCost,
    totalDuration,
    agentCount,
    
    // Error handling
    error
  }
}

export default useCalls
