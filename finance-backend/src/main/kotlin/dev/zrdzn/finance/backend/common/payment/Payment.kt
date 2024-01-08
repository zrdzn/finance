package dev.zrdzn.finance.backend.common.payment

import io.hypersistence.utils.hibernate.type.basic.PostgreSQLEnumType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import org.hibernate.annotations.Type

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

    @Column(name = "method")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val method: PaymentMethod,
)