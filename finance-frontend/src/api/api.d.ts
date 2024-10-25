import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Components {
    namespace Schemas {
        export interface AccessTokenResponse {
            value: string;
            userId: number; // int32
            refreshTokenId: string;
            email: string;
            expiresAt: string; // date-time
        }
        export interface AuditListResponse {
            audits: AuditResponse[];
        }
        export interface AuditResponse {
            id: number; // int32
            createdAt: string; // date-time
            vault: VaultResponse;
            user: UserResponse;
            auditAction: "TRANSACTION_CREATED" | "TRANSACTION_UPDATED" | "TRANSACTION_DELETED" | "TRANSACTION_EXPORTED" | "TRANSACTION_PRODUCT_CREATED" | "CATEGORY_CREATED" | "CATEGORY_DELETED" | "PRODUCT_CREATED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED";
            description: string;
        }
        export interface AuthenticationDetailsResponse {
            email: string;
            username: string;
            verified: boolean;
        }
        export interface AuthenticationLoginRequest {
            email: string;
            password: string;
        }
        export interface AuthenticationRegisterResponse {
            userId: number; // int32
        }
        export interface CategoryCreateRequest {
            name: string;
            vaultId: number; // int32
        }
        export interface CategoryCreateResponse {
            id: number; // int32
        }
        export interface CategoryListResponse {
            categories: CategoryResponse[];
        }
        export interface CategoryResponse {
            id: number; // int32
            name: string;
            vaultId: number; // int32
        }
        export interface Price {
            amount: number;
            currency: string;
        }
        export interface ProductCreateRequest {
            name: string;
            vaultId: number; // int32
            categoryId?: number; // int32
        }
        export interface ProductCreateResponse {
            id: number; // int32
            name: string;
            vaultId: number; // int32
            categoryId?: number; // int32
        }
        export interface ProductListResponse {
            products: ProductResponse[];
        }
        export interface ProductResponse {
            id: number; // int32
            name: string;
            vaultId: number; // int32
            categoryId?: number; // int32
            categoryName?: string;
        }
        export interface ProductUpdateRequest {
            categoryId?: number; // int32
        }
        export interface TransactionAmountResponse {
            amount: number; // int32
        }
        export interface TransactionCreateRequest {
            vaultId: number; // int32
            transactionMethod: "CARD" | "BLIK" | "CASH";
            transactionType: "INCOMING" | "OUTGOING";
            description?: string;
            price: number;
            currency: string;
        }
        export interface TransactionCreateResponse {
            id: number; // int32
        }
        export interface TransactionFlowsResponse {
            total: Price;
        }
        export interface TransactionListResponse {
            transactions: TransactionResponse[];
        }
        export interface TransactionProductCreateRequest {
            productId: number; // int32
            unitAmount: number;
            quantity: number; // int32
        }
        export interface TransactionProductCreateResponse {
            id: number; // int32
        }
        export interface TransactionProductListResponse {
            products: TransactionProductWithProductResponse[];
        }
        export interface TransactionProductWithProductResponse {
            id: number; // int32
            transactionId: number; // int32
            product: ProductResponse;
            unitAmount: number;
            quantity: number; // int32
        }
        export interface TransactionResponse {
            id: number; // int32
            createdAt: string; // date-time
            userId: number; // int32
            vaultId: number; // int32
            transactionMethod: "CARD" | "BLIK" | "CASH";
            transactionType: "INCOMING" | "OUTGOING";
            description?: string;
            totalInVaultCurrency: number;
            total: number;
            currency: string;
        }
        export interface TransactionUpdateRequest {
            transactionMethod: "CARD" | "BLIK" | "CASH";
            transactionType: "INCOMING" | "OUTGOING";
            description?: string;
            total: number;
            currency: string;
        }
        export interface Unit {
        }
        export interface UserCreateRequest {
            email: string;
            username: string;
            password: string;
        }
        export interface UserEmailUpdateRequest {
            securityCode: string;
            email: string;
        }
        export interface UserPasswordUpdateRequest {
            securityCode: string;
            oldPassword: string;
            newPassword: string;
        }
        export interface UserProfileUpdateRequest {
            username: string;
        }
        export interface UserResponse {
            id: number; // int32
            email: string;
            username: string;
            verified: boolean;
        }
        export interface UsernameResponse {
            username: string;
        }
        export interface VaultCreateRequest {
            name: string;
            currency: string;
            transactionMethod: "CARD" | "BLIK" | "CASH";
        }
        export interface VaultCreateResponse {
            id: number; // int32
            publicId: string;
        }
        export interface VaultInvitationCreateRequest {
            vaultId: number; // int32
            userEmail: string;
        }
        export interface VaultInvitationListResponse {
            vaultInvitations: VaultInvitationResponse[];
        }
        export interface VaultInvitationResponse {
            id: number; // int32
            vault: VaultResponse;
            userEmail: string;
            expiresAt: string; // date-time
        }
        export interface VaultListResponse {
            vaults: VaultResponse[];
        }
        export interface VaultMemberListResponse {
            vaultMembers: VaultMemberResponse[];
        }
        export interface VaultMemberResponse {
            id: number; // int32
            vaultId: number; // int32
            user: UserResponse;
            vaultRole: "OWNER" | "MANAGER" | "MEMBER";
        }
        export interface VaultMemberUpdateRequest {
            vaultRole: "OWNER" | "MANAGER" | "MEMBER";
        }
        export interface VaultResponse {
            id: number; // int32
            createdAt: string; // date-time
            publicId: string;
            ownerId: number; // int32
            name: string;
            currency: string;
            transactionMethod: "CARD" | "BLIK" | "CASH";
        }
        export interface VaultRoleResponse {
            name: string;
            weight: number; // int32
            permissions: ("DETAILS_READ" | "DELETE" | "AUDIT_READ" | "SETTINGS_READ" | "SETTINGS_UPDATE" | "TRANSACTION_CREATE" | "TRANSACTION_READ" | "TRANSACTION_UPDATE" | "TRANSACTION_DELETE" | "PRODUCT_CREATE" | "PRODUCT_READ" | "PRODUCT_UPDATE" | "PRODUCT_DELETE" | "CATEGORY_CREATE" | "CATEGORY_READ" | "CATEGORY_UPDATE" | "CATEGORY_DELETE" | "MEMBER_READ" | "MEMBER_UPDATE" | "MEMBER_REMOVE" | "MEMBER_INVITE_CREATE" | "MEMBER_INVITE_READ" | "MEMBER_INVITE_DELETE")[];
        }
        export interface VaultUpdateRequest {
            name: string;
            currency: string;
            transactionMethod: "CARD" | "BLIK" | "CASH";
        }
    }
}
declare namespace Paths {
    namespace AcceptVaultInvitation {
        namespace Parameters {
            export type InvitationId = number; // int32
        }
        export interface PathParameters {
            invitationId: Parameters.InvitationId /* int32 */;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace CreateCategory {
        export type RequestBody = Components.Schemas.CategoryCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.CategoryCreateResponse;
        }
    }
    namespace CreateProduct {
        export type RequestBody = Components.Schemas.ProductCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.ProductCreateResponse;
        }
    }
    namespace CreateTransaction {
        export type RequestBody = Components.Schemas.TransactionCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.TransactionCreateResponse;
        }
    }
    namespace CreateTransactionProduct {
        namespace Parameters {
            export type TransactionId = number; // int32
        }
        export interface PathParameters {
            transactionId: Parameters.TransactionId /* int32 */;
        }
        export type RequestBody = Components.Schemas.TransactionProductCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.TransactionProductCreateResponse;
        }
    }
    namespace CreateVault {
        export type RequestBody = Components.Schemas.VaultCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.VaultCreateResponse;
        }
    }
    namespace CreateVaultInvitation {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export type RequestBody = Components.Schemas.VaultInvitationCreateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace DeleteCategory {
        namespace Parameters {
            export type CategoryId = number; // int32
        }
        export interface PathParameters {
            categoryId: Parameters.CategoryId /* int32 */;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace DeleteProduct {
        namespace Parameters {
            export type ProductId = number; // int32
        }
        export interface PathParameters {
            productId: Parameters.ProductId /* int32 */;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace DeleteTransaction {
        namespace Parameters {
            export type TransactionId = number; // int32
        }
        export interface PathParameters {
            transactionId: Parameters.TransactionId /* int32 */;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace ExportTransactions {
        namespace Parameters {
            export type EndDate = string; // date-time
            export type StartDate = string; // date-time
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export interface QueryParameters {
            startDate: Parameters.StartDate /* date-time */;
            endDate: Parameters.EndDate /* date-time */;
        }
        namespace Responses {
            export type $200 = string;
        }
    }
    namespace GetAudits {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.AuditListResponse;
        }
    }
    namespace GetAuthenticationDetails {
        namespace Responses {
            export type $200 = Components.Schemas.AuthenticationDetailsResponse;
        }
    }
    namespace GetCategoriesByVaultId {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.CategoryListResponse;
        }
    }
    namespace GetCategoryById {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.CategoryResponse;
        }
    }
    namespace GetExpensesByVaultId {
        namespace Parameters {
            export type Currency = string;
            export type Start = string; // date-time
            export type TransactionType = "INCOMING" | "OUTGOING";
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export interface QueryParameters {
            transactionType?: Parameters.TransactionType;
            currency: Parameters.Currency;
            start: Parameters.Start /* date-time */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.TransactionFlowsResponse;
        }
    }
    namespace GetProductsByVaultId {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ProductListResponse;
        }
    }
    namespace GetTransactionProducts {
        namespace Parameters {
            export type TransactionId = number; // int32
        }
        export interface PathParameters {
            transactionId: Parameters.TransactionId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.TransactionProductListResponse;
        }
    }
    namespace GetTransactionsAmountByVaultId {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.TransactionAmountResponse;
        }
    }
    namespace GetTransactionsByVaultId {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.TransactionListResponse;
        }
    }
    namespace GetUsernameByUserId {
        namespace Parameters {
            export type UserId = number; // int32
        }
        export interface PathParameters {
            userId: Parameters.UserId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.UsernameResponse;
        }
    }
    namespace GetVaultByPublicId {
        namespace Parameters {
            export type VaultPublicId = string;
        }
        export interface PathParameters {
            vaultPublicId: Parameters.VaultPublicId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.VaultResponse;
        }
    }
    namespace GetVaultInvitations {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.VaultInvitationListResponse;
        }
    }
    namespace GetVaultInvitationsByUserEmail {
        namespace Parameters {
            export type UserEmail = string;
        }
        export interface PathParameters {
            userEmail: Parameters.UserEmail;
        }
        namespace Responses {
            export type $200 = Components.Schemas.VaultInvitationListResponse;
        }
    }
    namespace GetVaultMembers {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.VaultMemberListResponse;
        }
    }
    namespace GetVaultRole {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.VaultRoleResponse;
        }
    }
    namespace GetVaults {
        namespace Responses {
            export type $200 = Components.Schemas.VaultListResponse;
        }
    }
    namespace Login {
        export type RequestBody = Components.Schemas.AuthenticationLoginRequest;
        namespace Responses {
            export type $200 = Components.Schemas.AccessTokenResponse;
        }
    }
    namespace Logout {
        namespace Responses {
            export type $200 = Components.Schemas.Unit;
        }
    }
    namespace Register {
        export type RequestBody = Components.Schemas.UserCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.AuthenticationRegisterResponse;
        }
    }
    namespace RemoveVault {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace RemoveVaultInvitation {
        namespace Parameters {
            export type UserEmail = string;
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
            userEmail: Parameters.UserEmail;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace RemoveVaultMember {
        namespace Parameters {
            export type UserId = number; // int32
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
            userId: Parameters.UserId /* int32 */;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace RequestUserUpdate {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace RequestUserVerification {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateProduct {
        namespace Parameters {
            export type ProductId = number; // int32
        }
        export interface PathParameters {
            productId: Parameters.ProductId /* int32 */;
        }
        export type RequestBody = Components.Schemas.ProductUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateTransaction {
        namespace Parameters {
            export type TransactionId = number; // int32
        }
        export interface PathParameters {
            transactionId: Parameters.TransactionId /* int32 */;
        }
        export type RequestBody = Components.Schemas.TransactionUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateUserEmail {
        export type RequestBody = Components.Schemas.UserEmailUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateUserPassword {
        export type RequestBody = Components.Schemas.UserPasswordUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateUserProfile {
        export type RequestBody = Components.Schemas.UserProfileUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateVault {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export type RequestBody = Components.Schemas.VaultUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UpdateVaultMember {
        namespace Parameters {
            export type UserId = number; // int32
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
            userId: Parameters.UserId /* int32 */;
        }
        export type RequestBody = Components.Schemas.VaultMemberUpdateRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace VerifyUser {
        namespace Parameters {
            export type SecurityCode = string;
        }
        export interface QueryParameters {
            securityCode: Parameters.SecurityCode;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Unit;
        }
    }
}

export interface OperationMethods {
  /**
   * getVaultInvitations
   */
  'getVaultInvitations'(
    parameters: Parameters<Paths.GetVaultInvitations.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVaultInvitations.Responses.$200>
  /**
   * createVaultInvitation
   */
  'createVaultInvitation'(
    parameters: Parameters<Paths.CreateVaultInvitation.PathParameters>,
    data?: Paths.CreateVaultInvitation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateVaultInvitation.Responses.$200>
  /**
   * acceptVaultInvitation
   */
  'acceptVaultInvitation'(
    parameters: Parameters<Paths.AcceptVaultInvitation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AcceptVaultInvitation.Responses.$200>
  /**
   * createVault
   */
  'createVault'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateVault.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateVault.Responses.$200>
  /**
   * createTransactionProduct
   */
  'createTransactionProduct'(
    parameters: Parameters<Paths.CreateTransactionProduct.PathParameters>,
    data?: Paths.CreateTransactionProduct.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateTransactionProduct.Responses.$200>
  /**
   * createTransaction
   */
  'createTransaction'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateTransaction.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateTransaction.Responses.$200>
  /**
   * createProduct
   */
  'createProduct'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateProduct.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateProduct.Responses.$200>
  /**
   * createCategory
   */
  'createCategory'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateCategory.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateCategory.Responses.$200>
  /**
   * register
   */
  'register'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Register.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Register.Responses.$200>
  /**
   * logout
   */
  'logout'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Logout.Responses.$200>
  /**
   * login
   */
  'login'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Login.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Login.Responses.$200>
  /**
   * updateVault
   */
  'updateVault'(
    parameters: Parameters<Paths.UpdateVault.PathParameters>,
    data?: Paths.UpdateVault.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateVault.Responses.$200>
  /**
   * removeVault
   */
  'removeVault'(
    parameters: Parameters<Paths.RemoveVault.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RemoveVault.Responses.$200>
  /**
   * updateVaultMember
   */
  'updateVaultMember'(
    parameters: Parameters<Paths.UpdateVaultMember.PathParameters>,
    data?: Paths.UpdateVaultMember.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateVaultMember.Responses.$200>
  /**
   * removeVaultMember
   */
  'removeVaultMember'(
    parameters: Parameters<Paths.RemoveVaultMember.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RemoveVaultMember.Responses.$200>
  /**
   * updateUserPassword
   */
  'updateUserPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateUserPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateUserPassword.Responses.$200>
  /**
   * updateUserEmail
   */
  'updateUserEmail'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateUserEmail.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateUserEmail.Responses.$200>
  /**
   * updateUserProfile
   */
  'updateUserProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateUserProfile.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateUserProfile.Responses.$200>
  /**
   * updateTransaction
   */
  'updateTransaction'(
    parameters: Parameters<Paths.UpdateTransaction.PathParameters>,
    data?: Paths.UpdateTransaction.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateTransaction.Responses.$200>
  /**
   * deleteTransaction
   */
  'deleteTransaction'(
    parameters: Parameters<Paths.DeleteTransaction.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteTransaction.Responses.$200>
  /**
   * updateProduct
   */
  'updateProduct'(
    parameters: Parameters<Paths.UpdateProduct.PathParameters>,
    data?: Paths.UpdateProduct.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateProduct.Responses.$200>
  /**
   * deleteProduct
   */
  'deleteProduct'(
    parameters: Parameters<Paths.DeleteProduct.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteProduct.Responses.$200>
  /**
   * getVaults
   */
  'getVaults'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVaults.Responses.$200>
  /**
   * getVaultByPublicId
   */
  'getVaultByPublicId'(
    parameters: Parameters<Paths.GetVaultByPublicId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVaultByPublicId.Responses.$200>
  /**
   * getVaultRole
   */
  'getVaultRole'(
    parameters: Parameters<Paths.GetVaultRole.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVaultRole.Responses.$200>
  /**
   * getVaultMembers
   */
  'getVaultMembers'(
    parameters: Parameters<Paths.GetVaultMembers.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVaultMembers.Responses.$200>
  /**
   * getVaultInvitationsByUserEmail
   */
  'getVaultInvitationsByUserEmail'(
    parameters: Parameters<Paths.GetVaultInvitationsByUserEmail.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetVaultInvitationsByUserEmail.Responses.$200>
  /**
   * getUsernameByUserId
   */
  'getUsernameByUserId'(
    parameters: Parameters<Paths.GetUsernameByUserId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUsernameByUserId.Responses.$200>
  /**
   * verifyUser
   */
  'verifyUser'(
    parameters?: Parameters<Paths.VerifyUser.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.VerifyUser.Responses.$200>
  /**
   * requestUserVerification
   */
  'requestUserVerification'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RequestUserVerification.Responses.$200>
  /**
   * requestUserUpdate
   */
  'requestUserUpdate'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RequestUserUpdate.Responses.$200>
  /**
   * getTransactionsByVaultId
   */
  'getTransactionsByVaultId'(
    parameters: Parameters<Paths.GetTransactionsByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTransactionsByVaultId.Responses.$200>
  /**
   * getExpensesByVaultId
   */
  'getExpensesByVaultId'(
    parameters: Parameters<Paths.GetExpensesByVaultId.QueryParameters & Paths.GetExpensesByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetExpensesByVaultId.Responses.$200>
  /**
   * exportTransactions
   */
  'exportTransactions'(
    parameters: Parameters<Paths.ExportTransactions.QueryParameters & Paths.ExportTransactions.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ExportTransactions.Responses.$200>
  /**
   * getTransactionsAmountByVaultId
   */
  'getTransactionsAmountByVaultId'(
    parameters: Parameters<Paths.GetTransactionsAmountByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTransactionsAmountByVaultId.Responses.$200>
  /**
   * getTransactionProducts
   */
  'getTransactionProducts'(
    parameters: Parameters<Paths.GetTransactionProducts.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTransactionProducts.Responses.$200>
  /**
   * getProductsByVaultId
   */
  'getProductsByVaultId'(
    parameters: Parameters<Paths.GetProductsByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetProductsByVaultId.Responses.$200>
  /**
   * getCategoryById
   */
  'getCategoryById'(
    parameters: Parameters<Paths.GetCategoryById.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCategoryById.Responses.$200>
  /**
   * getCategoriesByVaultId
   */
  'getCategoriesByVaultId'(
    parameters: Parameters<Paths.GetCategoriesByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCategoriesByVaultId.Responses.$200>
  /**
   * getAuthenticationDetails
   */
  'getAuthenticationDetails'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAuthenticationDetails.Responses.$200>
  /**
   * getAudits
   */
  'getAudits'(
    parameters: Parameters<Paths.GetAudits.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetAudits.Responses.$200>
  /**
   * removeVaultInvitation
   */
  'removeVaultInvitation'(
    parameters: Parameters<Paths.RemoveVaultInvitation.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RemoveVaultInvitation.Responses.$200>
  /**
   * deleteCategory
   */
  'deleteCategory'(
    parameters: Parameters<Paths.DeleteCategory.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteCategory.Responses.$200>
}

export interface PathsDictionary {
  ['/api/vaults/{vaultId}/invitations']: {
    /**
     * getVaultInvitations
     */
    'get'(
      parameters: Parameters<Paths.GetVaultInvitations.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVaultInvitations.Responses.$200>
    /**
     * createVaultInvitation
     */
    'post'(
      parameters: Parameters<Paths.CreateVaultInvitation.PathParameters>,
      data?: Paths.CreateVaultInvitation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateVaultInvitation.Responses.$200>
  }
  ['/api/vaults/invitations/{invitationId}/accept']: {
    /**
     * acceptVaultInvitation
     */
    'post'(
      parameters: Parameters<Paths.AcceptVaultInvitation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AcceptVaultInvitation.Responses.$200>
  }
  ['/api/vaults/create']: {
    /**
     * createVault
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateVault.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateVault.Responses.$200>
  }
  ['/api/transactions/{transactionId}/products/create']: {
    /**
     * createTransactionProduct
     */
    'post'(
      parameters: Parameters<Paths.CreateTransactionProduct.PathParameters>,
      data?: Paths.CreateTransactionProduct.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateTransactionProduct.Responses.$200>
  }
  ['/api/transactions/create']: {
    /**
     * createTransaction
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateTransaction.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateTransaction.Responses.$200>
  }
  ['/api/products/create']: {
    /**
     * createProduct
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateProduct.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateProduct.Responses.$200>
  }
  ['/api/categories/create']: {
    /**
     * createCategory
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateCategory.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateCategory.Responses.$200>
  }
  ['/api/authentication/register']: {
    /**
     * register
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Register.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Register.Responses.$200>
  }
  ['/api/authentication/logout']: {
    /**
     * logout
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Logout.Responses.$200>
  }
  ['/api/authentication/login']: {
    /**
     * login
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Login.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Login.Responses.$200>
  }
  ['/api/vaults/{vaultId}']: {
    /**
     * removeVault
     */
    'delete'(
      parameters: Parameters<Paths.RemoveVault.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RemoveVault.Responses.$200>
    /**
     * updateVault
     */
    'patch'(
      parameters: Parameters<Paths.UpdateVault.PathParameters>,
      data?: Paths.UpdateVault.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateVault.Responses.$200>
  }
  ['/api/vaults/{vaultId}/members/{userId}']: {
    /**
     * removeVaultMember
     */
    'delete'(
      parameters: Parameters<Paths.RemoveVaultMember.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RemoveVaultMember.Responses.$200>
    /**
     * updateVaultMember
     */
    'patch'(
      parameters: Parameters<Paths.UpdateVaultMember.PathParameters>,
      data?: Paths.UpdateVaultMember.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateVaultMember.Responses.$200>
  }
  ['/api/users/update/password']: {
    /**
     * updateUserPassword
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateUserPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateUserPassword.Responses.$200>
  }
  ['/api/users/update/email']: {
    /**
     * updateUserEmail
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateUserEmail.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateUserEmail.Responses.$200>
  }
  ['/api/users/profile']: {
    /**
     * updateUserProfile
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateUserProfile.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateUserProfile.Responses.$200>
  }
  ['/api/transactions/{transactionId}']: {
    /**
     * deleteTransaction
     */
    'delete'(
      parameters: Parameters<Paths.DeleteTransaction.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteTransaction.Responses.$200>
    /**
     * updateTransaction
     */
    'patch'(
      parameters: Parameters<Paths.UpdateTransaction.PathParameters>,
      data?: Paths.UpdateTransaction.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateTransaction.Responses.$200>
  }
  ['/api/products/{productId}']: {
    /**
     * deleteProduct
     */
    'delete'(
      parameters: Parameters<Paths.DeleteProduct.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteProduct.Responses.$200>
    /**
     * updateProduct
     */
    'patch'(
      parameters: Parameters<Paths.UpdateProduct.PathParameters>,
      data?: Paths.UpdateProduct.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateProduct.Responses.$200>
  }
  ['/api/vaults']: {
    /**
     * getVaults
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVaults.Responses.$200>
  }
  ['/api/vaults/{vaultPublicId}']: {
    /**
     * getVaultByPublicId
     */
    'get'(
      parameters: Parameters<Paths.GetVaultByPublicId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVaultByPublicId.Responses.$200>
  }
  ['/api/vaults/{vaultId}/role']: {
    /**
     * getVaultRole
     */
    'get'(
      parameters: Parameters<Paths.GetVaultRole.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVaultRole.Responses.$200>
  }
  ['/api/vaults/{vaultId}/members']: {
    /**
     * getVaultMembers
     */
    'get'(
      parameters: Parameters<Paths.GetVaultMembers.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVaultMembers.Responses.$200>
  }
  ['/api/vaults/invitations/{userEmail}']: {
    /**
     * getVaultInvitationsByUserEmail
     */
    'get'(
      parameters: Parameters<Paths.GetVaultInvitationsByUserEmail.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetVaultInvitationsByUserEmail.Responses.$200>
  }
  ['/api/users/{userId}/username']: {
    /**
     * getUsernameByUserId
     */
    'get'(
      parameters: Parameters<Paths.GetUsernameByUserId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUsernameByUserId.Responses.$200>
  }
  ['/api/users/verify']: {
    /**
     * verifyUser
     */
    'get'(
      parameters?: Parameters<Paths.VerifyUser.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.VerifyUser.Responses.$200>
  }
  ['/api/users/verify/request']: {
    /**
     * requestUserVerification
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RequestUserVerification.Responses.$200>
  }
  ['/api/users/update/request']: {
    /**
     * requestUserUpdate
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RequestUserUpdate.Responses.$200>
  }
  ['/api/transactions/{vaultId}']: {
    /**
     * getTransactionsByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetTransactionsByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTransactionsByVaultId.Responses.$200>
  }
  ['/api/transactions/{vaultId}/flows']: {
    /**
     * getExpensesByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetExpensesByVaultId.QueryParameters & Paths.GetExpensesByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetExpensesByVaultId.Responses.$200>
  }
  ['/api/transactions/{vaultId}/export']: {
    /**
     * exportTransactions
     */
    'get'(
      parameters: Parameters<Paths.ExportTransactions.QueryParameters & Paths.ExportTransactions.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ExportTransactions.Responses.$200>
  }
  ['/api/transactions/{vaultId}/amount']: {
    /**
     * getTransactionsAmountByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetTransactionsAmountByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTransactionsAmountByVaultId.Responses.$200>
  }
  ['/api/transactions/{transactionId}/products']: {
    /**
     * getTransactionProducts
     */
    'get'(
      parameters: Parameters<Paths.GetTransactionProducts.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTransactionProducts.Responses.$200>
  }
  ['/api/products/{vaultId}']: {
    /**
     * getProductsByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetProductsByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetProductsByVaultId.Responses.$200>
  }
  ['/api/categories/{id}']: {
    /**
     * getCategoryById
     */
    'get'(
      parameters: Parameters<Paths.GetCategoryById.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCategoryById.Responses.$200>
  }
  ['/api/categories/vault/{vaultId}']: {
    /**
     * getCategoriesByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetCategoriesByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCategoriesByVaultId.Responses.$200>
  }
  ['/api/authentication/details']: {
    /**
     * getAuthenticationDetails
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAuthenticationDetails.Responses.$200>
  }
  ['/api/audits/{vaultId}']: {
    /**
     * getAudits
     */
    'get'(
      parameters: Parameters<Paths.GetAudits.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetAudits.Responses.$200>
  }
  ['/api/vaults/{vaultId}/invitations/{userEmail}']: {
    /**
     * removeVaultInvitation
     */
    'delete'(
      parameters: Parameters<Paths.RemoveVaultInvitation.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RemoveVaultInvitation.Responses.$200>
  }
  ['/api/categories/{categoryId}']: {
    /**
     * deleteCategory
     */
    'delete'(
      parameters: Parameters<Paths.DeleteCategory.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteCategory.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>