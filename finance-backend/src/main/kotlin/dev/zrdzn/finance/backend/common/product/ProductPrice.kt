package dev.zrdzn.finance.backend.common.product

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

typealias ProductPriceId = Int

@Entity("ProductPrice")
@Table("product_prices")
data class ProductPrice(
    @Id
    @Column("id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: ProductPriceId?,

    @Column("product_id")
    val productId: ProductId,

    @Column("price_id")
    val priceId: PriceId,
)
