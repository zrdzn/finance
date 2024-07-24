package dev.zrdzn.finance.backend.vault

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

typealias VaultInvitationId = Int

@Entity(name = "VaultInvitation")
@Table(name = "vault_invitations")
data class VaultInvitation(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: VaultInvitationId?,

    @Column(name = "vault_id")
    val vaultId: VaultId,

    @Column(name = "user_email")
    val userEmail: String,

    @Column(name = "expires_at")
    val expiresAt: Instant,
)