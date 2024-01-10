package dev.zrdzn.finance.backend.common.product

import dev.zrdzn.finance.backend.common.price.PriceId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

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

    @Column(name = "price_id")
    val priceId: PriceId,
)
