package dev.zrdzn.finance.backend.transaction

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.transaction.api.TransactionType
import dev.zrdzn.finance.backend.user.UserId
import dev.zrdzn.finance.backend.vault.VaultId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.Instant
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

typealias TransactionId = Int

@Entity(name = "Transaction")
@Table(name = "transactions")
data class Transaction(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: TransactionId?,

    @Column(name = "created_at")
    val createdAt: Instant,

    @Column(name = "user_id")
    val userId: UserId,

    @Column(name = "vault_id")
    val vaultId: VaultId,

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
    var currency: Currency,
)