export type ClientOrg = {
  id: string
  name: string
  company_id: string
  company_name?: string
  user_count?: number
  created_at?: string
  updated_at?: string
}

export type CreateClientData = {
  name: string
  adminEmail?: string // Optional email to invite as client admin
}

export type UseClientsReturn = {
  isLoading: boolean
  isCreating: boolean
  clients: ClientOrg[]
  error: string | null
  refresh: () => Promise<void>
  addClient: (data: CreateClientData) => Promise<boolean>
}


