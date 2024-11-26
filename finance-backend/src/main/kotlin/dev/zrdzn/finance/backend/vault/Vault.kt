package dev.zrdzn.finance.backend.vault

import dev.zrdzn.finance.backend.transaction.api.TransactionMethod
import dev.zrdzn.finance.backend.vault.api.VaultResponse
import jakarta.persistence.*
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.time.Instant

@Table(name = "vaults")
data class Vault(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int?,

    @Column(name = "created_at")
    val createdAt: Instant,

    @Column(name = "public_id")
    val publicId: String,

    @Column(name = "owner_id")
    val ownerId: Int,

    @Column(name = "name")
    var name: String,

    @Column(name = "currency")
    var currency: String,

    @Column(columnDefinition = "transaction_method")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var transactionMethod: TransactionMethod,
)

fun Vault.toResponse() = VaultResponse(
    id = id!!,
    createdAt = createdAt,
    publicId = publicId,
    ownerId = ownerId,
    name = name,
    currency = currency,
    transactionMethod = transactionMethod
)