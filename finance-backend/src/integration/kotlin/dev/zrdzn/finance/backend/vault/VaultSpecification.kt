package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.authentication.AuthenticationSpecification
import dev.zrdzn.finance.backend.transaction.TransactionMethod
import dev.zrdzn.finance.backend.vault.dto.VaultResponse
import dev.zrdzn.finance.backend.vault.dto.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.dto.VaultMemberResponse

open class VaultSpecification : AuthenticationSpecification() {

    protected val vaultService: VaultService get() = application.getBean(VaultService::class.java)
    protected val vaultRepository: VaultRepository get() = application.getBean(VaultRepository::class.java)
    protected val vaultInvitationRepository: VaultInvitationRepository
        get() = application.getBean(
            VaultInvitationRepository::class.java)
    protected val vaultMemberRepository: VaultMemberRepository get() = application.getBean(VaultMemberRepository::class.java)

    protected fun createVault(
        ownerId: Int,
        name: String = "Test Vault",
        currency: String = "PLN",
        defaultTransactionMethod: TransactionMethod = TransactionMethod.CARD
    ): VaultResponse =
        vaultService.createVault(
            ownerId = ownerId,
            name = name,
            currency = currency,
            defaultTransactionMethod = defaultTransactionMethod
        )

    protected fun createVaultInvitation(
        vaultId: Int,
        requesterId: Int,
        userEmail: String
    ): VaultInvitationResponse =
        vaultService.createVaultInvitation(
            vaultId = vaultId,
            requesterId = requesterId,
            userEmail = userEmail
        )

    protected fun createVaultMember(
        vaultId: Int,
        userId: Int,
        vaultRole: VaultRole
    ): VaultMemberResponse =
        vaultService.createVaultMemberForcefully(
            vaultId = vaultId,
            userId = userId,
            vaultRole = vaultRole
        )

}