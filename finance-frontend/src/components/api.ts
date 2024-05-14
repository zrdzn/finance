import {SingleValue} from "react-select"

// global
export type SelectOptionProperties = {value: string, label: string}
export type SelectProperties = SingleValue<SelectOptionProperties>

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

// products
export interface ProductResponse {
  id: number
  name: string
  vaultId: number
  categoryId: number | null
}

export interface ProductCreateRequest {
  name: string
  vaultId: number
  categoryId: number | null
}

export interface ProductUpdateRequest {
  categoryId: number | null
}

// product prices
export interface ProductPriceResponse {
  id: number
  productId: number
  price: {
    amount: number
    currency: string
  }
}

export interface ProductPriceCreateRequest {
  unitAmount: number
  currency: string
}

// categories
export interface CategoryResponse {
  id: number
  name: string
  vaultId: number
}

export interface CategoryCreateRequest {
  name: string
  vaultId: number
}