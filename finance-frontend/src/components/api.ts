// users
export interface UserResponse {
  id: number
  email: string
  username: string
}

export interface UsernameResponse {
  username: string
}

// vaults
export interface VaultResponse {
  id: number
  publicId: string
  ownerId: number
  name: string
}

// payments
export interface PaymentResponse {
  id: number
  payedAt: string
  paymentMethod: string
  description: string | null
  total: number
  currency: string
}

export interface PaymentCreateRequest {
  vaultId: number
  paymentMethod: string
  description: string | null
  price: number
  currency: string
}