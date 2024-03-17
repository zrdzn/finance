package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.payment.PaymentMethod
import dev.zrdzn.finance.backend.common.customer.CustomerId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
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

    @Column(name = "customer_id")
    val customerId: CustomerId,

    @Column(name = "payed_at")
    val payedAt: Instant,

    @Column(columnDefinition = "payment_method")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val paymentMethod: PaymentMethod,

    @Column(name = "description")
    val description: String?
)