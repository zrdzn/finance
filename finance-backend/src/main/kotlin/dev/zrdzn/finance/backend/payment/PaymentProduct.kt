package dev.zrdzn.finance.backend.payment

import dev.zrdzn.finance.backend.product.ProductId
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

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

    @Column(name = "unit_amount")
    val unitAmount: BigDecimal,

    @Column(name = "quantity")
    val quantity: Int,
)
