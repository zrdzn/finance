package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.product.api.ProductResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "transaction_products")
data class TransactionProduct(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "transaction_id")
    val transactionId: Int,

    @Column(name = "product_id")
    val productId: Int,

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(name = "quantity")
    val quantity: Int,
)

fun TransactionProduct.toResponse(product: ProductResponse) = TransactionProductResponse(
    id = id!!,
    transactionId = transactionId,
    product = product,
    unitAmount = unitAmount,
    quantity = quantity
)
