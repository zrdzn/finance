package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.user.dto.UserResponse
import dev.zrdzn.finance.backend.vault.dto.VaultInvitationResponse
import dev.zrdzn.finance.backend.vault.dto.VaultMemberResponse
import dev.zrdzn.finance.backend.vault.dto.VaultResponse

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