package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.vault.api.VaultResponse
import dev.zrdzn.finance.backend.vault.api.invitation.VaultInvitationResponse
import jakarta.persistence.*
import java.time.Instant

@Table(name = "vault_invitations")
data class VaultInvitation(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "vault_id")
    val vaultId: Int,

    @Column(name = "user_email")
    val userEmail: String,

    @Column(name = "expires_at")
    val expiresAt: Instant,
)

fun VaultInvitation.toResponse(vault: VaultResponse) = VaultInvitationResponse(
    id = id!!,
    vault = vault,
    userEmail = userEmail,
    expiresAt = expiresAt
)