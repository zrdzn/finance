package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.user.UserId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

typealias VaultId = Int
typealias VaultPublicId = String

@Entity(name = "Vault")
@Table(name = "vaults")
data class Vault(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: VaultId?,

    @Column(name = "public_id")
    val publicId: VaultPublicId,

    @Column(name = "owner_id")
    val ownerId: UserId,

    @Column(name = "name")
    val name: String,
)