package dev.zrdzn.finance.backend.common.product

import dev.zrdzn.finance.backend.common.vault.VaultId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size

typealias CategoryId = Int

@Entity(name = "Category")
@Table(name = "categories")
data class Category(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: CategoryId?,

    @Column(name = "name")
    @Size(max = 100)
    val name: String,

    @Column(name = "vault_id")
    val vaultId: VaultId,
)