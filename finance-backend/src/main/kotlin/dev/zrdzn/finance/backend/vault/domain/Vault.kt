package dev.zrdzn.finance.backend.vault.domain

import dev.zrdzn.finance.backend.transaction.domain.TransactionMethod
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

@Entity
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