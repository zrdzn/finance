package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.product.api.ProductResponse
import dev.zrdzn.finance.backend.transaction.api.product.TransactionProductResponse
import jakarta.persistence.*
import java.math.BigDecimal

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
