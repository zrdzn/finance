package dev.zrdzn.finance.backend.product

import dev.zrdzn.finance.backend.product.api.ProductResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size

@Entity
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