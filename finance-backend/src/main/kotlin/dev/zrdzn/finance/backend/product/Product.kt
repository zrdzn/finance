package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.product.api.ProductResponse
import jakarta.persistence.*
import jakarta.validation.constraints.Size

@Table(name = "products")
data class Product(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "name")
    @Size(max = 100)
    val name: String,

    @Column(name = "vault_id")
    val vaultId: Int,

    @Column(name = "category_id")
    var categoryId: Int?,
)

fun Product.toResponse(categoryName: String?) = ProductResponse(
    id = id!!,
    name = name,
    vaultId = vaultId,
    categoryId = categoryId,
    categoryName = categoryName
)