import {SingleValue} from "react-select"

// global
export type SelectOptionProperties = {value: string, label: string}
export type SelectProperties = SingleValue<SelectOptionProperties>

export enum AnalyticsOverviewStatisticType {
  Balance = "BALANCE",
  Income = "INCOME",
  Expenses = "EXPENSES",
  Transactions = "TRANSACTIONS"
}

export enum AccountUpdateType {
  Email = "EMAIL",
  Password = "PASSWORD"
}

// users
export interface UserResponse {
  id: number
  email: string
  username: string
  verified: boolean
}

export interface UsernameResponse {
  username: string
}

export interface UserEmailUpdateRequest {
  securityCode: string
  email: string
}

export interface UserPasswordUpdateRequest {
  securityCode: string
  oldPassword: string
  newPassword: string
}

export interface UserProfileUpdateRequest {
  username: string
}

// vaults
export interface VaultResponse {
  id: number
  createdAt: number
  publicId: string
  ownerId: number
  name: string
  currency: string
  transactionMethod: string
}

export interface VaultMemberUpdateRequest {
  vaultRole: string
}

export interface VaultMemberResponse {
  id: number
  vaultId: number
  user: UserResponse
  vaultRole: string
}

export interface VaultInvitationResponse {
  id: number
  vault: VaultResponse
  userEmail: string,
  expiresAt: number
}

export interface VaultCreateRequest {
  name: string
  currency: string
  transactionMethod: string
}

export interface VaultUpdateRequest {
  name: string
  currency: string
  transactionMethod: string
}

export interface VaultInvitationCreateRequest {
  vaultId: number
  userEmail: string
}

export interface VaultRoleResponse {
  name: string
  weight: number
  permissions: string[]
}

// transactions
export enum TransactionType {
  Incoming = "INCOMING",
  Outgoing = "OUTGOING"
}

export interface TransactionResponse {
  id: number
  createdAt: number
  transactionMethod: string
  transactionType: string
  description: string | null
  totalInVaultCurrency: number
  total: number
  currency: string
}

export interface TransactionProductWithProductResponse {
  id: number
  transactionId: number
  product: ProductResponse
  unitAmount: number
  quantity: number
}

export interface TransactionCreateRequest {
  vaultId: number
  transactionMethod: string
  transactionType: string
  description: string | null
  price: number
  currency: string
}

export interface TransactionUpdateRequest {
  transactionMethod: string
  transactionType: string
  description: string | null
  total: number
  currency: string
}

export interface TransactionProductCreateRequest {
  productId: number
  unitAmount: number
  quantity: number
}

export interface TransactionFlowsResponse {
  amount: number
  currency: string
}

export enum TransactionFlowsRange {
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
  categoryName: string | null
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
export interface CategoryResponse {
  id: number
  name: string
  vaultId: number
}

export interface CategoryCreateRequest {
  name: string
  vaultId: number
}

// authentication
export interface AuthenticationDetails {
  email: string
  username: string
  verified: boolean
}

// audits
export interface AuditResponse {
  id: number
  createdAt: number
  vault: VaultResponse
  user: UserResponse
  auditAction: string
  description: string
}