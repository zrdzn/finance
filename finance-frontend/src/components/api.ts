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

export interface PaymentProductWithProductResponse {
  id: number
  paymentId: number
  product: ProductResponse
  unitAmount: number
  quantity: number
}

export interface PaymentCreateRequest {
  vaultId: number
  paymentMethod: string
  description: string | null
  price: number
  currency: string
}

export interface PaymentProductCreateRequest {
  productId: number
  unitAmount: number
  quantity: number
}

export interface PaymentExpensesResponse {
  amount: number
  currency: string
}

export enum PaymentExpensesRange {
  Day = "DAY",
  Week = "WEEK",
  Month = "MONTH",
  Year = "YEAR",
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

// categories
export interface ProductResponse {
  id: number
  name: string
  vaultId: number
}

export interface CategoryCreateRequest {
  name: string
  vaultId: number
}