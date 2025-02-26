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
        export interface AnalysedTransactionProductResponse {
            name: string;
            unitAmount: number;
            quantity: number; // int32
        }
        export interface AnalysedTransactionResponse {
            transactionMethod: "CARD" | "BLIK" | "CASH";
            products: AnalysedTransactionProductResponse[];
            description: string;
            total: number;
            currency: string;
        }
        export interface AuditListResponse {
            audits: AuditResponse[];
        }
        export interface AuditResponse {
            id: number; // int32
            createdAt: string; // date-time
            vault: VaultResponse;
            user: UserResponse;
            auditAction: "TRANSACTION_CREATED" | "TRANSACTION_UPDATED" | "TRANSACTION_DELETED" | "TRANSACTION_IMPORTED" | "TRANSACTION_EXPORTED" | "TRANSACTION_PRODUCT_CREATED" | "SCHEDULE_CREATED" | "SCHEDULE_DELETED" | "CATEGORY_CREATED" | "CATEGORY_DELETED" | "PRODUCT_CREATED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED";
            description: string;
        }
        export interface AuthenticationLoginRequest {
            email: string;
            password: string;
            oneTimePassword?: string;
        }
        export interface CategoryCreateRequest {
            name: string;
            vaultId: number; // int32
        }
        export interface CategoryListResponse {
            categories: CategoryResponse[];
        }
        export interface CategoryResponse {
            id: number; // int32
            name: string;
            vaultId: number; // int32
        }
        export interface ConfigurationResponse {
            aiEnabled: boolean;
        }
        export interface FlowsChartResponse {
            categories: string[];
            series: FlowsChartSeries[];
        }
        export interface FlowsChartSeries {
            name: string;
            data: number[];
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
        export interface ScheduleCreateRequest {
            description: string;
            interval: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
            amount: number; // int32
        }
        export interface ScheduleListResponse {
            schedules: ScheduleResponse[];
        }
        export interface ScheduleResponse {
            id: number; // int32
            transactionId: number; // int32
            description: string;
            nextExecution: string; // date-time
            interval: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
            amount: number; // int32
        }
        export interface TransactionAmountResponse {
            amount: number; // int32
        }
        export interface TransactionCreateRequest {
            vaultId: number; // int32
            transactionMethod: "CARD" | "BLIK" | "CASH";
            transactionType: "INCOMING" | "OUTGOING";
            description: string;
            price: number;
            currency: string;
            products: TransactionProductCreateRequest[];
        }
        export interface TransactionFlowsResponse {
            total: Price;
            count: TransactionAmountResponse;
        }
        export interface TransactionListResponse {
            transactions: TransactionResponse[];
        }
        export interface TransactionProductCreateRequest {
            name: string;
            categoryId?: number; // int32
            unitAmount: number;
            quantity: number; // int32
        }
        export interface TransactionProductListResponse {
            products: TransactionProductResponse[];
        }
        export interface TransactionProductResponse {
            id: number; // int32
            transactionId: number; // int32
            name: string;
            categoryName?: string;
            unitAmount: number;
            quantity: number; // int32
        }
        export interface TransactionResponse {
            id: number; // int32
            createdAt: string; // date-time
            user: UserResponse;
            vaultId: number; // int32
            transactionMethod: "CARD" | "BLIK" | "CASH";
            transactionType: "INCOMING" | "OUTGOING";
            products: TransactionProductListResponse;
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
        export interface TwoFactorSetupRequest {
            securityCode: string;
        }
        export interface TwoFactorSetupResponse {
            qrCodeImage: string;
            secret: string;
        }
        export interface TwoFactorVerifyRequest {
            secret: string;
            oneTimePassword: string;
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
            decimalSeparator: string;
            groupSeparator: string;
        }
        export interface UserResponse {
            id: number; // int32
            email: string;
            username: string;
            verified: boolean;
            isTwoFactorEnabled: boolean;
            decimalSeparator: string;
            groupSeparator: string;
        }
        export interface UsernameResponse {
            username: string;
        }
        export interface VaultCreateRequest {
            name: string;
            currency: string;
            transactionMethod: "CARD" | "BLIK" | "CASH";
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
            permissions: ("DETAILS_READ" | "DELETE" | "AUDIT_READ" | "SETTINGS_READ" | "SETTINGS_UPDATE" | "TRANSACTION_CREATE" | "TRANSACTION_READ" | "TRANSACTION_UPDATE" | "TRANSACTION_DELETE" | "SCHEDULE_CREATE" | "SCHEDULE_READ" | "SCHEDULE_DELETE" | "PRODUCT_CREATE" | "PRODUCT_READ" | "PRODUCT_UPDATE" | "PRODUCT_DELETE" | "CATEGORY_CREATE" | "CATEGORY_READ" | "CATEGORY_UPDATE" | "CATEGORY_DELETE" | "MEMBER_READ" | "MEMBER_UPDATE" | "MEMBER_REMOVE" | "MEMBER_INVITE_CREATE" | "MEMBER_INVITE_READ" | "MEMBER_INVITE_DELETE")[];
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
    namespace AnalyzeImage {
        export interface RequestBody {
            file: string; // binary
        }
        namespace Responses {
            export type $200 = Components.Schemas.AnalysedTransactionResponse;
        }
    }
    namespace CreateCategory {
        export type RequestBody = Components.Schemas.CategoryCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.CategoryResponse;
        }
    }
    namespace CreateProduct {
        export type RequestBody = Components.Schemas.ProductCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.ProductResponse;
        }
    }
    namespace CreateSchedule {
        namespace Parameters {
            export type TransactionId = number; // int32
        }
        export interface PathParameters {
            transactionId: Parameters.TransactionId /* int32 */;
        }
        export type RequestBody = Components.Schemas.ScheduleCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.ScheduleResponse;
        }
    }
    namespace CreateTransaction {
        export type RequestBody = Components.Schemas.TransactionCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.TransactionResponse;
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
            export type $200 = Components.Schemas.TransactionProductResponse;
        }
    }
    namespace CreateVault {
        export type RequestBody = Components.Schemas.VaultCreateRequest;
        namespace Responses {
            export type $200 = Components.Schemas.VaultResponse;
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
            export type $200 = Components.Schemas.VaultInvitationResponse;
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
    namespace DeleteScheduleById {
        namespace Parameters {
            export type ScheduleId = number; // int32
        }
        export interface PathParameters {
            scheduleId: Parameters.ScheduleId /* int32 */;
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
            export type $200 = Components.Schemas.UserResponse;
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
            export type CategoryId = number; // int32
        }
        export interface PathParameters {
            categoryId: Parameters.CategoryId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.CategoryResponse;
        }
    }
    namespace GetConfiguration {
        namespace Responses {
            export type $200 = Components.Schemas.ConfigurationResponse;
        }
    }
    namespace GetFlowsByVaultId {
        namespace Parameters {
            export type Start = string; // date-time
            export type TransactionType = "INCOMING" | "OUTGOING";
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export interface QueryParameters {
            transactionType?: Parameters.TransactionType;
            start: Parameters.Start /* date-time */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.TransactionFlowsResponse;
        }
    }
    namespace GetFlowsChart {
        namespace Parameters {
            export type TransactionType = "INCOMING" | "OUTGOING";
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export interface QueryParameters {
            transactionType?: Parameters.TransactionType;
        }
        namespace Responses {
            export type $200 = Components.Schemas.FlowsChartResponse;
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
    namespace GetSchedulesByVaultId {
        namespace Parameters {
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ScheduleListResponse;
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
    namespace GetUserAvatar {
        namespace Parameters {
            export type Username = string;
        }
        export interface PathParameters {
            username: Parameters.Username;
        }
        namespace Responses {
            export type $200 = string; // binary
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
    namespace ImportTransactionsFromCsv {
        namespace Parameters {
            export type ApplyTransactionMethod = "CARD" | "BLIK" | "CASH";
            export type Mappings = string;
            export type Separator = string;
            export type VaultId = number; // int32
        }
        export interface PathParameters {
            vaultId: Parameters.VaultId /* int32 */;
        }
        export interface QueryParameters {
            mappings: Parameters.Mappings;
            separator: Parameters.Separator;
            applyTransactionMethod?: Parameters.ApplyTransactionMethod;
        }
        export interface RequestBody {
            file: string; // binary
        }
        namespace Responses {
            export interface $200 {
            }
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
            export type $200 = Components.Schemas.UserResponse;
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
    namespace RequestUserTwoFactorSetup {
        export type RequestBody = Components.Schemas.TwoFactorSetupRequest;
        namespace Responses {
            export type $200 = Components.Schemas.TwoFactorSetupResponse;
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
    namespace UpdateUserAvatar {
        export interface RequestBody {
            avatar: string; // binary
        }
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
    namespace VerifyUserTwoFactorSetup {
        export type RequestBody = Components.Schemas.TwoFactorVerifyRequest;
        namespace Responses {
            export interface $200 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * updateUserAvatar
   */
  'updateUserAvatar'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateUserAvatar.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UpdateUserAvatar.Responses.$200>
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
   * requestUserTwoFactorSetup
   */
  'requestUserTwoFactorSetup'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.RequestUserTwoFactorSetup.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.RequestUserTwoFactorSetup.Responses.$200>
  /**
   * verifyUserTwoFactorSetup
   */
  'verifyUserTwoFactorSetup'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.VerifyUserTwoFactorSetup.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.VerifyUserTwoFactorSetup.Responses.$200>
  /**
   * importTransactionsFromCsv
   */
  'importTransactionsFromCsv'(
    parameters: Parameters<Paths.ImportTransactionsFromCsv.QueryParameters & Paths.ImportTransactionsFromCsv.PathParameters>,
    data?: Paths.ImportTransactionsFromCsv.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ImportTransactionsFromCsv.Responses.$200>
  /**
   * createSchedule
   */
  'createSchedule'(
    parameters: Parameters<Paths.CreateSchedule.PathParameters>,
    data?: Paths.CreateSchedule.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateSchedule.Responses.$200>
  /**
   * createTransactionProduct
   */
  'createTransactionProduct'(
    parameters: Parameters<Paths.CreateTransactionProduct.PathParameters>,
    data?: Paths.CreateTransactionProduct.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.CreateTransactionProduct.Responses.$200>
  /**
   * analyzeImage
   */
  'analyzeImage'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AnalyzeImage.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AnalyzeImage.Responses.$200>
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
   * getUserAvatar
   */
  'getUserAvatar'(
    parameters: Parameters<Paths.GetUserAvatar.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetUserAvatar.Responses.$200>
  /**
   * getTransactionsByVaultId
   */
  'getTransactionsByVaultId'(
    parameters: Parameters<Paths.GetTransactionsByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTransactionsByVaultId.Responses.$200>
  /**
   * getFlowsByVaultId
   */
  'getFlowsByVaultId'(
    parameters: Parameters<Paths.GetFlowsByVaultId.QueryParameters & Paths.GetFlowsByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetFlowsByVaultId.Responses.$200>
  /**
   * getFlowsChart
   */
  'getFlowsChart'(
    parameters: Parameters<Paths.GetFlowsChart.QueryParameters & Paths.GetFlowsChart.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetFlowsChart.Responses.$200>
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
   * getSchedulesByVaultId
   */
  'getSchedulesByVaultId'(
    parameters: Parameters<Paths.GetSchedulesByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSchedulesByVaultId.Responses.$200>
  /**
   * getProductsByVaultId
   */
  'getProductsByVaultId'(
    parameters: Parameters<Paths.GetProductsByVaultId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetProductsByVaultId.Responses.$200>
  /**
   * getConfiguration
   */
  'getConfiguration'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetConfiguration.Responses.$200>
  /**
   * getCategoryById
   */
  'getCategoryById'(
    parameters: Parameters<Paths.GetCategoryById.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCategoryById.Responses.$200>
  /**
   * deleteCategory
   */
  'deleteCategory'(
    parameters: Parameters<Paths.DeleteCategory.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteCategory.Responses.$200>
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
   * deleteScheduleById
   */
  'deleteScheduleById'(
    parameters: Parameters<Paths.DeleteScheduleById.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteScheduleById.Responses.$200>
}

export interface PathsDictionary {
  ['/api/users/avatar']: {
    /**
     * updateUserAvatar
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateUserAvatar.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UpdateUserAvatar.Responses.$200>
  }
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
  ['/api/users/2fa/setup']: {
    /**
     * requestUserTwoFactorSetup
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.RequestUserTwoFactorSetup.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.RequestUserTwoFactorSetup.Responses.$200>
  }
  ['/api/users/2fa/setup/verify']: {
    /**
     * verifyUserTwoFactorSetup
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.VerifyUserTwoFactorSetup.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.VerifyUserTwoFactorSetup.Responses.$200>
  }
  ['/api/transactions/{vaultId}/import/csv']: {
    /**
     * importTransactionsFromCsv
     */
    'post'(
      parameters: Parameters<Paths.ImportTransactionsFromCsv.QueryParameters & Paths.ImportTransactionsFromCsv.PathParameters>,
      data?: Paths.ImportTransactionsFromCsv.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ImportTransactionsFromCsv.Responses.$200>
  }
  ['/api/transactions/{transactionId}/schedule/create']: {
    /**
     * createSchedule
     */
    'post'(
      parameters: Parameters<Paths.CreateSchedule.PathParameters>,
      data?: Paths.CreateSchedule.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.CreateSchedule.Responses.$200>
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
  ['/api/transactions/image-analysis']: {
    /**
     * analyzeImage
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AnalyzeImage.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AnalyzeImage.Responses.$200>
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
  ['/api/users/avatar/{username}']: {
    /**
     * getUserAvatar
     */
    'get'(
      parameters: Parameters<Paths.GetUserAvatar.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetUserAvatar.Responses.$200>
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
     * getFlowsByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetFlowsByVaultId.QueryParameters & Paths.GetFlowsByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetFlowsByVaultId.Responses.$200>
  }
  ['/api/transactions/{vaultId}/flows/chart']: {
    /**
     * getFlowsChart
     */
    'get'(
      parameters: Parameters<Paths.GetFlowsChart.QueryParameters & Paths.GetFlowsChart.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetFlowsChart.Responses.$200>
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
  ['/api/transactions/schedules/{vaultId}']: {
    /**
     * getSchedulesByVaultId
     */
    'get'(
      parameters: Parameters<Paths.GetSchedulesByVaultId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSchedulesByVaultId.Responses.$200>
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
  ['/api/config']: {
    /**
     * getConfiguration
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetConfiguration.Responses.$200>
  }
  ['/api/categories/{categoryId}']: {
    /**
     * getCategoryById
     */
    'get'(
      parameters: Parameters<Paths.GetCategoryById.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCategoryById.Responses.$200>
    /**
     * deleteCategory
     */
    'delete'(
      parameters: Parameters<Paths.DeleteCategory.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteCategory.Responses.$200>
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
  ['/api/transactions/schedules/{scheduleId}']: {
    /**
     * deleteScheduleById
     */
    'delete'(
      parameters: Parameters<Paths.DeleteScheduleById.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteScheduleById.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
