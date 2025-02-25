package dev.zrdzn.finance.backend.transaction.domain

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
    val name: String,

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(name = "quantity")
    val quantity: Int,
)