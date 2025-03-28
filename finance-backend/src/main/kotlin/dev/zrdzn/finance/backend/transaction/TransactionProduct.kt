package dev.zrdzn.finance.backend.transaction

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

    @Column(name = "name")
    var name: String,

    @Column(name = "category_id")
    var categoryId: Int?,

    @Column(name = "unit_amount")
    var unitAmount: BigDecimal,

    @Column(name = "quantity")
    var quantity: Int,
)