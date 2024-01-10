package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.common.price.PriceId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

typealias PaymentPriceId = Int

@Entity(name = "PaymentPrice")
@Table(name = "payment_prices")
data class PaymentPrice(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: PaymentPriceId?,

    @Column(name = "payment_id")
    val paymentId: PaymentId,

    @Column(name = "price_id")
    val priceId: PriceId,
)
