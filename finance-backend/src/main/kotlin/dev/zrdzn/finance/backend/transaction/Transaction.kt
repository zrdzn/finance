package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.transaction.api.TransactionResponse
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import jakarta.persistence.*
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.math.BigDecimal
import java.time.Instant

@Table(name = "transactions")
data class Transaction(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "created_at")
    val createdAt: Instant,

    @Column(name = "user_id")
    val userId: Int,

    @Column(name = "vault_id")
    val vaultId: Int,

    @Column(columnDefinition = "transaction_method")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var transactionMethod: TransactionMethod,

    @Column(columnDefinition = "transaction_type")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var transactionType: TransactionType,

    @Column(name = "description")
    var description: String?,

    @Column(name = "total")
    var total: BigDecimal,

    @Column(name = "currency")
    var currency: String,
)

fun Transaction.toResponse(totalInVaultCurrency: BigDecimal) = TransactionResponse(
    id = this.id!!,
    userId = this.userId,
    vaultId = this.vaultId,
    createdAt = this.createdAt,
    transactionMethod = this.transactionMethod,
    transactionType = this.transactionType,
    description = this.description,
    totalInVaultCurrency = totalInVaultCurrency,
    total = this.total,
    currency = this.currency
)
