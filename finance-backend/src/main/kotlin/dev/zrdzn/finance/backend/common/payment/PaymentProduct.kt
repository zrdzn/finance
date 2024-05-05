package dev.zrdzn.finance.backend.common.payment

import dev.zrdzn.finance.backend.api.price.PriceCurrency
import dev.zrdzn.finance.backend.common.product.ProductId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType

typealias PaymentProductId = Int

@Entity(name = "PaymentProduct")
@Table(name = "payment_products")
data class PaymentProduct(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: PaymentProductId?,

    @Column(name = "payment_id")
    val paymentId: PaymentId,

    @Column(name = "product_id")
    val productId: ProductId,

    @Column(name = "quantity")
    val quantity: Int,

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(name = "price_currency", columnDefinition = "price_currency")
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val currency: PriceCurrency,
)
