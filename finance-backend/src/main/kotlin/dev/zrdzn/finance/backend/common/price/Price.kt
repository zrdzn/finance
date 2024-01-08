package dev.zrdzn.finance.backend.common.price

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

typealias PriceId = Int

@Entity("Price")
@Table("prices")
data class Price(
    @Id
    @Column("id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: PriceId?,

    @Column("unit_amount")
    val unitAmount: BigDecimal,

    @Column("currency")
    val currency: PriceCurrency,
)
