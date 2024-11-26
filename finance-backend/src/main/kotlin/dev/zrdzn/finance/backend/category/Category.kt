package dev.zrdzn.finance.backend.category

import dev.zrdzn.finance.backend.category.api.CategoryResponse
import jakarta.persistence.*
import jakarta.validation.constraints.Size

@Table(name = "categories")
data class Category(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "name")
    @Size(max = 100)
    val name: String,

    @Column(name = "vault_id")
    val vaultId: Int,
)

fun Category.toResponse() = CategoryResponse(
    id = id!!,
    name = name,
    vaultId = vaultId
)