export type Call = {
  id: string
  agent_id: string
  title: string
  type: 'Support' | 'Outbound' | 'Front Desk' | 'General'
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Resolved' | 'Failed'
  duration_seconds: number
  duration_display?: string
  started_at?: string
  ended_at?: string
  cost_cents?: number
  cost_display?: string
  caller_phone?: string
  caller_name?: string
  caller_id?: string
  transcript?: any // JSONB data
  audio_url?: string
  recording_id?: string
  call_direction?: 'inbound' | 'outbound'
  call_quality_score?: number
  resolution_status?: string
  tags?: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export type CallWithDetails = Call & {
  agent_name: string
  agent_platform_name: string
  company_id: string
  client_id?: string
  client_name?: string
  company_name: string
}

export type CallSummary = {
  total_calls: number
  total_duration_seconds: number
  total_cost_cents: number
  avg_duration_seconds: number
  avg_cost_cents: number
  success_rate: number
  by_type: Record<string, number>
  by_status: Record<string, number>
}

export type CallsChartDataPoint = {
  date: string
  [agentName: string]: string | number // Dynamic agent names as keys for call counts
}

export type UseCallsReturn = {
  // Loading states
  isLoading: boolean
  isLoadingByAgent: boolean
  isLoadingChart: boolean
  
  // Data
  allCalls: CallWithDetails[]
  callsById: Record<string, CallWithDetails[]>
  chartData: CallsChartDataPoint[]
  summary: CallSummary
  
  // Methods
  refresh: () => Promise<void>
  getCallsByAgentId: (agentId: string) => Promise<CallWithDetails[]>
  getChartData: (limit?: number, days?: number) => Promise<CallsChartDataPoint[]>
  getCallById: (callId: string) => Promise<CallWithDetails | null>
  
  // Computed values
  totalCalls: number
  totalCost: number
  totalDuration: number
  agentCount: number
  
  // Error handling
  error: string | null
}
