export type AgentAnalytics = {
  id: string
  agent_id: string
  total_interactions: number
  daily_interactions: number
  date: string
  created_at: string
  updated_at: string
}

export type AgentAnalyticsWithDetails = AgentAnalytics & {
  agent_name: string
  agent_platform_name: string
  client_id?: string
  client_name?: string
  company_id: string
}

export type ChartDataPoint = {
  date: string
  [agentName: string]: string | number // Dynamic agent names as keys
}

export type UseAgentAnalyticsReturn = {
  // Loading states
  isLoading: boolean
  isLoadingByAgent: boolean
  isLoadingChart: boolean
  
  // Data
  allAnalytics: AgentAnalyticsWithDetails[]
  analyticsById: Record<string, AgentAnalyticsWithDetails[]>
  chartData: ChartDataPoint[]
  
  // Methods
  refresh: () => Promise<void>
  getAnalyticsByAgentId: (agentId: string) => Promise<AgentAnalyticsWithDetails[]>
  getChartData: (limit?: number) => Promise<ChartDataPoint[]>
  
  // Computed values
  totalInteractions: number
  agentCount: number
  
  // Error handling
  error: string | null
}
