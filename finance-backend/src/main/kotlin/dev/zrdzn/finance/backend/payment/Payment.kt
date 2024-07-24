package dev.zrdzn.finance.backend.payment

import dev.zrdzn.finance.backend.payment.api.PaymentMethod
import dev.zrdzn.finance.backend.shared.Currency
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

typealias PaymentId = Int

@Entity(name = "Payment")
@Table(name = "payments")
data class Payment(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: PaymentId?,

    @Column(name = "user_id")
    val userId: UserId,

    @Column(name = "vault_id")
    val vaultId: VaultId,

    @Column(name = "payed_at")
    val payedAt: Instant,

    @Column(columnDefinition = "payment_method")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    var paymentMethod: PaymentMethod,

    @Column(name = "description")
    var description: String?,

    @Column(name = "total")
    var total: BigDecimal,

    @Column(name = "currency")
    var currency: Currency,
)