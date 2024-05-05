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