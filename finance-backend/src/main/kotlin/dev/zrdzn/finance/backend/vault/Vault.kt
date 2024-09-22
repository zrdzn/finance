package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.shared.Currency
import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.user.UserId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

typealias VaultId = Int
typealias VaultPublicId = String

@Entity(name = "Vault")
@Table(name = "vaults")
data class Vault(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: VaultId?,

    @Column(name = "created_at")
    val createdAt: Instant,

    @Column(name = "public_id")
    val publicId: VaultPublicId,

    @Column(name = "owner_id")
    val ownerId: UserId,

    @Column(name = "name")
    var name: String,

    @Column(name = "currency")
    var currency: Currency,

    @Column(columnDefinition = "transaction_method")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var transactionMethod: TransactionMethod,
)