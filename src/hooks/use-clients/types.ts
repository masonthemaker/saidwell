export type ClientOrg = {
  id: string
  name: string
  company_id: string
  company_name?: string
  created_at?: string
  updated_at?: string
}

export type UseClientsReturn = {
  isLoading: boolean
  clients: ClientOrg[]
  error: string | null
  refresh: () => Promise<void>
}


