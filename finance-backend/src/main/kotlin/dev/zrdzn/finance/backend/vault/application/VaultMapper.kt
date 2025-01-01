package dev.zrdzn.finance.backend.vault.application

import dev.zrdzn.finance.backend.user.application.response.UserResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultMemberResponse
import dev.zrdzn.finance.backend.vault.application.response.VaultResponse
import dev.zrdzn.finance.backend.vault.domain.Vault
import dev.zrdzn.finance.backend.vault.domain.VaultInvitation
import dev.zrdzn.finance.backend.vault.domain.VaultMember

object VaultMapper {

    fun Vault.toResponse() = VaultResponse(
        id = id!!,
        createdAt = createdAt,
        publicId = publicId,
        ownerId = ownerId,
        name = name,
        currency = currency,
        transactionMethod = transactionMethod
    )

    fun VaultInvitation.toResponse(vault: VaultResponse) = VaultInvitationResponse(
        id = id!!,
        vault = vault,
        userEmail = userEmail,
        expiresAt = expiresAt
    )

    fun VaultMember.toResponse(user: UserResponse) = VaultMemberResponse(
        id = id!!,
        vaultId = vaultId,
        user = user,
        vaultRole = vaultRole
    )

}