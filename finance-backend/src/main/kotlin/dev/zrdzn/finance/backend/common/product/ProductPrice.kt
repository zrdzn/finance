package dev.zrdzn.finance.backend.common.product

import dev.zrdzn.finance.backend.api.shared.Currency
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

typealias ProductPriceId = Int

@Entity(name = "ProductPrice")
@Table(name = "product_prices")
data class ProductPrice(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: ProductPriceId?,

    @Column(name = "product_id")
    val productId: ProductId,

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(name = "currency")
    val currency: Currency,
)