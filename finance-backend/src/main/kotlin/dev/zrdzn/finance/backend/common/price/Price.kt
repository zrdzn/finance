package dev.zrdzn.finance.backend.common.price

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

typealias PriceId = Int

@Entity(name = "Price")
@Table(name = "prices")
data class Price(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: PriceId?,

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(columnDefinition = "price_currency")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val priceCurrency: PriceCurrency,
)
