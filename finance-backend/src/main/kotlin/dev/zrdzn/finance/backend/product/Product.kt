package dev.zrdzn.finance.backend.product

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.Size
import java.math.BigDecimal

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

    @Column(name = "unit_amount")
    var unitAmount: BigDecimal,
)