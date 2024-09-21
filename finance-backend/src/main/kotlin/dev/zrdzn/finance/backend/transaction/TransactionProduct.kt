package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.product.ProductId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

typealias TransactionProductId = Int

@Entity(name = "TransactionProduct")
@Table(name = "transaction_products")
data class TransactionProduct(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: TransactionProductId?,

    @Column(name = "transaction_id")
    val transactionId: TransactionId,

    @Column(name = "product_id")
    val productId: ProductId,

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(name = "quantity")
    val quantity: Int,
)
