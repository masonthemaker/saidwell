import { useEffect, useMemo, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { AgentAnalytics, AgentAnalyticsWithDetails, UseAgentAnalyticsReturn, ChartDataPoint } from './types'

export function useAgentAnalytics(): UseAgentAnalyticsReturn {
  const supabase = useMemo(() => createClient(), [])
  const { user, isOwner, isAdmin, getCurrentClient } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingByAgent, setIsLoadingByAgent] = useState(false)
  const [isLoadingChart, setIsLoadingChart] = useState(false)
  const [allAnalytics, setAllAnalytics] = useState<AgentAnalyticsWithDetails[]>([])
  const [analyticsById, setAnalyticsById] = useState<Record<string, AgentAnalyticsWithDetails[]>>({})
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadAllAnalytics = useCallback(async () => {
    if (!user) {
      setAllAnalytics([])
      setError(null)
      return
    }

    try {
      setError(null)
      
      // RLS policies will automatically filter based on user's access level
      // Company owners/admins see all company analytics
      // Client users see only analytics for agents assigned to their client
      const { data, error: queryError } = await supabase
        .from('agent_analytics')
        .select(`
          id,
          agent_id,
          total_interactions,
          daily_interactions,
          date,
          created_at,
          updated_at,
          agents!inner (
            id,
            name,
            platform_name,
            company_id,
            client_id,
            clients (
              id,
              name
            )
          )
        `)
        .order('date', { ascending: false })

      if (queryError) {
        console.error('Error loading agent analytics:', queryError)
        setError(queryError.message)
        setAllAnalytics([])
        return
      }

      const formattedData: AgentAnalyticsWithDetails[] = (data || []).map(item => ({
        id: item.id,
        agent_id: item.agent_id,
        total_interactions: item.total_interactions,
        daily_interactions: item.daily_interactions,
        date: item.date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        agent_name: item.agents.name,
        agent_platform_name: item.agents.platform_name,
        company_id: item.agents.company_id,
        client_id: item.agents.client_id,
        client_name: item.agents.clients?.name
      }))

      setAllAnalytics(formattedData)
    } catch (err) {
      console.error('Error in loadAllAnalytics:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setAllAnalytics([])
    }
  }, [supabase, user])

  const getChartData = useCallback(async (limit: number = 5): Promise<ChartDataPoint[]> => {
    if (!user) {
      return []
    }

    try {
      setIsLoadingChart(true)
      setError(null)

      // Get time-series data for chart, limited to top N agents
      const { data, error: queryError } = await supabase
        .from('agent_analytics')
        .select(`
          date,
          daily_interactions,
          agents!inner (
            name
          )
        `)
        .order('date', { ascending: true })

      if (queryError) {
        console.error('Error loading chart data:', queryError)
        setError(queryError.message)
        return []
      }

      // Group by agent and get top N agents by total interactions
      const agentTotals: Record<string, number> = {}
      data?.forEach(item => {
        const agentName = item.agents.name
        agentTotals[agentName] = (agentTotals[agentName] || 0) + item.daily_interactions
      })

      // Get top N agents
      const topAgents = Object.entries(agentTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([name]) => name)

      // Group data by date and transform to chart format
      const dateGroups: Record<string, Record<string, number>> = {}
      data?.forEach(item => {
        const agentName = item.agents.name
        if (!topAgents.includes(agentName)) return // Only include top agents

        const date = item.date
        if (!dateGroups[date]) {
          dateGroups[date] = {}
        }
        dateGroups[date][agentName] = item.daily_interactions
      })

      // Convert to chart data format
      const chartData: ChartDataPoint[] = Object.entries(dateGroups)
        .map(([date, agents]) => ({
          date,
          ...agents
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setChartData(chartData)
      return chartData
    } catch (err) {
      console.error('Error in getChartData:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return []
    } finally {
      setIsLoadingChart(false)
    }
  }, [supabase, user])

  const getAnalyticsByAgentId = useCallback(async (agentId: string): Promise<AgentAnalyticsWithDetails[]> => {
    if (!user || !agentId) {
      return []
    }

    try {
      setIsLoadingByAgent(true)
      setError(null)

      // Check if we already have this data cached
      if (analyticsById[agentId]) {
        return analyticsById[agentId]
      }

      const { data, error: queryError } = await supabase
        .from('agent_analytics')
        .select(`
          id,
          agent_id,
          total_interactions,
          created_at,
          updated_at,
          agents!inner (
            id,
            name,
            platform_name,
            company_id,
            client_id,
            clients (
              id,
              name
            )
          )
        `)
        .eq('agent_id', agentId)
        .order('updated_at', { ascending: false })

      if (queryError) {
        console.error('Error loading analytics for agent:', queryError)
        setError(queryError.message)
        return []
      }

      const formattedData: AgentAnalyticsWithDetails[] = (data || []).map(item => ({
        id: item.id,
        agent_id: item.agent_id,
        total_interactions: item.total_interactions,
        created_at: item.created_at,
        updated_at: item.updated_at,
        agent_name: item.agents.name,
        agent_platform_name: item.agents.platform_name,
        company_id: item.agents.company_id,
        client_id: item.agents.client_id,
        client_name: item.agents.clients?.name
      }))

      // Cache the result
      setAnalyticsById(prev => ({
        ...prev,
        [agentId]: formattedData
      }))

      return formattedData
    } catch (err) {
      console.error('Error in getAnalyticsByAgentId:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      return []
    } finally {
      setIsLoadingByAgent(false)
    }
  }, [supabase, user, analyticsById])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      // Clear cache and reload
      setAnalyticsById({})
      await loadAllAnalytics()
    } finally {
      setIsLoading(false)
    }
  }, [loadAllAnalytics])

  // Computed values
  const totalInteractions = useMemo(() => {
    return allAnalytics.reduce((sum, analytics) => sum + analytics.total_interactions, 0)
  }, [allAnalytics])

  const agentCount = useMemo(() => {
    const uniqueAgentIds = new Set(allAnalytics.map(analytics => analytics.agent_id))
    return uniqueAgentIds.size
  }, [allAnalytics])

  // Load data on mount and when user changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        await loadAllAnalytics()
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [loadAllAnalytics])

  return {
    // Loading states
    isLoading,
    isLoadingByAgent,
    isLoadingChart,
    
    // Data
    allAnalytics,
    analyticsById,
    chartData,
    
    // Methods
    refresh,
    getAnalyticsByAgentId,
    getChartData,
    
    // Computed values
    totalInteractions,
    agentCount,
    
    // Error handling
    error
  }
}

export default useAgentAnalytics
